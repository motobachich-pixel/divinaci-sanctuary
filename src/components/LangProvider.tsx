"use client";
import { createContext, useEffect, useState, ReactNode } from "react";
import { translations } from "../lib/i18n";

export const LangContext = createContext({ lang: "en", setLang: (_: string) => {}, t: translations.en });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang");
      if (stored && (stored === "en" || stored === "fr")) setLang(stored);
    }
  }, []);
  const t = translations[lang as "en" | "fr"] || translations.en;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
