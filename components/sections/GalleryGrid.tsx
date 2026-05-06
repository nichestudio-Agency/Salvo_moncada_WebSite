"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ArtworkCard from "./ArtworkCard";
import type { Artwork, ArtworkCategory } from "@/lib/artworks";

interface GalleryGridProps {
  artworks: Artwork[];
  showFilters?: boolean;
}

const filterOptions: { value: ArtworkCategory | "all"; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "pescheria", label: "Pescheria" },
  { value: "fruttivendolo", label: "Fruttivendolo" },
  { value: "paesaggio", label: "Paesaggio" },
  { value: "personalizzato", label: "Su Commissione" },
];

export default function GalleryGrid({ artworks, showFilters = false }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<ArtworkCategory | "all">("all");

  const filtered =
    activeFilter === "all"
      ? artworks
      : artworks.filter((a) => a.category === activeFilter);

  return (
    <section
      style={{
        background: "#FAF8F4",
        padding: "3rem clamp(1.5rem, 5vw, 4rem) 6rem",
      }}
    >
      {/* Filters */}
      {showFilters && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "3rem",
          }}
        >
          {filterOptions.map(({ value, label }) => {
            const active = activeFilter === value;
            return (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1.1rem",
                  border: active
                    ? "1px solid #C4783C"
                    : "1px solid rgba(26,21,16,0.15)",
                  background: active ? "rgba(196,120,58,0.08)" : "transparent",
                  color: active ? "#C4783C" : "rgba(26,21,16,0.45)",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
          gap: "1.5rem",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((artwork) => (
            <motion.div
              key={artwork.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.85rem",
            color: "rgba(26,21,16,0.4)",
            textAlign: "center",
            padding: "3rem 0",
          }}
        >
          Nessuna opera in questa categoria al momento.
        </p>
      )}
    </section>
  );
}
