const { ethers } = require("ethers");

async function seedRealTransactions() {
  console.log("=== Seeding Real Transactions on 0G Galileo Testnet ===");
  const rpc = "http://evmrpc-testnet.0g.ai";
  const provider = new ethers.JsonRpcProvider(rpc);
  const privateKey = process.env.PRIVATE_KEY || "fd9b76f4e98112193ac346bb83d9a3160ae3e731d04273302d20c6a6339ada0f";
  const wallet = new ethers.Wallet(privateKey, provider);

  const marketplaceAddress = "0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627";
  const agenticIDAddress = "0x91EcD796b55B815719117A8530e3bed138c89bCb";

  const marketplaceAbi = [
    "function requestInference(uint256 listingId, string calldata inputHash) external payable returns (uint256)"
  ];
  const agenticIdAbi = [
    "function mintAgenticID(address to, string memory storageHash, string memory modelReference, string memory initialMetadataURI) external returns (uint256)"
  ];

  const marketplace = new ethers.Contract(marketplaceAddress, marketplaceAbi, wallet);
  const agenticID = new ethers.Contract(agenticIDAddress, agenticIdAbi, wallet);

  const txHashes = [];

  for (let i = 1; i <= 4; i++) {
    console.log(`Sending Real On-Chain Tx #${i}...`);
    try {
      let tx;
      if (i % 2 === 1) {
        tx = await marketplace.requestInference(i, `0g_storage_input_seed_${i}`, {
          value: ethers.parseEther("0.01")
        });
      } else {
        tx = await agenticID.mintAgenticID(wallet.address, `0g_storage_root_seed_${i}`, "0g-compute/deepseek-r1-verifier", `https://kitsune.0g.ai/api/metadata/${i}`);
      }
      console.log(`Tx #${i} Hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Tx #${i} Confirmed in Block #${receipt.blockNumber}`);
      txHashes.push(tx.hash);
    } catch (err) {
      console.error(`Tx #${i} Error:`, err?.message || err);
    }
  }

  console.log("\n=== Real On-Chain Hashes Generated ===");
  console.log(JSON.stringify(txHashes, null, 2));
}

seedRealTransactions();
