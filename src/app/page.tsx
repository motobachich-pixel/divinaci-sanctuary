"use client";

import { Cinzel, Montserrat } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { RichContent } from "@/components/RichContent";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"] });

type ChatMsg = { 
  id: string; 
  role: "user" | "assistant"; 
  content: string;
  richContent?: any;
};

export default function Home() {
  const [intent, setIntent] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string>("en");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (msg: ChatMsg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const detectLanguageFromText = (text: string): string => {
    const frenchWords = /\b(je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|du|de|et|ou|mais|donc|pour|qui|que|avec|par|à|dans|sans)\b/i;
    const spanishWords = /\b(yo|tú|él|ella|nosotros|vosotros|ellos|ellas|el|la|los|las|un|una|unos|unas|de|y|o|pero|porque|para|quien|que|con|por|a|en|sin)\b/i;
    const germanWords = /\b(ich|du|er|sie|es|wir|ihr|sie|der|die|das|den|dem|des|ein|eine|einem|einen|einer|eines|und|oder|aber|weil|da|um|zu|mit|von|in|zu|für)\b/i;
    const italianWords = /\b(io|tu|lui|lei|noi|voi|loro|il|lo|la|i|gli|le|un|una|uno|di|e|o|ma|perché|per|chi|che|con|da|in|a|su)\b/i;
    const portugueseWords = /\b(eu|tu|ele|ela|nós|vós|eles|elas|o|a|os|as|um|uma|uns|umas|de|e|ou|mas|porque|para|quem|que|com|por|em|a|sem)\b/i;
    const japaneseChars = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;

    if (japaneseChars.test(text)) return "ja";
    if (germanWords.test(text)) return "de";
    if (spanishWords.test(text)) return "es";
    if (italianWords.test(text)) return "it";
    if (portugueseWords.test(text)) return "pt";
    if (frenchWords.test(text)) return "fr";
    return "en";
  };

  const sendIntent = async () => {
    const trimmed = intent.trim();
    if (!trimmed || loading) return;
    setLoading(true);

    // Detect language from user input
    const detectedLang = detectLanguageFromText(trimmed);
    setLanguage(detectedLang);

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    addMessage(userMsg);
    setIntent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/plain")) {
        // Streaming text response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let aggregated = "";
        if (reader) {
          // create an assistant placeholder and update progressively
          const id = crypto.randomUUID();
          addMessage({ id, role: "assistant", content: "" });
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            aggregated += chunk;
            setMessages((prev) =>
              prev.map((m) => (m.id === id ? { ...m, content: aggregated } : m))
            );
          }
        } else {
          // No stream visibility, fallback to single message
          const text = await res.text();
          addMessage({ id: crypto.randomUUID(), role: "assistant", content: text });
        }
      } else {
        // JSON fallback with rich content support
        const data = await res.json().catch(() => ({ message: "" }));
        const content = data?.message ?? "";
        const richContent = data?.richContent;
        addMessage({ id: crypto.randomUUID(), role: "assistant", content, richContent });
      }
    } catch (e) {
      addMessage({ id: crypto.randomUUID(), role: "assistant", content: "…" });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendIntent();
    }
  };

  const getPlaceholder = () => {
    const placeholders: Record<string, string> = {
      fr: "Partagez votre intention…",
      es: "Comparte tu intención…",
      de: "Teilen Sie Ihre Absicht…",
      it: "Condividi la tua intenzione…",
      pt: "Compartilhe sua intenção…",
      ja: "あなたの意図を共有してください…",
      en: "Share your intention…",
    };
    return placeholders[language] || "Share your intention…";
  };

  const getDefinition = () => {
    const definitions: Record<string, string> = {
      fr: "Guide consciente dans l'actualisation des intentions",
      es: "Guía consciente en la actualización de intenciones",
      de: "Bewusstes Leitfaden bei der Verwirklichung von Absichten",
      it: "Guida consapevole nell'attuazione delle intenzioni",
      pt: "Guia consciente na atualização de intenções",
      ja: "意図の実現における意識的なガイド",
      en: "Conscious guide in the actualization of intentions",
    };
    return definitions[language] || "Conscious guide in the actualization of intentions";
  };

  const borderPadClass = "px-4 sm:px-6 md:px-8";

  return (
    <div className={`${montserrat.className} w-screen h-dvh bg-[#050505] text-gray-300 flex flex-col overflow-hidden`}>
      <main className={`${borderPadClass} max-w-4xl mx-auto w-full h-full flex flex-col`}>
        {/* Header / Logo - Cinzel only */}
        <div className="flex flex-col items-center justify-center pt-2 sm:pt-3 md:pt-4 pb-3 sm:pb-4 md:pb-5 border-b border-amber-500/30 flex-shrink-0 gap-1 sm:gap-2">
          <h1
            className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-[#C5A059] motion-safe:animate-pulse`}
            style={{ animationDuration: "4s" }}
          >
            DIVINACI
          </h1>
          <p className={`${montserrat.className} text-xs sm:text-sm md:text-base text-gray-500 italic tracking-wide opacity-70 transition-opacity duration-500`}>
            {getDefinition()}
          </p>
        </div>

        {/* Messages area - scrollable container */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8 scroll-smooth"
        >
          <div className="space-y-4 sm:space-y-6 md:space-y-8 pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`
                  transition-all duration-1000 ease-out
                  ${m.role === "user" ? "text-gray-400 text-right opacity-70" : "text-[#C5A059] opacity-80"}
                `}
              >
                <p className={`${m.role === "user" ? `${montserrat.className}` : cinzel.className} text-sm sm:text-base md:text-lg leading-relaxed font-light break-words message-text`}>
                  {m.content}
                </p>
                {m.richContent && m.role === "assistant" && (
                  <div className="mt-3 bg-gray-800/30 p-3 rounded-lg border border-[#C5A059]/20">
                    <RichContent content={m.richContent} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input area - fixed at bottom */}
        <div className="border-t-2 border-amber-500 bg-[#050505] pt-2 sm:pt-3 pb-2 sm:pb-3 flex-shrink-0">
          <input
            type="text"
            aria-label="Intent"
            placeholder={getPlaceholder()}
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            className={`w-full bg-black text-gray-300 placeholder-gray-500 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-light text-sm sm:text-base
              ${loading ? "opacity-60" : "opacity-90"}
              transition-all duration-300
            `}
          />
        </div>

        {/* Status - minimal */}
        <div className="py-1 sm:py-2 text-xs tracking-wide text-gray-500 uppercase bg-[#050505] flex-shrink-0">
          {loading ? "Thinking…" : "Ready"}
        </div>
      </main>
    </div>
  );
}
