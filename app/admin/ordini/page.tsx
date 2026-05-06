import { readOrders } from "@/lib/data";
import { updateOrderStatus, deleteOrder } from "@/lib/actions";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  nuovo: "Nuovo",
  "in-lavorazione": "In lavorazione",
  completato: "Completato",
};

const statusColor: Record<string, { bg: string; color: string; border: string }> = {
  nuovo: {
    bg: "rgba(196,120,58,0.1)",
    color: "#C4783C",
    border: "rgba(196,120,58,0.25)",
  },
  "in-lavorazione": {
    bg: "rgba(61,100,180,0.08)",
    color: "#3d64b4",
    border: "rgba(61,100,180,0.2)",
  },
  completato: {
    bg: "rgba(61,122,69,0.08)",
    color: "#3d7a45",
    border: "rgba(61,122,69,0.2)",
  },
};

export default async function AdminOrdiniPage() {
  const orders = await readOrders();
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2.2rem",
            fontWeight: 300,
            color: "#1A1510",
            marginBottom: "0.3rem",
          }}
        >
          Ordini
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
          {orders.length} {orders.length === 1 ? "richiesta ricevuta" : "richieste ricevute"}
          {" · "}
          {orders.filter((o) => o.status === "nuovo").length} nuove
        </p>
      </div>

      {sorted.length === 0 ? (
        <div
          style={{
            border: "1px solid rgba(26,21,16,0.1)",
            background: "#FFFFFF",
            padding: "4rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "rgba(26,21,16,0.35)" }}>
            Nessun ordine ancora. Gli ordini appariranno qui quando i clienti compilano il form sul sito.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {sorted.map((order) => {
            const sc = statusColor[order.status];
            return (
              <div
                key={order.id}
                style={{
                  border: "1px solid rgba(26,21,16,0.1)",
                  background: "#FFFFFF",
                  padding: "1.4rem 1.6rem",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.3rem" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          color: "#1A1510",
                        }}
                      >
                        {order.nome}
                      </p>
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "3px 8px",
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {statusLabel[order.status]}
                      </span>
                    </div>
                    <a
                      href={`mailto:${order.email}`}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.78rem",
                        color: "#C4783C",
                        textDecoration: "none",
                      }}
                    >
                      {order.email}
                    </a>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.72rem",
                      color: "rgba(26,21,16,0.35)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Details */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "1rem",
                    padding: "1rem",
                    background: "#FAF8F4",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "rgba(26,21,16,0.35)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      Scena richiesta
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.85rem",
                        color: "#1A1510",
                        lineHeight: 1.6,
                      }}
                    >
                      {order.scena}
                    </p>
                  </div>

                  {order.dimensione && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "rgba(26,21,16,0.35)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Dimensione
                      </p>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#1A1510" }}>
                        {order.dimensione}
                      </p>
                    </div>
                  )}

                  {order.budget && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "rgba(26,21,16,0.35)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Budget
                      </p>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#1A1510" }}>
                        {order.budget === "100-200"
                          ? "€ 100 – 200"
                          : order.budget === "200-350"
                          ? "€ 200 – 350"
                          : order.budget === "350+"
                          ? "€ 350+"
                          : "Da definire"}
                      </p>
                    </div>
                  )}

                  {order.messaggio && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "rgba(26,21,16,0.35)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Messaggio aggiuntivo
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.82rem",
                          color: "#6B5C4A",
                          lineHeight: 1.6,
                          fontStyle: "italic",
                        }}
                      >
                        {order.messaggio}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {(["nuovo", "in-lavorazione", "completato"] as const).map((s) => (
                    <form key={s} action={updateOrderStatus.bind(null, order.id, s)}>
                      <button
                        type="submit"
                        disabled={order.status === s}
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "0.6rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "0.4rem 0.9rem",
                          border: `1px solid ${order.status === s ? statusColor[s].border : "rgba(26,21,16,0.12)"}`,
                          background: order.status === s ? statusColor[s].bg : "transparent",
                          color: order.status === s ? statusColor[s].color : "rgba(26,21,16,0.4)",
                          cursor: order.status === s ? "default" : "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {statusLabel[s]}
                      </button>
                    </form>
                  ))}

                  <form
                    action={deleteOrder.bind(null, order.id)}
                    style={{ marginLeft: "auto" }}
                  >
                    <button
                      type="submit"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "0.4rem 0.9rem",
                        border: "1px solid rgba(185,64,64,0.2)",
                        background: "transparent",
                        color: "rgba(185,64,64,0.6)",
                        cursor: "pointer",
                      }}
                    >
                      Elimina
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
