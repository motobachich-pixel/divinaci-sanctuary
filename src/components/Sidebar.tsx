"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .app-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: clamp(260px, 20vw, 320px);
          background: linear-gradient(165deg, 
            rgba(15, 12, 8, 0.98) 0%, 
            rgba(8, 6, 4, 0.97) 50%,
            rgba(5, 4, 3, 0.98) 100%);
          backdrop-filter: blur(25px) saturate(1.2);
          border-right: 1px solid rgba(197, 160, 89, 0.2);
          z-index: 100;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(0);
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 30px rgba(0, 0, 0, 0.6),
                      inset -1px 0 0 rgba(197, 160, 89, 0.08);
        }
        .app-sidebar.collapsed {
          transform: translateX(calc(-100% + 60px));
        }
        .app-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(197, 160, 89, 0.4) 50%, 
            transparent 100%);
        }
        .sidebar-header {
          padding: 2rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          border-bottom: 1px solid rgba(197, 160, 89, 0.12);
          position: relative;
        }
        .sidebar-header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(197, 160, 89, 0.3) 50%,
            transparent 100%);
        }
        .sidebar-logo {
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          font-weight: 100;
          letter-spacing: 0.4em;
          color: #C5A059;
          text-align: center;
          filter: drop-shadow(0 0 12px rgba(197, 160, 89, 0.4))
                  drop-shadow(0 0 25px rgba(197, 160, 89, 0.2));
          font-family: var(--font-cinzel), serif;
          text-shadow: 0 0 20px rgba(197, 160, 89, 0.3);
          animation: logoGlow 3s ease-in-out infinite alternate;
        }
        @keyframes logoGlow {
          0% { 
            filter: drop-shadow(0 0 12px rgba(197, 160, 89, 0.4))
                    drop-shadow(0 0 25px rgba(197, 160, 89, 0.2)); 
          }
          100% { 
            filter: drop-shadow(0 0 16px rgba(197, 160, 89, 0.6))
                    drop-shadow(0 0 35px rgba(197, 160, 89, 0.3)); 
          }
        }
        .sidebar-subtitle {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: rgba(197, 160, 89, 0.6);
          text-align: center;
          font-weight: 100;
          text-transform: uppercase;
          font-family: var(--font-cinzel), serif;
        }
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .sidebar-content::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-content::-webkit-scrollbar-track {
          background: rgba(197, 160, 89, 0.03);
          border-radius: 3px;
        }
        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.25);
          border-radius: 3px;
        }
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.45);
        }
        .nav-section {
          margin-bottom: 0.8rem;
        }
        .nav-title {
          font-size: 0.7rem;
          font-weight: 100;
          letter-spacing: 0.15em;
          color: rgba(197, 160, 89, 0.5);
          margin-bottom: 0.8rem;
          padding: 0 0.8rem;
          text-transform: uppercase;
          font-family: var(--font-cinzel), serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-title::before {
          content: '';
          width: 20px;
          height: 1px;
          background: linear-gradient(90deg, 
            rgba(197, 160, 89, 0.3),
            transparent);
        }
        .nav-link {
          width: 100%;
          padding: 1rem 1.2rem;
          background: rgba(197, 160, 89, 0.03);
          border: 1px solid rgba(197, 160, 89, 0.08);
          border-radius: 12px;
          color: rgba(197, 160, 89, 0.75);
          cursor: pointer;
          font-family: var(--font-cinzel), serif;
          font-weight: 100;
          letter-spacing: 0.08em;
          font-size: clamp(0.85rem, 1vw, 0.95rem);
          display: flex;
          align-items: center;
          gap: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        .nav-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, 
            rgba(197, 160, 89, 0.8),
            rgba(197, 160, 89, 0.4));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .nav-link:hover {
          background: rgba(197, 160, 89, 0.1);
          border-color: rgba(197, 160, 89, 0.25);
          color: #C5A059;
          transform: translateX(6px);
          box-shadow: 0 4px 15px rgba(197, 160, 89, 0.15);
        }
        .nav-link:hover::before {
          opacity: 1;
        }
        .nav-link.active {
          background: linear-gradient(135deg, 
            rgba(197, 160, 89, 0.2) 0%, 
            rgba(197, 160, 89, 0.12) 100%);
          border-color: rgba(197, 160, 89, 0.35);
          color: #D4AF6A;
          box-shadow: inset 0 1px 3px rgba(197, 160, 89, 0.15),
                      0 4px 12px rgba(197, 160, 89, 0.15);
        }
        .nav-link.active::before {
          opacity: 1;
        }
        .nav-icon {
          font-size: 1.3rem;
          opacity: 0.9;
          filter: drop-shadow(0 0 8px rgba(197, 160, 89, 0.3));
          transition: all 0.3s ease;
        }
        .nav-link:hover .nav-icon,
        .nav-link.active .nav-icon {
          filter: drop-shadow(0 0 12px rgba(197, 160, 89, 0.5));
          transform: scale(1.1);
        }
        .toggle-sidebar-btn {
          width: 60px;
          height: 80px;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, 
            rgba(20, 15, 10, 0.98) 0%,
            rgba(12, 10, 7, 0.97) 100%);
          border: 1px solid rgba(197, 160, 89, 0.3);
          border-radius: 0 16px 16px 0;
          border-left: none;
          color: #C5A059;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0.4rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-cinzel), serif;
          font-weight: 100;
          letter-spacing: 0.12em;
          font-size: 1.4rem;
          box-shadow: 3px 0 15px rgba(0, 0, 0, 0.4);
          z-index: 101;
          backdrop-filter: blur(15px);
        }
        .toggle-sidebar-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(197, 160, 89, 0.15),
            transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 0 16px 16px 0;
        }
        .toggle-sidebar-btn span:last-child {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          opacity: 0.8;
        }
        .toggle-sidebar-btn:hover {
          background: linear-gradient(135deg, 
            rgba(25, 20, 12, 0.98) 0%,
            rgba(15, 12, 8, 0.97) 100%);
          border-color: #C5A059;
          box-shadow: 3px 0 25px rgba(197, 160, 89, 0.3),
                      inset 0 0 20px rgba(197, 160, 89, 0.1);
          transform: translateY(-50%) translateX(3px);
        }
        .toggle-sidebar-btn:hover::before {
          opacity: 1;
        }
        .toggle-sidebar-btn:active {
          transform: translateY(-50%) scale(0.96);
        }
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 99;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(2px);
        }
        .sidebar-overlay.visible {
          opacity: 1;
          pointer-events: all;
        }
        .sidebar-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(197, 160, 89, 0.2) 50%,
            transparent 100%);
          margin: 0.5rem 0;
        }
        @media (max-width: 768px) {
          .app-sidebar {
            width: 300px;
          }
          .app-sidebar.collapsed {
            transform: translateX(calc(-100% + 55px));
          }
          .toggle-sidebar-btn {
            width: 55px;
            height: 70px;
          }
        }
      `}</style>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={`app-sidebar ${!isOpen ? 'collapsed' : ''}`}>
        {/* Toggle Button - Always visible */}
        <button
          className="toggle-sidebar-btn"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Sceller le sanctuaire" : "Ouvrir le sanctuaire"}
        >
          <span>{isOpen ? "✧" : "✦"}</span>
          <span>{isOpen ? "SCELLER" : "OUVRIR"}</span>
        </button>

        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">USULDIVINACI</div>
          <div className="sidebar-subtitle">Le Sanctuaire Mystique</div>
        </div>

        {/* Content / Navigation */}
        <div className="sidebar-content">
          <div className="nav-section">
            <div className="nav-title">
              <span>Portails</span>
            </div>
            <Link 
              href="/" 
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-icon">◈</span>
              <span>Sanctuaire</span>
            </Link>
            <Link 
              href="/chat" 
              className={`nav-link ${pathname === '/chat' ? 'active' : ''}`}
            >
              <span className="nav-icon">✦</span>
              <span>Oracle</span>
            </Link>
          </div>

          <div className="sidebar-divider"></div>

          <div className="nav-section">
            <div className="nav-title">
              <span>Rituels</span>
            </div>
            <button 
              className="nav-link"
              onClick={() => {
                if (pathname === '/chat') {
                  window.location.reload();
                } else {
                  window.location.href = '/chat';
                }
              }}
            >
              <span className="nav-icon">⟳</span>
              <span>Nouvelle Séance</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
