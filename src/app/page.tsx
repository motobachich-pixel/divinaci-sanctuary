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
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (msg: ChatMsg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendIntent = async () => {
    const trimmed = intent.trim();
    if (!trimmed || loading) return;
    setLoading(true);

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

  const borderPadClass = "px-4 sm:px-6 md:px-8";

  return (
    <div className={`${montserrat.className} w-screen h-dvh bg-[#050505] text-gray-300 overflow-hidden flex flex-col`}>
      <main
        className={`${borderPadClass} max-w-4xl mx-auto w-full h-full flex flex-col`}
      >
        {/* Minimal frame - clean structure */}
        <div className="flex-1 flex flex-col">
          {/* Header / Logo - Cinzel only */}
          <div className="flex items-center justify-center pt-2 sm:pt-3 md:pt-4 pb-3 sm:pb-4 md:pb-5 border-b border-amber-500/30">
            <h1
              className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider text-[#C5A059] motion-safe:animate-pulse`}
              style={{ animationDuration: "4s" }}
            >
              DIVINACI
            </h1>
          </div>

          {/* Messages area - clean, minimal, scrollable */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-3 md:px-4 mb-2 sm:mb-3"
          >
            <div className="space-y-4 sm:space-y-6 md:space-y-8 pr-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`
                    transition-opacity duration-700 ease-out
                    ${m.role === "user" ? "text-gray-400 text-right" : "text-[#C5A059]"}
                  `}
                >
                  <p className={`${m.role === "user" ? `${montserrat.className}` : cinzel.className} text-sm sm:text-base md:text-lg leading-relaxed font-medium break-words`}>
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

          {/* Input area - minimal, symmetric, sticky */}
          <div className="border-t-2 border-amber-500 sticky bottom-0 bg-[#050505] pt-2 sm:pt-3 pb-2 sm:pb-3">
            <input
              type="text"
              aria-label="Intent"
              placeholder="Share your intention…"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              className={`w-full bg-gray-300 text-gray-900 placeholder-gray-600 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 font-medium text-sm sm:text-base
                ${loading ? "opacity-50" : "opacity-100"}
                transition-all duration-300
              `}
            />
          </div>

          {/* Status - minimal */}
          <div className="py-1 sm:py-2 text-xs sm:text-xs tracking-wide text-gray-500 uppercase sticky bottom-0 bg-[#050505]">
            {loading ? "Thinking…" : "Ready"}
          </div>
        </div>
      </main>
    </div>
  );
}
