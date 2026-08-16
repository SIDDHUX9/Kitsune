"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingStory from '../components/LandingStory';
import { useWeb3 } from '../context/Web3Context';

export default function Home() {
  const router = useRouter();
  const { gateNavigation } = useWeb3();

  const handleEnterMarketplace = () => {
    router.push('/marketplace');
  };

  const handleOpenMint = () => {
    const canProceed = gateNavigation('/mint');
    if (canProceed) {
      router.push('/mint');
    }
  };

  return (
    <div className="min-h-screen bg-zen-bg text-zen-paper flex flex-col font-sans selection:bg-zen-gold selection:text-zen-ink">
      {/* Persistent App Shell Header */}
      <Navbar />

      {/* Cinematic Scroll-Driven Landing Narrative */}
      <main className="flex-1">
        <LandingStory 
          onEnterMarketplace={handleEnterMarketplace}
          onOpenMintModal={handleOpenMint}
        />
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}
