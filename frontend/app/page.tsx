"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ZeroGStatusBar from '../components/ZeroGStatusBar';
import { Search, Filter, ShieldCheck, Database, Cpu, ArrowUpRight, Copy, Check, Sparkles } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface AgentCard {
  id: number;
  tokenId: number;
  name: string;
  category: string;
  modelRef: string;
  storageHash: string;
  pricePerCall: string;
  creator: string;
  totalCalls: number;
  avgLatency: string;
  image: string;
  description: string;
  verified: boolean;
}

const INITIAL_AGENTS: AgentCard[] = [
  {
    id: 1,
    tokenId: 1,
    name: "Kitsune Zen Oracle",
    category: "Zen Oracle",
    modelRef: "0g-compute/llama-3.1-70b-instruct",
    storageHash: "0g_storage_root_c8a9f0e123456789",
    pricePerCall: "0.01 0G",
    creator: "0x892A...F104",
    totalCalls: 1420,
    avgLatency: "480ms",
    image: "/images/agent1.jpg",
    description: "Verifiable autonomous spirit agent providing deep strategic insights and architectural guidance across 0G primitives.",
    verified: true
  },
  {
    id: 2,
    tokenId: 2,
    name: "Ronin Cyber-Auditor",
    category: "Ronin Auditor",
    modelRef: "0g-compute/deepseek-r1-verifier",
    storageHash: "0g_storage_root_e4b1c9f876543210",
    pricePerCall: "0.025 0G",
    creator: "0x34F1...A902",
    totalCalls: 890,
    avgLatency: "620ms",
    image: "/images/agent2.jpg",
    description: "Rigorous smart contract auditor running formal verification and reentrancy analysis with signed 0G Compute proofs.",
    verified: true
  },
  {
    id: 3,
    tokenId: 3,
    name: "Tengu Sentiment Strategist",
    category: "Tengu Strategist",
    modelRef: "0g-compute/mistral-large-0g",
    storageHash: "0g_storage_root_f99a0d8172635441",
    pricePerCall: "0.015 0G",
    creator: "0x12B9...C881",
    totalCalls: 2150,
    avgLatency: "390ms",
    image: "/images/agent3.jpg",
    description: "Real-time cross-chain liquidity and social sentiment analysis model backed by encrypted 0G Storage state history.",
    verified: true
  },
  {
    id: 4,
    tokenId: 4,
    name: "Sensei Data Analyst",
    category: "Sensei Analyst",
    modelRef: "0g-compute/qwen-2.5-coder-32b",
    storageHash: "0g_storage_root_b219d04981726354",
    pricePerCall: "0.018 0G",
    creator: "0x67E4...55A2",
    totalCalls: 1110,
    avgLatency: "510ms",
    image: "/images/agent4.jpg",
    description: "Specialized on-chain telemetry interpreter extracting state transitions and indexing event logs into 0G Storage.",
    verified: true
  },
  {
    id: 5,
    tokenId: 5,
    name: "Ethereal Calligraphy Scribe",
    category: "Scribe",
    modelRef: "0g-compute/llama-3.3-70b",
    storageHash: "0g_storage_root_d774a10293847561",
    pricePerCall: "0.008 0G",
    creator: "0x90B3...22D1",
    totalCalls: 3400,
    avgLatency: "310ms",
    image: "/images/agent5.jpg",
    description: "High-throughput content generator crafting elegant documentation and technical specs with verifiable receipts.",
    verified: true
  }
];

export default function Home() {
  const { activeNetwork } = useWeb3();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const categories = ['All', 'Zen Oracle', 'Ronin Auditor', 'Tengu Strategist', 'Sensei Analyst', 'Scribe'];

  const filteredAgents = INITIAL_AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.modelRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const explorerUrl = CONTRACT_ADDRESSES[activeNetwork].explorer;

  return (
    <div className="min-h-screen bg-zen-bg text-zen-paper flex flex-col font-sans">
      <Navbar />
      <ZeroGStatusBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-12">
        
        {/* Hero Section */}
        <section className="relative rounded-2xl bg-gradient-to-b from-zen-card/90 to-zen-bg border border-zen-cardBorder p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-zen-gold/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-6 max-w-3xl">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zen-gold/10 border border-zen-gold/30 text-zen-gold text-xs font-serif tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ERC-7857 Tokenized AI Agent Standard</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zen-paper">
              Decentralized Marketplace for <span className="text-transparent bg-clip-text bg-gradient-to-r from-zen-gold via-amber-300 to-zen-vermilion">Verifiable AI Agents</span>
            </h1>

            <p className="text-zen-muted text-base sm:text-lg leading-relaxed font-sans">
              Mint autonomous AI agents as ERC-7857 assets, run inference on <span className="text-zen-paper font-semibold">0G Compute</span>, store encrypted prompt logs on <span className="text-zen-paper font-semibold">0G Storage</span>, and execute micropayments via <span className="text-zen-paper font-semibold">0G Pay</span> on <span className="text-zen-paper font-semibold">0G Chain</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/mint" 
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-zen-gold to-amber-600 text-zen-ink font-semibold text-sm hover:lantern-glow transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <span>Mint Agentic ID (ERC-7857)</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/audit" 
                className="px-6 py-3 rounded-lg bg-zen-card border border-zen-cardBorder text-zen-paper font-medium text-sm hover:bg-zen-slate transition-colors flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-zen-gold" />
                <span>View On-Chain Audit Logs</span>
              </Link>
            </div>

          </div>
        </section>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zen-card/60 p-4 rounded-xl border border-zen-cardBorder">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-muted" />
            <input 
              type="text"
              placeholder="Search Kitsune agents by model, role, or prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zen-bg border border-zen-cardBorder rounded-lg pl-10 pr-4 py-2 text-sm text-zen-paper placeholder-zen-muted focus:outline-none focus:border-zen-gold transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-zen-gold text-zen-ink font-semibold'
                    : 'text-zen-muted hover:text-zen-paper hover:bg-zen-cardBorder/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <div 
              key={agent.id}
              className="zen-glass rounded-xl overflow-hidden border border-zen-cardBorder zen-glass-hover flex flex-col group"
            >
              {/* Card Header & Custom Illustration */}
              <div className="relative h-56 w-full overflow-hidden bg-zen-card">
                <img 
                  src={agent.image} 
                  alt={agent.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zen-card via-transparent to-transparent"></div>
                
                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-zen-bg/80 backdrop-blur-md border border-zen-cardBorder text-[11px] font-mono font-semibold text-zen-gold">
                    Token #{agent.tokenId}
                  </span>
                  
                  {agent.verified && (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-semibold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>0G Verified</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-zen-paper group-hover:text-zen-gold transition-colors">
                      {agent.name}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zen-cardBorder/50 text-zen-paper">
                      {agent.pricePerCall}
                    </span>
                  </div>

                  <p className="text-xs text-zen-muted line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                {/* Model Reference & 0G Storage Hash */}
                <div className="space-y-2 text-xs font-mono bg-zen-bg/60 p-3 rounded-lg border border-zen-cardBorder/60">
                  <div className="flex items-center justify-between text-zen-muted">
                    <span className="flex items-center space-x-1">
                      <Cpu className="w-3.5 h-3.5 text-sky-400" />
                      <span>Model</span>
                    </span>
                    <span className="text-zen-paper truncate max-w-[170px]">{agent.modelRef}</span>
                  </div>

                  <div className="flex items-center justify-between text-zen-muted">
                    <span className="flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5 text-teal-400" />
                      <span>0G Storage</span>
                    </span>
                    <button 
                      onClick={() => handleCopyHash(agent.storageHash)}
                      className="flex items-center space-x-1 text-zen-paper hover:text-zen-gold transition-colors text-[11px]"
                    >
                      <span className="truncate max-w-[120px]">{agent.storageHash}</span>
                      {copiedHash === agent.storageHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-zen-muted" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Footer: Metrics & Action */}
                <div className="pt-2 flex items-center justify-between border-t border-zen-cardBorder/40">
                  <div className="flex items-center space-x-4 text-xs text-zen-muted">
                    <div>
                      <span className="block text-[10px] uppercase">Calls</span>
                      <span className="font-semibold text-zen-paper">{agent.totalCalls}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Latency</span>
                      <span className="font-semibold text-zen-paper">{agent.avgLatency}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/agent/${agent.id}`}
                    className="px-4 py-2 rounded-lg bg-zen-slate hover:bg-zen-gold hover:text-zen-ink text-zen-paper font-semibold text-xs transition-all duration-200 flex items-center space-x-1.5"
                  >
                    <span>Run Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zen-cardBorder bg-zen-card/40 py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zen-muted">
          <div className="flex items-center space-x-2 font-serif text-zen-paper">
            <span>KITSUNE 0G Marketplace</span>
            <span>•</span>
            <span className="font-sans text-zen-muted">Powered by 0G Chain, Compute, Storage, Agentic ID & Pay</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href={explorerUrl} target="_blank" rel="noreferrer" className="hover:text-zen-gold transition-colors">0G Chainscan Explorer</a>
            <a href="https://docs.0g.ai" target="_blank" rel="noreferrer" className="hover:text-zen-gold transition-colors">0G Developer Hub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
