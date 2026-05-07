import Link from "next/link";
import { getOpere, getOrdini, getMessaggi } from "@/lib/supabase/db";
import type { Ordine, Messaggio } from "@/types/db";

export const dynamic = "force-dynamic";

const COLORS = {
  bg: "#FAF8F4",
  surface: "#FFFFFF",
  ink: "#1A1510",
  stone: "#6B5C4A",
  border: "rgba(26,21,16,0.1)",
  borderSoft: "rgba(26,21,16,0.07)",
  accent: "#C4783C",
  accentSoft: "rgba(196,120,58,0.1)",
  accentBorder: "rgba(196,120,58,0.3)",
  green: "#3d7a45",
  greenSoft: "rgba(61,122,69,0.08)",
  greenBorder: "rgba(61,122,69,0.2)",
  red: "#b94040",
  redSoft: "rgba(185,64,64,0.08)",
  blue: "#3d64b4",
  blueSoft: "rgba(61,100,180,0.08)",
};

const FONT_DISPLAY = "var(--font-cormorant)";
const FONT_BODY = "var(--font-inter)";

const statusColor: Record<string, { bg: string; color: string; border: string }> = {
  nuovo:            { bg: COLORS.accentSoft, color: COLORS.accent, border: COLORS.accentBorder },
  "in-lavorazione": { bg: COLORS.blueSoft,   color: COLORS.blue,   border: "rgba(61,100,180,0.2)" },
  completato:       { bg: COLORS.greenSoft,  color: COLORS.green,  border: COLORS.greenBorder },
};
const statusLabel: Record<string, string> = {
  nuovo: "Nuovo", "in-lavorazione": "In lavorazione", completato: "Completato",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ora";
  if (min < 60) return `${min} min fa`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ${h === 1 ? "ora" : "ore"} fa`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days} ${days === 1 ? "giorno" : "giorni"} fa`;
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
}

function ordersByMonth(ordini: Ordine[], months: number): { label: string; value: number; key: string }[] {
  const buckets: { label: string; value: number; key: string }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleDateString("it-IT", { month: "short" }).replace(".", "");
    buckets.push({ label, value: 0, key });
  }
  for (const o of ordini) {
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const b = buckets.find((x) => x.key === key);
    if (b) b.value += 1;
  }
  return buckets;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Card({ children, padding = "1.4rem 1.6rem" }: { children: React.ReactNode; padding?: string }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding }}>
      {children}
    </div>
  );
}

function StatCard({
  label, value, icon, accent = false, sub,
}: {
  label: string; value: string | number; icon: React.ReactNode; accent?: boolean; sub?: string;
}) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${accent ? COLORS.accentBorder : COLORS.border}`, padding: "1.3rem 1.4rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.45)" }}>
          {label}
        </p>
        <div style={{
          width: 32, height: 32,
          background: accent ? COLORS.accentSoft : "rgba(26,21,16,0.04)",
          color: accent ? COLORS.accent : COLORS.stone,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
      </div>
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: "2.4rem", fontWeight: 300, color: accent ? COLORS.accent : COLORS.ink, lineHeight: 1, marginBottom: sub ? "0.4rem" : 0 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.7rem", color: "rgba(26,21,16,0.4)" }}>{sub}</p>
      )}
    </div>
  );
}

function OrdersSparkline({ ordini }: { ordini: Ordine[] }) {
  const data = ordersByMonth(ordini, 6);
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 100, H = 38, P = 2;
  const step = (W - P * 2) / (data.length - 1 || 1);
  const points = data.map((d, i) => {
    const x = P + i * step;
    const y = H - P - ((d.value / max) * (H - P * 2));
    return [x, y] as const;
  });
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${(W - P).toFixed(1)},${H - P} L${P},${H - P} Z`;

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <p style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.45)", marginBottom: "0.3rem" }}>
            Andamento ordini
          </p>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: "1.6rem", fontWeight: 300, color: COLORS.ink, lineHeight: 1 }}>
            {ordini.length} <span style={{ fontSize: "0.78rem", color: "rgba(26,21,16,0.4)" }}>totali</span>
          </p>
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.65rem", color: "rgba(26,21,16,0.4)" }}>
          Ultimi 6 mesi
        </p>
      </div>

      <div style={{ width: "100%", aspectRatio: "100 / 38" }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
          <defs>
            <linearGradient id="orderArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.22" />
              <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#orderArea)" />
          <path d={linePath} fill="none" stroke={COLORS.accent} strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.9} fill={COLORS.surface} stroke={COLORS.accent} strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
        {data.map((d) => (
          <p key={d.key + d.label} style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", color: "rgba(26,21,16,0.35)" }}>
            {d.label}
          </p>
        ))}
      </div>
    </Card>
  );
}

function AvailabilityDonut({
  disponibili, vendute, riservate, nonInVendita,
}: {
  disponibili: number; vendute: number; riservate: number; nonInVendita: number;
}) {
  const total = disponibili + vendute + riservate + nonInVendita;
  const segments = [
    { label: "Disponibili",    value: disponibili,   color: COLORS.green },
    { label: "Riservate",      value: riservate,     color: COLORS.accent },
    { label: "Vendute",        value: vendute,       color: COLORS.red },
    { label: "Non in vendita", value: nonInVendita,  color: "rgba(26,21,16,0.35)" },
  ].filter((s) => s.value > 0);

  const R = 32, C = 2 * Math.PI * R, CX = 50, CY = 50;
  let offset = 0;

  return (
    <Card>
      <p style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.45)", marginBottom: "1rem" }}>
        Catalogo opere
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
        <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(26,21,16,0.06)" strokeWidth={10} />
            {total > 0 && segments.map((s) => {
              const len = (s.value / total) * C;
              const dasharray = `${len} ${C - len}`;
              const dashoffset = -offset;
              offset += len;
              return (
                <circle
                  key={s.label}
                  cx={CX} cy={CY} r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={10}
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                />
              );
            })}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: "1.8rem", fontWeight: 300, color: COLORS.ink, lineHeight: 1 }}>{total}</p>
            <p style={{ fontFamily: FONT_BODY, fontSize: "0.55rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(26,21,16,0.4)", marginTop: 2 }}>Opere</p>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {segments.length === 0 ? (
            <p style={{ fontFamily: FONT_BODY, fontSize: "0.78rem", color: "rgba(26,21,16,0.4)" }}>Nessuna opera ancora.</p>
          ) : segments.map((s) => {
            const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
            return (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: 8, height: 8, background: s.color, flexShrink: 0 }} />
                <p style={{ fontFamily: FONT_BODY, fontSize: "0.78rem", color: COLORS.ink, flex: 1 }}>{s.label}</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: "0.78rem", color: COLORS.stone, fontVariantNumeric: "tabular-nums" }}>
                  {s.value} <span style={{ color: "rgba(26,21,16,0.35)", fontSize: "0.7rem" }}>({pct}%)</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

type ActivityItem = {
  id: string;
  type: "ordine" | "messaggio";
  title: string;
  subtitle: string;
  date: string;
  href: string;
  highlight: boolean;
};

function ActivityTimeline({ ordini, messaggi }: { ordini: Ordine[]; messaggi: Messaggio[] }) {
  const items: ActivityItem[] = [
    ...ordini.map<ActivityItem>((o) => ({
      id: `o-${o.id}`,
      type: "ordine",
      title: o.nome,
      subtitle: o.scena,
      date: o.created_at,
      href: "/admin/ordini",
      highlight: o.status === "nuovo",
    })),
    ...messaggi.map<ActivityItem>((m) => ({
      id: `m-${m.id}`,
      type: "messaggio",
      title: m.nome,
      subtitle: m.oggetto || m.messaggio.slice(0, 80),
      date: m.created_at,
      href: "/admin/messaggi",
      highlight: !m.letto,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <Card padding="1.2rem 0">
      <div style={{ padding: "0 1.4rem", marginBottom: "1rem" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.45)" }}>
          Attività recenti
        </p>
      </div>

      {items.length === 0 ? (
        <p style={{ padding: "0 1.4rem 0.5rem", fontFamily: FONT_BODY, fontSize: "0.78rem", color: "rgba(26,21,16,0.4)" }}>
          Nessuna attività ancora.
        </p>
      ) : (
        <div>
          {items.map((it, i) => (
            <Link
              key={it.id}
              href={it.href}
              style={{
                display: "flex",
                gap: "0.9rem",
                padding: "0.8rem 1.4rem",
                textDecoration: "none",
                borderBottom: i < items.length - 1 ? `1px solid ${COLORS.borderSoft}` : "none",
              }}
            >
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                background: it.highlight ? COLORS.accentSoft : "rgba(26,21,16,0.04)",
                color: it.highlight ? COLORS.accent : COLORS.stone,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {it.type === "ordine" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6" />
                    <circle cx="10" cy="20.5" r="1.2" />
                    <circle cx="17" cy="20.5" r="1.2" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", marginBottom: "0.15rem" }}>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "0.82rem", color: COLORS.ink, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {it.type === "ordine" ? "Nuovo ordine — " : "Messaggio — "}{it.title}
                  </p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "0.7rem", color: "rgba(26,21,16,0.35)", whiteSpace: "nowrap" }}>
                    {formatRelative(it.date)}
                  </p>
                </div>
                <p style={{ fontFamily: FONT_BODY, fontSize: "0.74rem", color: COLORS.stone, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {it.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

function RecentOrdersTable({ ordini }: { ordini: Ordine[] }) {
  const recent = ordini.slice(0, 5);
  return (
    <Card padding="1.2rem 0">
      <div style={{ padding: "0 1.4rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.45)" }}>
          Ultimi ordini
        </p>
        <Link href="/admin/ordini" style={{ fontFamily: FONT_BODY, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.accent, textDecoration: "none" }}>
          Tutti →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p style={{ padding: "0 1.4rem 0.5rem", fontFamily: FONT_BODY, fontSize: "0.78rem", color: "rgba(26,21,16,0.4)" }}>
          Nessun ordine ricevuto.
        </p>
      ) : (
        <div>
          {recent.map((o, i) => {
            const sc = statusColor[o.status] ?? statusColor.completato;
            return (
              <div
                key={o.id}
                style={{
                  padding: "0.8rem 1.4rem",
                  borderBottom: i < recent.length - 1 ? `1px solid ${COLORS.borderSoft}` : "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "0.82rem", color: COLORS.ink, fontWeight: 500, marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {o.nome}
                  </p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: "0.7rem", color: COLORS.stone, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {o.scena}
                  </p>
                </div>
                <span style={{
                  fontFamily: FONT_BODY, fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "3px 8px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                  whiteSpace: "nowrap",
                }}>
                  {statusLabel[o.status]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const [opere, ordini, messaggi] = await Promise.all([
    getOpere().catch(() => []),
    getOrdini().catch(() => []),
    getMessaggi().catch(() => []),
  ]);

  const disponibili = opere.filter((o) => o.disponibilita === "disponibile").length;
  const vendute     = opere.filter((o) => o.disponibilita === "venduta").length;
  const riservate   = opere.filter((o) => o.disponibilita === "riservata").length;
  const nonInVend   = opere.filter((o) => o.disponibilita === "non_in_vendita").length;
  const nuoviOrdini = ordini.filter((o) => o.status === "nuovo").length;
  const nonLetti    = messaggi.filter((m) => !m.letto).length;
  const valoreDisp  = opere.filter((o) => o.disponibilita === "disponibile").reduce((s, o) => s + (o.prezzo ?? 0), 0);
  const totalViews  = opere.reduce((s, o) => s + (o.visualizzazioni ?? 0), 0);

  const oggi = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: "2.2rem", fontWeight: 300, color: COLORS.ink, marginBottom: "0.3rem" }}>
            Dashboard
          </h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: "0.82rem", color: COLORS.stone, textTransform: "capitalize" }}>
            {oggi}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link href="/admin/prodotti/nuovo" style={{ fontFamily: FONT_BODY, fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.7rem 1.3rem", background: COLORS.accent, color: "#FAF8F4", textDecoration: "none" }}>
            + Aggiungi opera
          </Link>
          <Link href="/admin/statistiche" style={{ fontFamily: FONT_BODY, fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.7rem 1.3rem", border: `1px solid ${COLORS.border}`, color: COLORS.stone, textDecoration: "none" }}>
            Statistiche →
          </Link>
        </div>
      </div>

      {/* ── Stat row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
        <StatCard
          label="Opere totali"
          value={opere.length}
          sub={valoreDisp > 0 ? `Valore disponibili: € ${valoreDisp.toLocaleString("it-IT")}` : `${disponibili} disponibili`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.7 1.5-1.5 0-1.5 1-2 2-2H17a4 4 0 0 0 4-4 9 9 0 0 0-9-10.5Z" />
              <circle cx="7.5" cy="11" r="1.2" />
              <circle cx="12" cy="7.5" r="1.2" />
            </svg>
          }
        />
        <StatCard
          label="Nuovi ordini"
          value={nuoviOrdini}
          accent={nuoviOrdini > 0}
          sub={`${ordini.length} totali`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6" />
              <circle cx="10" cy="20.5" r="1.2" />
              <circle cx="17" cy="20.5" r="1.2" />
            </svg>
          }
        />
        <StatCard
          label="Messaggi non letti"
          value={nonLetti}
          accent={nonLetti > 0}
          sub={`${messaggi.length} totali`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          }
        />
        <StatCard
          label="Visualizzazioni"
          value={totalViews.toLocaleString("it-IT")}
          sub="Somma su tutte le opere"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        />
      </div>

      {/* ── Chart row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
        <OrdersSparkline ordini={ordini} />
        <AvailabilityDonut
          disponibili={disponibili}
          vendute={vendute}
          riservate={riservate}
          nonInVendita={nonInVend}
        />
      </div>

      {/* ── Activity + Recent orders ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
        <ActivityTimeline ordini={ordini} messaggi={messaggi} />
        <RecentOrdersTable ordini={ordini} />
      </div>
    </div>
  );
}
