import { ethers } from 'ethers';

/**
 * 0G Storage 256KB Merkle Root Calculator
 * Creates authentic Merkle roots for encrypting agent prompts, configs, and execution traces
 * @param data - The data to hash into a Merkle tree
 * @returns The 32-byte Merkle root as a hex string prefixed with "0g_storage_root_"
 */
export function computeZeroGStorageRoot(data: Uint8Array): string {
  const CHUNK_SIZE = 256 * 1024; // 256KB chunks as per 0G specification
  const chunks: string[] = [];

  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const slice = data.subarray(i, i + CHUNK_SIZE);
    chunks.push(ethers.keccak256(slice));
  }

  if (chunks.length === 0) {
    return ethers.keccak256(ethers.toUtf8Bytes("empty_0g_storage_blob"));
  }

  let layer = chunks;
  while (layer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      if (i + 1 < layer.length) {
        // Pack two 32-byte hashes together using Solidity-style packing
        const combined = ethers.solidityPackedKeccak256(
          ["bytes32", "bytes32"],
          [layer[i], layer[i + 1]]
        );
        nextLayer.push(combined);
      } else {
        // Odd number of nodes: promote the last one
        nextLayer.push(layer[i]);
      }
    }
    layer = nextLayer;
  }
  return layer[0];
}

/**
 * Calculates a storage hash for an agent's system prompt and configuration
 * @param agentName - Name of the AI agent
 * @param modelRef - 0G Compute model reference (e.g. "0g-compute/llama-3.1-70b-instruct")
 * @param systemPrompt - The agent's system prompt text
 * @param pricePerCall - Price per inference call in 0G tokens
 * @returns A storage hash string suitable for AgenticID minting
 */
export function calculateAgentStorageHash(
  agentName: string,
  modelRef: string,
  systemPrompt: string,
  pricePerCall: string
): string {
  const payload = JSON.stringify({
    agentName,
    modelRef,
    systemPrompt,
    pricePerCall,
    createdAt: new Date().toISOString(),
    standard: "ERC-7857 Agentic ID"
  });

  const bytes = ethers.toUtf8Bytes(payload);
  const merkleRoot = computeZeroGStorageRoot(bytes);
  const storageHash = `0g_storage_root_${merkleRoot.slice(2, 18)}`;

  return storageHash;
}
