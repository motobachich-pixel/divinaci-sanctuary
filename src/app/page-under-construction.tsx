import Image from "next/image";
import { useContext } from "react";
import { LangContext } from "../components/LangProvider";

export default function Home() {
  const { t } = useContext(LangContext);
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #0a0907 0%, #050505 50%, #0a0907 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }}>
      <div style={{
        zIndex: 2,
        background: "rgba(10,9,7,0.92)",
        borderRadius: "18px",
        boxShadow: "0 2px 32px 0 rgba(0,0,0,0.12)",
        padding: "2.5rem 1.5rem",
        maxWidth: 420,
        textAlign: "center"
      }}>
        <h1 style={{
          fontFamily: "var(--font-cinzel), serif",
          color: "#C5A059",
          fontWeight: 400,
          fontSize: "2.2rem",
          letterSpacing: "0.08em",
          marginBottom: "1.2rem"
        }}>
          {t?.home?.title || "DIVINACI"}
        </h1>
        <p style={{
          color: "#e9e0c9",
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "1.1rem",
          marginBottom: "1.5rem"
        }}>
          {t?.home?.subtitle || "A new divinatory experience is coming soon."}
        </p>
        <Image
          src="/under-construction.png"
          alt="Under Construction"
          width={220}
          height={220}
          style={{ margin: "0 auto 1.5rem auto", borderRadius: "12px", boxShadow: "0 4px 24px rgba(197,160,89,0.15)" }}
        />
        <div style={{
          color: "#C5A059",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "1.1rem",
          fontWeight: 300,
          marginTop: "1.2rem"
        }}>
          {t?.home?.celestialWisdom?.[0] || "The stars are aligning..."}
        </div>
        <div style={{
          color: "#e9e0c9",
          fontSize: "0.95rem",
          marginTop: "1.5rem",
          opacity: 0.7
        }}>
          USULDIVINACI spirit · Geometry · Wisdom · Light
        </div>
      </div>
    </div>
  );
}
