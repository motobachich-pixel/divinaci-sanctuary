"use client";

import { Cinzel } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-cinzel",
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        content: "An error occurred. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cinzel.variable}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          width: 100%;
          height: 100%;
        }
        .chat-wrapper {
          display: flex;
          width: 100%;
          height: 100vh;
          background: #050505;
        }
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: clamp(220px, 18vw, 280px);
          background: linear-gradient(180deg, rgba(10, 8, 5, 0.98) 0%, rgba(5, 5, 5, 0.95) 100%);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(197, 160, 89, 0.15);
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(0);
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 20px rgba(0, 0, 0, 0.5);
        }
        .sidebar.collapsed {
          transform: translateX(-100%);
        }
        .sidebar-header {
          padding: 1.5rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-bottom: 1px solid rgba(197, 160, 89, 0.1);
        }
        .sidebar-logo {
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          font-weight: 100;
          letter-spacing: 0.3em;
          color: #C5A059;
          opacity: 0.9;
          text-align: center;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 0 8px rgba(197, 160, 89, 0.3));
        }
        .new-chat-btn {
          width: 100%;
          padding: 0.9rem 1.2rem;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.08) 100%);
          border: 1px solid rgba(197, 160, 89, 0.3);
          border-radius: 12px;
          color: #C5A059;
          cursor: pointer;
          font-family: var(--font-cinzel), system-ui, sans-serif;
          font-weight: 100;
          letter-spacing: 0.08em;
          font-size: clamp(0.8rem, 1vw, 0.9rem);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }
        .new-chat-btn:hover {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.25) 0%, rgba(197, 160, 89, 0.15) 100%);
          border-color: #C5A059;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(197, 160, 89, 0.2);
        }
        .new-chat-btn:active {
          transform: translateY(0);
        }
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-content::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-content::-webkit-scrollbar-track {
          background: rgba(197, 160, 89, 0.05);
          border-radius: 3px;
        }
        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.3);
          border-radius: 3px;
        }
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.5);
        }
        .history-section {
          margin-bottom: 1rem;
        }
        .history-title {
          font-size: 0.75rem;
          font-weight: 100;
          letter-spacing: 0.1em;
          color: rgba(197, 160, 89, 0.6);
          margin-bottom: 0.5rem;
          padding: 0 0.5rem;
          text-transform: uppercase;
        }
        .history-item {
          padding: 0.7rem 0.8rem;
          background: rgba(197, 160, 89, 0.05);
          border: 1px solid transparent;
          border-radius: 8px;
          color: rgba(197, 160, 89, 0.8);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 100;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .history-item:hover {
          background: rgba(197, 160, 89, 0.12);
          border-color: rgba(197, 160, 89, 0.3);
          color: #C5A059;
        }
        .sidebar-footer {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          border-top: 1px solid rgba(197, 160, 89, 0.1);
        }
        .sidebar-button {
          width: 100%;
          padding: 0.8rem;
          background: rgba(197, 160, 89, 0.08);
          border: 1px solid rgba(197, 160, 89, 0.25);
          border-radius: 8px;
          color: #C5A059;
          cursor: pointer;
          font-family: var(--font-cinzel), system-ui, sans-serif;
          font-weight: 100;
          letter-spacing: 0.08em;
          font-size: clamp(0.75rem, 0.9vw, 0.85rem);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .sidebar-button:hover {
          background: rgba(197, 160, 89, 0.15);
          border-color: rgba(197, 160, 89, 0.4);
          transform: translateX(2px);
        }
        .toggle-sidebar {
          width: 100%;
          padding: 0.7rem;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.1), rgba(197, 160, 89, 0.05));
          border: 1px solid rgba(197, 160, 89, 0.3);
          border-radius: 8px;
          color: #C5A059;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .toggle-sidebar:hover {
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.18), rgba(197, 160, 89, 0.1));
          border-color: #C5A059;
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.2);
        }
        .toggle-sidebar:active {
          transform: scale(0.98);
        }
        .chat-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-left: clamp(220px, 18vw, 280px);
          height: 100vh;
          background: #050505;
          color: #e5e5e5;
          font-family: var(--font-cinzel), system-ui, sans-serif;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .chat-container.sidebar-collapsed {
          margin-left: 0;
        }
        .chat-header {
          padding: clamp(1rem, 3vmin, 2rem);
          background: linear-gradient(180deg, rgba(197, 160, 89, 0.1), transparent);
          border-bottom: 1px solid rgba(197, 160, 89, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chat-header h1 {
          font-size: clamp(1.2rem, 3vmin, 1.8rem);
          font-weight: 100;
          letter-spacing: 0.1em;
          color: #C5A059;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .back-link {
          color: #C5A059;
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          padding: 0.5rem 1rem;
          border: 1px solid rgba(197, 160, 89, 0.5);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .back-link:hover {
          background: rgba(197, 160, 89, 0.1);
          border-color: #C5A059;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: clamp(1rem, 3vmin, 2rem);
          display: flex;
          flex-direction: column;
          gap: clamp(0.5rem, 2vmin, 1.5rem);
        }
        .message {
          display: flex;
          gap: 1rem;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message.user {
          justify-content: flex-end;
        }
        .message-content {
          max-width: 70%;
          padding: clamp(0.75rem, 2vmin, 1.5rem);
          border-radius: 4px;
          font-size: clamp(0.9rem, 2vmin, 1rem);
          line-height: 1.6;
        }
        .message.assistant .message-content {
          background: rgba(197, 160, 89, 0.1);
          border-left: 2px solid #C5A059;
          color: #e5e5e5;
        }
        .message.user .message-content {
          background: rgba(197, 160, 89, 0.2);
          border-right: 2px solid #C5A059;
          color: #C5A059;
        }
        .chat-input-area {
          padding: clamp(1rem, 3vmin, 2rem);
          background: linear-gradient(180deg, transparent, rgba(197, 160, 89, 0.05));
          border-top: 1px solid rgba(197, 160, 89, 0.2);
        }
        .input-form {
          display: flex;
          gap: 0.75rem;
          max-width: 100%;
        }
        .input-field {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(197, 160, 89, 0.05);
          border: 1px solid rgba(197, 160, 89, 0.3);
          border-radius: 2px;
          color: #e5e5e5;
          font-family: var(--font-cinzel), system-ui, sans-serif;
          font-size: clamp(0.9rem, 2vmin, 1rem);
          transition: border-color 0.3s ease;
        }
        .input-field:focus {
          outline: none;
          border-color: #C5A059;
          background: rgba(197, 160, 89, 0.1);
        }
        .send-button {
          padding: 0.75rem 1.5rem;
          background: #C5A059;
          color: #050505;
          border: none;
          border-radius: 2px;
          font-family: var(--font-cinzel), system-ui, sans-serif;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: clamp(0.9rem, 2vmin, 1rem);
        }
        .send-button:hover:not(:disabled) {
          background: #d4af57;
          transform: translateY(-2px);
        }
        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .loading-indicator {
          text-align: center;
          color: #C5A059;
          font-size: 0.9rem;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="chat-wrapper">
        {/* Sidebar */}
        <div className={`sidebar ${!sidebarOpen ? "collapsed" : ""}`}>
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <div className="sidebar-logo">DIVINACI</div>
            <button 
              className="new-chat-btn"
              onClick={() => {
                setMessages([]);
                setInput("");
              }}
              title="Nouvelle conversation"
            >
              <span style={{ fontSize: '1.2rem' }}>✦</span>
              <span>Nouveau Chat</span>
            </button>
          </div>

          {/* Sidebar Content (History) */}
          <div className="sidebar-content">
            <div className="history-section">
              <div className="history-title">Historique</div>
              {messages.length > 0 && (
                <div className="history-item">
                  Session actuelle
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <Link href="/" className="sidebar-button">
              <span>◈</span>
              <span>Accueil</span>
            </Link>
            <button
              className="toggle-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Sceller le sanctuaire" : "Ouvrir le sanctuaire"}
            >
              {sidebarOpen ? "✧" : "✦"}
            </button>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className={`chat-container ${!sidebarOpen ? "sidebar-collapsed" : ""}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <h1>DIVINACI</h1>
          <Link href="/" className="back-link">
            ← Return
          </Link>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#C5A059", opacity: 0.6 }}>
              The sanctum awaits your inquiry...
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && <div className="loading-indicator">Sanctuary is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <form className="input-form" onSubmit={handleSend}>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your intention..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="send-button" disabled={loading}>
              {loading ? "..." : "Transmit"}
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
