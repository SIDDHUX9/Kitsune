# Kitsune — 0G Integration & Judge Verification Guide

This document provides exact reference links, network endpoints, contract events, and code locations for hackathon judges evaluating the **0G Verifiable Agent Marketplace ("Kitsune")**.

---

## 1. Network & Explorer Details

| Network Element | Mainnet (`0G-Aristotle`) | Testnet (`0G-Galileo`) | Local Dev (`Hardhat`) |
| :--- | :--- | :--- | :--- |
| **Chain ID** | `16661` | `16601` | `31337` |
| **RPC Endpoint** | `https://evmrpc.0g.ai` | `http://evmrpc-testnet.0g.ai` | `http://127.0.0.1:8545` |
| **Explorer** | [chainscan.0g.ai](https://chainscan.0g.ai) | [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai) | N/A |
| **Native Token** | 0G | 0G | ETH / 0G |

---

## 2. Deployed Contracts on 0G Galileo Testnet

- **AgenticID (ERC-7857)**: [`0x91EcD796b55B815719117A8530e3bed138c89bCb`](https://chainscan-galileo.0g.ai/address/0x91EcD796b55B815719117A8530e3bed138c89bCb)
- **AgentMarketplace**: [`0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627`](https://chainscan-galileo.0g.ai/address/0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627)

---

## 3. Smart Contract Source Files & Key Functions

- **[`contracts/AgenticID.sol`](file:///c:/Users/Siddhu/Downloads/Kitsune/contracts/AgenticID.sol)**:
  - `mintAgenticID`: Mints ERC-7857 Agentic ID token with 0G Storage Merkle hash pointer.
  - `updateMetadata`: Rotates encrypted metadata reference stored on 0G Storage.
  - `updateStateCommitment`: Updates Merkle root state commitment after 0G Compute execution.
  - `getAgentMetadata`: Queries complete tokenized agent metadata.

- **[`contracts/AgentMarketplace.sol`](file:///c:/Users/Siddhu/Downloads/Kitsune/contracts/AgentMarketplace.sol)**:
  - `listAgent`: Lists tokenized agent with price per call.
  - `requestInference`: Escrows buyer payment (0G Pay) and emits `InferenceRequested`.
  - `fulfillInference`: Validates 0G Compute worker attestation signature (`COMPUTE_WORKER_ROLE`) and releases escrow to creator.
  - `refundExpiredRequest`: Timeout safety mechanism for buyer refund recovery.
  - `pause` / `unpause`: Emergency Pausable circuit breaker (`DEFAULT_ADMIN_ROLE`).

---

## 4. Worker Attestation & Trust Model Transparency

> **Worker Attestation Specification**:
> The worker attestation signature verified in `AgentMarketplace.sol` is an ECDSA signature generated off-chain by an authorized worker wallet holding `COMPUTE_WORKER_ROLE`.
> Message payload: `keccak256(abi.encodePacked(requestId, listingId, resultHash, buyer))`.
> This guarantees trust-minimized off-chain attestation by authorized 0G Compute worker nodes. Hardware-enforced TEE attestation (Intel SGX / AMD SEV-SNP) is planned on the future roadmap.

---

## 5. Off-Chain Relayer & Real 0G Storage Integration

- **[`relayer/src/index.ts`](file:///c:/Users/Siddhu/Downloads/Kitsune/relayer/src/index.ts)** & **[`relayer/src/zeroGStorage.ts`](file:///c:/Users/Siddhu/Downloads/Kitsune/relayer/src/zeroGStorage.ts)**:
  - `ZeroGStorageClient`: Uploads and downloads Merkle tree blob data to/from 0G Storage node endpoints (`https://indexer-storage-testnet.0g.ai`). Computes authentic 32-byte 0G Storage Merkle roots.
  - `executeZeroGCompute`: Dispatches inference job to 0G Compute worker node and generates ECDSA attestation signature.
  - `processInferenceRequest`: Orchestrates event listening, 0G Storage fetching, 0G Compute execution, and 0G Chain transaction submission.

---

## 6. Contract Event Signatures for 0G Chainscan Explorer Verification

Judges can track the following on-chain events on [0G Galileo Chainscan Explorer](https://chainscan-galileo.0g.ai):

1. `AgenticIDMinted(uint256 indexed tokenId, address indexed owner, string storageHash, string modelReference)`
2. `AgentListed(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 pricePerCall)`
3. `InferenceRequested(uint256 indexed requestId, uint256 indexed listingId, address indexed buyer, uint256 escrowAmount, string inputHash)`
4. `InferenceFulfilled(uint256 indexed requestId, uint256 indexed listingId, bytes32 resultHash, bytes workerAttestation)`
5. `PaymentReleased(uint256 indexed requestId, address indexed seller, uint256 amount)`
6. `InferenceRefunded(uint256 indexed requestId, address indexed buyer, uint256 amount)`
