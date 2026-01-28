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
      {/* Structure géométrique animée inspirée des équations du site */}
      <svg width={220} height={220} viewBox="0 0 220 220" style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
        {/* Spirale logarithmique */}
        <path d={(() => {
          let d = "M110 110 ";
          const a = 4.5;
          const b = 0.22;
          for (let t = 0; t < 4 * Math.PI; t += 0.08) {
            const r = a * Math.exp(b * t);
            const x = 110 + r * Math.cos(t);
            const y = 110 + r * Math.sin(t);
            d += `L${x.toFixed(2)} ${y.toFixed(2)} `;
          }
          return d;
        })()} stroke="#C5A059" strokeWidth="2.5" fill="none" />
        {/* Orbites elliptiques */}
        <ellipse cx="110" cy="110" rx="60" ry="24" fill="none" stroke="#6d77c4" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="110" cy="110" rx="38" ry="12" fill="none" stroke="#C5A059" strokeWidth="1.2" opacity="0.4" />
        {/* Points sur orbite */}
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i / 7) * 2 * Math.PI;
          const x = 110 + 60 * Math.cos(angle);
          const y = 110 + 24 * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r={4} fill="#C5A059" opacity="0.7" />;
        })}
        {/* Centre lumineux */}
        <circle cx="110" cy="110" r="13" fill="#fffbe6" opacity="0.9" />
        <circle cx="110" cy="110" r="8" fill="#6d77c4" opacity="0.25" />
      </svg>
    </div>
  );
}
