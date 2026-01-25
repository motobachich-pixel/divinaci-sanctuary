"use client";

import "./ThinkingLoader.css";

interface ThinkingLoaderProps {
  mode: "idle" | "listening" | "thinking" | "streaming";
  visible?: boolean;
}

export function ThinkingLoader({ mode, visible = true }: ThinkingLoaderProps) {
  if (!visible) return null;

  return (
    <div className={`metatron-indicator mode-${mode}`}>
      <div className="divinaci-portal">
        <div className="metatron-core">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>

          <svg viewBox="0 0 100 100" className="sacred-geo">
            <circle cx="50" cy="50" r="10" className="center-light" />
            <path d="M50 10 L90 50 L50 90 L10 50 Z" className="diamond-path" />
            <circle cx="50" cy="50" r="35" stroke="#C5A059" strokeWidth="0.2" fill="none" />
          </svg>

          <div className="particle p1"></div>
          <div className="particle p2"></div>
          <div className="particle p3"></div>
          <div className="particle p4"></div>
        </div>
      </div>
    </div>
  );
}
