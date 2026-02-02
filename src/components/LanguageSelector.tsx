"use client";
import { useContext } from "react";
import { LangContext } from "./LangProvider";

const LANGS = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export default function LanguageSelector() {
  const { lang, setLang } = useContext(LangContext);
  return (
    <div style={{ position: "absolute", top: 18, right: 24, zIndex: 100, display: "flex", gap: 8 }}>
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          style={{
            background: lang === l.code ? "#C5A059" : "#222",
            color: lang === l.code ? "#222" : "#C5A059",
            border: "none",
            borderRadius: 8,
            padding: "0.3rem 0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 15,
            transition: "all 0.2s"
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
