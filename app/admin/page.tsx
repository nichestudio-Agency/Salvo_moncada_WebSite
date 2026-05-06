import Link from "next/link";
import { getOpere, getOrdini, getMessaggi } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

const statusColor: Record<string, { bg: string; color: string; border: string }> = {
  nuovo:            { bg: "rgba(196,120,58,0.1)",  color: "#C4783C", border: "rgba(196,120,58,0.25)" },
  "in-lavorazione": { bg: "rgba(61,100,180,0.08)", color: "#3d64b4", border: "rgba(61,100,180,0.2)"  },
  completato:       { bg: "rgba(61,122,69,0.08)",  color: "#3d7a45", border: "rgba(61,122,69,0.2)"   },
};
const statusLabel: Record<string, string> = {
  nuovo: "Nuovo", "in-lavorazione": "In lavorazione", completato: "Completato",
};

function StatCard({ label, value, href, highlight = false, sub }: {
  label: string; value: string | number; href: string; highlight?: boolean; sub?: string
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        background: "#FFFFFF",
        border: `1px solid ${highlight ? "rgba(196,120,58,0.4)" : "rgba(26,21,16,0.1)"}`,
        padding: "1.2rem 1.4rem",
        transition: "border-color 0.2s",
      }}>
        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.6rem", fontWeight: 300, color: highlight ? "#C4783C" : "#1A1510", lineHeight: 1, marginBottom: "0.35rem" }}>
          {value}
        </p>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(26,21,16,0.4)" }}>
          {label}
        </p>
        {sub && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", color: "rgba(26,21,16,0.35)", marginTop: "0.3rem" }}>{sub}</p>}
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [opere, ordini, messaggi] = await Promise.all([
    getOpere().catch(() => []),
    getOrdini().catch(() => []),
    getMessaggi().catch(() => []),
  ]);

  const disponibili    = opere.filter((o) => o.disponibilita === "disponibile");
  const nuoviOrdini    = ordini.filter((o) => o.status === "nuovo").length;
  const inLavorazione  = ordini.filter((o) => o.status === "in-lavorazione").length;
  const nonLetti       = messaggi.filter((m) => !m.letto).length;
  const valoreDisp     = disponibili.reduce((s, o) => s + (o.prezzo ?? 0), 0);

  const recentOrdini   = ordini.slice(0, 4);
  const ultimeOpere    = opere.slice(0, 3);

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#1A1510", marginBottom: "0.3rem" }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
          Panoramica del sito
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        <StatCard label="Opere totali"   value={opere.length}       href="/admin/prodotti" />
        <StatCard label="Disponibili"    value={disponibili.length} href="/admin/prodotti" highlight={disponibili.length > 0}
          sub={valoreDisp > 0 ? `€ ${valoreDisp.toLocaleString("it-IT")}` : undefined} />
        <StatCard label="Ordini totali"  value={ordini.length}      href="/admin/ordini" />
        <StatCard label="Nuovi ordini"   value={nuoviOrdini}        href="/admin/ordini"  highlight={nuoviOrdini > 0} />
        <StatCard label="In lavorazione" value={inLavorazione}      href="/admin/ordini" />
        <StatCard label="Messaggi nuovi" value={nonLetti}           href="/admin/messaggi" highlight={nonLetti > 0} />
      </div>

      {/* ── Azioni rapide ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", marginBottom: "0.8rem" }}>
          Azioni rapide
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/admin/prodotti/nuovo" style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.7rem 1.4rem", background: "#C4783C", color: "#FAF8F4", textDecoration: "none" }}>
            + Aggiungi opera
          </Link>
          <Link href="/admin/ordini" style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.7rem 1.4rem", border: "1px solid rgba(26,21,16,0.2)", color: "rgba(26,21,16,0.6)", textDecoration: "none" }}>
            Vedi ordini
          </Link>
          <Link href="/admin/messaggi" style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.7rem 1.4rem", border: `1px solid ${nonLetti > 0 ? "rgba(196,120,58,0.4)" : "rgba(26,21,16,0.2)"}`, color: nonLetti > 0 ? "#C4783C" : "rgba(26,21,16,0.6)", textDecoration: "none" }}>
            Messaggi {nonLetti > 0 ? `(${nonLetti})` : ""}
          </Link>
          <Link href="/admin/statistiche" style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.7rem 1.4rem", border: "1px solid rgba(26,21,16,0.2)", color: "rgba(26,21,16,0.6)", textDecoration: "none" }}>
            Statistiche →
          </Link>
        </div>
      </div>

      {/* ── Ultime opere aggiunte ── */}
      {ultimeOpere.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)" }}>
              Ultime opere aggiunte
            </p>
            <Link href="/admin/prodotti" style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C4783C", textDecoration: "none" }}>
              Vedi tutte →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {ultimeOpere.map((opera) => (
              <Link key={opera.id} href={`/admin/prodotti/${opera.slug}`} style={{ textDecoration: "none", display: "flex", gap: "1rem", background: "#FFFFFF", border: "1px solid rgba(26,21,16,0.1)", padding: "1rem" }}>
                <div style={{ width: 64, height: 64, flexShrink: 0, background: "#ede6dc", overflow: "hidden" }}>
                  {opera.immagini[0] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={opera.immagini[0]} alt={opera.titolo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", color: "rgba(26,21,16,0.25)" }}>—</span>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "#1A1510", fontWeight: 500, marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {opera.titolo}
                  </p>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", color: "rgba(26,21,16,0.4)", marginBottom: "0.4rem" }}>
                    {opera.tecnica || "—"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 6px", background: opera.disponibilita === "disponibile" ? "rgba(61,122,69,0.08)" : opera.disponibilita === "venduta" ? "rgba(185,64,64,0.08)" : "rgba(26,21,16,0.06)", color: opera.disponibilita === "disponibile" ? "#3d7a45" : opera.disponibilita === "venduta" ? "#b94040" : "rgba(26,21,16,0.4)", border: `1px solid ${opera.disponibilita === "disponibile" ? "rgba(61,122,69,0.2)" : opera.disponibilita === "venduta" ? "rgba(185,64,64,0.2)" : "rgba(26,21,16,0.1)"}` }}>
                      {opera.disponibilita === "disponibile" ? "Disponibile" : opera.disponibilita === "venduta" ? "Venduta" : opera.disponibilita === "riservata" ? "Riservata" : "Non in vendita"}
                    </span>
                    {opera.prezzo && (
                      <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", color: "#C4783C" }}>€ {opera.prezzo}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Ultimi ordini ── */}
      {recentOrdini.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)" }}>
              Ultimi ordini
            </p>
            <Link href="/admin/ordini" style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C4783C", textDecoration: "none" }}>
              Vedi tutti →
            </Link>
          </div>
          <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF" }}>
            {recentOrdini.map((ordine, i) => {
              const sc = statusColor[ordine.status] ?? statusColor.completato;
              return (
                <div key={ordine.id} style={{
                  padding: "0.9rem 1.2rem",
                  borderBottom: i < recentOrdini.length - 1 ? "1px solid rgba(26,21,16,0.07)" : "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap",
                }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "#1A1510", marginBottom: "0.15rem" }}>
                      {ordine.nome}
                      <span style={{ color: "rgba(26,21,16,0.4)", fontSize: "0.78rem", marginLeft: "0.6rem" }}>{ordine.email}</span>
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#6B5C4A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 380 }}>
                      {ordine.scena}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {statusLabel[ordine.status]}
                    </span>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "rgba(26,21,16,0.3)" }}>
                      {new Date(ordine.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
