"use client";

import { Cinzel } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-cinzel",
});

export default function Home() {
  const [idle, setIdle] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; opacity: number; vx: number; vy: number }>>([]);

  // Reset idle timer on any user interaction
  const resetIdleTimer = () => {
    setIdle(false);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => setIdle(true), 5000);
  };

  // Particle animation loop with DPR scaling and responsive canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    let rafId = 0;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0.01);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.02;
        ctx.fillStyle = `rgba(197, 160, 89, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Golden dust on hover
  const handleStarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        opacity: 0.6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
    resetIdleTimer();
  };

  // Initialize idle timer on mount
  useEffect(() => {
    resetIdleTimer();
    const handleUserInput = () => resetIdleTimer();
    window.addEventListener("mousemove", handleUserInput);
    window.addEventListener("keydown", handleUserInput);
    window.addEventListener("click", handleUserInput);
    return () => {
      window.removeEventListener("mousemove", handleUserInput);
      window.removeEventListener("keydown", handleUserInput);
      window.removeEventListener("click", handleUserInput);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  return (
    <div className={cinzel.variable}>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes glimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          width: 100%;
          height: 100%;
        }
        .void {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #050505;
          z-index: -10;
        }
        .canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        .star {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(140px, 22vmin, 340px);
          height: clamp(140px, 22vmin, 340px);
          background: radial-gradient(circle at center, #C5A059 0%, transparent 70%);
          border-radius: 50%;
          animation: breathe 10s ease-in-out infinite;
          z-index: 2;
          cursor: pointer;
          box-shadow: 0 0 clamp(30px, 6vmin, 80px) rgba(197, 160, 89, 0.28);
        }
        .title-container {
          position: fixed;
          bottom: clamp(40px, 8vmin, 100px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          text-align: center;
        }
        .title {
          font-family: var(--font-cinzel);
          font-size: clamp(1.4rem, 6vmin, 3rem);
          font-weight: 100;
          letter-spacing: clamp(0.3em, 2.5vw, 2em);
          color: #C5A059;
          background: linear-gradient(90deg, transparent 0%, #C5A059 50%, transparent 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: glimmer 8s linear infinite;
          white-space: nowrap;
        }
        .idle-message {
          position: fixed;
          top: calc(50% - clamp(70px, 10vmin, 140px));
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          font-family: var(--font-cinzel);
          font-size: clamp(0.9rem, 2.8vmin, 1.1rem);
          letter-spacing: 0.12em;
          color: rgba(197, 160, 89, 0.66);
          text-shadow: 0 0 clamp(6px, 1vmin, 10px) rgba(197, 160, 89, 0.12);
          animation: fadeInOut 2s ease-in-out infinite;
          text-align: center;
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Zen Void Background */}
      <div className="void"></div>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="canvas" />

      {/* Pulsing Star */}
      <div
        className="star"
        onMouseEnter={handleStarHover}
        onMouseMove={handleStarHover}
      ></div>

      {/* Title: USULDIVINACI */}
      <div className="title-container">
        <h1 className="title">USULDIVINACI</h1>
      </div>

      {/* Idle Message: appears after 5 seconds, placed aesthetically near the orb */}
      {idle && <div className="idle-message">USULDIVINACI — The sanctum is forming...</div>}
    </div>
  );
}

