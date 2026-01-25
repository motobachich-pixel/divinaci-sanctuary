"use client";

import { Cinzel } from "next/font/google";
import Link from "next/link";
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

  // Handle click navigation to chat
  const handleClick = () => {
    window.location.href = "/chat";
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
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes sidebarGlow {
          0%, 100% { box-shadow: inset 0 0 20px rgba(197, 160, 89, 0.05); }
          50% { box-shadow: inset 0 0 30px rgba(197, 160, 89, 0.15); }
        }
        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.4); }
          50% { box-shadow: 0 0 20px 4px rgba(197, 160, 89, 0.2); }
        }
        @keyframes logoGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(197, 160, 89, 0.3); }
          50% { text-shadow: 0 0 20px rgba(197, 160, 89, 0.6); }
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
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: clamp(70px, 14vmin, 140px);
          height: 100%;
          background: linear-gradient(135deg, rgba(5, 5, 5, 0.98) 0%, rgba(20, 15, 5, 0.95) 100%);
          border-right: 2px solid rgba(197, 160, 89, 0.3);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(2rem, 5vmin, 3rem) 0;
          gap: clamp(2.5rem, 6vmin, 4rem);
          animation: slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), sidebarGlow 4s ease-in-out infinite;
          backdrop-filter: blur(15px);
          box-shadow: inset -1px 0 rgba(197, 160, 89, 0.1);
        }
        .sidebar-logo {
          font-family: var(--font-cinzel);
          font-size: clamp(0.65rem, 1.8vmin, 1rem);
          font-weight: 100;
          letter-spacing: 0.2em;
          color: #C5A059;
          text-align: center;
          opacity: 0.85;
          animation: logoGlow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(197, 160, 89, 0.2));
          writing-mode: horizontal-tb;
          width: 100%;
          padding: 0 clamp(0.3rem, 1vmin, 0.8rem);
        }
        .sidebar-button {
          width: clamp(55px, 9vmin, 100px);
          height: clamp(55px, 9vmin, 100px);
          border-radius: 8px;
          border: 1.5px solid rgba(197, 160, 89, 0.5);
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.08) 0%, rgba(197, 160, 89, 0.03) 100%);
          color: #C5A059;
          font-family: var(--font-cinzel);
          font-size: clamp(0.7rem, 2vmin, 0.95rem);
          font-weight: 100;
          letter-spacing: 0.1em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: clamp(0.6rem, 1.2vmin, 1.2rem);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
          line-height: 1.3;
          position: relative;
          overflow: hidden;
        }
        .sidebar-button::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.2), rgba(197, 160, 89, 0.05));
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .sidebar-button:hover {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.08) 100%);
          border-color: #C5A059;
          transform: scale(1.12) translateX(2px);
          box-shadow: 0 8px 25px rgba(197, 160, 89, 0.35), inset 0 0 15px rgba(197, 160, 89, 0.1);
        }
        .sidebar-button:active {
          transform: scale(1.08) translateX(2px);
        }
        .sidebar-button.chat-btn {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.12) 0%, rgba(197, 160, 89, 0.05) 100%);
          border-color: #C5A059;
          animation: buttonPulse 2s infinite;
        }
        .sidebar-button.chat-btn:hover {
          animation: none;
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
          background: radial-gradient(circle at 35% 35%, #E8D5A3 0%, #C5A059 20%, #8B6F47 45%, transparent 70%);
          border-radius: 50%;
          animation: breathe 10s ease-in-out infinite;
          z-index: 2;
          cursor: pointer;
          box-shadow: 
            0 0 clamp(40px, 8vmin, 100px) rgba(197, 160, 89, 0.4),
            0 0 clamp(70px, 14vmin, 180px) rgba(197, 160, 89, 0.25),
            0 0 clamp(100px, 20vmin, 280px) rgba(197, 160, 89, 0.12),
            inset -30px -30px 60px rgba(0, 0, 0, 0.3),
            inset 20px 20px 40px rgba(255, 255, 255, 0.15);
          transition: filter 0.3s ease, box-shadow 0.4s ease;
          filter: drop-shadow(0 0 clamp(20px, 4vmin, 50px) rgba(197, 160, 89, 0.3));
        }
        .star:hover {
          filter: 
            brightness(1.25) 
            drop-shadow(0 0 clamp(30px, 6vmin, 80px) rgba(197, 160, 89, 0.5));
          box-shadow: 
            0 0 clamp(50px, 10vmin, 120px) rgba(197, 160, 89, 0.5),
            0 0 clamp(90px, 18vmin, 220px) rgba(197, 160, 89, 0.35),
            0 0 clamp(130px, 26vmin, 360px) rgba(197, 160, 89, 0.2),
            inset -30px -30px 60px rgba(0, 0, 0, 0.3),
            inset 20px 20px 40px rgba(255, 255, 255, 0.2);
        }
        .void-link {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          cursor: pointer;
          text-decoration: none;
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

      {/* Left Sidebar Menu */}
      <div className="sidebar">
        <div className="sidebar-logo">DIVINACI</div>
        <a href="/chat" className="sidebar-button chat-btn" title="Enter DIVINACI Chat">
          ◈ CHAT
        </a>
      </div>

      {/* Zen Void Background — Clickable to enter chat */}
      <a href="/chat" className="void-link" title="Enter the sanctum"></a>
      <div className="void"></div>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="canvas" />

      {/* Pulsing Star — Clickable to enter chat */}
      <div
        className="star"
        onClick={handleClick}
        onMouseEnter={handleStarHover}
        onMouseMove={handleStarHover}
        role="button"
        tabIndex={0}
        title="Click to enter the sanctum"
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

