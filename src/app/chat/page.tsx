
"use client";
import Image from "next/image";

export default function Chat() {
  return (
    <main style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #0a0907 0%, #050505 50%, #0a0907 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 1rem"
    }}>
      <section style={{
        background: "rgba(10,9,7,0.96)",
        borderRadius: 20,
        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
        padding: "3rem 2rem 2.5rem 2rem",
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
        margin: "2rem 0"
      }}>
        <Image
          src="/under-construction.png"
          alt="Chat Under Construction"
          width={160}
          height={160}
          style={{ margin: "0 auto 1.5rem auto", borderRadius: "14px", boxShadow: "0 4px 24px rgba(197,160,89,0.15)" }}
        />
        <h1 style={{
          fontFamily: "var(--font-cinzel), serif",
          color: "#C5A059",
          fontWeight: 700,
          fontSize: "2.1rem",
          letterSpacing: "0.09em",
          marginBottom: "1.1rem"
        }}>
          Espace Chat en rénovation
        </h1>
        <p style={{
          color: "#e9e0c9",
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "1.13rem",
          marginBottom: "1.7rem"
        }}>
          Le chat sera bientôt de retour avec de nouvelles fonctionnalités.<br />
          <span style={{ color: "#C5A059", fontWeight: 500 }}>Merci de votre patience !</span>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <a
            href="mailto:contact@usuldivinaci.com"
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #C5A059 60%, #e9e0c9 100%)",
              color: "#0a0907",
              fontFamily: "var(--font-cinzel), serif",
              fontWeight: 600,
              fontSize: "1.08rem",
              borderRadius: 30,
              padding: "0.7rem 2.2rem",
              textDecoration: "none",
              boxShadow: "0 2px 12px rgba(197,160,89,0.13)",
              marginTop: 18,
              transition: "background 0.2s"
            }}
          >
            Me contacter : contact@usuldivinaci.com
          </a>
          <a
            href="mailto:usuldivinaci@gmail.com"
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #C5A059 60%, #e9e0c9 100%)",
              color: "#0a0907",
              fontFamily: "var(--font-cinzel), serif",
              fontWeight: 600,
              fontSize: "1.08rem",
              borderRadius: 30,
              padding: "0.7rem 2.2rem",
              textDecoration: "none",
              boxShadow: "0 2px 12px rgba(197,160,89,0.13)",
              marginTop: 0,
              transition: "background 0.2s"
            }}
          >
            Me contacter : usuldivinaci@gmail.com
          </a>
        </div>
        <div style={{
          color: "#C5A059",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "1.05rem",
          fontWeight: 300,
          marginTop: "2.2rem"
        }}>
          USULDIVINACI · Guidance · Géométrie · Lumière
        </div>
      </section>
    </main>
  );
}

