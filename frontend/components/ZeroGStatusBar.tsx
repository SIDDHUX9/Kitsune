"use client";

import React from 'react';
import { Database, Cpu, CreditCard, ShieldCheck, Link2 } from 'lucide-react';

export default function ZeroGStatusBar() {
  const primitives = [
    {
      name: "0G Chain",
      subtitle: "0G-Aristotle (16661)",
      icon: Link2,
      status: "Active (https://evmrpc.0g.ai)",
      color: "text-emerald-400"
    },
    {
      name: "Agentic ID",
      subtitle: "ERC-7857 Standard",
      icon: ShieldCheck,
      status: "Tokenized & Verifiable",
      color: "text-amber-400"
    },
    {
      name: "0G Compute",
      subtitle: "Worker Attestation",
      icon: Cpu,
      status: "ECDSA Verifiable Proofs",
      color: "text-sky-400"
    },
    {
      name: "0G Storage",
      subtitle: "Encrypted Blob & Logs",
      icon: Database,
      status: "Content Hash Immutable",
      color: "text-teal-400"
    },
    {
      name: "0G Pay",
      subtitle: "Escrow Settlement",
      icon: CreditCard,
      status: "Per-Call Micro-Payments",
      color: "text-rose-400"
    }
  ];

  return (
    <div className="w-full bg-zen-card/80 border-y border-zen-cardBorder py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 text-zen-muted">
          <span className="w-2 h-2 rounded-full bg-zen-gold animate-ping"></span>
          <span className="font-serif uppercase tracking-wider text-[11px] font-semibold text-zen-gold">
            0G Infrastructure Engine
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {primitives.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex items-center space-x-2 bg-zen-bg/60 px-3 py-1.5 rounded-lg border border-zen-cardBorder/60">
                <IconComponent className={`w-3.5 h-3.5 ${item.color}`} />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-zen-paper">{item.name}</span>
                    <span className="text-[10px] text-zen-muted font-mono">{item.subtitle}</span>
                  </div>
                  <p className="text-[10px] text-zen-muted">{item.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
