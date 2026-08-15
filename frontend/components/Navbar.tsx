"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, ShieldCheck, Layers, Wallet, ExternalLink, LogOut, ChevronDown, Compass } from 'lucide-react';
import { useWeb3, OG_NETWORKS } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import KitsuneLogoMark from './KitsuneLogoMark';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    account,
    chainId,
    balance,
    isConnected,
    isConnecting,
    openWalletModal,
    disconnectWallet,
    switchTo0GNetwork,
    activeNetwork,
    gateNavigation
  } = useWeb3();

  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const isAristotle = chainId === OG_NETWORKS.aristotle.chainId;
  const isGalileo = chainId === OG_NETWORKS.galileo.chainId;
  const isLocalhost = chainId === OG_NETWORKS.localhost.chainId;

  // Intercept navigation link clicks if wallet connection is required
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, requiresWallet = false) => {
    e.preventDefault();
    if (!requiresWallet) {
      router.push(href);
      return;
    }

    const canProceed = gateNavigation(href);
    if (canProceed) {
      router.push(href);
    }
  };

  return (
    <header className="sticky top-0 z-50 zen-glass border-b border-zen-cardBorder px-6 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center space-x-3 group">
          <KitsuneLogoMark size={34} className="group-hover:scale-105 transition-transform duration-300" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg font-bold text-zen-paper tracking-wide group-hover:text-zen-gold transition-colors">
                KITSUNE
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-zen-moss/40 text-zen-paper border border-zen-mossLight font-mono">
                ERC-7857
              </span>
            </div>
            <p className="text-[10px] text-zen-muted font-sans tracking-wider uppercase">0G Verifiable Agent Shell</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2 text-sm font-medium">

          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/', false)}
            className={`px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${pathname === '/'
                ? 'bg-zen-gold/15 text-zen-gold font-semibold border border-zen-gold/30 lantern-glow'
                : 'text-zen-muted hover:text-zen-paper hover:bg-zen-card/50'
              }`}
          >
            <Compass className="w-4 h-4 text-zen-gold" />
            <span>Home</span>
          </a>

          <a
            href="/marketplace"
            onClick={(e) => handleNavClick(e, '/marketplace', false)}
            className={`px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${pathname === '/marketplace'
                ? 'bg-zen-gold/15 text-zen-gold font-semibold border border-zen-gold/30 lantern-glow'
                : 'text-zen-muted hover:text-zen-paper hover:bg-zen-card/50'
              }`}
          >
            <Layers className="w-4 h-4 text-zen-gold" />
            <span>Marketplace</span>
          </a>

          <a
            href="/mint"
            onClick={(e) => handleNavClick(e, '/mint', true)}
            className={`px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${pathname === '/mint'
                ? 'bg-zen-gold/15 text-zen-gold font-semibold border border-zen-gold/30 lantern-glow'
                : 'text-zen-muted hover:text-zen-paper hover:bg-zen-card/50'
              }`}
          >
            <Sparkles className="w-4 h-4 text-zen-gold" />
            <span>Mint Agentic ID</span>
          </a>

          <a
            href="/audit"
            onClick={(e) => handleNavClick(e, '/audit', false)}
            className={`px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${pathname === '/audit'
                ? 'bg-zen-gold/15 text-zen-gold font-semibold border border-zen-gold/30 lantern-glow'
                : 'text-zen-muted hover:text-zen-paper hover:bg-zen-card/50'
              }`}
          >
            <ShieldCheck className="w-4 h-4 text-zen-gold" />
            <span>0G Audit Trail</span>
          </a>

        </nav>

        {/* Right Section: Network Selector & Connect Wallet */}
        <div className="flex items-center space-x-3">

          {/* Network Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zen-card border border-zen-cardBorder text-xs text-zen-paper hover:border-zen-gold transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${isAristotle || isGalileo || isLocalhost ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="font-mono text-[11px]">
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
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-zen-moss/40 border border-zen-mossLight text-zen-paper text-xs font-mono hover:bg-zen-moss/60 transition-all"
              >
                {balance && (
                  <span className="text-zen-gold font-semibold text-[11px] border-r border-zen-cardBorder pr-2">
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
              onClick={() => openWalletModal()}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-zen-gold to-amber-600 text-zen-ink font-semibold text-xs hover:lantern-glow transition-all duration-300 shadow-md disabled:opacity-50"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
