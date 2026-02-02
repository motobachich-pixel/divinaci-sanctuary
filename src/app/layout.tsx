import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";



import ClientFloatingShaman from "../components/ClientFloatingShaman";
import GeometryCanvasBackground from "../components/GeometryCanvasBackground";
import Sidebar from "../components/Sidebar";
import LanguageSelector from "../components/LanguageSelector";
import { LangProvider } from "../components/LangProvider";

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
  title: "USULDIVINACI",
  description: "The Kinetic Being - An architectural, empathetic, and structural thought partner",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${montserrat.variable} antialiased`}
        style={{ position: "relative", minHeight: "100vh" }}
      >
        {/* Animated geometry-canvas background for all pages */}
        <style>{`
          .geometry-canvas-global {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            min-width: 100vw;
            min-height: 100vh;
            max-width: 100vw;
            max-height: 100vh;
            z-index: 0;
            pointer-events: none;
            object-fit: cover;
            background: linear-gradient(135deg, rgba(10,9,7,0.98) 0%, rgba(7,5,10,0.98) 50%, rgba(5,3,7,0.98) 100%);
          }
        `}</style>
        <LangProvider>
          <LanguageSelector />
          <Sidebar />
          <GeometryCanvasBackground />
          <main className="page-content" style={{ position: "relative", zIndex: 1, marginLeft: 56 }}>{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
