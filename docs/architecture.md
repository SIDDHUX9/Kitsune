# Kitsune Technical Architecture — 0G Verifiable Agent Marketplace

**Kitsune** is a decentralized marketplace where AI agents are minted as tokenized, verifiable assets (**Agentic ID / ERC-7857**), execute verifiable inference jobs through **0G Compute**, store their encrypted memory, system prompts, and execution trace logs on **0G Storage**, and settle per-call payments via **0G Pay** on **0G Chain**.

---

## 1. Five 0G Primitives Integration Architecture

```
                                  +---------------------------------------+
                                  |            Frontend App              |
                                  |    (Next.js + Serene Zen UI)          |
                                  +-------------------+-------------------+
                                                      |
                                                      | 1. Mint Agentic ID (ERC-7857)
                                                      | 2. List & Request Inference (0G Pay Escrow)
                                                      v
  +---------------------------------------------------------------------------------------------------+
  |                                         0G CHAIN                                                  |
  |  +-------------------------------------+                +--------------------------------------+  |
  |  |           AgenticID.sol             |                |        AgentMarketplace.sol          |  |
  |  |            (ERC-7857)               |                |   - Escrow via 0G Pay                |  |
  |  | - Tokenized AI Identity             |                |   - Job Request Queue                |  |
  |  | - Encrypted Storage Metadata Reference|                |   - Worker Attestation Verifier      |  |
  |  | - Dynamic State Commitment Root     |                |   - Timeout Refund Safeguard         |  |
  |  +------------------+------------------+                +------------------+-------------------+  |
  +---------------------|--------------------------------------------------|--------------------------+
                        |                                                  |
       0G Storage Hash  |                                                  | Emits `InferenceRequested`
       Metadata Pointer |                                                  v
                        |                                   +----------------------------------+
                        |                                   |        0G Relayer Service        |
                        |                                   |  - Node.js Event Listener        |
                        |                                   |  - Storage Hash Resolver         |
                        v                                   +-----------------+----------------+
       +---------------------------------+                                    |
       |           0G STORAGE            | <----------------------------------+
       | - Real 0G Blob & Merkle Upload  | 1. Pull Agent System Prompt & Input Hash
       | - Immutable Execution Audit Logs| 2. Persist Verified Execution Trace
       +---------------------------------+
                        |
                        |
                        v
       +---------------------------------+
       |           0G COMPUTE            |
       | - Run LLM Execution (Llama/Mistral)|
       | - ECDSA Worker Node Attestation |
       +---------------------------------+
                        |
                        | 3. Submit `fulfillInference` with Worker Signature
                        v
       +---------------------------------+
       |             0G PAY              |
       | - Escrow Settlement to Creator  |
       | - Verifiable On-chain Audit     |
       +---------------------------------+
```

---

## 2. Deep-Dive into 0G Primitive Touchpoints

### A. 0G Chain (Mainnet: `0G-Aristotle` / Testnet: `0G-Galileo`)
- **Network Parameters**:
  - **Mainnet Target**: `0G-Aristotle`, Chain ID `16661`, RPC `https://evmrpc.0g.ai`, Explorer `https://chainscan.0g.ai`
  - **Testnet Target**: `0G-Galileo`, Chain ID `16601`, RPC `http://evmrpc-testnet.0g.ai`
- **Smart Contracts**:
  - `AgenticID.sol` (ERC-7857 Token Contract)
  - `AgentMarketplace.sol` (Marketplace + Escrow + Attestation Verification)

### B. 0G Agentic ID (ERC-7857)
- Tokenizes AI agents as transferable on-chain assets.
- Stores encrypted metadata reference hashes (`storageHash`), base model pointers (`modelReference`), and dynamic Merkle state commitments (`stateCommitment`).
- Transfer hook ensures metadata access control handoffs remain secure upon ownership transfer.

### C. 0G Compute & Attestation Trust Model
> [!NOTE]
> **Attestation Design Statement**:
> In the current implementation, worker attestations are trust-minimized ECDSA signatures signed by an authorized 0G Compute worker node key (`COMPUTE_WORKER_ROLE`) over `keccak256(requestId, listingId, resultHash, buyer)` and verified on-chain via `ecrecover`.
> This guarantees that output results originate from an authorized worker node. Hardware-enforced TEE attestation (Intel SGX / AMD SEV-SNP) and zero-knowledge validity proofs (zk-SNARKs) represent planned roadmap items as 0G Compute prover networks mature.

### D. 0G Storage
- Stores encrypted agent configuration, system prompts, fine-tuning weights pointers, and per-call execution traces via real 0G Storage Blob Merkle tree roots.
- Content hashes are committed directly to `AgenticID` and `AgentMarketplace` contracts, providing an immutable audit trail queryable via 0G Chainscan Explorer.

### E. 0G Pay
- Routes buyer payments through an escrow pattern in `AgentMarketplace.sol`.
- Funds are safely held while the job is processed by 0G Compute and released to the creator upon verified fulfillment.
- Includes a safety timeout refund path (`refundExpiredRequest`) if unfulfilled after 1 hour.

---

## 3. Relayer Trust Model & Decentralization Roadmap

### Current Architecture (Trust-Minimized Authorized Worker Node)
- **Role**: Off-chain listener service watching contract events, querying 0G Storage, submitting jobs to 0G Compute, and broadcasting `fulfillInference` transactions on-chain.
- **Security**: Secured via OpenZeppelin `AccessControl` with `RELAYER_ROLE` and `COMPUTE_WORKER_ROLE`. Worker attestations are verified via `ecrecover` on-chain.

### Decentralization Roadmap
1. **TEE Hardware-Enforced Attestation**: Transition worker signatures to hardware-attested quotes produced inside Intel SGX or AMD SEV secure enclaves.
2. **Multi-Relayer Quorum**: Transition from single relayer address to a 2-of-3 threshold signature scheme across independent relayer nodes.
3. **ZK Execution Proofs**: Replace ECDSA worker attestation signatures with zero-knowledge succinct execution proofs (zk-SNARKs) as 0G Compute ZK prover networks mature.
