"use client";
import dynamic from "next/dynamic";
const ShamanGuide = dynamic(() => import("./ShamanGuide"), { ssr: false });

export default function ClientFloatingShaman() {
  return (
    <div style={{ position: "fixed", right: 32, bottom: 32, zIndex: 30, pointerEvents: "none" }}>
      <ShamanGuide />
    </div>
  );
}