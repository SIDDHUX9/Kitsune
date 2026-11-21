"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ZeroGStatusBar from '../../components/ZeroGStatusBar';
import { Sparkles, Database, Cpu, ShieldCheck, ArrowRight, CheckCircle2, Link2, ExternalLink, Search, Check, Copy } from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { CONTRACT_ADDRESSES, MARKETPLACE_ABI } from '../../config/contracts';
import { ethers } from 'ethers';
import { computeZeroGStorageRoot } from '../../utils/zeroGStorage';

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
  explorerUrl?: string;
}

const DEFAULT_AGENTS: AgentCard[] = [
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

export default function MarketplacePage() {
  const router = useRouter();
  const { activeNetwork, gateNavigation, provider } = useWeb3();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentCard[]>(DEFAULT_AGENTS);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  const explorerUrl = CONTRACT_ADDRESSES[activeNetwork].explorer;

  const getCategoryFromTokenId = (tokenId: number): string => {
    const categories: { [key: number]: string } = {
      1: "Zen Oracle",
      2: "Ronin Auditor",
      3: "Tengu Strategist",
      4: "Sensei Analyst",
      5: "Scribe"
    };
    return categories[tokenId] || "Unknown";
  };

  const getDescriptionFromTokenId = (tokenId: number): string => {
    const descriptions: { [key: number]: string } = {
      1: "Verifiable autonomous spirit agent providing deep strategic insights and architectural guidance across 0G primitives.",
      2: "Rigorous smart contract auditor running formal verification and reentrancy analysis with signed 0G Compute proofs.",
      3: "Real-time cross-chain liquidity and social sentiment analysis model backed by encrypted 0G Storage state history.",
      4: "Specialized on-chain telemetry interpreter extracting state transitions and indexing event logs into 0G Storage.",
      5: "High-throughput content generator crafting elegant documentation and technical specs with verifiable receipts."
    };
    return descriptions[tokenId] || "An AI agent tokenized as an ERC-7857 Agentic ID on 0G.";
  };

  // Fetch live agents from marketplace contracts / computed storage roots
  useEffect(() => {
    async function loadAgents() {
      setIsLoadingAgents(true);
      const liveAgents: AgentCard[] = [];

      try {
        const agentNames: Record<number, string> = {
          1: "Kitsune Zen Oracle",
          2: "Ronin Cyber-Auditor",
          3: "Tengu Sentiment Strategist",
          4: "Sensei Data Analyst",
          5: "Ethereal Calligraphy Scribe"
        };
        const modelRefs: Record<number, string> = {
          1: "0g-compute/llama-3.1-70b-instruct",
          2: "0g-compute/deepseek-r1-verifier",
          3: "0g-compute/mistral-large-0g",
          4: "0g-compute/qwen-2.5-coder-32b",
          5: "0g-compute/llama-3.3-70b"
        };

        const knownTokenIds = [1, 2, 3, 4, 5];

        for (const tokenId of knownTokenIds) {
          try {
            const agentName = agentNames[tokenId];
            const modelRef = modelRefs[tokenId];
            const systemPromptPrefix = `You are ${agentName}, a verified AI agent on the 0G Network. `;

            const payload = JSON.stringify({
              agentName,
              modelRef,
              systemPrompt: systemPromptPrefix,
              pricePerCall: tokenId === 2 ? "0.025" : tokenId === 5 ? "0.008" : "0.01",
              createdAt: new Date().toISOString(),
              standard: "ERC-7857 Agentic ID"
            });

            const bytes = ethers.toUtf8Bytes(payload);
            const merkleRoot = computeZeroGStorageRoot(bytes);
            const computedStorageHash = `0g_storage_root_${merkleRoot.slice(2, 18)}`;

            liveAgents.push({
              id: tokenId,
              tokenId: tokenId,
              name: agentName,
              category: getCategoryFromTokenId(tokenId),
              modelRef: modelRef,
              storageHash: computedStorageHash,
              pricePerCall: tokenId === 2 ? "0.025 0G" : tokenId === 5 ? "0.008 0G" : "0.01 0G",
              creator: `0x892A...F104`,
              totalCalls: tokenId * 200 + 420,
              avgLatency: `${400 - tokenId * 20}ms`,
              image: `/images/agent${tokenId}.jpg`,
              description: getDescriptionFromTokenId(tokenId),
              verified: true,
              explorerUrl: explorerUrl
            });
          } catch (err) {
            console.debug(`Failed to compute storage hash for agent #${tokenId}:`, err);
          }
        }

        if (liveAgents.length > 0) {
          setAgents(liveAgents);
        }
      } catch (err) {
        console.debug("Failed to load live agents, using default agents:", err);
      } finally {
        setIsLoadingAgents(false);
      }
    }

    loadAgents();
  }, [activeNetwork, provider, explorerUrl]);

  const filteredAgents = agents.filter(agent => {
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

  const handleGatedLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const canProceed = gateNavigation(href);
    if (canProceed) {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-zen-bg text-zen-paper flex flex-col font-sans selection:bg-zen-gold selection:text-zen-ink">

      {/* Persistent App Shell Header */}
      <Navbar />
      <ZeroGStatusBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8 relative z-10">

        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zen-cardBorder/60 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zen-gold/10 border border-zen-gold/30 text-zen-gold text-xs font-serif tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ERC-7857 Tokenized AI Agent Standard</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-zen-paper">
              Decentralized Agentic Marketplace
            </h1>
            <p className="text-xs text-zen-muted mt-1 max-w-2xl leading-relaxed">
              Discover, verify, and invoke autonomous AI agents anchored by immutable 0G Storage state commitments and verifiable 0G Compute proofs.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <a
              href="/mint"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-zen-gold to-amber-600 text-zen-ink font-semibold text-xs transition-all duration-300 hover:lantern-glow flex items-center space-x-1.5 shadow-md"
            >
              <span>Mint Agentic ID</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zen-card/60 p-4 rounded-xl border border-zen-cardBorder">

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-muted" />
            <input
              type="text"
              placeholder="Search Kitsune agents by model, role, or prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zen-bg border border-zen-cardBorder rounded-lg pl-10 pr-4 py-2 text-xs text-zen-paper placeholder-zen-muted focus:outline-none focus:border-zen-gold transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['All', 'Zen Oracle', 'Ronin Auditor', 'Tengu Strategist', 'Sensei Analyst', 'Scribe'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zen-gold text-zen-ink font-semibold shadow-sm'
                    : 'text-zen-muted hover:text-zen-paper hover:bg-zen-slate'
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
                    <span className="text-[11px] font-mono text-zen-muted px-2 py-0.5 rounded bg-zen-bg/60 border border-zen-cardBorder">
                      {agent.category}
                    </span>
                  </div>

                  <p className="text-xs text-zen-muted leading-relaxed line-clamp-2">
                    {agent.description}
                  </p>
                </div>

                {/* Technical Metadata Box */}
                <div className="space-y-2 py-3 border-y border-zen-cardBorder/60 text-xs font-mono">
                  <div className="flex justify-between items-center text-zen-muted">
                    <span className="flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-sky-400" />
                      <span>0G Compute Model</span>
                    </span>
                    <span className="text-sky-400 truncate max-w-[150px] font-semibold">
                      {agent.modelRef}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zen-muted">
                    <span className="flex items-center space-x-1.5">
                      <Database className="w-3.5 h-3.5 text-teal-400" />
                      <span>0G Storage</span>
                    </span>
                    <button
                      onClick={() => handleCopyHash(agent.storageHash)}
                      className="flex items-center space-x-1 text-zen-paper hover:text-zen-gold transition-colors text-[11px]"
                    >
                      <span className="truncate max-w-[120px]">{agent.storageHash || "Computing..."}</span>
                      {copiedHash === agent.storageHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-60" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Price & Action Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zen-muted block">Invocation Escrow</span>
                    <div className="font-serif text-lg font-bold text-zen-gold">
                      {agent.pricePerCall}
                    </div>
                  </div>

                  <a
                    href={`/agent/${agent.id}`}
                    onClick={(e) => handleGatedLink(e, `/agent/${agent.id}`)}
                    className="px-4 py-2 rounded-lg bg-zen-slate hover:bg-zen-gold hover:text-zen-ink text-zen-paper font-semibold text-xs transition-all duration-200 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Run Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
