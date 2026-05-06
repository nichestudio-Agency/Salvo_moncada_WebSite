import { getMessaggi } from "@/lib/supabase/db";
import { deleteMessaggio, markMessaggioLetto } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminMessaggiPage() {
  const messaggi = await getMessaggi().catch(() => []);
  const nonLetti = messaggi.filter((m) => !m.letto).length;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#1A1510", marginBottom: "0.3rem" }}>
          Messaggi
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
          {messaggi.length} {messaggi.length === 1 ? "messaggio ricevuto" : "messaggi ricevuti"}
          {nonLetti > 0 && <span style={{ color: "#C4783C", marginLeft: "0.4rem" }}>· {nonLetti} non {nonLetti === 1 ? "letto" : "letti"}</span>}
        </p>
      </div>

      {messaggi.length === 0 ? (
        <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF", padding: "4rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "rgba(26,21,16,0.35)" }}>
            Nessun messaggio ancora. Appariranno qui quando qualcuno compila il form di contatto.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messaggi.map((msg) => (
            <div
              key={msg.id}
              style={{
                border: `1px solid ${msg.letto ? "rgba(26,21,16,0.1)" : "rgba(196,120,58,0.3)"}`,
                background: msg.letto ? "#FFFFFF" : "rgba(196,120,58,0.02)",
                padding: "1.4rem 1.6rem",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.3rem" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", fontWeight: 500, color: "#1A1510" }}>
                      {msg.nome}
                    </p>
                    {!msg.letto && (
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "2px 7px", background: "rgba(196,120,58,0.12)", color: "#C4783C", border: "1px solid rgba(196,120,58,0.3)", borderRadius: 999 }}>
                        Nuovo
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${msg.email}`} style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "#C4783C", textDecoration: "none" }}>
                    {msg.email}
                  </a>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem", color: "rgba(26,21,16,0.35)", whiteSpace: "nowrap" }}>
                  {new Date(msg.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Dettagli */}
              <div style={{ background: "#FAF8F4", padding: "1rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", marginBottom: "0.25rem" }}>Oggetto</p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#1A1510", fontWeight: 500 }}>{msg.oggetto}</p>
                  </div>
                  {msg.opera && (
                    <div>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", marginBottom: "0.25rem" }}>Opera</p>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#C4783C" }}>{msg.opera}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", marginBottom: "0.25rem" }}>Messaggio</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "#1A1510", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.messaggio}</p>
                </div>
              </div>

              {/* Azioni */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <form action={markMessaggioLetto.bind(null, msg.id, !msg.letto)}>
                  <button type="submit" style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 0.9rem", border: "1px solid rgba(26,21,16,0.15)", background: "transparent", color: "rgba(26,21,16,0.5)", cursor: "pointer" }}>
                    {msg.letto ? "Segna come non letto" : "Segna come letto"}
                  </button>
                </form>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.oggetto)}`}
                  style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 0.9rem", border: "1px solid rgba(196,120,58,0.3)", background: "transparent", color: "#C4783C", textDecoration: "none" }}
                >
                  Rispondi via email →
                </a>
                <form action={deleteMessaggio.bind(null, msg.id)} style={{ marginLeft: "auto" }}>
                  <button type="submit" style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 0.9rem", border: "1px solid rgba(185,64,64,0.2)", background: "transparent", color: "rgba(185,64,64,0.6)", cursor: "pointer" }}>
                    Elimina
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
