const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function sendWithRetry(fn, retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isNetwork =
        err.code === "ECONNRESET" ||
        err.code === "TIMEOUT" ||
        err.message?.includes("socket hang up") ||
        err.message?.includes("request timeout") ||
        err.message?.includes("ETIMEDOUT") ||
        err.message?.includes("network") ||
        err.code === "SERVER_ERROR";
      if (attempt < retries && isNetwork) {
        console.warn(`[Retry ${attempt}/${retries}] Network connection reset/timeout. Retrying in ${delayMs}ms...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  const targetNetwork = process.argv[2] || "aristotle";
  
  let rpcUrl, chainId, explorerBase;
  if (targetNetwork === "aristotle") {
    rpcUrl = process.env.OG_ARISTOTLE_RPC || "https://evmrpc.0g.ai";
    chainId = 16661;
    explorerBase = "https://chainscan.0g.ai";
  } else if (targetNetwork === "galileo") {
    rpcUrl = process.env.OG_GALILEO_RPC || "http://evmrpc-testnet.0g.ai";
    chainId = 16601;
    explorerBase = "https://chainscan-galileo.0g.ai";
  } else {
    rpcUrl = "http://127.0.0.1:8545";
    chainId = 31337;
    explorerBase = "http://127.0.0.1:8545";
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not set in .env file");
  }

  console.log("=================================================");
  console.log(` Deploying Kitsune Agent Marketplace to ${targetNetwork.toUpperCase()}`);
  console.log(" RPC Endpoint:           ", rpcUrl);
  console.log(" Target Chain ID:        ", chainId);
  console.log("=================================================");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  const wallet = new ethers.Wallet(formattedKey, provider);

  console.log("Deployer Address:       ", wallet.address);
  const balance = await sendWithRetry(() => provider.getBalance(wallet.address));
  console.log("Deployer Native Balance:", ethers.formatEther(balance), "0G / ETH");

  if (balance === 0n) {
    throw new Error(`Deployer wallet ${wallet.address} has 0 native 0G tokens on ${targetNetwork}!`);
  }

  // Load contract artifacts
  const agenticIDArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../contracts/artifacts/src/AgenticID.sol/AgenticID.json"), "utf8")
  );
  const marketplaceArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../contracts/artifacts/src/AgentMarketplace.sol/AgentMarketplace.json"), "utf8")
  );

  // Check if contracts were already deployed previously for this network
  const recordPath = path.join(__dirname, "../deployed-contracts.json");
  let existingRecordMap = {};
  if (fs.existsSync(recordPath)) {
    try {
      existingRecordMap = JSON.parse(fs.readFileSync(recordPath, "utf8"));
    } catch (e) {}
  }
  const existingRecord = existingRecordMap[targetNetwork];

  let agenticID, agenticIDAddress;
  let marketplace, marketplaceAddress;

  // 1. Deploy or attach AgenticID
  if (existingRecord?.agenticID) {
    const code = await sendWithRetry(() => provider.getCode(existingRecord.agenticID));
    if (code && code !== "0x") {
      console.log("\n[1/3] Found existing active AgenticID contract at:", existingRecord.agenticID);
      agenticIDAddress = existingRecord.agenticID;
      agenticID = new ethers.Contract(agenticIDAddress, agenticIDArtifact.abi, wallet);
    }
  }

  if (!agenticID) {
    console.log("\n[1/3] Deploying new AgenticID (ERC-7857) Contract...");
    const AgenticIDFactory = new ethers.ContractFactory(agenticIDArtifact.abi, agenticIDArtifact.bytecode, wallet);
    agenticID = await sendWithRetry(async () => {
      const contract = await AgenticIDFactory.deploy();
      await contract.waitForDeployment();
      return contract;
    });
    agenticIDAddress = await agenticID.getAddress();
    console.log(">>> AgenticID Deployed at:", agenticIDAddress);
  }

  // 2. Deploy or attach AgentMarketplace
  if (existingRecord?.marketplace) {
    const code = await sendWithRetry(() => provider.getCode(existingRecord.marketplace));
    if (code && code !== "0x") {
      console.log("\n[2/3] Found existing active AgentMarketplace contract at:", existingRecord.marketplace);
      marketplaceAddress = existingRecord.marketplace;
      marketplace = new ethers.Contract(marketplaceAddress, marketplaceArtifact.abi, wallet);
    }
  }

  if (!marketplace) {
    console.log("\n[2/3] Deploying new AgentMarketplace Contract...");
    const MarketplaceFactory = new ethers.ContractFactory(marketplaceArtifact.abi, marketplaceArtifact.bytecode, wallet);
    marketplace = await sendWithRetry(async () => {
      const contract = await MarketplaceFactory.deploy(agenticIDAddress);
      await contract.waitForDeployment();
      return contract;
    });
    marketplaceAddress = await marketplace.getAddress();
    console.log(">>> AgentMarketplace Deployed at:", marketplaceAddress);
  }

  // 3. Configure Roles & Authorizations
  console.log("\n[3/3] Authorizing Marketplace in AgenticID & Seeding Initial Kitsune Agents...");
  
  const isAuthorized = await sendWithRetry(() => agenticID.authorizedUpdaters(marketplaceAddress)).catch(() => false);
  if (!isAuthorized) {
    console.log("Setting Marketplace as authorized updater in AgenticID...");
    const tx1 = await sendWithRetry(() => agenticID.setAuthorizedUpdater(marketplaceAddress, true));
    await sendWithRetry(() => tx1.wait());
  }

  const RELAYER_ROLE = await marketplace.RELAYER_ROLE();
  const COMPUTE_WORKER_ROLE = await marketplace.COMPUTE_WORKER_ROLE();

  const hasRelayer = await sendWithRetry(() => marketplace.hasRole(RELAYER_ROLE, wallet.address)).catch(() => false);
  if (!hasRelayer) {
    const tx2 = await sendWithRetry(() => marketplace.grantRole(RELAYER_ROLE, wallet.address));
    await sendWithRetry(() => tx2.wait());
  }

  const hasWorker = await sendWithRetry(() => marketplace.hasRole(COMPUTE_WORKER_ROLE, wallet.address)).catch(() => false);
  if (!hasWorker) {
    const tx3 = await sendWithRetry(() => marketplace.grantRole(COMPUTE_WORKER_ROLE, wallet.address));
    await sendWithRetry(() => tx3.wait());
  }

  // Seed 5 Pre-Minted Kitsune Agents
  const seedAgents = [
    {
      name: "Kitsune Zen Oracle",
      storageHash: "0g_storage_root_c8a9f0e123456789",
      modelRef: "0g-compute/llama-3.1-70b-instruct",
      uri: "https://kitsune.0g.ai/api/metadata/1",
      price: ethers.parseEther("0.01")
    },
    {
      name: "Ronin Cyber-Auditor",
      storageHash: "0g_storage_root_e4b1c9f876543210",
      modelRef: "0g-compute/deepseek-r1-verifier",
      uri: "https://kitsune.0g.ai/api/metadata/2",
      price: ethers.parseEther("0.025")
    },
    {
      name: "Tengu Sentiment Strategist",
      storageHash: "0g_storage_root_f99a0d8172635441",
      modelRef: "0g-compute/mistral-large-0g",
      uri: "https://kitsune.0g.ai/api/metadata/3",
      price: ethers.parseEther("0.015")
    },
    {
      name: "Sensei On-Chain Data Analyst",
      storageHash: "0g_storage_root_b219d04981726354",
      modelRef: "0g-compute/qwen-2.5-coder-32b",
      uri: "https://kitsune.0g.ai/api/metadata/4",
      price: ethers.parseEther("0.018")
    },
    {
      name: "Ethereal Calligraphy Scribe",
      storageHash: "0g_storage_root_d774a10293847561",
      modelRef: "0g-compute/llama-3.3-70b",
      uri: "https://kitsune.0g.ai/api/metadata/5",
      price: ethers.parseEther("0.008")
    }
  ];

  for (let i = 0; i < seedAgents.length; i++) {
    const tokenId = i + 1;
    const agent = seedAgents[i];

    // Check if agent is already minted
    let isMinted = false;
    try {
      const owner = await sendWithRetry(() => agenticID.ownerOf(tokenId));
      if (owner && owner !== ethers.ZeroAddress) {
        isMinted = true;
      }
    } catch (e) {}

    if (!isMinted) {
      console.log(`Minting Agent #${tokenId}: ${agent.name}...`);
      const mintTx = await sendWithRetry(() =>
        agenticID.mintAgenticID(wallet.address, agent.storageHash, agent.modelRef, agent.uri)
      );
      await sendWithRetry(() => mintTx.wait());
    } else {
      console.log(`Agent #${tokenId} (${agent.name}) already minted on-chain.`);
    }

    // Check if agent is already listed
    let isListed = false;
    try {
      const listing = await sendWithRetry(() => marketplace.getListing(tokenId));
      if (listing && listing.active) {
        isListed = true;
      }
    } catch (e) {}

    if (!isListed) {
      console.log(`Listing Agent #${tokenId}: ${agent.name}...`);
      const listTx = await sendWithRetry(() => marketplace.listAgent(tokenId, agent.price));
      await sendWithRetry(() => listTx.wait());
    } else {
      console.log(`Listing #${tokenId} already active on-chain.`);
    }
  }

  // Update deployed-contracts.json
  existingRecordMap[targetNetwork] = {
    chainId,
    deployer: wallet.address,
    agenticID: agenticIDAddress,
    marketplace: marketplaceAddress,
    timestamp: new Date().toISOString(),
    explorerLinks: {
      agenticID: `${explorerBase}/address/${agenticIDAddress}`,
      marketplace: `${explorerBase}/address/${marketplaceAddress}`
    }
  };

  fs.writeFileSync(recordPath, JSON.stringify(existingRecordMap, null, 2));
  console.log(`\nDeployment record updated in: ${recordPath}`);

  // Update frontend config/contracts.ts
  const frontendConfigPath = path.join(__dirname, "../frontend/config/contracts.ts");
  if (fs.existsSync(frontendConfigPath)) {
    let content = fs.readFileSync(frontendConfigPath, "utf8");
    if (targetNetwork === "aristotle") {
      content = content.replace(
        /aristotle:\s*\{[\s\S]*?\},/,
        `aristotle: {\n    agenticID: process.env.NEXT_PUBLIC_ARISTOTLE_AGENTIC_ID || "${agenticIDAddress}",\n    marketplace: process.env.NEXT_PUBLIC_ARISTOTLE_MARKETPLACE || "${marketplaceAddress}",\n    rpc: "https://evmrpc.0g.ai",\n    explorer: "https://chainscan.0g.ai"\n  },`
      );
    } else if (targetNetwork === "galileo") {
      content = content.replace(
        /galileo:\s*\{[\s\S]*?\},/,
        `galileo: {\n    agenticID: process.env.NEXT_PUBLIC_GALILEO_AGENTIC_ID || "${agenticIDAddress}",\n    marketplace: process.env.NEXT_PUBLIC_GALILEO_MARKETPLACE || "${marketplaceAddress}",\n    rpc: "http://evmrpc-testnet.0g.ai",\n    explorer: "https://chainscan-galileo.0g.ai"\n  },`
      );
    }
    fs.writeFileSync(frontendConfigPath, content);
    console.log(`Updated frontend contracts config: ${frontendConfigPath}`);
  }

  console.log("\n=================================================");
  console.log(` DEPLOYMENT TO ${targetNetwork.toUpperCase()} COMPLETE!`);
  console.log(" AgenticID Address:       ", agenticIDAddress);
  console.log(" AgentMarketplace Address:", marketplaceAddress);
  console.log(" Explorer links:");
  console.log("   - AgenticID:  ", `${explorerBase}/address/${agenticIDAddress}`);
  console.log("   - Marketplace:", `${explorerBase}/address/${marketplaceAddress}`);
  console.log("=================================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
