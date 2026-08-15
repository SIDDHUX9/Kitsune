"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  color: string;
}

export default function InkWashBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool representing diffusing ink spots and ambient glowing dust
    const inkColors = [
      'rgba(18, 24, 30, 0.45)',
      'rgba(24, 32, 40, 0.35)',
      'rgba(35, 45, 55, 0.25)',
      'rgba(229, 169, 60, 0.04)', // subtle lantern gold glow
      'rgba(200, 75, 49, 0.03)',  // subtle vermilion trace
    ];

    const particles: Particle[] = [];
    const particleCount = 22;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 180 + 100,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5,
        maxAlpha: Math.random() * 0.4 + 0.1,
        color: inkColors[Math.floor(Math.random() * inkColors.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Base Zen backdrop gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#060809');
      bgGradient.addColorStop(0.5, '#0A0C0E');
      bgGradient.addColorStop(1, '#0F1317');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Render organic ink diffusion blobs
      particles.forEach((p, idx) => {
        p.x += p.vx + Math.sin(time + idx) * 0.15;
        p.y += p.vy + Math.cos(time + idx * 0.7) * 0.15;

        // Wrap around boundaries smoothly
        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const radGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        radGradient.addColorStop(0, p.color);
        radGradient.addColorStop(0.7, p.color.replace(/[\d\.]+\)$/, '0.05)'));
        radGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render subtle drifting ink dust specks
      ctx.fillStyle = 'rgba(229, 169, 60, 0.25)';
      for (let i = 0; i < 15; i++) {
        const dustX = (Math.sin(time * 0.5 + i * 2.5) * 0.5 + 0.5) * width;
        const dustY = ((Math.cos(time * 0.3 + i * 1.8) * 0.5 + 0.5) * height + time * 10) % height;
        const dustSize = (Math.sin(time + i) + 1.5) * 1.2;
        ctx.beginPath();
        ctx.arc(dustX, dustY, dustSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-85 transition-opacity duration-1000"
    />
  );
}
