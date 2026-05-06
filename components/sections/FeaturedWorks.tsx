import Link from "next/link";
import type { Artwork } from "@/lib/artworks";
import ArtworkCard from "./ArtworkCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface FeaturedWorksProps {
  artworks: Artwork[];
}

export default function FeaturedWorks({ artworks }: FeaturedWorksProps) {
  return (
    <section
      style={{
        background: "#FAF8F4",
        padding: "6rem clamp(1.5rem, 5vw, 4rem) 5rem",
      }}
    >
      {/* Header */}
      <AnimatedSection
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C4783C",
              marginBottom: "0.6rem",
            }}
          >
            Opere in Evidenza
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 300,
              color: "#1A1510",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            Dalla Bottega
          </h2>
        </div>

        <Link
          href="/galleria"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#C4783C",
            textDecoration: "none",
            borderBottom: "1px solid rgba(196,120,58,0.35)",
            paddingBottom: "2px",
            whiteSpace: "nowrap",
          }}
        >
          Vedi tutta la galleria →
        </Link>
      </AnimatedSection>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
          gap: "1.5rem",
        }}
      >
        {artworks.map((artwork, i) => (
          <AnimatedSection key={artwork.slug} delay={i * 0.1}>
            <ArtworkCard artwork={artwork} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
