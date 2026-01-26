"use client";

import { useEffect, useRef, useState } from "react";

// Sagesse du Codex Boutayeb
const codexWisdom = [
  "L'équilibre réside dans l'harmonie des forces opposées",
  "La connaissance illumine le chemin de la conscience",
  "Dans le silence réside la vérité universelle",
  "L'énergie circule où l'intention se concentre",
  "La sagesse naît de l'observation profonde",
  "Chaque forme contient l'essence de l'univers",
  "Le temps est une illusion, la conscience est éternelle",
  "L'unité se manifeste dans la diversité",
];

// Sagesses dédiées aux piliers ADIL, dérivées de l'esprit des aphorismes
const adilPillars = [
  "Alignement : l'harmonie des forces opposées",
  "Dynamisme : l'énergie circule où l'intention se pose",
  "Intention : chaque forme porte l'essence",
  "Luminosité : la connaissance illumine le chemin",
  "Alignement · Dynamisme · Intention · Luminosité",
  "Intention · Luminosité · Alignement · Dynamisme",
];

const languageNotes: Record<string, { code: string; note: string }> = {
  fr: {
    code: "Français",
    note: "Nous ajustons la conversation pour répondre en français automatiquement.",
  },
  en: {
    code: "English",
    note: "We will answer in English by default; change anytime in the chat.",
  },
  es: {
    code: "Español",
    note: "Responderemos en español para más comodidad en la conversation.",
  },
  ar: {
    code: "العربية",
    note: "سيتم الرد عليك بالعربية مع تنسيق مريح للعينين.",
  },
  de: {
    code: "Deutsch",
    note: "Antworten erfolgen auf Deutsch; tu peux basculer dans le chat à tout moment.",
  },
  it: {
    code: "Italiano",
    note: "Risponderemo in italiano; puoi cambiare lingua nel chat en un clic.",
  },
  pt: {
    code: "Português",
    note: "Responderemos em português; mude a qualquer momento no chat.",
  },
};

export default function Home() {
  const [currentWisdom, setCurrentWisdom] = useState(0);
  const [adilVariant, setAdilVariant] = useState(0);
  const [userLanguageCode, setUserLanguageCode] = useState("en");
  const [userLanguageName, setUserLanguageName] = useState("English");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geometryCanvasRef = useRef<HTMLCanvasElement>(null);

  // Détecte la langue du navigateur pour informer l'utilisateur
  useEffect(() => {
    const browserLang = (typeof navigator !== "undefined" ? navigator.language : "en") || "en";
    const code = browserLang.slice(0, 2).toLowerCase();
    const names: Record<string, string> = {
      en: "English",
      fr: "Français",
      es: "Español",
      de: "Deutsch",
      it: "Italiano",
      pt: "Português",
      nl: "Nederlands",
      ar: "العربية",
      zh: "中文",
      ja: "日本語",
      ko: "한국어",
      ru: "Русский",
      hi: "हिन्दी",
      tr: "Türkçe",
    };
    setUserLanguageCode(code);
    setUserLanguageName(languageNotes[code]?.code || names[code] || "English");
  }, []);

  // Rotation de la sagesse toutes les 8 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWisdom((prev) => (prev + 1) % codexWisdom.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Variation aléatoire des piliers ADIL toutes les 7 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setAdilVariant((prev) => {
        if (adilPillars.length <= 1) return prev;
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * adilPillars.length);
        }
        return next;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Particules dorées en arrière-plan
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

    const particles: Array<{ x: number; y: number; vx: number; vy: number; opacity: number }> = [];
    const particleCount = 48;

    // Initialiser des particules
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    let rafId = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        
        ctx.fillStyle = `rgba(197, 160, 89, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
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

  // Formes géométriques basées sur l'Équation ADIL
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

    let time = 0;
    let rafId = 0;

    // Équation ADIL: A·D·I·L = Harmonie
    // A = Alignement, D = Dynamisme, I = Intention, L = Luminosité
    const drawADILGeometry = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      time += 0.008;
      
      // Loi ADIL 1: Spirale d'Alignement
      const spiralPoints = 120;
      ctx.strokeStyle = `rgba(197, 160, 89, 0.18)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < spiralPoints; i++) {
        const angle = (i / spiralPoints) * Math.PI * 8 + time;
        const radius = 100 + i * 2 + Math.sin(time * 2) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Loi ADIL 2: Hexagone du Dynamisme
      const hexRadius = 150 + Math.sin(time) * 30;
      ctx.strokeStyle = `rgba(197, 160, 89, 0.22)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.5;
        const x = centerX + Math.cos(angle) * hexRadius;
        const y = centerY + Math.sin(angle) * hexRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Loi ADIL 3: Cercles d'Intention concentriques
      for (let i = 1; i <= 4; i++) {
        const radius = 80 * i + Math.sin(time + i) * 15;
        ctx.strokeStyle = `rgba(197, 160, 89, ${0.12 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Loi ADIL 4: Étoile de Luminosité à 8 branches
      const starRadius = 200 + Math.cos(time * 1.5) * 40;
      ctx.strokeStyle = `rgba(197, 160, 89, 0.16)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2 + time * 0.3;
        const outerRadius = starRadius;
        const innerRadius = starRadius * 0.5;
        
        const x1 = centerX + Math.cos(angle) * outerRadius;
        const y1 = centerY + Math.sin(angle) * outerRadius;
        const x2 = centerX + Math.cos(angle + Math.PI / 8) * innerRadius;
        const y2 = centerY + Math.sin(angle + Math.PI / 8) * innerRadius;
        
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.closePath();
      ctx.stroke();

      // Orbe central lumineux (point de convergence ADIL)
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
      gradient.addColorStop(0, 'rgba(232, 213, 163, 0.72)');
      gradient.addColorStop(0.5, 'rgba(197, 160, 89, 0.32)');
      gradient.addColorStop(1, 'rgba(139, 111, 71, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.fill();
      
      rafId = requestAnimationFrame(drawADILGeometry);
    };
    
    rafId = requestAnimationFrame(drawADILGeometry);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClick = () => {
    const langParam = userLanguageCode ? `?lang=${encodeURIComponent(userLanguageCode)}` : "";
    window.location.href = `/chat${langParam}`;
  };

  return (
    <div>
      <style>{`
        :root {
          --center-offset: calc(var(--sidebar-active-width, 260px) / 2);
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .void {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, #0a0808 0%, #030202 100%);
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
        .geometry-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }
        .brand-mark {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
          z-index: 6;
          translate: calc(var(--center-offset)) 0;
        }
        .brand-ring {
          width: clamp(160px, 18vmin, 220px);
          height: clamp(160px, 18vmin, 220px);
          border-radius: 999px;
          border: 1.5px solid rgba(197, 160, 89, 0.22);
          box-shadow: 0 0 40px rgba(197, 160, 89, 0.12), inset 0 0 30px rgba(197, 160, 89, 0.08);
          backdrop-filter: blur(6px);
          position: relative;
          opacity: 0.8;
          animation: slowPulse 6s ease-in-out infinite;
        }
        .brand-ring::after {
          content: "";
          position: absolute;
          inset: 12%;
          border-radius: inherit;
          border: 1px solid rgba(197, 160, 89, 0.16);
        }
        .brand-core {
          position: relative;
          width: clamp(32px, 5vmin, 48px);
          height: clamp(32px, 5vmin, 48px);
          background: radial-gradient(circle, rgba(232, 213, 163, 0.9), rgba(197, 160, 89, 0.55));
          border-radius: 12px;
          box-shadow: 0 0 30px rgba(197, 160, 89, 0.4), 0 0 80px rgba(197, 160, 89, 0.2);
          transform: rotate(15deg);
          opacity: 0.9;
        }
        @keyframes slowPulse {
          0% { transform: scale(0.98); opacity: 0.7; }
          50% { transform: scale(1.02); opacity: 0.9; }
          100% { transform: scale(0.98); opacity: 0.7; }
        }
        .wisdom-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: linear-gradient(180deg, rgba(15, 12, 8, 0.78) 0%, rgba(10, 8, 5, 0.64) 100%);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(197, 160, 89, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1.8rem 0 calc(var(--sidebar-active-width, 260px) + 24px);
          transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 50;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }
        .wisdom-bar::before {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(197, 160, 89, 0.4) 50%,
            transparent 100%);
        }
        .wisdom-text {
          font-family: var(--font-cinzel);
          font-size: clamp(0.85rem, 1.4vw, 1.05rem);
          font-weight: 100;
          letter-spacing: 0.12em;
          color: #C5A059;
          text-align: center;
          text-shadow: 0 0 10px rgba(197, 160, 89, 0.22);
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sanctuary-title {
          position: fixed;
          top: 45%;
          left: calc(50% + var(--center-offset));
          transform: translate(-50%, -50%);
          z-index: 10;
          text-align: center;
        }
        .title-main {
          font-family: var(--font-cinzel);
          font-size: clamp(2.5rem, 8vmin, 5rem);
          font-weight: 100;
          letter-spacing: clamp(0.4em, 3vw, 1em);
          color: #C5A059;
          text-shadow: 
            0 0 18px rgba(197, 160, 89, 0.42),
            0 0 34px rgba(197, 160, 89, 0.26),
            0 0 50px rgba(197, 160, 89, 0.18);
          animation: titleGlow 4s ease-in-out infinite alternate;
        }
        @keyframes titleGlow {
          0% { 
            text-shadow: 
              0 0 20px rgba(197, 160, 89, 0.5),
              0 0 40px rgba(197, 160, 89, 0.3),
              0 0 60px rgba(197, 160, 89, 0.2);
          }
          100% { 
            text-shadow: 
              0 0 30px rgba(197, 160, 89, 0.7),
              0 0 60px rgba(197, 160, 89, 0.5),
              0 0 90px rgba(197, 160, 89, 0.3);
          }
        }
        .title-subtitle {
          font-family: var(--font-cinzel);
          font-size: clamp(0.85rem, 2.2vmin, 1.3rem);
          font-weight: 100;
          letter-spacing: 0.3em;
          color: rgba(197, 160, 89, 0.7);
          margin-top: 1rem;
          text-transform: uppercase;
        }
        .enter-portal {
          position: fixed;
          bottom: 120px;
          left: calc(50% + var(--center-offset));
          transform: translateX(-50%);
          padding: 1rem 2.6rem;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.12), rgba(197, 160, 89, 0.06));
          border: 1.5px solid rgba(197, 160, 89, 0.28);
          border-radius: 50px;
          color: #C5A059;
          font-family: var(--font-cinzel);
          font-size: clamp(0.9rem, 1.5vw, 1.1rem);
          font-weight: 100;
          letter-spacing: 0.16em;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 0 18px rgba(197, 160, 89, 0.24);
        }
        .enter-portal:hover {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.2), rgba(197, 160, 89, 0.12));
          border-color: #C5A059;
          box-shadow: 0 0 26px rgba(197, 160, 89, 0.34);
          transform: translateX(-50%) translateY(-3px);
        }
        .adil-label {
          position: fixed;
          bottom: 40px;
          left: calc(50% + var(--center-offset));
          transform: translateX(-50%);
          font-family: var(--font-cinzel);
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: rgba(197, 160, 89, 0.65);
          text-transform: uppercase;
          z-index: 10;
          padding: 0.38rem 1.3rem;
          background: rgba(5, 5, 5, 0.22);
          border: 1px solid rgba(197, 160, 89, 0.18);
          border-radius: 999px;
          backdrop-filter: blur(4px);
          text-shadow: 0 0 6px rgba(197, 160, 89, 0.28);
          animation: fadeIn 0.9s ease-in-out;
        }

        @keyframes pulseShimmer {
          0% { box-shadow: 0 0 20px rgba(197,160,89,0.12); }
          50% { box-shadow: 0 0 32px rgba(197,160,89,0.3); }
          100% { box-shadow: 0 0 20px rgba(197,160,89,0.12); }
        }
        .enter-portal {
          animation: pulseShimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* Fond du sanctuaire */}
      <div className="void"></div>

      {/* Canvas de particules */}
      <canvas ref={canvasRef} className="canvas" />

      {/* Canvas des formes géométriques ADIL */}
      <canvas ref={geometryCanvasRef} className="geometry-canvas" />

      {/* Barre de sagesse du Codex Boutayeb */}
      <div className="wisdom-bar">
        <span className="wisdom-text" key={currentWisdom}>
          {codexWisdom[currentWisdom]}
        </span>
      </div>

      {/* Titre du sanctuaire */}
      <div className="sanctuary-title">
        <h1 className="title-main">USULDIVINACI</h1>
        <p className="title-subtitle">Le Sanctuaire Éternel</p>
      </div>

      {/* Logo central inspiré de la géométrie */}
      <div className="brand-mark" aria-hidden="true">
        <div className="brand-ring" />
        <div className="brand-core" />
      </div>

      {/* Bouton d'entrée */}
      <button className="enter-portal" onClick={handleClick}>
        ◈ Entrer dans l'Oracle ◈
      </button>

      {/* Label ADIL sans mention explicite */}
      <div className="adil-label" key={adilVariant}>
        {adilPillars[adilVariant]}
      </div>
    </div>
  );
}
