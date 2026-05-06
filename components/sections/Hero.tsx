"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "#0C0A07",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/artworks/hero-tile.jpg"
          alt="Tegola in maiolica di Salvo Moncada"
          fill
          priority
          style={{ objectFit: "cover", opacity: 0.25 }}
          onError={() => {}}
        />
      </div>

      {/* Overlay gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(110deg, rgba(12,10,7,0.85) 0%, rgba(12,10,7,0.6) 50%, rgba(12,10,7,0.4) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 clamp(2rem, 8vw, 8rem)",
          maxWidth: "780px",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.6rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(196,120,58,0.8)",
            marginBottom: "1.5rem",
          }}
        >
          — Arte Siciliana · Tegole in Maiolica
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(3.2rem, 8vw, 6.5rem)",
            fontWeight: 300,
            color: "rgba(237,232,224,0.95)",
            lineHeight: 0.92,
            letterSpacing: "-0.01em",
            marginBottom: "1.8rem",
          }}
        >
          Storie di Sicilia
          <br />
          <span style={{ color: "rgba(196,120,58,0.85)" }}>in Maiolica</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
            color: "rgba(237,232,224,0.5)",
            lineHeight: 1.75,
            maxWidth: "460px",
            marginBottom: "2.5rem",
          }}
        >
          Ogni tegola è un frammento di vita quotidiana siciliana. Pescherie,
          fruttivendoli, vicoli e sagre dipinti a mano su maiolica. Opere uniche
          che raccontano la Sicilia vera.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <Link
            href="/galleria"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.85rem 2rem",
              background: "#C4783C",
              color: "#FAF8F4",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            Scopri le Opere
          </Link>
          <Link
            href="/ordina"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.85rem 2rem",
              border: "1px solid rgba(237,232,224,0.25)",
              color: "rgba(237,232,224,0.65)",
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            Ordina un&apos;Opera
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(237,232,224,0.25)",
          }}
        >
          Scorri
        </span>
        <div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(to bottom, rgba(196,120,58,0.5), transparent)",
            animation: "bounce-y 1.8s ease-in-out infinite",
          }}
        />
      </motion.div>
    </section>
  );
}
