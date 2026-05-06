import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";

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

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salvo Moncada — Tegole in Maiolica",
  description:
    "Arte siciliana: scene di vita quotidiana dipinte a mano su maiolica. Opere uniche disponibili e su commissione.",
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
      className={`${cormorant.variable} ${inter.variable} ${dancing.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
