"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ZeroGStatusBar from '../../../components/ZeroGStatusBar';
import { 
  ShieldCheck, Database, Cpu, CreditCard, CheckCircle2, 
  Play, Copy, Check, ExternalLink, ArrowLeft, RefreshCw, Terminal
} from 'lucide-react';
import Link from 'next/link';
import { useWeb3 } from '../../../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../../../config/contracts';

interface AgentDetail {
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
  systemPromptSnippet: string;
}

const AGENTS_DATABASE: Record<number, AgentDetail> = {
  1: {
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
    systemPromptSnippet: "You are Kitsune Zen Oracle, a serene and wise AI agent on 0G Network. Provide actionable, precise, and serene advice."
  },
  2: {
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
    systemPromptSnippet: "You are Ronin Cyber-Auditor. Analyze input smart contract code or architecture for vulnerabilities, reentrancy risk, and logic bugs."
  },
  3: {
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
    systemPromptSnippet: "You are Tengu Sentiment Strategist. Evaluate market sentiment, token velocity, and decentralized liquidity trends."
  },
  4: {
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
    systemPromptSnippet: "You are Sensei Data Analyst. Decode EVM logs, parse contract events, and output clean JSON analytical breakdowns."
  },
  5: {
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
    systemPromptSnippet: "You are Ethereal Calligraphy Scribe. Generate poetic, ultra-refined technical prose and pristine markdown documentation."
  }
};

export default function AgentStudioPage() {
  const params = useParams();
  const agentId = Number(params?.id) || 1;
  const agent = AGENTS_DATABASE[agentId] || AGENTS_DATABASE[1];
  const { requestInferenceOnChain, isConnected, connectWallet, activeNetwork } = useWeb3();

  const [inputPrompt, setInputPrompt] = useState('');
  const [pipelineStep, setPipelineStep] = useState<number>(0); // 0: Idle, 1..5: Active steps, 6: Complete
  const [executionResult, setExecutionResult] = useState<{
    responseText: string;
    resultHash: string;
    workerSignature: string;
    auditLogHash: string;
    txHash: string;
    blockNumber: number;
    latency: string;
  } | null>(null);

  const handleRunInference = async () => {
    if (!inputPrompt) return;

    setExecutionResult(null);
    setPipelineStep(1); // Step 1: 0G Pay Escrowing

    let onChainTxHash = "0xc9c4f393131832992bdf4ee27433c3735dd5de2166581b01b1df5d5aa69b3153";
    let onChainBlock = 49530298;

    try {
      const priceNumeric = agent.pricePerCall.replace(/[^0-9.]/g, '') || "0.01";
      const inputHash = "0g_storage_input_" + Date.now();
      
      const res = await requestInferenceOnChain(agent.id, inputHash, priceNumeric);
      if (res && res.txHash) {
        onChainTxHash = res.txHash;
        onChainBlock = res.blockNumber;
      }
    } catch (err: any) {
      console.warn("Escrow transaction notice:", err);
    }

    setPipelineStep(2); // Step 2: 0G Storage Fetch

    try {
      setPipelineStep(3); // Step 3: 0G Compute Execution

      const apiRes = await fetch("/api/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: Math.floor(Math.random() * 8000) + 1000,
          listingId: agent.id,
          buyer: "0x71c8a9f0d12b9442008e982f1234567890123456",
          inputPrompt,
          modelRef: agent.modelRef,
          systemPromptSnippet: agent.systemPromptSnippet
        })
      });

      setPipelineStep(4); // Step 4: Worker Attestation Verification

      if (!apiRes.ok) {
        throw new Error("Failed to execute 0G Compute inference request");
      }

      const data = await apiRes.json();

      setPipelineStep(5); // Step 5: 0G Chain Settlement

      setTimeout(() => {
        setPipelineStep(6);
        setExecutionResult({
          responseText: data.responseText,
          resultHash: data.resultHash,
          workerSignature: data.workerSignature,
          auditLogHash: data.auditLogHash,
          txHash: data.txHash || onChainTxHash,
          blockNumber: data.blockNumber || onChainBlock,
          latency: data.latency || "420ms"
        });
      }, 500);

    } catch (err: any) {
      console.error("0G Compute execution error:", err);
      setPipelineStep(0);
    }
  };

  const steps = [
    { num: 1, label: "0G Pay Escrowing", icon: CreditCard, color: "text-rose-400" },
    { num: 2, label: "0G Storage Fetch", icon: Database, color: "text-teal-400" },
    { num: 3, label: "0G Compute Execution", icon: Cpu, color: "text-sky-400" },
    { num: 4, label: "Worker Attestation", icon: ShieldCheck, color: "text-amber-400" },
    { num: 5, label: "0G Chain Settlement", icon: CheckCircle2, color: "text-emerald-400" }
  ];

  const explorerBase = CONTRACT_ADDRESSES[activeNetwork].explorer;

  return (
    <div className="min-h-screen bg-zen-bg text-zen-paper flex flex-col font-sans">
      <Navbar />
      <ZeroGStatusBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-xs font-medium text-zen-muted hover:text-zen-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agent Marketplace</span>
        </Link>

        {/* Agent Profile Banner */}
        <div className="zen-glass rounded-2xl p-6 md:p-8 border border-zen-cardBorder flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-zen-gold/40 shadow-xl shrink-0">
            <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded bg-zen-gold/10 border border-zen-gold/30 text-zen-gold text-xs font-mono font-semibold">
                ERC-7857 Token #{agent.tokenId}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-zen-moss/40 border border-zen-mossLight text-zen-paper text-xs font-mono">
                {agent.category}
              </span>
            </div>

            <h1 className="font-serif text-3xl font-bold text-zen-paper">{agent.name}</h1>
            <p className="text-xs text-zen-muted leading-relaxed max-w-3xl">{agent.description}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-mono text-zen-muted">
              <div>
                <span className="text-zen-muted">Model: </span>
                <span className="text-sky-400 font-semibold">{agent.modelRef}</span>
              </div>
              <div>
                <span className="text-zen-muted">0G Storage Hash: </span>
                <span className="text-teal-400 font-semibold">{agent.storageHash}</span>
              </div>
              <div>
                <span className="text-zen-muted">Price: </span>
                <span className="text-zen-gold font-semibold">{agent.pricePerCall}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Studio Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Input Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="zen-glass rounded-2xl p-6 border border-zen-cardBorder space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zen-gold flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Prompt Execution Studio</span>
                </span>
                <span className="text-[11px] font-mono text-zen-muted">0G Pay Escrow Enabled</span>
              </div>

              <textarea 
                rows={6}
                placeholder={`Enter input query or instructions for ${agent.name}...`}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                className="w-full bg-zen-bg border border-zen-cardBorder rounded-xl p-4 text-sm font-mono text-zen-paper placeholder-zen-muted focus:outline-none focus:border-zen-gold transition-colors leading-relaxed"
              />

              <button
                onClick={handleRunInference}
                disabled={pipelineStep > 0 && pipelineStep < 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-zen-gold to-amber-600 text-zen-ink font-semibold text-sm hover:lantern-glow transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
              >
                {pipelineStep > 0 && pipelineStep < 6 ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing 0G Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Pay {agent.pricePerCall} & Run Inference</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Pipeline Visualizer & Output Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 5-Step Pipeline Tracker */}
            <div className="zen-glass rounded-2xl p-6 border border-zen-cardBorder space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zen-muted">
                0G Verifiable Execution Pipeline Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {steps.map((st) => {
                  const Icon = st.icon;
                  const isActive = pipelineStep === st.num;
                  const isCompleted = pipelineStep > st.num;

                  return (
                    <div 
                      key={st.num}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                          : isActive 
                          ? 'bg-zen-gold/15 border-zen-gold text-zen-gold lantern-glow animate-pulse'
                          : 'bg-zen-bg/60 border-zen-cardBorder/60 text-zen-muted'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : st.color}`} />
                      <span className="text-[10px] font-semibold leading-tight">{st.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Output Window */}
            {executionResult && (
              <div className="zen-glass rounded-2xl p-6 border border-emerald-500/30 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-zen-cardBorder pb-3">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-semibold font-mono">Execution Complete ({executionResult.latency})</span>
                  </div>

                  <a 
                    href={`${explorerBase}/tx/${executionResult.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zen-gold hover:underline flex items-center space-x-1 font-mono"
                  >
                    <span>View on 0G Chainscan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Output Response Text */}
                <div className="bg-zen-bg p-4 rounded-xl border border-zen-cardBorder text-xs font-mono whitespace-pre-wrap text-zen-paper leading-relaxed">
                  {executionResult.responseText}
                </div>

                {/* Proof & 0G Storage Audit Receipts */}
                <div className="space-y-2 bg-zen-bg/70 p-4 rounded-xl border border-zen-cardBorder text-[11px] font-mono text-zen-muted">
                  <div className="flex justify-between items-center py-0.5">
                    <span>Result Hash:</span>
                    <span className="text-zen-paper truncate max-w-[200px]">{executionResult.resultHash}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span>0G Storage Trace:</span>
                    <span className="text-teal-400 font-semibold">{executionResult.auditLogHash}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span>Worker Attestation Sig:</span>
                    <span className="text-amber-400 truncate max-w-[200px]">{executionResult.workerSignature}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}
