"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const codexWisdom = [
    "L'équilibre réside dans l'harmonie des forces opposées",
    "La connaissance illumine le chemin de la conscience",
    "Dans le silence réside la vérité universelle",
    "L'énergie circule où l'intention se concentre",
    "La sagesse naît de l'observation profonde",
    "Chaque forme contient l'essence de l'univers",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWisdomIndex((prev) => (prev + 1) % codexWisdom.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const text = await response.text();
      const assistantMessage: Message = { role: "assistant", content: text };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Une erreur est survenue. Veuillez réessayer.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body, html {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
        
        .chat-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0808 0%, #050505 50%, #0a0808 100%);
          position: relative;
          overflow: hidden;
        }
        
        /* Aurora background effect */
        .chat-page::before {
          content: "";
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            ellipse at 30% 20%,
            rgba(197,160,89,0.12) 0%,
            transparent 45%
          ),
          radial-gradient(
            ellipse at 70% 80%,
            rgba(197,160,89,0.08) 0%,
            transparent 50%
          );
          animation: auroraShift 20s ease-in-out infinite alternate;
          z-index: 0;
        }
        
        @keyframes auroraShift {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(5%, 3%) rotate(2deg); }
        }
        
        .chat-container {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: clamp(1rem, 3vh, 2rem) clamp(0.75rem, 2vw, 1.5rem);
        }
        
        /* Header with home link */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0 1.5rem;
          animation: fadeInDown 0.6s ease-out;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .oracle-badge {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        
        .oracle-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(197,160,89,0.35), rgba(197,160,89,0.15));
          border: 1px solid rgba(197,160,89,0.4);
          display: grid;
          place-items: center;
          font-size: 0.95rem;
          color: #C5A059;
          box-shadow: 0 4px 16px rgba(197,160,89,0.2), 0 0 30px rgba(197,160,89,0.15);
          animation: iconPulse 3s ease-in-out infinite;
        }
        
        @keyframes iconPulse {
          0%, 100% { 
            box-shadow: 0 4px 16px rgba(197,160,89,0.2), 0 0 30px rgba(197,160,89,0.15);
            filter: drop-shadow(0 0 8px rgba(197,160,89,0.3));
          }
          50% { 
            box-shadow: 0 4px 20px rgba(197,160,89,0.3), 0 0 40px rgba(197,160,89,0.25);
            filter: drop-shadow(0 0 12px rgba(197,160,89,0.5));
          }
        }
        
        .oracle-title {
          font-family: var(--font-cinzel), serif;
          font-size: 1.1rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: #C5A059;
          text-transform: uppercase;
        }
        
        .home-link {
          padding: 0.5rem 1rem;
          border-radius: 999px;
          background: rgba(197,160,89,0.08);
          border: 1px solid rgba(197,160,89,0.25);
          color: #C5A059;
          text-decoration: none;
          font-size: 0.85rem;
          font-family: var(--font-cinzel), serif;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
        }
        
        .home-link:hover {
          background: rgba(197,160,89,0.15);
          border-color: rgba(197,160,89,0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(197,160,89,0.15);
        }
        
        /* Messages area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: fadeIn 0.8s ease-out 0.2s both;
          mask-image: linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Custom scrollbar */
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-area::-webkit-scrollbar-track {
          background: rgba(197,160,89,0.05);
          border-radius: 10px;
        }
        
        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(197,160,89,0.25);
          border-radius: 10px;
        }
        
        .messages-area::-webkit-scrollbar-thumb:hover {
          background: rgba(197,160,89,0.4);
        }
        
        /* Empty state */
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: rgba(197,160,89,0.6);
          text-align: center;
          animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        
        .adil-symbol {
          margin-bottom: 1rem;
          animation: rotate 20s linear infinite, symbolGlow 3s ease-in-out infinite;
          filter: drop-shadow(0 0 15px rgba(197,160,89,0.4));
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes symbolGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 15px rgba(197,160,89,0.4));
          }
          50% { 
            filter: drop-shadow(0 0 25px rgba(197,160,89,0.6));
          }
        }
        
        .empty-text {
          font-family: var(--font-cinzel), serif;
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          font-weight: 300;
        }
        
        .empty-hint {
          font-size: 0.85rem;
          opacity: 0.7;
          font-family: var(--font-montserrat), sans-serif;
        }
        
        .empty-wisdom {
          font-family: var(--font-cinzel), serif;
          font-size: 1rem;
          font-weight: 300;
          font-style: italic;
          color: rgba(197,160,89,0.85);
          max-width: 520px;
          text-align: center;
          line-height: 1.6;
          margin: 1rem 0;
          animation: fadeInWisdom 1s ease-in-out;
        }
        
        @keyframes fadeInWisdom {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Message bubble */
        .message-row {
          display: flex;
          gap: 0.6rem;
          animation: messageSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 100%;
        }
        
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .message-row.user {
          flex-direction: row-reverse;
        }
        
        .message-avatar {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 1rem;
          margin-top: 4px;
        }
        
        .message-avatar.assistant {
          background: radial-gradient(circle at 35% 35%, rgba(197,160,89,0.3), rgba(197,160,89,0.12));
          border: 1px solid rgba(197,160,89,0.35);
          color: #C5A059;
          box-shadow: 0 2px 12px rgba(197,160,89,0.15), 0 0 20px rgba(197,160,89,0.1);
          filter: drop-shadow(0 0 6px rgba(197,160,89,0.25));
          animation: thinkingPulse 2s ease-in-out infinite;
          position: relative;
        }
        
        @keyframes thinkingPulse {
          0%, 100% {
            box-shadow: 0 2px 12px rgba(197,160,89,0.15), 0 0 20px rgba(197,160,89,0.1);
            filter: drop-shadow(0 0 6px rgba(197,160,89,0.25));
            transform: scale(1);
          }
          50% {
            box-shadow: 0 3px 16px rgba(197,160,89,0.25), 0 0 30px rgba(197,160,89,0.18);
            filter: drop-shadow(0 0 10px rgba(197,160,89,0.4));
            transform: scale(1.05);
          }
        }
        
        .message-avatar.user {
          background: radial-gradient(circle at 35% 35%, rgba(197,160,89,0.25), rgba(197,160,89,0.08));
          border: 1px solid rgba(197,160,89,0.3);
          box-shadow: 0 2px 10px rgba(197,160,89,0.12), 0 0 18px rgba(197,160,89,0.08);
          filter: drop-shadow(0 0 5px rgba(197,160,89,0.2));
          color: #d9bb6f;
          animation: avatarUserPulse 4s ease-in-out infinite;
        }
        
        @keyframes avatarUserPulse {
          0%, 100% {
            box-shadow: 0 2px 10px rgba(197,160,89,0.12), 0 0 18px rgba(197,160,89,0.08);
            filter: drop-shadow(0 0 5px rgba(197,160,89,0.2));
          }
          50% {
            box-shadow: 0 2px 14px rgba(197,160,89,0.18), 0 0 24px rgba(197,160,89,0.12);
            filter: drop-shadow(0 0 8px rgba(197,160,89,0.35));
          }
        }
        
        .message-bubble {
          max-width: calc(100% - 40px);
          padding: 0.9rem 1.1rem;
          border-radius: 18px;
          font-size: 0.96rem;
          line-height: 1.6;
          font-family: var(--font-montserrat), sans-serif;
          position: relative;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .message-bubble.assistant {
          background: linear-gradient(135deg, rgba(197,160,89,0.12), rgba(197,160,89,0.08));
          border: 1px solid rgba(197,160,89,0.2);
          color: #e9e0c9;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          border-bottom-left-radius: 6px;
        }
        
        .message-bubble.user {
          background: linear-gradient(135deg, rgba(197,160,89,0.22), rgba(197,160,89,0.16));
          border: 1px solid rgba(197,160,89,0.3);
          color: #f5f0e0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          border-bottom-right-radius: 6px;
        }
        
        /* Typing indicator */
        .typing-indicator {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          animation: messageSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .typing-dots {
          background: linear-gradient(135deg, rgba(197,160,89,0.12), rgba(197,160,89,0.08));
          border: 1px solid rgba(197,160,89,0.2);
          border-radius: 18px;
          border-bottom-left-radius: 6px;
          padding: 1rem 1.5rem;
          display: flex;
          gap: 6px;
          align-items: center;
        }
        
        .typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #C5A059;
          animation: typingBounce 1.4s ease-in-out infinite;
        }
        
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        
        /* Input area */
        .input-area {
          padding: 1.5rem 0 0.5rem;
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .input-container {
          background: rgba(8,6,4,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(197,160,89,0.25);
          border-radius: 16px;
          padding: 0.5rem;
          display: flex;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .input-container:focus-within {
          border-color: rgba(197,160,89,0.45);
          box-shadow: 0 8px 32px rgba(197,160,89,0.15), 0 0 0 3px rgba(197,160,89,0.08);
        }
        
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e9e0c9;
          font-size: 0.98rem;
          padding: 0.75rem 1rem;
          font-family: var(--font-montserrat), sans-serif;
          line-height: 1.5;
        }
        
        .chat-input::placeholder {
          color: rgba(197,160,89,0.5);
        }
        
        .send-btn {
          flex-shrink: 0;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #C5A059, #d7bb72);
          border: none;
          border-radius: 12px;
          color: #050505;
          font-family: var(--font-cinzel), serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(197,160,89,0.25);
        }
        
        .send-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #d7bb72, #e5c884);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(197,160,89,0.35);
        }
        
        .send-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .chat-container {
            padding: 0.75rem;
          }
          
          .chat-header {
            padding: 0.5rem 0 1rem;
          }
          
          .oracle-title {
            font-size: 0.95rem;
          }
          
          .message-bubble {
            max-width: 85%;
            padding: 0.85rem 1rem;
            font-size: 0.95rem;
          }
          
          .message-avatar {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }
          
          .input-area {
            padding: 1rem 0 0.25rem;
          }
          
          .send-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 480px) {
          .oracle-badge {
            gap: 0.5rem;
          }
          
          .oracle-icon {
            width: 28px;
            height: 28px;
            font-size: 0.85rem;
          }
          
          .oracle-title {
            font-size: 0.85rem;
          }
          
          .home-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
          
          .message-bubble {
            max-width: 90%;
            font-size: 0.92rem;
          }
          
          .empty-text {
            font-size: 1rem;
          }
          
          .empty-hint {
            font-size: 0.8rem;
          }
        }
      `}</style>

      <div className="chat-page">
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div className="oracle-badge">
              <div className="oracle-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="bevel" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="rgba(197,160,89,0.25)" opacity="0.8"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.6"/>
                </svg>
              </div>
              <span className="oracle-title">Oracle Divinaci</span>
            </div>
            <a href="/" className="home-link">← Sanctuaire</a>
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="adil-symbol">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="28" stroke="rgba(197,160,89,0.3)" strokeWidth="1.5"/>
                    <circle cx="30" cy="30" r="22" stroke="rgba(197,160,89,0.15)" strokeWidth="1" strokeDasharray="4 4"/>
                    <path d="M30 5L35 25L55 30L35 35L30 55L25 35L5 30L25 25L30 5Z" stroke="rgba(197,160,89,0.6)" strokeWidth="2" strokeLinejoin="bevel" fill="none"/>
                    <circle cx="30" cy="30" r="8" fill="rgba(197,160,89,0.15)" stroke="rgba(197,160,89,0.5)" strokeWidth="1.5"/>
                    <circle cx="30" cy="30" r="3" fill="rgba(197,160,89,0.3)"/>
                    <text x="30" y="34" textAnchor="middle" fontSize="10" fill="#C5A059" fontFamily="var(--font-cinzel)" fontWeight="300">ADIL</text>
                  </svg>
                </div>
                <div className="empty-wisdom" key={wisdomIndex}>{codexWisdom[wisdomIndex]}</div>
                <div className="empty-hint">Alignement · Dynamisme · Intention · Luminosité</div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message-row ${msg.role}`}>
                    <div className={`message-avatar ${msg.role}`}>
                      {msg.role === "assistant" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          {/* Ondes de pensée externes */}
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
                          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="0.5" opacity="0.25"/>
                          {/* Étoile principale (connexions synaptiques) */}
                          <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="bevel" fill="rgba(197,160,89,0.2)"/>
                          {/* Centre pensant avec halo */}
                          <circle cx="12" cy="12" r="4" fill="rgba(197,160,89,0.15)" opacity="0.6"/>
                          <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.5"/>
                          <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.8)"/>
                        </svg>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <div className={`message-bubble ${msg.role}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="typing-indicator">
                    <div className="message-avatar assistant">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        {/* Ondes de pensée externes */}
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
                        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="0.5" opacity="0.25"/>
                        {/* Étoile principale */}
                        <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="bevel" fill="rgba(197,160,89,0.2)"/>
                        {/* Centre pensant */}
                        <circle cx="12" cy="12" r="4" fill="rgba(197,160,89,0.15)" opacity="0.6"/>
                        <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.5"/>
                        <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.8)"/>
                      </svg>
                    </div>
                    <div className="typing-dots">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            <form onSubmit={handleSend}>
              <div className="input-container">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Écrivez votre message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={loading || !input.trim()}
                >
                  {loading ? "..." : "Envoyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
