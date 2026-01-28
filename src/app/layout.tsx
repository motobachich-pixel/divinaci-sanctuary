import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";

import dynamic from "next/dynamic";
const ShamanGuide = dynamic(() => import("../components/ShamanGuide"), { ssr: false });

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIVINACI | Usuldivinaci",
  description: "The Kinetic Being - An architectural, empathetic, and structural thought partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${montserrat.variable} antialiased`}
        style={{ position: "relative", minHeight: "100vh" }}
      >
        {/* Merlin chamanique flottant sur toutes les pages */}
        <div style={{ position: "fixed", right: 32, bottom: 32, zIndex: 30, pointerEvents: "none" }}>
          <ShamanGuide />
        </div>
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
