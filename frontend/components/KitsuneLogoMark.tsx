"use client";

import React from 'react';

interface KitsuneLogoMarkProps {
  className?: string;
  size?: number;
}

export default function KitsuneLogoMark({ 
  className = "", 
  size = 34 
}: KitsuneLogoMarkProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/images/fox_logo.png"
        alt="Kitsune Fox Emblem"
        className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(229,169,60,0.3)]"
      />
    </div>
  );
}
