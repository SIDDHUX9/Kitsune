const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("=================================================");
  console.log(" Deploying Kitsune 0G Verifiable Agent Marketplace ");
  console.log(" Target Network Chain ID:", chainId);
  console.log("=================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer Wallet Address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Native Balance:", ethers.formatEther(balance), "0G / ETH");

  // 1. Deploy AgenticID (ERC-7857)
  console.log("\n[1/3] Deploying AgenticID (ERC-7857) Contract...");
  const AgenticID = await ethers.getContractFactory("AgenticID");
  const agenticID = await AgenticID.deploy();
  await agenticID.waitForDeployment();
  const agenticIDAddress = await agenticID.getAddress();
  console.log(">>> AgenticID Deployed at:", agenticIDAddress);

  // 2. Deploy AgentMarketplace
  console.log("\n[2/3] Deploying AgentMarketplace Contract...");
  const AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
  const marketplace = await AgentMarketplace.deploy(agenticIDAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log(">>> AgentMarketplace Deployed at:", marketplaceAddress);

  // 3. Configure Roles & Authorizations
  console.log("\n[3/3] Authorizing Marketplace in AgenticID & Seeding Initial Kitsune Agents...");
  await (await agenticID.setAuthorizedUpdater(marketplaceAddress, true)).wait();
  
  const RELAYER_ROLE = await marketplace.RELAYER_ROLE();
  const COMPUTE_WORKER_ROLE = await marketplace.COMPUTE_WORKER_ROLE();
  await (await marketplace.grantRole(RELAYER_ROLE, deployer.address)).wait();
  await (await marketplace.grantRole(COMPUTE_WORKER_ROLE, deployer.address)).wait();

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
    const agent = seedAgents[i];
    console.log(`Minting & Listing Agent #${i + 1}: ${agent.name}...`);
    const mintTx = await agenticID.mintAgenticID(deployer.address, agent.storageHash, agent.modelRef, agent.uri);
    await mintTx.wait();
    
    const listTx = await marketplace.listAgent(i + 1, agent.price);
    await listTx.wait();
  }

  // Save deployed addresses JSON
  const networkKey = chainId === 16661 ? "aristotle" : (chainId === 16601 ? "galileo" : "localhost");
  const explorerBase = chainId === 16661 ? "https://chainscan.0g.ai" : "https://chainscan-galileo.0g.ai";

  const outputPath = path.join(__dirname, "../deployed-contracts.json");
  let deploymentRecordMap = {};
  if (fs.existsSync(outputPath)) {
    try {
      deploymentRecordMap = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    } catch (e) {}
  }

  deploymentRecordMap[networkKey] = {
    chainId,
    deployer: deployer.address,
    agenticID: agenticIDAddress,
    marketplace: marketplaceAddress,
    timestamp: new Date().toISOString(),
    explorerLinks: {
      agenticID: `${explorerBase}/address/${agenticIDAddress}`,
      marketplace: `${explorerBase}/address/${marketplaceAddress}`
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(deploymentRecordMap, null, 2));
  console.log(`\nDeployment details written to: ${outputPath}`);

  // Update frontend config/contracts.ts
  const frontendConfigPath = path.join(__dirname, "../frontend/config/contracts.ts");
  if (fs.existsSync(frontendConfigPath)) {
    let content = fs.readFileSync(frontendConfigPath, "utf8");
    if (networkKey === "aristotle") {
      content = content.replace(
        /aristotle:\s*\{[\s\S]*?\},/,
        `aristotle: {\n    agenticID: process.env.NEXT_PUBLIC_ARISTOTLE_AGENTIC_ID || "${agenticIDAddress}",\n    marketplace: process.env.NEXT_PUBLIC_ARISTOTLE_MARKETPLACE || "${marketplaceAddress}",\n    rpc: "https://evmrpc.0g.ai",\n    explorer: "https://chainscan.0g.ai"\n  },`
      );
    } else if (networkKey === "galileo") {
      content = content.replace(
        /galileo:\s*\{[\s\S]*?\},/,
        `galileo: {\n    agenticID: process.env.NEXT_PUBLIC_GALILEO_AGENTIC_ID || "${agenticIDAddress}",\n    marketplace: process.env.NEXT_PUBLIC_GALILEO_MARKETPLACE || "${marketplaceAddress}",\n    rpc: "http://evmrpc-testnet.0g.ai",\n    explorer: "https://chainscan-galileo.0g.ai"\n  },`
      );
    }
    fs.writeFileSync(frontendConfigPath, content);
    console.log(`Updated frontend contracts config: ${frontendConfigPath}`);
  }

  console.log("\n=================================================");
  console.log(" DEPLOYMENT COMPLETE!");
  console.log(" AgenticID Address:       ", agenticIDAddress);
  console.log(" AgentMarketplace Address:", marketplaceAddress);
  console.log(" 0G Chainscan Explorer:    https://chainscan.0g.ai");
  console.log("=================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
