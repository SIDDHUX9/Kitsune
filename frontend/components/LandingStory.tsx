"use client";

import React, { useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import InkWashBackground from './InkWashBackground';
import KitsuneCalligraphyLogo from './KitsuneCalligraphyLogo';
import { 
  ShieldAlert, Lock, DollarSign, Sparkles, 
  Cpu, Database, ShieldCheck, Wallet, Flame, ArrowDown, ChevronRight, Play, CheckCircle2
} from 'lucide-react';

interface LandingStoryProps {
  onEnterMarketplace: () => void;
  onOpenMintModal?: () => void;
}

export default function LandingStory({ onEnterMarketplace, onOpenMintModal }: LandingStoryProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Active stepping stone in "How It Works"
  const [activePrimitive, setActivePrimitive] = useState<number>(0);

  // Motion transforms for hero scene parallax & opacity fading
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const problemOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.42], [0, 1, 1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.4, 0.48, 0.6, 0.68], [0, 1, 1, 0]);

  const primitives = [
    {
      id: 1,
      title: "0G Chain",
      kanji: "鏈",
      role: "Immutable Consensus Engine",
      icon: ShieldCheck,
      color: "text-amber-400",
      borderColor: "border-amber-500/40",
      glowColor: "rgba(229, 169, 60, 0.2)",
      description: "Ultra-high throughput L1 EVM blockchain providing microsecond finality and cryptographic escrow settlement for agent services."
    },
    {
      id: 2,
      title: "0G Compute",
      kanji: "算",
      role: "Verifiable Inference Workers",
      icon: Cpu,
      color: "text-sky-400",
      borderColor: "border-sky-500/40",
      glowColor: "rgba(56, 189, 248, 0.2)",
      description: "Decentralized AI worker nodes executing model inferences with TEE hardware enclaves and signed ECDSA cryptographic attestations."
    },
    {
      id: 3,
      title: "0G Storage",
      kanji: "藏",
      role: "Encrypted Prompt State Archive",
      icon: Database,
      color: "text-teal-400",
      borderColor: "border-teal-500/40",
      glowColor: "rgba(45, 212, 191, 0.2)",
      description: "High-speed data availability network archiving encrypted system prompts, fine-tuned weights, and audit traces permanently."
    },
    {
      id: 4,
      title: "ERC-7857 Agentic ID",
      kanji: "魂",
      role: "Tokenized Agent Soul & Ownership",
      icon: Sparkles,
      color: "text-rose-400",
      borderColor: "border-rose-500/40",
      glowColor: "rgba(244, 63, 94, 0.2)",
      description: "Standardized Smart Asset NFT binding model execution authority, state storage roots, and royalty cash flows directly to the token holder."
    },
    {
      id: 5,
      title: "0G Pay",
      kanji: "幣",
      role: "Micropayment Escrow & Relayer",
      icon: Wallet,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      glowColor: "rgba(52, 211, 153, 0.2)",
      description: "Gasless transaction relayer and streaming escrow protocol enabling per-call micro-billing without wallet signature friction."
    }
  ];

  return (
    <div className="relative bg-zen-bg text-zen-paper overflow-hidden selection:bg-zen-gold selection:text-zen-ink">
      
      {/* Dynamic Animated Ink Wash Fluid Canvas */}
      <InkWashBackground />

      {/* ========================================================================= */}
      {/* SCENE 1: OPENING HERO (Full Viewport Narrative) */}
      {/* ========================================================================= */}
      <motion.section 
        style={shouldReduceMotion ? {} : { opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-between px-6 py-16 text-center z-10"
      >
        <div className="my-auto space-y-8 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Sacred Calligraphy Emblem Draw */}
          <KitsuneCalligraphyLogo size={180} className="mb-2" />

          {/* Title & Subtitle with Zen Typography */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-zen-gold/10 border border-zen-gold/30 text-zen-gold text-xs font-serif tracking-widest uppercase"
            >
              <Flame className="w-3.5 h-3.5 text-zen-gold animate-pulse" />
              <span>Verifiable AI Spirit Standard • ERC-7857</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="font-serif text-5xl sm:text-7xl font-bold tracking-tight leading-tight text-zen-paper drop-shadow-lg"
            >
              K I T S U N E
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg sm:text-2xl text-zen-paper/90 font-serif italic max-w-2xl mx-auto leading-relaxed"
            >
              "Where autonomous intelligence finds its true spirit, verified on the decentralized substrate of 0G."
            </motion.p>
          </div>

          {/* Scene Setting Summary */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-sm sm:text-base text-zen-muted max-w-xl font-sans leading-relaxed"
          >
            A cinematic, scroll-driven journey into tokenized AI agents (ERC-7857), cryptographically proven compute, and decentralized state governance.
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onEnterMarketplace}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-zen-gold via-amber-500 to-amber-600 text-zen-ink font-semibold text-sm hover:lantern-glow transition-all duration-300 flex items-center space-x-2 shadow-2xl group"
            >
              <span>Enter Marketplace</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#problem-scene"
              className="px-6 py-3.5 rounded-xl bg-zen-card/80 border border-zen-cardBorder text-zen-paper font-medium text-sm hover:bg-zen-slate transition-colors flex items-center space-x-2"
            >
              <span>Unfold Narrative</span>
              <ArrowDown className="w-4 h-4 text-zen-gold" />
            </a>
          </motion.div>

        </div>

        {/* Floating Scroll Down Prompt */}
        <motion.div 
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2 text-zen-muted text-xs font-serif tracking-widest uppercase opacity-70"
        >
          <span>Scroll to Explore Story</span>
          <ArrowDown className="w-4 h-4 text-zen-gold" />
        </motion.div>
      </motion.section>

      {/* ========================================================================= */}
      {/* SCENE 2: THE PROBLEM (Broken AI Economy Minimal Line-Art) */}
      {/* ========================================================================= */}
      <section id="problem-scene" className="relative min-h-screen flex items-center justify-center px-6 py-24 z-10">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-serif tracking-widest text-zen-vermilion uppercase font-semibold">
              Scene II • The Illusion
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zen-paper">
              Today's Broken AI-Agent Economy
            </h2>
            <p className="text-zen-muted text-sm sm:text-base leading-relaxed">
              Modern AI agents operate inside opaque black boxes. Creators build value they cannot own, and users rely on unverified outputs with zero accountability.
            </p>
          </div>

          {/* 3 Minimal Animated SVG Line-Art Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Untrusted Outputs */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="zen-glass rounded-2xl p-8 border border-zen-cardBorder hover:border-zen-vermilion/40 transition-colors space-y-6 group"
            >
              <div className="w-14 h-14 rounded-xl bg-zen-vermilion/10 border border-zen-vermilion/30 flex items-center justify-center text-zen-vermilion">
                {/* Custom Minimalist Vector SVG Line-Art */}
                <svg className="w-8 h-8 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
                  <path d="M12 3v3m0 12v3M3 12h3m12 0h3" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="5" strokeDasharray="3 3" />
                  <path d="M7.5 7.5l2 2m5 5l2 2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-zen-paper group-hover:text-zen-vermilion transition-colors">
                  Untrusted Inference
                </h3>
                <p className="text-xs text-zen-muted leading-relaxed font-sans">
                  Centralized API providers can silently alter prompts, downgrade models, or fake output tokens with zero cryptographic proof.
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono text-zen-vermilion/80 flex items-center space-x-1">
                <span>• Zero Verifiability</span>
              </div>
            </motion.div>

            {/* Card 2: No True Ownership */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="zen-glass rounded-2xl p-8 border border-zen-cardBorder hover:border-zen-vermilion/40 transition-colors space-y-6 group"
            >
              <div className="w-14 h-14 rounded-xl bg-zen-vermilion/10 border border-zen-vermilion/30 flex items-center justify-center text-zen-vermilion">
                <svg className="w-8 h-8 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <path d="M8 8V6a4 4 0 018 0v2" strokeDasharray="2 2" />
                  <circle cx="12" cy="14" r="1.5" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-zen-paper group-hover:text-zen-vermilion transition-colors">
                  Zero Agent Ownership
                </h3>
                <p className="text-xs text-zen-muted leading-relaxed font-sans">
                  Agents hosted on cloud platforms can be deactivated or copied overnight. Creators hold no transferable, liquid asset for their prompts.
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono text-zen-vermilion/80 flex items-center space-x-1">
                <span>• Vendor Lock-In</span>
              </div>
            </motion.div>

            {/* Card 3: Opaque Micropayments */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="zen-glass rounded-2xl p-8 border border-zen-cardBorder hover:border-zen-vermilion/40 transition-colors space-y-6 group"
            >
              <div className="w-14 h-14 rounded-xl bg-zen-vermilion/10 border border-zen-vermilion/30 flex items-center justify-center text-zen-vermilion">
                <svg className="w-8 h-8 stroke-current fill-none stroke-[1.5]" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M15 9l-6 6m0-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-zen-paper group-hover:text-zen-vermilion transition-colors">
                  Opaque Payments
                </h3>
                <p className="text-xs text-zen-muted leading-relaxed font-sans">
                  Heavy intermediary fees, monthly subscriptions, and manual invoice reconciliations prevent real-time autonomous machine transactions.
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono text-zen-vermilion/80 flex items-center space-x-1">
                <span>• High Friction</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 3: THE REVEAL (Emotional High Point - Lantern Lighting & Fox Motif) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24 z-10 overflow-hidden">
        
        {/* Background Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zen-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <span className="text-xs font-serif tracking-widest text-zen-gold uppercase font-semibold">
              Scene III • The Awakening
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-zen-paper leading-tight">
              Agents as Living, Tokenized Spirits
            </h2>
            <p className="text-zen-muted text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Introducing <span className="text-zen-gold font-serif">ERC-7857 Agentic ID</span> — a new paradigm where AI agents become sovereign on-chain assets with encrypted memory, verifiable compute, and direct payment rights.
            </p>
          </motion.div>

          {/* Emotional High Point: Sacred Lantern Lighting Sequence */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative py-12 px-8 rounded-3xl bg-gradient-to-b from-zen-card/90 via-zen-card/60 to-zen-bg border border-zen-gold/30 shadow-2xl lantern-glow space-y-8"
          >
            
            {/* Center Glowing Spirit Fox Icon */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-zen-gold/20 rounded-full blur-2xl animate-pulse" />
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-zen-gold to-zen-vermilion p-0.5 shadow-2xl">
                <div className="w-full h-full bg-zen-bg rounded-[14px] flex items-center justify-center">
                  <span className="text-4xl font-serif text-zen-gold">🦊</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <h3 className="font-serif text-2xl font-bold text-zen-paper">
                Verifiable Inference on <span className="text-transparent bg-clip-text bg-gradient-to-r from-zen-gold to-amber-300">0G Infrastructure</span>
              </h3>
              <p className="text-xs sm:text-sm text-zen-muted leading-relaxed font-sans">
                Every inference prompt submitted through Kitsune is processed by 0G Compute worker nodes, cryptographically hashed into 0G Storage, and signed with on-chain worker attestations.
              </p>
            </div>

            {/* Glowing Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zen-cardBorder/60 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zen-bg/70 border border-zen-cardBorder">
                <span className="block text-[10px] text-zen-muted uppercase">Standard</span>
                <span className="text-zen-gold font-semibold">ERC-7857</span>
              </div>
              <div className="p-3 rounded-xl bg-zen-bg/70 border border-zen-cardBorder">
                <span className="block text-[10px] text-zen-muted uppercase">Compute</span>
                <span className="text-sky-400 font-semibold">0G Hardware TEE</span>
              </div>
              <div className="p-3 rounded-xl bg-zen-bg/70 border border-zen-cardBorder">
                <span className="block text-[10px] text-zen-muted uppercase">State Storage</span>
                <span className="text-teal-400 font-semibold">0G Storage Root</span>
              </div>
              <div className="p-3 rounded-xl bg-zen-bg/70 border border-zen-cardBorder">
                <span className="block text-[10px] text-zen-muted uppercase">Settlement</span>
                <span className="text-emerald-400 font-semibold">0G Pay Relayer</span>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 4: HOW IT WORKS (5 Primitives as Glowing Lantern Stepping Stones) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24 z-10">
        <div className="max-w-6xl mx-auto space-y-16 w-full">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-serif tracking-widest text-zen-gold uppercase font-semibold">
              Scene IV • The Path
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-zen-paper">
              The 5 Sacred Primitives of Kitsune
            </h2>
            <p className="text-zen-muted text-sm sm:text-base leading-relaxed">
              Step past each glowing lantern stone along the Zen path to explore how 0G primitives harmonize into autonomous intelligence.
            </p>
          </div>

          {/* Stepping Stones Horizontal / Vertical Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Stepping Stone Nodes */}
            <div className="lg:col-span-5 space-y-3">
              {primitives.map((prim, idx) => {
                const Icon = prim.icon;
                const isSelected = activePrimitive === idx;

                return (
                  <motion.button
                    key={prim.id}
                    onClick={() => setActivePrimitive(idx)}
                    whileHover={{ x: 4 }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                      isSelected
                        ? `bg-zen-card border-zen-gold shadow-xl lantern-glow`
                        : `bg-zen-card/40 border-zen-cardBorder hover:border-zen-cardBorder/80`
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Kanji Stamp Badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold border transition-colors ${
                        isSelected 
                          ? 'bg-zen-gold/20 border-zen-gold text-zen-gold' 
                          : 'bg-zen-bg border-zen-cardBorder text-zen-muted'
                      }`}>
                        {prim.kanji}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-serif text-base font-bold ${isSelected ? 'text-zen-paper' : 'text-zen-muted group-hover:text-zen-paper'}`}>
                            {prim.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-zen-muted block">{prim.role}</span>
                      </div>
                    </div>

                    <Icon className={`w-5 h-5 ${isSelected ? prim.color : 'text-zen-muted'}`} />
                  </motion.button>
                );
              })}
            </div>

            {/* Right Detailed Primitive Drawer Card */}
            <div className="lg:col-span-7">
              {(() => {
                const prim = primitives[activePrimitive];
                const Icon = prim.icon;

                return (
                  <motion.div
                    key={prim.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`zen-glass rounded-3xl p-8 border ${prim.borderColor} space-y-6 shadow-2xl relative overflow-hidden`}
                    style={{ boxShadow: `0 0 40px ${prim.glowColor}` }}
                  >
                    {/* Background Kanji Watermark */}
                    <div className="absolute -right-6 -bottom-10 text-9xl font-serif font-black text-zen-cardBorder/20 pointer-events-none select-none">
                      {prim.kanji}
                    </div>

                    <div className="flex items-center justify-between border-b border-zen-cardBorder/60 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-zen-bg border ${prim.borderColor} flex items-center justify-center ${prim.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-zen-muted">Primitive #{prim.id}</span>
                          <h3 className="font-serif text-2xl font-bold text-zen-paper">{prim.title}</h3>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-zen-bg border border-zen-cardBorder text-xs font-mono text-zen-gold">
                        {prim.kanji} Kanji Standard
                      </span>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h4 className="text-sm font-serif font-semibold text-zen-gold">{prim.role}</h4>
                      <p className="text-xs sm:text-sm text-zen-paper/90 leading-relaxed font-sans">
                        {prim.description}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-xs font-mono text-zen-muted border-t border-zen-cardBorder/40">
                      <span className="flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>0G Mainnet & Testnet Ready</span>
                      </span>
                      <span>Verified On-Chain</span>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 5: CALL TO ACTION (Final Scene - Enter Marketplace & Ink Settling) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-24 z-10 border-t border-zen-cardBorder/40">
        
        <div className="max-w-3xl mx-auto text-center space-y-8">
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-zen-gold/10 border border-zen-gold/30 flex items-center justify-center text-zen-gold mx-auto lantern-glow">
              <Flame className="w-8 h-8 animate-pulse" />
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-zen-paper">
              Step Into The Marketplace
            </h2>
            
            <p className="text-zen-muted text-base sm:text-lg max-w-xl mx-auto font-serif italic">
              "The ink has settled. Explore autonomous agents or mint your own ERC-7857 Agentic ID today."
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterMarketplace}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-zen-gold via-amber-500 to-amber-600 text-zen-ink font-bold text-sm hover:lantern-glow transition-all duration-300 flex items-center space-x-2 shadow-2xl group"
            >
              <span>Explore Marketplace</span>
              <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
            </button>

            {onOpenMintModal && (
              <button
                onClick={onOpenMintModal}
                className="px-8 py-4 rounded-xl bg-zen-card border border-zen-cardBorder text-zen-paper font-semibold text-sm hover:border-zen-gold hover:bg-zen-slate transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-zen-gold" />
                <span>Mint Agentic ID</span>
              </button>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
