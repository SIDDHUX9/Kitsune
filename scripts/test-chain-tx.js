const { ethers } = require("ethers");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function testRealOnChainTx() {
  console.log("=== Testing Real On-Chain Transaction on 0G Galileo Testnet ===");
  const rpc = process.env.OG_GALILEO_RPC || "https://evmrpc-testnet.0g.ai";
  const provider = new ethers.JsonRpcProvider(rpc);

  const rawKey = process.env.PRIVATE_KEY;
  if (!rawKey) {
    throw new Error("PRIVATE_KEY is required in .env");
  }
  const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Wallet Address:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance on 0G Galileo Testnet:", ethers.formatEther(balance), "0G");

  const marketplaceAddress = "0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627";
  const marketplaceAbi = [
    "function requestInference(uint256 listingId, string calldata inputHash) external payable returns (uint256)"
  ];

  const contract = new ethers.Contract(marketplaceAddress, marketplaceAbi, wallet);
  console.log("Sending real requestInference transaction on 0G Chain...");

  try {
    const tx = await contract.requestInference(1, "0g_storage_input_test", {
      value: ethers.parseEther("0.01")
    });

    console.log("Tx Sent! Hash:", tx.hash);
    console.log("Waiting for confirmation on 0G Chain...");
    const receipt = await tx.wait();
    console.log("Tx Confirmed in Block #", receipt.blockNumber);
    console.log("View on 0G Chainscan: https://chainscan-galileo.0g.ai/tx/" + tx.hash);
  } catch (err) {
    console.error("Tx Error:", err?.message || err);
  }
}

testRealOnChainTx();
