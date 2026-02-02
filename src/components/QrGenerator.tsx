"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrGenerator() {
  const [text, setText] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, margin: "2rem auto", maxWidth: 400 }}>
      <h2>Générateur de QR Code</h2>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Entrez un texte ou une URL..."
        style={{ padding: 8, width: "100%", fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px #0001" }}>
        <QRCodeSVG value={text || "https://divinaci.com"} size={180} fgColor="#222" bgColor="#fff" />
      </div>
    </div>
  );
}
