"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InkWashBackground from '../../components/InkWashBackground';
import { 
  BookOpen, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Layers, 
  Zap, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Lock, 
  Code2, 
  Compass, 
  CheckCircle2,
  Terminal,
  FileCode,
  ArrowRight
} from 'lucide-react';

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState('abstract');

  const sections = [
    { id: 'abstract', title: 'Abstract & Executive Summary' },
    { id: 'problem', title: '1. Introduction & Problem Statement' },
    { id: 'architecture', title: '2. Kitsune & 0G System Architecture' },
    { id: 'erc7857', title: '3. ERC-7857 Technical Specification' },
    { id: 'mainnet', title: '4. Live Mainnet Deployment & Verification' },
    { id: 'roadmap', title: '5. Future Plans & Strategic Roadmap' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-zen-bg text-zen-paper flex flex-col font-sans selection:bg-zen-gold selection:text-zen-ink relative overflow-hidden">
      {/* Dynamic Animated Background Canvas */}
      <InkWashBackground />

      {/* Persistent App Header */}
      <Navbar />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full relative z-10">

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-14 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zen-gold/10 border border-zen-gold/30 text-zen-gold text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TECHNICAL WHITEPAPER V1.0</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-zen-paper tracking-tight">
            Verifiable Agentic Infrastructure
          </h1>

          <p className="text-zen-muted text-base sm:text-lg font-serif italic max-w-2xl mx-auto">
            "Tokenizing Autonomous AI Agents via ERC-7857, 0G Compute Verification, 0G Storage Merkle Archival, and 0G Pay Atomic Settlement."
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-zen-muted">
            <span className="bg-zen-card/60 px-3 py-1.5 rounded-lg border border-zen-cardBorder flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Target: 0G-Aristotle (16661)</span>
            </span>
            <a 
              href="https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5" 
              target="_blank" 
              rel="noreferrer"
              className="bg-zen-card/60 hover:bg-zen-card px-3 py-1.5 rounded-lg border border-zen-cardBorder hover:border-zen-gold text-zen-paper transition-colors flex items-center space-x-1"
            >
              <span>ERC-7857: 0x9162...D1a5</span>
              <ExternalLink className="w-3 h-3 text-zen-gold" />
            </a>
          </div>
        </div>

        {/* Layout: Sidebar ToC + Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sticky Table of Contents Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 zen-glass p-5 rounded-2xl border border-zen-cardBorder shadow-xl space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-zen-paper uppercase tracking-wider font-serif">
                <Compass className="w-4 h-4 text-zen-gold" />
                <span>Table of Contents</span>
              </div>

              <nav className="space-y-1 text-xs font-medium">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${
                      activeSection === sec.id
                        ? 'bg-zen-gold/15 text-zen-gold font-semibold border border-zen-gold/30'
                        : 'text-zen-muted hover:text-zen-paper hover:bg-zen-card/40'
                    }`}
                  >
                    <span className="truncate">{sec.title}</span>
                    <ChevronRight className={`w-3 h-3 text-zen-gold transition-transform ${activeSection === sec.id ? 'translate-x-0.5' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-zen-cardBorder/60">
                <a
                  href="/MAINNET.md"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full px-3 py-2 rounded-lg bg-zen-slate/50 hover:bg-zen-slate text-zen-paper text-xs font-mono transition-colors flex items-center justify-between border border-zen-cardBorder"
                >
                  <span>Mainnet Deployment</span>
                  <ExternalLink className="w-3 h-3 text-zen-gold" />
                </a>
              </div>
            </div>
          </div>

          {/* Main Documentation Articles */}
          <div className="lg:col-span-9 space-y-16">

            {/* ABSTRACT */}
            <section id="abstract" className="zen-glass p-8 sm:p-10 rounded-2xl border border-zen-cardBorder space-y-6">
              <div className="flex items-center space-x-3 border-b border-zen-cardBorder/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zen-paper">Abstract & Executive Summary</h2>
                  <p className="text-xs text-zen-muted font-mono uppercase">Verifiable AI Agent Economy</p>
                </div>
              </div>

              <p className="text-zen-paper/90 leading-relaxed text-sm sm:text-base">
                As Autonomous Artificial Intelligence agents evolve from passive prompt-response systems into sovereign economic actors, traditional Web2 AI platforms fail to provide trustless ownership, verifiable execution, or decentralized monetization. Centralized APIs remain opaque black boxes where model weights can be silently altered, execution logs can be tampered with, and creators lack atomic ownership transfer.
              </p>

              <p className="text-zen-paper/90 leading-relaxed text-sm sm:text-base">
                <strong className="text-zen-gold">Kitsune</strong> introduces a unified, decentralized marketplace architecture built natively on the <strong className="text-zen-paper font-semibold">0G Decentralized AI Operating System (0G AI OS)</strong>. AI agents are tokenized as verifiable, dynamic digital assets using the <strong className="text-zen-paper font-semibold">ERC-7857 Agentic ID</strong> standard. Inference calls are dispatched through <strong className="text-zen-paper font-semibold">0G Compute</strong>, prompt and execution history is immutably archived on <strong className="text-zen-paper font-semibold">0G Storage</strong>, per-call payments are escrowed via <strong className="text-zen-paper font-semibold">0G Pay</strong>, and all state commitments, worker attestations, and settlements are immutably verified on <strong className="text-zen-paper font-semibold">0G Chain (0G-Aristotle Mainnet)</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-zen-card/40 border border-zen-cardBorder/80 space-y-1">
                  <div className="text-xs text-zen-muted font-mono">Token Standard</div>
                  <div className="font-serif text-lg font-bold text-zen-gold">ERC-7857</div>
                  <div className="text-[11px] text-zen-muted">Dynamic State Pointers</div>
                </div>
                <div className="p-4 rounded-xl bg-zen-card/40 border border-zen-cardBorder/80 space-y-1">
                  <div className="text-xs text-zen-muted font-mono">Execution Proof</div>
                  <div className="font-serif text-lg font-bold text-zen-gold">Worker Attestation</div>
                  <div className="text-[11px] text-zen-muted">ECDSA Cryptographic Signature</div>
                </div>
                <div className="p-4 rounded-xl bg-zen-card/40 border border-zen-cardBorder/80 space-y-1">
                  <div className="text-xs text-zen-muted font-mono">Settlement Layer</div>
                  <div className="font-serif text-lg font-bold text-zen-gold">0G-Aristotle</div>
                  <div className="text-[11px] text-zen-muted">Chain ID 16661</div>
                </div>
              </div>
            </section>

            {/* PROBLEM STATEMENT */}
            <section id="problem" className="zen-glass p-8 sm:p-10 rounded-2xl border border-zen-cardBorder space-y-6">
              <div className="flex items-center space-x-3 border-b border-zen-cardBorder/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zen-paper">1. Introduction & Problem Statement</h2>
                  <p className="text-xs text-zen-muted font-mono uppercase">Limitations of Web2 AI Platforms</p>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-zen-paper/90 leading-relaxed">
                <p>
                  In modern AI deployment environments, users and enterprise developers operate under complete asymmetry of trust:
                </p>

                <ul className="space-y-3 font-mono text-xs sm:text-sm text-zen-paper/90 pl-2">
                  <li className="flex items-start space-x-3 p-3 rounded-lg bg-zen-card/30 border border-zen-cardBorder/60">
                    <span className="text-zen-vermilion font-bold">01.</span>
                    <div>
                      <strong className="text-zen-paper">Unverifiable Model Execution:</strong> Users cannot prove whether an API response was generated by the claimed 70B parameter model or an inferior 8B parameter fallback.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 p-3 rounded-lg bg-zen-card/30 border border-zen-cardBorder/60">
                    <span className="text-zen-vermilion font-bold">02.</span>
                    <div>
                      <strong className="text-zen-paper">Non-Transferable Asset Identity:</strong> Trained agent prompts, fine-tuned weights, and memory states cannot be sold or transferred as sovereign economic assets.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 p-3 rounded-lg bg-zen-card/30 border border-zen-cardBorder/60">
                    <span className="text-zen-vermilion font-bold">03.</span>
                    <div>
                      <strong className="text-zen-paper">Siloed Monetization:</strong> Creators depend on centralized platform revenue shares subject to arbitrary policy changes and account suspensions.
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 p-3 rounded-lg bg-zen-card/30 border border-zen-cardBorder/60">
                    <span className="text-zen-vermilion font-bold">04.</span>
                    <div>
                      <strong className="text-zen-paper">Ephemeral Memory & Auditability:</strong> Execution traces and memory logs are stored on private servers vulnerable to quiet data deletion or retroactive manipulation.
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* ARCHITECTURE */}
            <section id="architecture" className="zen-glass p-8 sm:p-10 rounded-2xl border border-zen-cardBorder space-y-6">
              <div className="flex items-center space-x-3 border-b border-zen-cardBorder/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zen-paper">2. Kitsune & 0G System Architecture</h2>
                  <p className="text-xs text-zen-muted font-mono uppercase">5 Foundational 0G Primitives</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                <div className="p-5 rounded-xl bg-zen-card/50 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center space-x-2 text-zen-gold font-bold font-serif text-sm">
                    <Zap className="w-4 h-4" />
                    <span>0G Chain (Mainnet 16661)</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    High-throughput EVM settlement layer. Executes smart contract logic for AgenticID tokenization, market listings, and escrow release.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-zen-card/50 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center space-x-2 text-zen-gold font-bold font-serif text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>0G Agentic ID (ERC-7857)</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Tokenizes autonomous AI agents into non-fungible assets containing encrypted metadata pointers and dynamic Merkle state commitments.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-zen-card/50 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center space-x-2 text-zen-gold font-bold font-serif text-sm">
                    <Cpu className="w-4 h-4" />
                    <span>0G Compute Nodes</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Off-chain LLM execution engines (Llama-3.1, DeepSeek R1). Generates verifiable ECDSA worker attestation signatures per inference call.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-zen-card/50 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center space-x-2 text-zen-gold font-bold font-serif text-sm">
                    <Database className="w-4 h-4" />
                    <span>0G Storage Network</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Archives encrypted prompt inputs, agent memory trees, fine-tuning weights, and execution logs into authentic 32-byte Merkle roots.
                  </p>
                </div>

              </div>
            </section>

            {/* ERC-7857 TECHNICAL SPEC */}
            <section id="erc7857" className="zen-glass p-8 sm:p-10 rounded-2xl border border-zen-cardBorder space-y-6">
              <div className="flex items-center space-x-3 border-b border-zen-cardBorder/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zen-paper">3. ERC-7857 Technical Specification</h2>
                  <p className="text-xs text-zen-muted font-mono uppercase">Smart Contract Interface & Data Structures</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-mono">
                <div className="bg-zen-bg/90 p-4 rounded-xl border border-zen-cardBorder overflow-x-auto text-zen-paper">
                  <div className="text-zen-gold mb-2 font-bold">// AgenticID Metadata Struct Definition</div>
                  <pre className="text-[12px] leading-relaxed">
{`struct AgentMetadata {
    string storageHash;       // 0G Storage Merkle root pointer
    string modelReference;    // Target 0G Compute model identifier
    bytes32 stateCommitment;  // Dynamic state Merkle root
    uint256 createdAt;        // Block timestamp
    bool isActive;            // Operating status
}

function mintAgenticID(
    address to, 
    string memory storageHash, 
    string memory modelReference, 
    string memory initialMetadataURI
) external returns (uint256);`}
                  </pre>
                </div>
              </div>
            </section>

            {/* MAINNET VERIFICATION */}
            <section id="mainnet" className="zen-glass p-8 sm:p-10 rounded-2xl border border-zen-cardBorder space-y-6">
              <div className="flex items-center space-x-3 border-b border-zen-cardBorder/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zen-paper">4. Live Mainnet Deployment & Verification</h2>
                  <p className="text-xs text-zen-muted font-mono uppercase">0G-Aristotle On-Chain Addresses</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-zen-card/40 border border-zen-cardBorder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-zen-paper font-serif">AgenticID (ERC-7857) Contract</div>
                    <div className="font-mono text-xs text-zen-gold">0x9162F031180dB91427e7B3DB8C075a89D27aD1a5</div>
                  </div>
                  <a
                    href="https://chainscan.0g.ai/address/0x9162F031180dB91427e7B3DB8C075a89D27aD1a5"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-zen-gold/10 hover:bg-zen-gold/20 text-zen-gold text-xs font-mono border border-zen-gold/30 transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
                  >
                    <span>View on 0G Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-zen-card/40 border border-zen-cardBorder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-zen-paper font-serif">AgentMarketplace Contract</div>
                    <div className="font-mono text-xs text-zen-gold">0x28630af41364909C18f18809a015afcA96343240</div>
                  </div>
                  <a
                    href="https://chainscan.0g.ai/address/0x28630af41364909C18f18809a015afcA96343240"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-zen-gold/10 hover:bg-zen-gold/20 text-zen-gold text-xs font-mono border border-zen-gold/30 transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
                  >
                    <span>View on 0G Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </section>

            {/* FUTURE ROADMAP */}
            <section id="roadmap" className="zen-glass p-8 sm:p-10 rounded-2xl border border-zen-cardBorder space-y-6">
              <div className="flex items-center space-x-3 border-b border-zen-cardBorder/60 pb-4">
                <div className="w-10 h-10 rounded-xl bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zen-paper">5. Future Plans & Strategic Roadmap</h2>
                  <p className="text-xs text-zen-muted font-mono uppercase">Next-Gen Agentic Verification</p>
                </div>
              </div>

              <div className="space-y-4">
                
                <div className="p-5 rounded-xl bg-zen-card/40 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-zen-gold text-base">Phase 1: Hardware-Enforced TEE Attestation</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zen-gold/20 text-zen-gold font-mono">Q3 2026</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Integration of Intel SGX and AMD SEV-SNP hardware enclaves for hardware-enforced remote attestation of 0G Compute worker nodes. Enclave-encrypted model weights prevent model theft or data leakage during execution.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-zen-card/40 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-zen-paper text-base">Phase 2: Zero-Knowledge Machine Learning (zkML) Proofs</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zen-cardBorder text-zen-muted font-mono">Q4 2026</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Succinct ZK-SNARK / STARK proofs for deterministic model verification. Proves exact model weight evaluation without revealing sensitive proprietary weights or fine-tuning datasets.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-zen-card/40 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-zen-paper text-base">Phase 3: Multi-Agent Autonomous Swarms & Inter-Agent Contracting</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zen-cardBorder text-zen-muted font-mono">Q1 2027</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Native support for ERC-7857 agents to autonomously hire and pay other ERC-7857 agents on-chain. Hierarchical task decomposition where a parent Oracle agent hires sub-agents for specialized sentiment, audit, or data analysis tasks.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-zen-card/40 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-zen-paper text-base">Phase 4: Sub-Second State Channel Micro-Settlement</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zen-cardBorder text-zen-muted font-mono">Q2 2027</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Implementation of off-chain 0G Pay state channels for high-frequency streaming inference. Reduces on-chain transaction overhead to sub-millisecond latency while maintaining atomic settlement safety.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-zen-card/40 border border-zen-cardBorder space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-zen-paper text-base">Phase 5: Kitsune DAO & Decentralized Model Registry Governance</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zen-cardBorder text-zen-muted font-mono">Q3 2027</span>
                  </div>
                  <p className="text-xs text-zen-muted leading-relaxed">
                    Community-governed curation of model providers and worker nodes. Automated slashing of misbehaving compute nodes submitting invalid or low-quality worker attestations.
                  </p>
                </div>

              </div>
            </section>

          </div>

        </div>

      </div>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
