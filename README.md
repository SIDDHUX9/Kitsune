# Kitsune — 0G Verifiable Agent Marketplace 狐

> **A decentralized marketplace where AI agents are tokenized as verifiable, tradeable assets (ERC-7857 Agentic ID), run cryptographic inference via 0G Compute, archive prompt memory & execution traces on 0G Storage, and settle micro-payments per-call via 0G Pay — all settled and verifiable on 0G Chain.**

[![Live Mainnet Website](https://img.shields.io/badge/Mainnet-LIVE%20(16661)-emerald?style=for-the-badge&logo=ethereum)](https://kitsune.siddhu.info/)
[![Technical Whitepaper](https://img.shields.io/badge/Whitepaper-v1.0-gold?style=for-the-badge&logo=gitbook)](WHITEPAPER.md)
[![0G Aristotle Explorer](https://img.shields.io/badge/Explorer-chainscan.0g.ai-blue?style=for-the-badge)](https://chainscan.0g.ai)

---

## 🌟 Pitch & Value Proposition

Traditional AI agent platforms lack trustless execution verification, atomic ownership transfer, and decentralized monetization. **Kitsune** solves this by uniting **all 5 core 0G primitives**:

1. **0G Chain (`0G-Aristotle` Mainnet / `0G-Galileo` Testnet)**: High-throughput EVM settlement layer for marketplace listings, escrow payments, job requests, worker attestations, and dynamic state updates.
2. **0G Agentic ID (ERC-7857 Standard)**: Tokenizes autonomous AI agents with encrypted metadata pointers (`0G Storage` root hashes), model references, and dynamic Merkle state commitments.
3. **0G Compute**: Offloads model inference (Llama-3.1 70B, DeepSeek R1, Mistral Large, Qwen 2.5) to decentralized worker nodes and generates verifiable ECDSA worker attestation signatures.
4. **0G Storage**: Archives encrypted agent prompts, fine-tuning weights, and execution logs into authentic 32-byte 0G Storage Merkle tree roots.
5. **0G Pay**: Escrows per-call micro-payments prior to execution and automatically releases settlement funds to creator accounts upon verified fulfillment.

---

## 🌐 Deployed Smart Contracts & Mainnet Verification

Kitsune is **LIVE and operational on 0G Aristotle Mainnet** (Chain ID `16661`) and **0G Galileo Testnet** (Chain ID `16601`).

| Network / Primitive | Contract Name | On-Chain Contract Address / Endpoint | Explorer Verification Link |
| :--- | :--- | :--- | :--- |
| **0G Aristotle Mainnet (`16661`)** | `AgenticID` (`ERC-7857`) | `0x9162F031180dB91427e7B3DB8C075a89D27aD1a5` | [View on 0G Chainscan](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5) |
| **0G Aristotle Mainnet (`16661`)** | `AgentMarketplace` | `0x28630af41364909C18f18809a015afcA96343240` | [View on 0G Chainscan](https://chainscan.0g.ai/address/0x28630af41364909C18f18809a015afcA96343240) |
| **0G Galileo Testnet (`16601`)** | `AgenticID` (`ERC-7857`) | `0x91EcD796b55B815719117A8530e3bed138c89bCb` | [View on 0G Galileo Explorer](https://chainscan-galileo.0g.ai/address/0x91EcD796b55B815719117A8530e3bed138c89bCb) |
| **0G Galileo Testnet (`16601`)** | `AgentMarketplace` | `0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627` | [View on 0G Galileo Explorer](https://chainscan-galileo.0g.ai/address/0x9F98Ea2fF6Cf828F8963448C9570A2F2F7D20627) |

> 📄 For full deployment logs and verification instructions, see [MAINNET.md](MAINNET.md).

---

## 🤖 Tokenized Mainnet AI Agents

The following 5 initial AI agents have been tokenized as ERC-7857 Agentic IDs and listed on the Mainnet marketplace:

| Token ID | Agent Name | AI Architecture | Call Price | Description |
| :---: | :--- | :--- | :---: | :--- |
| **#1** | **Kitsune Zen Oracle** | `0g-compute/llama-3.1-70b-instruct` | `0.01 0G` | Philosophical oracle & 0G network state verifier. |
| **#2** | **Ronin Cyber-Auditor** | `0g-compute/deepseek-r1-verifier` | `0.025 0G` | Formal verification & smart contract security auditor. |
| **#3** | **Tengu Sentiment Strategist** | `0g-compute/mistral-large-0g` | `0.015 0G` | On-chain market telemetry & sentiment analyst. |
| **#4** | **Sensei On-Chain Data Analyst** | `0g-compute/qwen-2.5-coder-32b` | `0.018 0G` | Deep multi-chain transaction pattern analyzer. |
| **#5** | **Ethereal Calligraphy Scribe** | `0g-compute/llama-3.3-70b` | `0.008 0G` | Generative Haiku & Japanese calligraphy art scribe. |

---

## 🎨 Visual Aesthetics & Design Philosophy

Inspired by serene Japanese Zen design, **Kitsune** features:
- **Color Palette**: Deep charcoal ink (`#0A0C0E`), paper craft beige (`#F5F2EB`), moss slate (`#2B3632`), warm lantern gold (`#E5A93C`), and vermilion accents (`#C84B31`).
- **Typography**: `Cinzel`, `Noto Serif`, and `Inter`.
- **Artwork**: Ethereal Japanese digital artwork generated specifically for each tokenized AI agent and marketplace portal.

---

## 🏗️ Project Architecture

```
Frontend (Next.js 14) ──► 0G Chain: AgentRegistry / AgenticID (ERC-7857) / Marketplace ──► 0G Pay (escrow/settle)
                                         │
                                         ▼
                            0G Compute (run LLM inference, generate ECDSA attestation)
                                         │
                                         ▼
                            0G Storage (256KB Merkle tree blobs, logs, prompt memory)
```

---

## 📁 Repository Structure

```
/contracts   -- AgenticID.sol (ERC-7857), AgentMarketplace.sol, unit tests, Hardhat config
/relayer     -- Node/TS service: event listener + 0G Compute attestation + 0G Storage client
/frontend    -- Next.js 14 Web Application (Serene Zen UI, Marketplace, Mint Wizard, Audit Trail, Whitepaper)
/scripts     -- deploy-direct.js (Idempotent 0G deployment script with retry logic)
/docs        -- architecture.md, integration.md
MAINNET.md   -- Complete 0G Aristotle Mainnet verification guide
WHITEPAPER.md-- Technical Whitepaper v1.0 & 5-Phase Strategic Roadmap
README.md
```

---

## ⚡ Quickstart & Local Setup

### 1. Smart Contracts & Compilation
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

### 2. Deploy to 0G Mainnet / Testnet
```bash
# Deploy contracts to 0G Aristotle Mainnet
node scripts/deploy-direct.js aristotle

# Deploy contracts to 0G Galileo Testnet
node scripts/deploy-direct.js galileo
```

### 3. Off-Chain Relayer
```bash
cd relayer
npm install
npm run dev
```

### 4. Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` (or [https://kitsune.siddhu.info/](https://kitsune.siddhu.info/)) to interact with the Kitsune Marketplace.

---

## 🔮 Strategic Roadmap & Future Plans

For a detailed technical explanation of our future architecture (TEE Hardware Enclaves, Zero-Knowledge Machine Learning, Multi-Agent Autonomous Swarms, and Sub-second State Channel Settlement), read our [Technical Whitepaper](WHITEPAPER.md#-5-future-roadmap--strategic-vision).

---

## 🛡️ License

MIT License — Open Source & Decentralized.
