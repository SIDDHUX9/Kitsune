"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Layers, Wallet, ExternalLink, LogOut, ChevronDown } from 'lucide-react';
import { useWeb3, OG_NETWORKS } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../config/contracts';

export default function Navbar() {
  const { account, chainId, balance, isConnected, isConnecting, connectWallet, openWalletModal, disconnectWallet, switchTo0GNetwork, activeNetwork } = useWeb3();
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const isAristotle = chainId === OG_NETWORKS.aristotle.chainId;
  const isGalileo = chainId === OG_NETWORKS.galileo.chainId;
  const isLocalhost = chainId === OG_NETWORKS.localhost.chainId;

  return (
    <header className="sticky top-0 z-50 zen-glass border-b border-zen-cardBorder px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zen-gold to-zen-vermilion p-0.5 shadow-lg group-hover:lantern-glow transition-all duration-300">
            <div className="w-full h-full bg-zen-bg rounded-[7px] flex items-center justify-center">
              <span className="text-zen-gold font-serif text-xl font-bold">狐</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl font-bold text-zen-paper tracking-wide group-hover:text-zen-gold transition-colors">
                KITSUNE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zen-moss/40 text-zen-paper border border-zen-mossLight font-mono">
                ERC-7857
              </span>
            </div>
            <p className="text-[11px] text-zen-muted font-sans tracking-wider uppercase">0G Verifiable Agent Marketplace</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className="text-zen-paper hover:text-zen-gold transition-colors flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-zen-gold" />
            <span>Marketplace</span>
          </Link>
          <Link href="/mint" className="text-zen-muted hover:text-zen-gold transition-colors flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-zen-gold" />
            <span>Mint Agentic ID</span>
          </Link>
          <Link href="/audit" className="text-zen-muted hover:text-zen-gold transition-colors flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-zen-gold" />
            <span>0G Audit Trail</span>
          </Link>
        </nav>

        {/* Right Section: Network Selector & Connect Wallet */}
        <div className="flex items-center space-x-3">
          
          {/* Network Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zen-card border border-zen-cardBorder text-xs text-zen-paper hover:border-zen-gold transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${isAristotle || isGalileo || isLocalhost ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="font-mono">
                {isAristotle ? '0G-Aristotle (16661)' : isGalileo ? '0G-Galileo (16601)' : isLocalhost ? 'Localhost (31337)' : chainId ? `Chain ${chainId}` : '0G-Aristotle (16661)'}
              </span>
              <ChevronDown className="w-3 h-3 text-zen-muted" />
            </button>

            {showNetworkMenu && (
              <div className="absolute right-0 mt-2 w-56 zen-glass rounded-xl border border-zen-cardBorder shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-3 py-1.5 text-[10px] uppercase font-serif text-zen-muted border-b border-zen-cardBorder">
                  Select Network
                </div>
                
                <button
                  onClick={() => { switchTo0GNetwork('aristotle'); setShowNetworkMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zen-slate flex items-center justify-between text-zen-paper transition-colors"
                >
                  <div>
                    <span className="font-semibold block">0G-Aristotle Mainnet</span>
                    <span className="text-[10px] text-zen-muted font-mono">Chain ID 16661</span>
                  </div>
                  {isAristotle && <span className="text-emerald-400 text-xs font-semibold">Active</span>}
                </button>

                <button
                  onClick={() => { switchTo0GNetwork('galileo'); setShowNetworkMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zen-slate flex items-center justify-between text-zen-paper transition-colors"
                >
                  <div>
                    <span className="font-semibold block">0G-Galileo Testnet</span>
                    <span className="text-[10px] text-zen-muted font-mono">Chain ID 16601</span>
                  </div>
                  {isGalileo && <span className="text-emerald-400 text-xs font-semibold">Active</span>}
                </button>

                <button
                  onClick={() => { switchTo0GNetwork('localhost'); setShowNetworkMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zen-slate flex items-center justify-between text-zen-paper transition-colors"
                >
                  <div>
                    <span className="font-semibold block">Hardhat Localhost</span>
                    <span className="text-[10px] text-zen-muted font-mono">Chain ID 31337</span>
                  </div>
                  {isLocalhost && <span className="text-emerald-400 text-xs font-semibold">Active</span>}
                </button>
              </div>
            )}
          </div>

          {/* Connect / User Wallet Button */}
          {isConnected && account ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2.5 px-4 py-2 rounded-lg bg-zen-moss/40 border border-zen-mossLight text-zen-paper text-sm font-mono hover:bg-zen-moss/60 transition-all"
              >
                {balance && (
                  <span className="text-zen-gold font-semibold text-xs border-r border-zen-cardBorder pr-2">
                    {parseFloat(balance).toFixed(3)} 0G
                  </span>
                )}
                <span>{shortenAddress(account)}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zen-muted" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 zen-glass rounded-xl border border-zen-cardBorder shadow-2xl p-2 z-50 text-xs space-y-1">
                  <a
                    href={`${CONTRACT_ADDRESSES[activeNetwork].explorer}/address/${account}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zen-slate flex items-center space-x-2 text-zen-paper transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-zen-gold" />
                    <span>View on 0G Chainscan</span>
                  </a>

                  <button
                    onClick={() => { disconnectWallet(); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openWalletModal}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-zen-gold to-amber-600 text-zen-ink font-semibold text-sm hover:lantern-glow transition-all duration-300 shadow-md disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
