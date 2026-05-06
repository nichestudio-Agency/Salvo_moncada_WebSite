import GalleryGrid from "@/components/sections/GalleryGrid";
import { getArtworks } from "@/lib/artworks";

export const metadata = {
  title: "Galleria — Salvo Moncada",
  description: "Tutte le tegole in maiolica di Salvo Moncada. Pescherie, fruttivendoli, paesaggi siciliani e opere su commissione.",
};

export default async function GalleriaPage() {
  const artworks = await getArtworks();

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      {/* Header pagina */}
      <div
        style={{
          padding: "8rem clamp(1.5rem, 5vw, 4rem) 3rem",
          borderBottom: "1px solid rgba(26,21,16,0.08)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#C4783C",
            marginBottom: "0.8rem",
          }}
        >
          Collezione
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 300,
            color: "#1A1510",
            lineHeight: 1,
            letterSpacing: "-0.01em",
            marginBottom: "1rem",
          }}
        >
          Le Opere
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.9rem",
            color: "#6B5C4A",
            lineHeight: 1.7,
            maxWidth: "500px",
          }}
        >
          Ogni tegola racconta una storia. Sfoglia la collezione o filtra per categoria.
        </p>
      </div>

      <GalleryGrid artworks={artworks} showFilters />
    </div>
  );
}
