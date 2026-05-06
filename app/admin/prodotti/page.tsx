import Link from "next/link";
import { getOpere } from "@/lib/supabase/db";
import { deleteArtwork } from "@/lib/actions";

export const dynamic = "force-dynamic";

const categoriaLabel: Record<string, string> = {
  pescheria:     "Pescheria",
  fruttivendolo: "Fruttivendolo",
  paesaggio:     "Paesaggio",
  personalizzato: "Su commissione",
};

const disponibilitaLabel: Record<string, { label: string; color: string; bg: string; border: string }> = {
  disponibile:    { label: "Disponibile",   color: "#3d7a45", bg: "rgba(61,122,69,0.08)",  border: "rgba(61,122,69,0.2)" },
  venduta:        { label: "Venduta",        color: "#b94040", bg: "rgba(185,64,64,0.08)",  border: "rgba(185,64,64,0.2)" },
  riservata:      { label: "Riservata",      color: "#b07a10", bg: "rgba(176,122,16,0.08)", border: "rgba(176,122,16,0.2)" },
  non_in_vendita: { label: "Non in vendita", color: "rgba(26,21,16,0.4)", bg: "rgba(26,21,16,0.04)", border: "rgba(26,21,16,0.1)" },
};

export default async function AdminProdottiPage() {
  const opere = await getOpere().catch(() => []);

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#1A1510", marginBottom: "0.3rem" }}>
            Prodotti
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
            {opere.length} {opere.length === 1 ? "opera in catalogo" : "opere in catalogo"}
          </p>
        </div>
        <Link href="/admin/prodotti/nuovo" style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.7rem 1.4rem", background: "#C4783C", color: "#FAF8F4", textDecoration: "none", whiteSpace: "nowrap" }}>
          + Aggiungi opera
        </Link>
      </div>

      <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(26,21,16,0.08)" }}>
              {["", "Titolo", "Categoria", "Dimensioni", "Prezzo", "Stato", ""].map((h) => (
                <th key={h} style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", padding: "0.85rem 1rem", textAlign: "left", fontWeight: 400, whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opere.map((opera, i) => {
              const dispo = disponibilitaLabel[opera.disponibilita] ?? disponibilitaLabel.non_in_vendita;
              return (
                <tr key={opera.slug} style={{ borderBottom: i < opere.length - 1 ? "1px solid rgba(26,21,16,0.06)" : "none" }}>
                  <td style={{ padding: "0.75rem 0.75rem 0.75rem 1rem", width: 52 }}>
                    <div style={{ width: 40, height: 40, background: "#ede6dc", flexShrink: 0, overflow: "hidden" }}>
                      {opera.immagini[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={opera.immagini[0]} alt={opera.titolo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : null}
                    </div>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "#1A1510", marginBottom: "0.1rem" }}>
                      {opera.titolo}
                      {opera.in_evidenza && (
                        <span style={{ marginLeft: "0.5rem", fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C4783C", background: "rgba(196,120,58,0.1)", border: "1px solid rgba(196,120,58,0.25)", padding: "1px 6px", borderRadius: 999 }}>
                          evidenza
                        </span>
                      )}
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", color: "rgba(26,21,16,0.35)", fontStyle: "italic" }}>
                      {opera.slug}
                    </p>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.62rem", color: "rgba(26,21,16,0.5)" }}>
                      {categoriaLabel[opera.categoria] ?? opera.categoria}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(26,21,16,0.5)" }}>
                      {opera.dimensioni || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: opera.prezzo ? "#C4783C" : "rgba(26,21,16,0.25)" }}>
                      {opera.prezzo ? `€ ${opera.prezzo}` : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", background: dispo.bg, color: dispo.color, border: `1px solid ${dispo.border}` }}>
                      {dispo.label}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <Link href={`/admin/prodotti/${opera.slug}`} style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4783C", textDecoration: "none", borderBottom: "1px solid rgba(196,120,58,0.3)", paddingBottom: "1px", whiteSpace: "nowrap" }}>
                        Modifica
                      </Link>
                      <form action={deleteArtwork.bind(null, opera.slug)}>
                        <button type="submit" style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(185,64,64,0.7)", background: "none", border: "none", padding: 0, cursor: "pointer", borderBottom: "1px solid rgba(185,64,64,0.2)", paddingBottom: "1px", whiteSpace: "nowrap" }}>
                          Elimina
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {opere.length === 0 && (
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "rgba(26,21,16,0.35)", textAlign: "center", padding: "3rem 1rem" }}>
            Nessuna opera in catalogo. Aggiungi la prima!
          </p>
        )}
      </div>
    </div>
  );
}
