"use client";
import { useEffect, useRef } from "react";

export default function GeometryCanvasBackground() {
  const geometryCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = geometryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

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
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas ref={geometryCanvasRef} className="geometry-canvas-global" />
  );
}