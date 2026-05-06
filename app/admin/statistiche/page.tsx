import { getOpere, getOrdini, getMessaggi } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

const categoriaLabel: Record<string, string> = {
  pescheria:      "Pescheria",
  fruttivendolo:  "Fruttivendolo",
  paesaggio:      "Paesaggio",
  personalizzato: "Su commissione",
};

function StatBox({ label, value, sub, highlight = false }: { label: string; value: string | number; sub?: string; highlight?: boolean }) {
  return (
    <div style={{ background: "#FFFFFF", border: `1px solid ${highlight ? "rgba(196,120,58,0.35)" : "rgba(26,21,16,0.1)"}`, padding: "1.4rem 1.6rem" }}>
      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.8rem", fontWeight: 300, color: highlight ? "#C4783C" : "#1A1510", lineHeight: 1, marginBottom: "0.35rem" }}>
        {value}
      </p>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(26,21,16,0.4)" }}>
        {label}
      </p>
      {sub && (
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "rgba(26,21,16,0.35)", marginTop: "0.4rem" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", marginBottom: "0.9rem", marginTop: "2.5rem" }}>
      {children}
    </p>
  );
}

export default async function StatistichePage() {
  const [opere, ordini, messaggi] = await Promise.all([
    getOpere().catch(() => []),
    getOrdini().catch(() => []),
    getMessaggi().catch(() => []),
  ]);

  // ── Statistiche catalogo ──
  const disponibili    = opere.filter((o) => o.disponibilita === "disponibile");
  const vendute        = opere.filter((o) => o.disponibilita === "venduta");
  const riservate      = opere.filter((o) => o.disponibilita === "riservata");
  const valoreDisp     = disponibili.reduce((s, o) => s + (o.prezzo ?? 0), 0);
  const valoreVenduto  = vendute.reduce((s, o) => s + (o.prezzo ?? 0), 0);
  const totaleViews    = opere.reduce((s, o) => s + (o.visualizzazioni ?? 0), 0);

  // ── Statistiche ordini ──
  const ordiniCompletati  = ordini.filter((o) => o.status === "completato").length;
  const ordiniNuovi       = ordini.filter((o) => o.status === "nuovo").length;
  const conversionRate    = ordini.length > 0 ? Math.round((ordiniCompletati / ordini.length) * 100) : 0;

  // ── Top opere per visualizzazioni ──
  const topOpere = [...opere]
    .filter((o) => (o.visualizzazioni ?? 0) > 0)
    .sort((a, b) => (b.visualizzazioni ?? 0) - (a.visualizzazioni ?? 0))
    .slice(0, 10);

  // ── Opere per categoria ──
  const perCategoria = Object.entries(
    opere.reduce<Record<string, number>>((acc, o) => {
      acc[o.categoria] = (acc[o.categoria] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#1A1510", marginBottom: "0.3rem" }}>
          Statistiche
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
          Panoramica completa del catalogo e delle vendite
        </p>
      </div>

      {/* ── Catalogo ── */}
      <SectionTitle>Catalogo</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem" }}>
        <StatBox label="Opere totali" value={opere.length} />
        <StatBox label="Disponibili" value={disponibili.length} highlight={disponibili.length > 0} />
        <StatBox label="Vendute" value={vendute.length} />
        <StatBox label="Riservate" value={riservate.length} />
        <StatBox
          label="Valore disponibile"
          value={valoreDisp > 0 ? `€ ${valoreDisp.toLocaleString("it-IT")}` : "—"}
          sub="Somma prezzi opere disponibili"
        />
        <StatBox
          label="Valore venduto"
          value={valoreVenduto > 0 ? `€ ${valoreVenduto.toLocaleString("it-IT")}` : "—"}
          sub="Somma prezzi opere vendute"
          highlight={valoreVenduto > 0}
        />
      </div>

      {/* ── Visualizzazioni ── */}
      <SectionTitle>Visualizzazioni</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatBox label="Visualizzazioni totali" value={totaleViews.toLocaleString("it-IT")} />
        <StatBox
          label="Media per opera"
          value={opere.length > 0 ? Math.round(totaleViews / opere.length) : 0}
        />
      </div>

      {topOpere.length > 0 && (
        <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF" }}>
          <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(26,21,16,0.08)" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)" }}>
              Top opere per visualizzazioni
            </p>
          </div>
          {topOpere.map((opera, i) => {
            const max = topOpere[0].visualizzazioni ?? 1;
            const pct = Math.round(((opera.visualizzazioni ?? 0) / max) * 100);
            return (
              <div key={opera.id} style={{ padding: "0.85rem 1rem", borderBottom: i < topOpere.length - 1 ? "1px solid rgba(26,21,16,0.06)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", color: "rgba(26,21,16,0.3)", width: "1.2rem" }}>{i + 1}</span>
                    {opera.immagini[0] && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={opera.immagini[0]} alt={opera.titolo} style={{ width: 32, height: 32, objectFit: "cover", background: "#ede6dc", borderRadius: 2 }} />
                    )}
                    <div>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#1A1510" }}>{opera.titolo}</p>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", color: "rgba(26,21,16,0.35)" }}>{categoriaLabel[opera.categoria] ?? opera.categoria}</p>
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 300, color: "#C4783C" }}>
                    {(opera.visualizzazioni ?? 0).toLocaleString("it-IT")}
                  </span>
                </div>
                <div style={{ background: "rgba(26,21,16,0.06)", height: 3, borderRadius: 2 }}>
                  <div style={{ background: "#C4783C", height: 3, borderRadius: 2, width: `${pct}%`, transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {topOpere.length === 0 && (
        <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF", padding: "2rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "rgba(26,21,16,0.35)" }}>
            Nessuna visualizzazione ancora. I dati appariranno non appena qualcuno visita le pagine delle opere.
          </p>
        </div>
      )}

      {/* ── Ordini ── */}
      <SectionTitle>Ordini e commissioni</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem" }}>
        <StatBox label="Ordini totali" value={ordini.length} />
        <StatBox label="Nuovi" value={ordiniNuovi} highlight={ordiniNuovi > 0} />
        <StatBox label="Completati" value={ordiniCompletati} />
        <StatBox label="Tasso completamento" value={`${conversionRate}%`} sub="Completati / totale" />
        <StatBox label="Messaggi ricevuti" value={messaggi.length} />
        <StatBox label="Non letti" value={messaggi.filter((m) => !m.letto).length} />
      </div>

      {/* ── Per categoria ── */}
      {perCategoria.length > 0 && (
        <>
          <SectionTitle>Opere per categoria</SectionTitle>
          <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF" }}>
            {perCategoria.map(([cat, count], i) => {
              const pct = Math.round((count / opere.length) * 100);
              return (
                <div key={cat} style={{ padding: "0.9rem 1.2rem", borderBottom: i < perCategoria.length - 1 ? "1px solid rgba(26,21,16,0.06)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#1A1510" }}>
                      {categoriaLabel[cat] ?? cat}
                    </p>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem", color: "rgba(26,21,16,0.45)" }}>
                      {count} {count === 1 ? "opera" : "opere"} · {pct}%
                    </span>
                  </div>
                  <div style={{ background: "rgba(26,21,16,0.06)", height: 3, borderRadius: 2 }}>
                    <div style={{ background: "#C4783C", height: 3, borderRadius: 2, width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
