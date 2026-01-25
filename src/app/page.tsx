"use client";

import { Cinzel, Inter } from "next/font/google";
import { useEffect, useMemo, useRef, useState } from "react";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"] });

type ChatMsg = { id: string; role: "user" | "assistant"; content: string };

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
        // JSON fallback
        const data = await res.json().catch(() => ({ message: "" }));
        const content = data?.message ?? "";
        addMessage({ id: crypto.randomUUID(), role: "assistant", content });
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

  const borderPadClass = "p-[5px] sm:p-[10px]"; // golden borders padding requirement

  return (
    <div className={`${inter.className} min-h-dvh bg-[#050505] text-zinc-200`}>
      <main
        className={`mx-auto ${borderPadClass} max-w-3xl min-h-dvh flex flex-col`}
      >
        {/* Frame with golden border */}
        <div className="flex-1 border border-[#C5A059] flex flex-col">
          {/* Header / Logo */}
          <div className="flex items-center justify-center pt-16">
            <h1
              className={`${cinzel.className} text-4xl sm:text-5xl tracking-[0.25em] text-[#C5A059] motion-safe:animate-pulse`}
              style={{ animationDuration: "4s" }}
            >
              DIVINACI
            </h1>
          </div>

          {/* Messages area */}
          <div
            ref={listRef}
            className="mt-12 flex-1 overflow-y-auto px-6 sm:px-10"
          >
            <div className="space-y-6">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`
                    ${m.role === "user" ? "text-zinc-300" : "text-[#C5A059]"}
                    transition-opacity duration-700 ease-out opacity-100
                  `}
                >
                  <p className={`${m.role === "user" ? "" : cinzel.className} text-lg leading-relaxed`}>{m.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Input line at bottom */}
          <div className="px-6 sm:px-10 pb-10">
            <input
              type="text"
              aria-label="Intent"
              placeholder="Intent…"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none text-base"
            />
            <div className="mt-2 h-px bg-[#C5A059]/60" />
            <div className="mt-3 text-xs text-zinc-500">
              {loading ? "Listening…" : "Press Enter to send"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
