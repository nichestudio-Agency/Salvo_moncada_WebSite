import Link from "next/link";
import { readArtworks } from "@/lib/data";
import { deleteArtwork } from "@/lib/actions";

export const dynamic = "force-dynamic";

const categoryLabel: Record<string, string> = {
  pescheria: "Pescheria",
  fruttivendolo: "Fruttivendolo",
  paesaggio: "Paesaggio",
  personalizzato: "Su commissione",
};

export default async function AdminProdottiPage() {
  const artworks = await readArtworks();

  return (
    <div style={{ maxWidth: 1000 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2.2rem",
              fontWeight: 300,
              color: "#1A1510",
              marginBottom: "0.3rem",
            }}
          >
            Prodotti
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
            {artworks.length} opere in catalogo
          </p>
        </div>
        <Link
          href="/admin/prodotti/nuovo"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.68rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "0.7rem 1.4rem",
            background: "#C4783C",
            color: "#FAF8F4",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          + Aggiungi opera
        </Link>
      </div>

      <div
        style={{
          border: "1px solid rgba(26,21,16,0.1)",
          background: "#FFFFFF",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(26,21,16,0.08)" }}>
              {["Titolo", "Categoria", "Dimensioni", "Prezzo", "Stato", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(26,21,16,0.35)",
                    padding: "0.85rem 1rem",
                    textAlign: "left",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {artworks.map((artwork, i) => (
              <tr
                key={artwork.slug}
                style={{
                  borderBottom: i < artworks.length - 1 ? "1px solid rgba(26,21,16,0.06)" : "none",
                }}
              >
                <td style={{ padding: "0.85rem 1rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.85rem",
                      color: "#1A1510",
                      marginBottom: "0.1rem",
                    }}
                  >
                    {artwork.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.68rem",
                      color: "rgba(26,21,16,0.35)",
                      fontStyle: "italic",
                    }}
                  >
                    {artwork.slug}
                  </p>
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.62rem",
                      color: "rgba(26,21,16,0.5)",
                    }}
                  >
                    {categoryLabel[artwork.category]}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.78rem",
                      color: "rgba(26,21,16,0.5)",
                    }}
                  >
                    {artwork.dimensions}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.1rem",
                      color: artwork.price ? "#C4783C" : "rgba(26,21,16,0.25)",
                    }}
                  >
                    {artwork.price ? `€ ${artwork.price}` : "—"}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      background: artwork.available ? "rgba(61,122,69,0.08)" : "rgba(26,21,16,0.04)",
                      color: artwork.available ? "#3d7a45" : "rgba(26,21,16,0.35)",
                      border: `1px solid ${artwork.available ? "rgba(61,122,69,0.2)" : "rgba(26,21,16,0.1)"}`,
                    }}
                  >
                    {artwork.available ? "Disponibile" : "Non disp."}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <Link
                      href={`/admin/prodotti/${artwork.slug}`}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#C4783C",
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(196,120,58,0.3)",
                        paddingBottom: "1px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Modifica
                    </Link>
                    <form
                      action={deleteArtwork.bind(null, artwork.slug)}
                      onSubmit={(e) => {
                        if (!confirm(`Eliminare "${artwork.title}"?`)) e.preventDefault();
                      }}
                    >
                      <button
                        type="submit"
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(185,64,64,0.7)",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(185,64,64,0.2)",
                          paddingBottom: "1px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Elimina
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {artworks.length === 0 && (
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.82rem",
              color: "rgba(26,21,16,0.35)",
              textAlign: "center",
              padding: "3rem 1rem",
            }}
          >
            Nessuna opera in catalogo. Aggiungi la prima!
          </p>
        )}
      </div>
    </div>
  );
}
