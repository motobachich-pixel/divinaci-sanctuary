"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { label: "Sanctuaire", icon: "◈", href: "/" },
  { label: "Oracle", icon: "✦", href: "/chat" },
  { label: "Rituels", icon: "✧", href: "/rituels" },
  { label: "Archives", icon: "☉", href: "/history" },
  { label: "Profil", icon: "✪", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [pinned, setPinned] = useState(false);

  const targetWidth = useMemo(() => (collapsed ? "78px" : "260px"), [collapsed]);

  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-active-width", targetWidth);
    document.documentElement.style.setProperty("--center-offset", `calc(${targetWidth} / 2)`);
    return () => {
      document.documentElement.style.removeProperty("--sidebar-active-width");
      document.documentElement.style.removeProperty("--center-offset");
    };
  }, [targetWidth]);

  useEffect(() => {
    const decide = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 900) setCollapsed(true);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);

  return (
    <aside
      className={`sidebar-shell ${collapsed ? "is-collapsed" : "is-expanded"} ${pinned ? "is-pinned" : ""}`}
      onMouseEnter={() => {
        if (!pinned) setCollapsed(false);
      }}
      onMouseLeave={() => {
        if (!pinned) setCollapsed(true);
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: targetWidth,
        background: "linear-gradient(180deg, rgba(10,9,7,0.95) 0%, rgba(7,5,10,0.97) 50%, rgba(5,3,7,0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(197, 160, 89, 0.15)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.5), 0 0 40px rgba(197, 160, 89, 0.08)",
        transition: "width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: 99999,
        overflow: "hidden",
      }}
    >
      <div 
        className="sidebar-surface"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 0",
        }}
      >
        <div 
          className="sidebar-top"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem",
            marginBottom: "2rem",
          }}
        >
          <div 
            className="sidebar-brand"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span 
              className="brand-icon"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #C5A059 0%, #8B7340 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "#0a0907",
                boxShadow: "0 4px 12px rgba(197, 160, 89, 0.3)",
                flexShrink: 0,
              }}
            >
              ✦
            </span>
            {!collapsed && (
              <span 
                className="brand-word"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  color: "#C5A059",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 20px rgba(197, 160, 89, 0.3)",
                }}
              >
                DIVINACI
              </span>
            )}
          </div>
          <button 
            className="sidebar-pin" 
            onClick={() => setPinned((p) => !p)} 
            aria-label="Épingler la barre"
            style={{
              background: "transparent",
              border: "none",
              color: pinned ? "#C5A059" : "rgba(197, 160, 89, 0.4)",
              fontSize: "1rem",
              cursor: "pointer",
              padding: "0.5rem",
              transition: "all 0.3s ease",
              opacity: collapsed ? 0 : 1,
            }}
          >
            {pinned ? "📌" : "📍"}
          </button>
        </div>

        <nav 
          className="sidebar-nav"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "0 0.75rem",
            overflowY: "auto",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`sidebar-item ${isActive ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: collapsed ? "0.75rem" : "0.75rem 1rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  background: isActive 
                    ? "linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.08) 100%)"
                    : "transparent",
                  border: isActive 
                    ? "1px solid rgba(197, 160, 89, 0.3)"
                    : "1px solid transparent",
                  boxShadow: isActive 
                    ? "0 4px 16px rgba(197, 160, 89, 0.15), inset 0 1px 0 rgba(197, 160, 89, 0.2)"
                    : "none",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "pointer",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(197, 160, 89, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.2)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <span 
                  className="item-icon"
                  style={{
                    fontSize: "1.2rem",
                    color: isActive ? "#C5A059" : "rgba(197, 160, 89, 0.6)",
                    transition: "all 0.3s ease",
                    textShadow: isActive ? "0 0 12px rgba(197, 160, 89, 0.4)" : "none",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span 
                    className="item-label"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: isActive ? "600" : "400",
                      color: isActive ? "#C5A059" : "rgba(197, 160, 89, 0.7)",
                      whiteSpace: "nowrap",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div 
          className="sidebar-footer"
          style={{
            padding: "0 1rem",
            marginTop: "1rem",
          }}
        >
          <button 
            className="sidebar-toggle" 
            onClick={() => setCollapsed((c) => !c)} 
            aria-label="Basculer la barre"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "rgba(197, 160, 89, 0.1)",
              border: "1px solid rgba(197, 160, 89, 0.2)",
              borderRadius: "10px",
              color: "#C5A059",
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(197, 160, 89, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.4)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(197, 160, 89, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(197, 160, 89, 0.1)";
              e.currentTarget.style.borderColor = "rgba(197, 160, 89, 0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>
      </div>
    </aside>
  );
}
