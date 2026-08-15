# Kitsune — 0G Verifiable Agent Marketplace 狐

> **A decentralized marketplace where AI agents are minted as tokenized, verifiable assets (Agentic ID / ERC-7857), run inference through 0G Compute, store their memory/logs/artifacts on 0G Storage, and get paid per-call through 0G Pay — all settled and verifiable on 0G Chain.**

---

## 🌟 Pitch & Value Proposition

Traditional AI agent platforms lack trustless verification, atomic ownership transfer, and decentralized monetization. **Kitsune** solves this by uniting **all 5 core 0G primitives**:

1. **0G Chain (`0G-Aristotle` Mainnet / `0G-Galileo` Testnet)**: Immutably settles marketplace listings, escrow payments, job requests, worker attestations, and state updates.
2. **0G Agentic ID (ERC-7857 Standard)**: Tokenizes autonomous AI agents with encrypted metadata pointers and dynamic Merkle state commitments.
3. **0G Compute**: Executes LLM jobs using agent configurations and generates verifiable ECDSA worker attestation signatures.
4. **0G Storage**: Archives encrypted agent prompts, fine-tuning weights references, and immutable per-call execution traces.
5. **0G Pay**: Escrows per-call micro-payments prior to execution and releases settlement to creator accounts upon verified fulfillment.

---

## 🎨 Visual Aesthetics & Design Philosophy

Inspired by serene Japanese Zen design, **Kitsune** features:
- **Palette**: Deep charcoal ink (`#0A0C0E`), paper craft beige (`#F5F2EB`), moss slate (`#2B3632`), warm lantern gold (`#E5A93C`), and vermilion accents (`#C84B31`).
- **Typography**: `Cinzel`, `Noto Serif`, and `Inter`.
- **Illustrations**: Ethereal Japanese digital artwork generated specifically for each tokenized AI agent.

---

## 🏗️ Project Architecture

```
Frontend (Next.js) ──► 0G Chain: AgentRegistry / AgenticID (ERC-7857) / Marketplace ──► 0G Pay (escrow/settle)
                                     │
                                     ▼
                        0G Compute (run inference, return attestation)
                                     │
                                     ▼
                        0G Storage (agent memory, logs, model refs)
```

---

## 📜 Deployed Network Configuration

| Primitive | Network Specification |
| :--- | :--- |
| **0G Mainnet Target** | `0G-Aristotle` (Chain ID `16661`) |
| **RPC Endpoint** | `https://evmrpc.0g.ai` |
| **Explorer** | [chainscan.0g.ai](https://chainscan.0g.ai) |
| **0G Testnet Target** | `0G-Galileo` (Chain ID `16601`, `http://evmrpc-testnet.0g.ai`) |

---

## 📁 Repository Structure

```
/contracts   -- AgenticID.sol (ERC-7857), AgentMarketplace.sol, tests, Hardhat config
/relayer     -- Node/TS service: event listener + 0G Compute attestation + Storage orchestration
/frontend    -- Next.js 14 Web Application (Serene Zen UI, Gallery, Mint Wizard, Live Pipeline Studio, Audit)
/docs        -- architecture.md, integration.md
/scripts     -- deploy.js contract & agent seeding script
README.md
```

---

## ⚡ Quickstart & Local Setup

### 1. Smart Contracts
```bash
cd contracts
npm install
npx hardhat test
```

### 2. Off-Chain Relayer
```bash
cd relayer
npm install
npm run dev
```

### 3. Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the Kitsune Agent Marketplace.

---

## 🛡️ License

MIT License
