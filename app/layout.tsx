import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";
import Footer from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salvo Moncada — Tegole in Maiolica",
  description:
    "Arte siciliana: scene di vita quotidiana dipinte a mano su maiolica. Pescherie, fruttivendoli, vicoli e paesaggi. Opere uniche disponibili e su commissione.",
  keywords: ["tegole", "maiolica", "arte siciliana", "Salvo Moncada", "artigianato", "Catania"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ClientShell>
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientShell>
      </body>
    </html>
  );
}
