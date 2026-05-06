import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArtworkBySlug } from "@/lib/artworks";

export const dynamic = "force-dynamic";

const categoryLabel: Record<string, string> = {
  pescheria: "Pescheria",
  fruttivendolo: "Fruttivendolo",
  paesaggio: "Paesaggio",
  personalizzato: "Su commissione",
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const artwork = await getArtworkBySlug(slug);
  return {
    title: artwork ? `${artwork.title} — Salvo Moncada` : "Opera non trovata",
    description: artwork?.description,
  };
}

export default async function OperaPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) notFound();

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      {/* Full-bleed hero image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "70vh",
          minHeight: 400,
          background: "#0C0A07",
          overflow: "hidden",
        }}
      >
        {artwork.images[0] && (
          <Image
            src={artwork.images[0]}
            alt={artwork.title}
            fill
            priority
            style={{ objectFit: "cover", opacity: 0.7 }}
          />
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(12,10,7,0.85) 0%, transparent 60%)",
          }}
        />
        {/* Title overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "clamp(1.5rem, 5vw, 4rem)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.55rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(196,120,58,0.8)",
              marginBottom: "0.5rem",
            }}
          >
            {categoryLabel[artwork.category]}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 300,
              color: "rgba(237,232,224,0.95)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {artwork.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "4rem clamp(1.5rem, 5vw, 4rem) 6rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3rem",
        }}
        className="lg:grid-cols-[1.5fr_1fr]"
      >
        {/* Left: info */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.1rem",
              fontStyle: "italic",
              color: "#6B5C4A",
              marginBottom: "1.5rem",
            }}
          >
            {artwork.subtitle}
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.9rem",
              color: "#6B5C4A",
              lineHeight: 1.85,
              marginBottom: "2.5rem",
            }}
          >
            {artwork.description}
          </p>

          {/* Details row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(26,21,16,0.1)",
            }}
          >
            {[
              { label: "Anno", value: String(artwork.year) },
              { label: "Dimensioni", value: artwork.dimensions },
              { label: "Tecnica", value: artwork.technique },
            ].map(({ label, value }) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(26,21,16,0.35)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.85rem",
                    color: "#1A1510",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: price + CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Price */}
          {artwork.price && (
            <div
              style={{
                padding: "1.5rem",
                border: "1px solid rgba(26,21,16,0.1)",
                background: "#FFFFFF",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(26,21,16,0.35)",
                  marginBottom: "0.5rem",
                }}
              >
                Prezzo
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "3rem",
                  fontWeight: 300,
                  color: "#C4783C",
                  lineHeight: 1,
                  marginBottom: "0.8rem",
                }}
              >
                € {artwork.price}
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  backgroundColor: artwork.available
                    ? "rgba(240,248,240,0.9)"
                    : "rgba(245,242,238,0.9)",
                  color: artwork.available ? "#3d7a45" : "rgba(26,21,16,0.4)",
                  border: `1px solid ${artwork.available ? "rgba(61,122,69,0.25)" : "rgba(26,21,16,0.1)"}`,
                }}
              >
                {artwork.available ? "Disponibile" : "Non disponibile"}
              </span>
            </div>
          )}

          {/* CTAs */}
          {artwork.available ? (
            <Link
              href="/ordina"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.9rem 1.5rem",
                background: "#C4783C",
                color: "#FAF8F4",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              Acquista questa opera →
            </Link>
          ) : (
            <Link
              href="/ordina"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.9rem 1.5rem",
                background: "#C4783C",
                color: "#FAF8F4",
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              Ordina un&apos;opera simile →
            </Link>
          )}

          <Link
            href="/galleria"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.9rem 1.5rem",
              border: "1px solid rgba(26,21,16,0.18)",
              color: "rgba(26,21,16,0.55)",
              textDecoration: "none",
              textAlign: "center",
              display: "block",
            }}
          >
            ← Torna alla Galleria
          </Link>
        </div>
      </div>
    </div>
  );
}
