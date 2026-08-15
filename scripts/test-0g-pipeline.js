const { ethers } = require("ethers");

/**
 * Verification script for 0G Storage Merkle root calculation & worker ECDSA attestation
 */
async function verifyZeroGPipeline() {
  console.log("=== 1. Testing 0G Storage 256KB Merkle Root Calculation ===");

  const samplePayload = JSON.stringify({
    agentName: "Ronin Cyber-Auditor",
    prompt: "Scan smart contract for reentrancy vulnerabilities",
    timestamp: new Date().toISOString()
  });

  const bytes = ethers.toUtf8Bytes(samplePayload);
  const CHUNK_SIZE = 256 * 1024;
  const chunks = [];

  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const slice = bytes.subarray(i, i + CHUNK_SIZE);
    chunks.push(ethers.keccak256(slice));
  }

  let layer = chunks;
  while (layer.length > 1) {
    const nextLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
      if (i + 1 < layer.length) {
        const combined = ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [layer[i], layer[i + 1]]);
        nextLayer.push(combined);
      } else {
        nextLayer.push(layer[i]);
      }
    }
    layer = nextLayer;
  }

  const merkleRoot = layer[0];
  const storageHash = `0g_storage_root_${merkleRoot.slice(2, 18)}`;

  console.log(`Payload Bytes: ${bytes.length}`);
  console.log(`Computed 0G Merkle Root: ${merkleRoot}`);
  console.log(`Generated 0G Storage Reference Hash: ${storageHash}`);

  console.log("\n=== 2. Testing 0G Compute Worker ECDSA Attestation Signature ===");

  const workerWallet = ethers.Wallet.createRandom();
  const requestId = 1042;
  const listingId = 2;
  const buyer = "0x71c8a9f0d12b9442008e982f1234567890123456";
  const resultHash = ethers.keccak256(ethers.toUtf8Bytes("Verified Auditor Output"));

  const messageHash = ethers.solidityPackedKeccak256(
    ["uint256", "uint256", "bytes32", "address"],
    [requestId, listingId, resultHash, buyer]
  );
  const workerSignature = await workerWallet.signMessage(ethers.getBytes(messageHash));

  console.log(`Worker Address: ${workerWallet.address}`);
  console.log(`Result Hash: ${resultHash}`);
  console.log(`Worker ECDSA Attestation Signature: ${workerSignature}`);

  const recoveredAddress = ethers.verifyMessage(ethers.getBytes(messageHash), workerSignature);
  console.log(`Recovered Signer Address: ${recoveredAddress}`);
  console.log(`ECDSA Signature Verification: ${recoveredAddress.toLowerCase() === workerWallet.address.toLowerCase() ? "PASSED ✅" : "FAILED ❌"}`);

  console.log("\n=== 0G Pipeline End-to-End Verification Complete ===");
}

verifyZeroGPipeline().catch(console.error);
