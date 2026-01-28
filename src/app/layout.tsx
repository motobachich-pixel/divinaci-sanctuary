import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";


import ClientFloatingShaman from "../components/ClientFloatingShaman";

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
        {/* Structure géométrique flottante et communicante */}
        <ClientFloatingShaman intention="Bienvenue dans l'espace Divinaci" intensity={0.3} />
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
