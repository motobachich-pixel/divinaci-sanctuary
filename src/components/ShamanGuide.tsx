"use client";
import React, { useRef, useEffect } from "react";

// Personnage chamanique animé SVG + Canvas (aura, particules)
export default function ShamanGuide() {
  const auraRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = auraRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const resize = () => {
      canvas.width = 220;
      canvas.height = 220;
    };
    resize();
    // Aura animée
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 18;
      const time = Date.now() * 0.002;
      // Halo pulsant
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, 60 + i * 10 + Math.sin(time + i) * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(197,160,89,${0.13 - i * 0.03})`;
        ctx.lineWidth = 8 - i * 2;
        ctx.stroke();
      }
      // Particules flottantes
      for (let p = 0; p < 18; p++) {
        const angle = (p / 18) * Math.PI * 2 + time * 0.7;
        const r = 80 + Math.sin(time * 1.2 + p) * 12;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 2.2 + Math.sin(time * 2 + p) * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(197,160,89,0.22)";
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div style={{ position: "relative", width: 220, height: 220 }}>
      <canvas ref={auraRef} style={{ position: "absolute", top: 0, left: 0, width: 220, height: 220, zIndex: 1, pointerEvents: "none" }} />
      {/* SVG du Merlin chamanique inspiré des équations */}
      <svg width={220} height={220} viewBox="0 0 220 220" style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
        {/* Corps spiralé */}
        <path d="M110 140 Q120 120 110 100 Q100 80 110 60" stroke="#C5A059" strokeWidth="4" fill="none" />
        {/* Orbites autour de la tête */}
        <ellipse cx="110" cy="70" rx="32" ry="12" fill="none" stroke="#6d77c4" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="110" cy="70" rx="22" ry="6" fill="none" stroke="#C5A059" strokeWidth="1.2" opacity="0.4" />
        {/* Tête sage, expression bienveillante */}
        <ellipse cx="110" cy="70" rx="18" ry="18" fill="#C5A059" stroke="#fffbe6" strokeWidth="2" />
        {/* Yeux doux */}
        <ellipse cx="104" cy="72" rx="2.2" ry="3.2" fill="#2d2233" />
        <ellipse cx="116" cy="72" rx="2.2" ry="3.2" fill="#2d2233" />
        {/* Sourire bienveillant */}
        <path d="M106 80 Q110 85 114 80" stroke="#2d2233" strokeWidth="1.5" fill="none" />
        {/* Bâton quantique */}
        <rect x="107" y="120" width="6" height="38" rx="2.5" fill="#C5A059" stroke="#fffbe6" strokeWidth="1" />
        <circle cx="110" cy="160" r="7" fill="#6d77c4" opacity="0.7" />
        {/* Spirale d'énergie dans la main */}
        <path d="M110 140 q8 8 16 0 q-8 -8 0 -16" stroke="#6d77c4" strokeWidth="2" fill="none" opacity="0.7" />
        {/* Cape translucide */}
        <path d="M90 140 Q110 200 130 140" fill="#6d77c4" opacity="0.13" />
      </svg>
    </div>
  );
}
