import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

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
      >
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
