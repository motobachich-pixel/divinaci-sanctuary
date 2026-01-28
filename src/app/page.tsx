"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const celestialWisdom = [
  "L'équilibre réside dans l'harmonie cosmique",
  "La connaissance illumine l'infini",
  "Dans le silence réside la sagesse universelle",
  "L'énergie circule entre les étoiles",
  "Chaque atome porte l'essence du cosmos",
];

const quickThemes = [
  { icon: "✦", label: "Oracle Cosmique", desc: "Posez vos grandes questions" },
  { icon: "☉", label: "Rituel Céleste", desc: "Explorez les pratiques sacrées" },
  { icon: "⚡", label: "Énergie", desc: "Conversation énergétique" },
  { icon: "◈", label: "Sagesse Ancienne", desc: "Transmissions spirituelles" },
];

export default function Home() {
  const [currentWisdom, setCurrentWisdom] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geometryCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWisdom((prev) => (prev + 1) % celestialWisdom.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const stars: Array<{ x: number; y: number; radius: number; opacity: number }> = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    let time = 0;
    let rafId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      stars.forEach((star) => {
        ctx.fillStyle = `rgba(197, 160, 89, ${star.opacity + Math.sin(time + star.x) * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Géométrie vivante DIVINACI
  useEffect(() => {
    const canvas = geometryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20;

      // Orbites rotatoires
      for (let orbit = 1; orbit <= 3; orbit++) {
        const radius = (maxRadius / 3) * orbit;
        const pointCount = orbit * 4;

        ctx.strokeStyle = `rgba(197, 160, 89, ${0.3 - orbit * 0.08})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Points animés sur orbite
        for (let i = 0; i < pointCount; i++) {
          const angle = (i / pointCount) * Math.PI * 2 + time * (0.3 - orbit * 0.08);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          const size = 2 + Math.sin(time * 2 + i) * 1.5;
          ctx.fillStyle = `rgba(197, 160, 89, ${0.6 + Math.sin(time + i) * 0.4})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spirale centrale
      ctx.strokeStyle = `rgba(197, 160, 89, 0.4)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < Math.PI * 6; i += 0.05) {
        const r = (i / (Math.PI * 6)) * (maxRadius * 0.4) + Math.sin(time * 2) * 5;
        const angle = i + time * 0.2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Cristaux/diamants
      const crystalCount = 8;
      for (let i = 0; i < crystalCount; i++) {
        const angle = (i / crystalCount) * Math.PI * 2 + time * 0.15;
        const distance = maxRadius * 0.7;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const size = 8 + Math.sin(time * 1.5 + i) * 3;
        ctx.fillStyle = `rgba(197, 160, 89, ${0.7 + Math.sin(time + i * 0.5) * 0.3})`;
        
        // Dessiner un diamant
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = `rgba(197, 160, 89, 0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="home-container">
      <style>{`
        .home-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0907 0%, #07050a 50%, #050307 100%);
          overflow-y: auto;
        }

        .cosmic-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100vh;
          background: radial-gradient(circle at 20% 50%, rgba(197, 160, 89, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(109, 119, 196, 0.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .stars-canvas {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
          pointer-events: none;
        }

        .hero-section {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2.5rem 1.5rem;
          text-align: center;
          gap: 1.5rem;
        }

        .hero-title {
          font-family: var(--font-cinzel);
          font-size: clamp(2.2rem, 8vw, 4.5rem);
          font-weight: 100;
          letter-spacing: 0.2em;
          color: #C5A059;
          text-shadow: 0 0 50px rgba(197, 160, 89, 0.5);
          margin: 0;
          animation: titleFloat 4s ease-in-out infinite;
        }

        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .hero-subtitle {
          font-family: var(--font-montserrat);
          font-size: clamp(0.9rem, 1.8vw, 1.05rem);
          color: rgba(197, 160, 89, 0.75);
          font-weight: 300;
          letter-spacing: 0.08em;
          margin: 0;
          max-width: 600px;
          line-height: 1.6;
        }

        .wisdom-rotating {
          min-height: 1.8rem;
          margin: 1rem 0;
          font-family: var(--font-cinzel);
          font-size: 0.9rem;
          font-weight: 100;
          letter-spacing: 0.1em;
          color: rgba(197, 160, 89, 0.8);
          text-shadow: 0 0 20px rgba(197, 160, 89, 0.3);
          animation: fadeInText 1s ease-in;
        }

        @keyframes fadeInText {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .geometry-canvas {
          width: 100%;
          max-width: 900px;
          height: 300px;
          margin: 2rem auto;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.05), rgba(109, 119, 196, 0.05));
          border: 1px solid rgba(197, 160, 89, 0.15);
          display: block;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 1000px;
          width: 100%;
          margin: 1.5rem auto;
          padding: 0 0.5rem;
        }

        .action-card {
          padding: 1.3rem 1rem;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.1), rgba(197, 160, 89, 0.03));
          border: 1px solid rgba(197, 160, 89, 0.25);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.7rem;
          text-align: center;
        }

        .action-card:hover {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.18), rgba(197, 160, 89, 0.08));
          border-color: rgba(197, 160, 89, 0.45);
          box-shadow: 0 8px 24px rgba(197, 160, 89, 0.2);
          transform: translateY(-8px);
        }

        .action-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 0 12px rgba(197, 160, 89, 0.3));
        }

        .action-title {
          font-family: var(--font-cinzel);
          font-size: 0.95rem;
          font-weight: 100;
          letter-spacing: 0.08em;
          color: #C5A059;
          margin: 0;
        }

        .action-desc {
          font-family: var(--font-montserrat);
          font-size: 0.75rem;
          color: rgba(197, 160, 89, 0.65);
          font-weight: 300;
          margin: 0;
          line-height: 1.3;
        }

        .cta-button {
          padding: 1rem 2.8rem;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.2), rgba(197, 160, 89, 0.08));
          border: 1.5px solid rgba(197, 160, 89, 0.4);
          border-radius: 50px;
          color: #C5A059;
          font-family: var(--font-cinzel);
          font-size: clamp(0.9rem, 1.4vw, 1.05rem);
          font-weight: 100;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 0 30px rgba(197, 160, 89, 0.25);
          text-transform: uppercase;
          margin-top: 1.5rem;
        }

        .cta-button:hover {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.3), rgba(197, 160, 89, 0.15));
          border-color: #C5A059;
          box-shadow: 0 0 50px rgba(197, 160, 89, 0.4), 0 12px 24px rgba(197, 160, 89, 0.2);
          transform: translateY(-5px);
        }

        .footer-wisdom {
          margin-top: 2rem;
          padding-top: 2rem;
          font-family: var(--font-montserrat);
          font-size: 0.75rem;
          color: rgba(197, 160, 89, 0.55);
          letter-spacing: 0.08em;
          text-align: center;
          border-top: 1px solid rgba(197, 160, 89, 0.15);
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 900px) {
          .hero-section {
            padding: 2rem 1.25rem;
            gap: 1rem;
          }
          .hero-subtitle {
            font-size: 0.9rem;
            margin: 0;
          }
          .wisdom-rotating {
            font-size: 0.85rem;
            min-height: 1.6rem;
            margin: 0.75rem 0;
          }
          .geometry-canvas {
            height: 200px;
            margin: 1.5rem auto;
          }
          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.9rem;
            margin: 1rem auto;
            padding: 0 0.5rem;
          }
        }

        @media (max-width: 600px) {
          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="cosmic-bg" />
      <canvas ref={canvasRef} className="stars-canvas" />

      {/* Fullscreen animated geometry background */}
      <canvas
        ref={geometryCanvasRef}
        className="geometry-canvas background-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          minWidth: "100vw",
          minHeight: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          objectFit: "cover",
          background: "linear-gradient(135deg, rgba(10,9,7,0.98) 0%, rgba(7,5,10,0.98) 50%, rgba(5,3,7,0.98) 100%)"
        }}
      />

      <div className="hero-section" style={{
        position: "relative",
        zIndex: 2,
        background: "none",
        boxShadow: "0 2px 32px 0 rgba(0,0,0,0.12)",
        borderRadius: "18px",
        margin: "2.5rem auto 0 auto",
        maxWidth: "900px",
        width: "100%",
        padding: "2.5rem 1.5rem 2.5rem 1.5rem"
      }}>
        <h1 className="hero-title" style={{marginBottom: "0.5rem"}}>DIVINACI</h1>
        <p className="hero-subtitle" style={{marginBottom: "1.2rem"}}>Votre compagnon de sagesse céleste et de réflexion profonde</p>
        <div className="wisdom-rotating" key={currentWisdom} style={{marginBottom: "1.5rem"}}>
          {celestialWisdom[currentWisdom]}
        </div>
        <div className="quick-actions" style={{marginBottom: "1.5rem"}}>
          {quickThemes.map((theme, idx) => (
            <Link key={idx} href="/chat" className="action-card">
              <span className="action-icon">{theme.icon}</span>
              <span className="action-title">{theme.label}</span>
              <span className="action-desc">{theme.desc}</span>
            </Link>
          ))}
        </div>
        <div className="footer-wisdom">
          Alignement · Dynamisme · Intention · Luminosité
        </div>
      </div>
    </div>
  );
}
