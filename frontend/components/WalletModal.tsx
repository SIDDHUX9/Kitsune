"use client";

import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Wallet, ShieldCheck, AlertCircle, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function WalletModal() {
  const { 
    isModalOpen, 
    closeWalletModal, 
    connectWallet, 
    connectDemoMode, 
    isConnecting, 
    walletError 
  } = useWeb3();

  if (!isModalOpen) return null;

  const hasInjectedWallet = typeof window !== 'undefined' && !!(window as any).ethereum;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md zen-glass rounded-2xl border border-zen-cardBorder shadow-2xl p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zen-cardBorder pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zen-paper">Connect Web3 Wallet</h3>
          </div>
          <button 
            onClick={closeWalletModal}
            className="text-zen-muted hover:text-zen-paper p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert if any */}
        {walletError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{walletError}</p>
          </div>
        )}

        {/* Connection Options */}
        <div className="space-y-3">
          
          {/* Primary Injected / MetaMask Wallet */}
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full p-4 rounded-xl bg-zen-card border border-zen-cardBorder hover:border-zen-gold hover:bg-zen-slate text-left transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg font-serif">
                🦊
              </div>
              <div>
                <span className="font-semibold text-sm text-zen-paper block group-hover:text-zen-gold transition-colors">
                  MetaMask / Browser Extension
                </span>
                <span className="text-[11px] text-zen-muted font-mono">
                  {hasInjectedWallet ? "Injected Provider Detected" : "Browser Extension Not Found"}
                </span>
              </div>
            </div>

            {hasInjectedWallet ? (
              <span className="text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
                Ready
              </span>
            ) : (
              <ExternalLink className="w-4 h-4 text-zen-muted group-hover:text-zen-gold" />
            )}
          </button>

          {/* Installation Helper if no browser wallet */}
          {!hasInjectedWallet && (
            <a 
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="block p-3 rounded-xl bg-zen-gold/5 border border-zen-gold/20 text-xs text-zen-gold hover:bg-zen-gold/10 transition-colors flex items-center justify-between"
            >
              <span>Install MetaMask Extension</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Demo Connection Mode */}
          <div className="pt-2 border-t border-zen-cardBorder/60">
            <button
              onClick={connectDemoMode}
              className="w-full p-3.5 rounded-xl bg-zen-moss/20 border border-zen-mossLight/50 text-left hover:bg-zen-moss/40 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="font-semibold text-xs text-zen-paper block">
                  Simulated 0G Demo Wallet Mode
                </span>
                <span className="text-[10px] text-zen-muted">
                  Test marketplace flow without extension
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-zen-muted group-hover:text-zen-gold transition-colors" />
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-[11px] text-zen-muted text-center pt-2 flex items-center justify-center space-x-1.5 font-serif">
          <ShieldCheck className="w-3.5 h-3.5 text-zen-gold" />
          <span>0G-Aristotle (16661) & 0G-Galileo (16601) Supported</span>
        </div>

      </div>
    </div>
  );
}
