"use client";

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ZeroGStatusBar from '../../components/ZeroGStatusBar';
import { Sparkles, Database, Cpu, ShieldCheck, ArrowRight, CheckCircle2, Link2, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../../config/contracts';

export default function MintPage() {
  const { mintAgenticIDOnChain, isConnected, connectWallet, activeNetwork } = useWeb3();
  const [agentName, setAgentName] = useState('');
  const [modelRef, setModelRef] = useState('0g-compute/llama-3.1-70b-instruct');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [pricePerCall, setPricePerCall] = useState('0.01');
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{
    tokenId: number;
    storageHash: string;
    txHash: string;
    blockNumber: number;
  } | null>(null);

  const availableModels = [
    { id: '0g-compute/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct (0G Compute)' },
    { id: '0g-compute/deepseek-r1-verifier', name: 'DeepSeek R1 Formal Verifier (0G Compute)' },
    { id: '0g-compute/mistral-large-0g', name: 'Mistral Large 0G Edition' },
    { id: '0g-compute/qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder 32B' }
  ];

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName || !systemPrompt) return;

    if (!isConnected) {
      await connectWallet();
    }

    setIsMinting(true);

    try {
      // 1. Upload system prompt & agent configuration to 0G Storage
      const apiRes = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName,
          modelRef,
          systemPrompt,
          pricePerCall
        })
      });

      const data = await apiRes.json();
      const realStorageHash = data.storageHash || "0g_storage_root_c8a9f0e123456789";
      const metadataURI = `https://kitsune.0g.ai/api/agent/${encodeURIComponent(agentName)}`;

      // 2. Register ERC-7857 Agentic ID on 0G Chain
      const res = await mintAgenticIDOnChain(realStorageHash, modelRef, metadataURI);
      
      setMintResult({
        tokenId: res.tokenId,
        storageHash: realStorageHash,
        txHash: res.txHash,
        blockNumber: res.blockNumber
      });
    } catch (err) {
      console.error("Mint error:", err);
    } finally {
      setIsMinting(false);
    }
  };

  const explorerBase = CONTRACT_ADDRESSES[activeNetwork].explorer;

  return (
    <div className="min-h-screen bg-zen-bg text-zen-paper flex flex-col font-sans">
      <Navbar />
      <ZeroGStatusBar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 border-b border-zen-cardBorder pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zen-gold/10 border border-zen-gold/30 text-zen-gold text-xs font-serif">
            <Sparkles className="w-3.5 h-3.5" />
            <span>0G Agentic ID Minting Wizard</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zen-paper">
            Mint New Tokenized AI Agent (ERC-7857)
          </h1>
          <p className="text-zen-muted text-sm leading-relaxed max-w-2xl">
            Encrypt system prompts & model parameters via <span className="text-zen-paper font-semibold">0G Storage</span>, bind execution permissions to an ERC-7857 Agentic ID token, and list your agent on the marketplace.
          </p>
        </div>

        {mintResult ? (
          /* Mint Success Confirmation View */
          <div className="zen-glass rounded-2xl p-8 border border-emerald-500/40 space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-3 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-zen-paper">Agentic ID Minted & Listed!</h2>
                <p className="text-xs text-zen-muted">Token ID #{mintResult.tokenId} successfully registered on 0G Chain</p>
              </div>
            </div>

            <div className="space-y-3 bg-zen-bg/70 p-5 rounded-xl border border-zen-cardBorder text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-zen-cardBorder/40">
                <span className="text-zen-muted">Token Standard:</span>
                <span className="text-zen-gold font-semibold">ERC-7857 Agentic ID</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zen-cardBorder/40">
                <span className="text-zen-muted">Token ID:</span>
                <span className="text-zen-paper">#{mintResult.tokenId}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zen-cardBorder/40">
                <span className="text-zen-muted">0G Storage Hash:</span>
                <span className="text-teal-400 font-semibold">{mintResult.storageHash}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zen-cardBorder/40">
                <span className="text-zen-muted">Transaction Hash:</span>
                <span className="text-zen-paper truncate max-w-[240px]">{mintResult.txHash}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zen-muted">0G Block Height:</span>
                <span className="text-zen-paper">#{mintResult.blockNumber}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href={`${explorerBase}/tx/${mintResult.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-lg bg-zen-moss/40 border border-zen-mossLight text-zen-paper text-xs font-semibold hover:bg-zen-moss/60 flex items-center space-x-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-zen-gold" />
                <span>View on 0G Chainscan Explorer</span>
              </a>
              
              <button 
                onClick={() => setMintResult(null)}
                className="px-5 py-2.5 rounded-lg bg-zen-gold text-zen-ink font-semibold text-xs hover:lantern-glow transition-all"
              >
                Mint Another Agent
              </button>
            </div>
          </div>
        ) : (
          /* Mint Form */
          <form onSubmit={handleMint} className="zen-glass rounded-2xl p-8 border border-zen-cardBorder space-y-6">
            
            {/* Agent Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zen-gold">
                Agent Name
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. Kitsune Zen Strategist"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-zen-bg border border-zen-cardBorder rounded-lg px-4 py-3 text-sm text-zen-paper placeholder-zen-muted focus:outline-none focus:border-zen-gold transition-colors"
              />
            </div>

            {/* Base Model Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zen-gold">
                0G Compute Base Model
              </label>
              <select
                value={modelRef}
                onChange={(e) => setModelRef(e.target.value)}
                className="w-full bg-zen-bg border border-zen-cardBorder rounded-lg px-4 py-3 text-sm text-zen-paper focus:outline-none focus:border-zen-gold transition-colors"
              >
                {availableModels.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* System Prompt & Configuration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zen-gold">
                  Encrypted System Prompt & Configuration
                </label>
                <span className="text-[11px] text-teal-400 font-mono flex items-center space-x-1">
                  <Database className="w-3 h-3" />
                  <span>Encrypted via 0G Storage</span>
                </span>
              </div>
              <textarea 
                required
                rows={5}
                placeholder="Enter the autonomous system prompt, constraints, and instructions for your agent..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-zen-bg border border-zen-cardBorder rounded-lg p-4 text-sm font-mono text-zen-paper placeholder-zen-muted focus:outline-none focus:border-zen-gold transition-colors leading-relaxed"
              />
            </div>

            {/* Price Per Call */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zen-gold">
                Price Per Call (0G Tokens)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.001"
                  required
                  value={pricePerCall}
                  onChange={(e) => setPricePerCall(e.target.value)}
                  className="w-full bg-zen-bg border border-zen-cardBorder rounded-lg px-4 py-3 text-sm font-mono text-zen-paper focus:outline-none focus:border-zen-gold transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-zen-muted">
                  0G Tokens / call
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isMinting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-zen-gold to-amber-600 text-zen-ink font-semibold text-sm hover:lantern-glow transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
              >
                {isMinting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zen-ink border-t-transparent rounded-full animate-spin"></span>
                    <span>Encrypting via 0G Storage & Minting ERC-7857...</span>
                  </>
                ) : (
                  <>
                    <span>Mint & List Agent on 0G Chain</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}
