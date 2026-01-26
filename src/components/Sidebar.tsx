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
    >
      <div className="sidebar-surface">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-icon">N</span>
            {!collapsed && <span className="brand-word">USULDIVINACI</span>}
          </div>
          <button className="sidebar-pin" onClick={() => setPinned((p) => !p)} aria-label="Épingler la barre">
            {pinned ? "⏸" : "✚"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`sidebar-item ${pathname === item.href ? "active" : ""}`}>
              <span className="item-icon">{item.icon}</span>
              {!collapsed && <span className="item-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-toggle" onClick={() => setCollapsed((c) => !c)} aria-label="Basculer la barre">
            {collapsed ? "▶" : "◀"}
          </button>
        </div>
      </div>
    </aside>
  );
}
