"use client";

import React from 'react';
import Link from 'next/link';
import KitsuneLogoMark from './KitsuneLogoMark';
import { ExternalLink, ShieldCheck, BookOpen, Layers, Sparkles, FileText, Github } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { useWeb3 } from '../context/Web3Context';

export default function Footer() {
  const { activeNetwork } = useWeb3();
  const explorerUrl = CONTRACT_ADDRESSES[activeNetwork]?.explorer || "https://chainscan.0g.ai";

  return (
    <footer className="border-t border-zen-cardBorder bg-zen-card/40 py-12 px-6 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-zen-muted">
        
        {/* Brand & Description */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <KitsuneLogoMark size={32} className="group-hover:scale-105 transition-transform" />
            <span className="font-serif text-lg font-bold text-zen-paper tracking-wide group-hover:text-zen-gold transition-colors">
              KITSUNE
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-zen-moss/40 text-zen-paper border border-zen-mossLight font-mono">
              ERC-7857
            </span>
          </Link>

          <p className="text-zen-muted leading-relaxed text-xs max-w-md">
            Decentralized marketplace where AI agents are tokenized as verifiable assets (ERC-7857), execute verifiable inference on 0G Compute, store prompt logs on 0G Storage, and settle payments on 0G Chain.
          </p>

          <div className="text-[11px] font-mono text-zen-paper/80 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live on 0G Aristotle Mainnet (Chain ID 16661)</span>
          </div>
        </div>

        {/* Core Navigation Links */}
        <div className="md:col-span-3 space-y-3">
          <div className="font-serif font-bold text-zen-paper text-sm uppercase tracking-wider">Navigation</div>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5">
                <span>Home Narrative</span>
              </Link>
            </li>
            <li>
              <Link href="/marketplace" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5">
                <span>Marketplace</span>
              </Link>
            </li>
            <li>
              <Link href="/mint" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5">
                <span>Mint Agentic ID</span>
              </Link>
            </li>
            <li>
              <Link href="/audit" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5">
                <span>0G Audit Trail</span>
              </Link>
            </li>
            <li>
              <Link href="/whitepaper" className="hover:text-zen-gold transition-colors text-zen-gold font-medium flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Technical Whitepaper</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer & On-Chain Links */}
        <div className="md:col-span-4 space-y-3">
          <div className="font-serif font-bold text-zen-paper text-sm uppercase tracking-wider">Resources & Proof</div>
          <ul className="space-y-2">
            <li>
              <Link href="/whitepaper" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5 text-zen-paper">
                <FileText className="w-3.5 h-3.5 text-zen-gold" />
                <span>Whitepaper & Future Roadmap</span>
              </Link>
            </li>
            <li>
              <a href="https://github.com/SIDDHUX9/Kitsune" target="_blank" rel="noreferrer" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            </li>
            <li>
              <a href={explorerUrl} target="_blank" rel="noreferrer" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-zen-gold" />
                <span>0G Chainscan Mainnet Explorer</span>
              </a>
            </li>
            <li>
              <a href="https://docs.0g.ai" target="_blank" rel="noreferrer" className="hover:text-zen-gold transition-colors flex items-center space-x-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>0G Developer Documentation</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-zen-cardBorder/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zen-muted">
        <div>© 2026 Kitsune Marketplace • 0G Verifiable Agent Shell</div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-4">
          <Link href="/whitepaper" className="hover:text-zen-paper transition-colors">Whitepaper</Link>
          <span>•</span>
          <a href="https://chainscan.0g.ai" target="_blank" rel="noreferrer" className="hover:text-zen-paper transition-colors">0G Aristotle</a>
        </div>
      </div>
    </footer>
  );
}
