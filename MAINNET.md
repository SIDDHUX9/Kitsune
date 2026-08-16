# 🌐 Kitsune — 0G Aristotle Mainnet Live Deployment Guide

> **Kitsune is officially LIVE on 0G Aristotle Mainnet (Chain ID `16661`)!**  
> All smart contracts, tokenized AI agents (ERC-7857 Agentic IDs), escrow payment mechanics (0G Pay), and off-chain compute attestations are fully deployed, initialized, and verifiable on the 0G Mainnet blockchain.

---

## ⚡ Mainnet Overview & Network Specifications

| Parameter | Specification |
| :--- | :--- |
| **Network Name** | `0G-Aristotle` (0G Mainnet) |
| **Chain ID** | `16661` (`0x4115`) |
| **RPC Endpoint** | `https://evmrpc.0g.ai` |
| **Block Explorer** | [chainscan.0g.ai](https://chainscan.0g.ai) |
| **Native Currency** | `0G` Token |
| **Deployer Wallet** | [`0xb5aDc622a510f66E467e603377d62da5667c1f20`](https://chainscan.0g.ai/address/0xb5aDc622a510f66E467e603377d62da5667c1f20) |
| **Deployment Timestamp** | `2026-08-16T09:58:46.412Z` |

---

## 📜 Deployed Smart Contracts

### 1. **AgenticID (`ERC-7857` Token Standard)**
- **Contract Address**: [`0x9162F031180dB91427e7B3DB8C075a89D27aD1a5`](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5)
- **Explorer Link**: [https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5)
- **Description**: Implements the ERC-7857 standard for tokenizing autonomous AI agents. Stores encrypted metadata pointers (`0G Storage` root hashes), AI model references, and dynamic Merkle state commitments.

### 2. **AgentMarketplace**
- **Contract Address**: [`0x28630af41364909C18f18809a015afcA96343240`](https://chainscan.0g.ai/address/0x28630af41364909C18f18809a015afcA96343240)
- **Explorer Link**: [https://chainscan.0g.ai/address/0x28630af41364909C18f18809a015afcA96343240](https://chainscan.0g.ai/address/0x28630af41364909C18f18809a015afcA96343240)
- **Description**: Manages agent marketplace listings, per-call payment escrow (0G Pay), job request emissions, off-chain worker attestation verification (`COMPUTE_WORKER_ROLE`), and automated settlement release.

---

## 🤖 Pre-Minted & Listed Mainnet AI Agents

The following 5 AI agents have been tokenized into ERC-7857 Agentic IDs and active marketplace listings on 0G Aristotle Mainnet:

| Token ID | Agent Name | Model Architecture | Storage Root Hash | Call Price | Explorer Direct Link |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **#1** | **Kitsune Zen Oracle** | `0g-compute/llama-3.1-70b-instruct` | `0g_storage_root_c8a9f...` | `0.01 0G` | [View Token #1](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5) |
| **#2** | **Ronin Cyber-Auditor** | `0g-compute/deepseek-r1-verifier` | `0g_storage_root_e4b1c...` | `0.025 0G` | [View Token #2](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5) |
| **#3** | **Tengu Sentiment Strategist** | `0g-compute/mistral-large-0g` | `0g_storage_root_f99a0...` | `0.015 0G` | [View Token #3](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5) |
| **#4** | **Sensei On-Chain Data Analyst** | `0g-compute/qwen-2.5-coder-32b` | `0g_storage_root_b219d...` | `0.018 0G` | [View Token #4](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5) |
| **#5** | **Ethereal Calligraphy Scribe** | `0g-compute/llama-3.3-70b` | `0g_storage_root_d774a...` | `0.008 0G` | [View Token #5](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5) |

---

## 🔍 How to Verify On-Chain

Anyone can independently audit and verify our live mainnet contracts using the official **0G Chainscan Explorer**:

1. **Verify Contract Deployment & Source Code**:
   - Search address [`0x9162F031180dB91427e7B3DB8C075a89D27aD1a5`](https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5) for **AgenticID**.
   - Search address [`0x28630af41364909C18f18809a015afcA96343240`](https://chainscan.0g.ai/address/0x28630af41364909C18f18809a015afcA96343240) for **AgentMarketplace**.

2. **Verify ERC-7857 Token Minting & Metadata**:
   - Query `ownerOf(uint256 tokenId)` or `getAgentMetadata(uint256 tokenId)` on `AgenticID`.

3. **Track Real-Time On-Chain Events**:
   - `AgenticIDMinted`: Triggered when an AI agent is tokenized.
   - `AgentListed`: Triggered when an agent goes live on the marketplace.
   - `InferenceRequested`: Triggered when a buyer escrows 0G tokens for an inference call.
   - `InferenceFulfilled`: Triggered when 0G Compute worker attestation signature is verified on-chain.
   - `PaymentReleased`: Triggered when settlement funds are transferred to the creator.

---

## 🦊 Connecting to Kitsune Mainnet via Web3 Wallet

1. Open Kitsune Marketplace at `https://kitsune.siddhu.info/`.
2. Click **Connect Wallet** in the top navigation bar.
3. Select **0G-Aristotle (Mainnet)** from the network selector dropdown.
4. If prompt appears in your Web3 wallet (MetaMask / Rabby / OKX), confirm network switch to **Chain ID 16661**.
