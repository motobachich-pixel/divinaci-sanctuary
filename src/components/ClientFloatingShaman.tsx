"use client";
import dynamic from "next/dynamic";
const ShamanGuide = dynamic(() => import("./ShamanGuide"), { ssr: false });

import { useEffect, useRef, useState } from "react";

// Props: intention (string), intensity (0-1)
export default function ClientFloatingShaman({ intention = "Bienvenue dans l'espace Usuldivinaci", intensity = 0.3 }) {
  // Mouvement flottant
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const tRef = useRef(0);
  useEffect(() => {
    let animId;
    const animate = () => {
      tRef.current += 0.012;
      setPos({
        x: Math.sin(tRef.current) * 40,
        y: Math.cos(tRef.current * 0.7) * 30,
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <div style={{ position: "fixed", right: 32 + pos.x, bottom: 32 + pos.y, zIndex: 30, pointerEvents: "none", transition: "right 0.2s, bottom 0.2s" }}>
      <ShamanGuide intensity={intensity} />
      <div style={{
        marginTop: 8,
        background: "rgba(10,9,7,0.92)",
        color: "#C5A059",
        borderRadius: 12,
        padding: "0.5rem 1.1rem",
        fontSize: "1.02rem",
        fontFamily: "var(--font-cinzel)",
        textAlign: "center",
        minWidth: 120,
        maxWidth: 220,
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.13)",
        opacity: 0.93,
        pointerEvents: "auto"
      }}>{intention}</div>
    </div>
  );
}