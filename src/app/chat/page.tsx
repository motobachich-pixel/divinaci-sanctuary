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
          width: clamp(8vmin, 15vmin, 200px);
          background: rgba(5, 5, 5, 0.95);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(197, 160, 89, 0.2);
          z-index: 100;
          transition: transform 0.3s ease;
          transform: translateX(0);
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .sidebar.collapsed {
          transform: translateX(-100%);
        }
        .sidebar-logo {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-size: clamp(0.7rem, 2vmin, 1rem);
          font-weight: 100;
          letter-spacing: 0.15em;
          color: #C5A059;
          opacity: 0.7;
          transform: rotate(180deg);
          white-space: nowrap;
          animation: slideInLeft 0.5s ease;
        }
        .sidebar-button {
          width: clamp(6vmin, 12vmin, 150px);
          height: clamp(6vmin, 12vmin, 150px);
          background: rgba(197, 160, 89, 0.15);
          border: 1px solid rgba(197, 160, 89, 0.4);
          border-radius: 4px;
          color: #C5A059;
          cursor: pointer;
          font-family: var(--font-cinzel), system-ui, sans-serif;
          font-weight: 100;
          letter-spacing: 0.1em;
          font-size: clamp(0.7rem, 2vmin, 0.9rem);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          animation: slideInLeft 0.5s ease 0.1s backwards;
        }
        .sidebar-button:hover {
          background: rgba(197, 160, 89, 0.3);
          border-color: #C5A059;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.3);
        }
        .toggle-sidebar {
          position: fixed;
          left: clamp(8vmin, 15vmin, 200px);
          top: 1.5rem;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(197, 160, 89, 0.15);
          border: 1px solid rgba(197, 160, 89, 0.4);
          border-radius: 4px;
          color: #C5A059;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 105;
        }
        .toggle-sidebar:hover {
          background: rgba(197, 160, 89, 0.3);
          border-color: #C5A059;
        }
        .chat-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-left: clamp(8vmin, 15vmin, 200px);
          height: 100vh;
          background: #050505;
          color: #e5e5e5;
          font-family: var(--font-cinzel), system-ui, sans-serif;
          transition: margin-left 0.3s ease;
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
          <div className="sidebar-logo">DIVINACI</div>
          <Link href="/" className="sidebar-button">
            ◈ HOME
          </Link>
        </div>

        {/* Toggle Button */}
        <button
          className="toggle-sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarOpen ? "◄" : "►"}
        </button>

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
