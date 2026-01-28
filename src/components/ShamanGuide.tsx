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
      {/* SVG du chaman */}
      <svg width={220} height={220} viewBox="0 0 220 220" style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
        {/* Corps */}
        <ellipse cx="110" cy="140" rx="32" ry="48" fill="#2d2233" stroke="#C5A059" strokeWidth="2.5" />
        {/* Tête */}
        <ellipse cx="110" cy="90" rx="22" ry="28" fill="#C5A059" stroke="#fffbe6" strokeWidth="2" />
        {/* Yeux */}
        <ellipse cx="102" cy="92" rx="2.7" ry="4" fill="#2d2233" />
        <ellipse cx="118" cy="92" rx="2.7" ry="4" fill="#2d2233" />
        {/* Bouche */}
        <path d="M104 104 Q110 110 116 104" stroke="#2d2233" strokeWidth="2" fill="none" />
        {/* Plume */}
        <path d="M110 62 Q120 40 130 62" stroke="#6d77c4" strokeWidth="3" fill="none" />
        <ellipse cx="130" cy="62" rx="4" ry="10" fill="#6d77c4" opacity="0.7" />
        {/* Bâton */}
        <rect x="106" y="150" width="8" height="40" rx="3" fill="#C5A059" stroke="#fffbe6" strokeWidth="1.2" />
        <circle cx="110" cy="190" r="7" fill="#6d77c4" opacity="0.7" />
        {/* Cape */}
        <path d="M78 150 Q110 200 142 150" fill="#6d77c4" opacity="0.18" />
      </svg>
    </div>
  );
}
