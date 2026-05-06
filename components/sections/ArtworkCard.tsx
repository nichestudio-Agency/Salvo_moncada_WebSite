"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Artwork } from "@/lib/artworks";

const categoryLabel: Record<string, string> = {
  pescheria: "Pescheria",
  fruttivendolo: "Fruttivendolo",
  paesaggio: "Paesaggio",
  personalizzato: "Su commissione",
};

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/galleria/${artwork.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#FAF8F4",
          border: `1px solid ${hovered ? "rgba(196,120,58,0.35)" : "rgba(26,21,16,0.10)"}`,
          boxShadow: hovered ? "0 8px 32px rgba(196,120,58,0.08)" : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
          overflow: "hidden",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1/1",
            overflow: "hidden",
            backgroundColor: "#F2EFE9",
          }}
        >
          {artwork.images[0] && !imgError ? (
            <Image
              src={artwork.images[0]}
              alt={artwork.title}
              fill
              style={{
                objectFit: "cover",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.6s ease",
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            /* Placeholder when no image */
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #F2EFE9 0%, #E8E2D8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(196,120,58,0.15), transparent)",
                  border: "1px solid rgba(196,120,58,0.2)",
                }}
              />
            </div>
          )}

          {/* Badge */}
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <span
              style={{
                display: "inline-block",
                padding: "3px 8px",
                fontFamily: "var(--font-inter)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                backgroundColor: artwork.available
                  ? "rgba(240,248,240,0.92)"
                  : "rgba(245,242,238,0.92)",
                color: artwork.available ? "#3d7a45" : "rgba(26,21,16,0.4)",
                border: `1px solid ${artwork.available ? "rgba(61,122,69,0.25)" : "rgba(26,21,16,0.1)"}`,
                backdropFilter: "blur(4px)",
              }}
            >
              {artwork.available ? "Disponibile" : "Non disponibile"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "1.1rem 1.2rem 1.3rem" }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C4783C",
              marginBottom: "0.35rem",
            }}
          >
            {categoryLabel[artwork.category]}
          </p>

          <h3
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.3rem",
              fontWeight: 400,
              color: "#1A1510",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
              marginBottom: "0.3rem",
            }}
          >
            {artwork.title}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.75rem",
              color: "#6B5C4A",
              marginBottom: "0.9rem",
              fontStyle: "italic",
            }}
          >
            {artwork.subtitle}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "0.8rem",
              borderTop: "1px solid rgba(26,21,16,0.08)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.6rem",
                color: "rgba(26,21,16,0.35)",
                letterSpacing: "0.06em",
              }}
            >
              {artwork.dimensions} · {artwork.year}
            </span>

            {artwork.price && (
              <span
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.35rem",
                  fontWeight: 400,
                  color: "#C4783C",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                € {artwork.price}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
