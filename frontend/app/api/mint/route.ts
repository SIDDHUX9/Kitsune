import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

function computeZeroGStorageRoot(data: Uint8Array): string {
  const CHUNK_SIZE = 256 * 1024;
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
        const combined = ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [layer[i], layer[i + 1]]);
        nextLayer.push(combined);
      } else {
        nextLayer.push(layer[i]);
      }
    }
    layer = nextLayer;
  }
  return layer[0];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentName, modelRef, systemPrompt, pricePerCall } = body;

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

    return NextResponse.json({
      success: true,
      storageHash,
      merkleRoot,
      sizeBytes: bytes.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to encrypt metadata to 0G Storage" }, { status: 500 });
  }
}
