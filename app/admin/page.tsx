import Link from "next/link";
import { readArtworks } from "@/lib/data";
import { readOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [artworks, orders] = await Promise.all([readArtworks(), readOrders()]);

  const disponibili = artworks.filter((a) => a.available).length;
  const nuoviOrdini = orders.filter((o) => o.status === "nuovo").length;
  const inLavorazione = orders.filter((o) => o.status === "in-lavorazione").length;

  const stats = [
    { label: "Opere totali", value: artworks.length, href: "/admin/prodotti" },
    { label: "Disponibili", value: disponibili, href: "/admin/prodotti" },
    { label: "Ordini totali", value: orders.length, href: "/admin/ordini" },
    { label: "Nuovi ordini", value: nuoviOrdini, href: "/admin/ordini", highlight: nuoviOrdini > 0 },
    { label: "In lavorazione", value: inLavorazione, href: "/admin/ordini" },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ maxWidth: 900 }}>
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
          Dashboard
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
          Panoramica del sito
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        {stats.map(({ label, value, href, highlight }) => (
          <Link
            key={label}
            href={href}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#FFFFFF",
                border: `1px solid ${highlight ? "rgba(196,120,58,0.4)" : "rgba(26,21,16,0.1)"}`,
                padding: "1.2rem 1.4rem",
                transition: "box-shadow 0.2s",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "2.5rem",
                  fontWeight: 300,
                  color: highlight ? "#C4783C" : "#1A1510",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(26,21,16,0.4)",
                }}
              >
                {label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: "3rem" }}>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(26,21,16,0.35)",
            marginBottom: "0.8rem",
          }}
        >
          Azioni rapide
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
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
            }}
          >
            + Aggiungi opera
          </Link>
          <Link
            href="/admin/ordini"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.7rem 1.4rem",
              border: "1px solid rgba(26,21,16,0.2)",
              color: "rgba(26,21,16,0.6)",
              textDecoration: "none",
            }}
          >
            Vedi ordini
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(26,21,16,0.35)",
              marginBottom: "0.8rem",
            }}
          >
            Ultimi ordini
          </p>
          <div
            style={{
              border: "1px solid rgba(26,21,16,0.1)",
              background: "#FFFFFF",
            }}
          >
            {recentOrders.map((order, i) => (
              <div
                key={order.id}
                style={{
                  padding: "0.9rem 1.2rem",
                  borderBottom: i < recentOrders.length - 1 ? "1px solid rgba(26,21,16,0.07)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.85rem",
                      color: "#1A1510",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {order.nome}
                    <span
                      style={{
                        color: "rgba(26,21,16,0.4)",
                        fontSize: "0.78rem",
                        marginLeft: "0.6rem",
                      }}
                    >
                      {order.email}
                    </span>
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.75rem",
                      color: "#6B5C4A",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 400,
                    }}
                  >
                    {order.scena}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      background:
                        order.status === "nuovo"
                          ? "rgba(196,120,58,0.1)"
                          : order.status === "in-lavorazione"
                          ? "rgba(61,100,180,0.08)"
                          : "rgba(61,122,69,0.08)",
                      color:
                        order.status === "nuovo"
                          ? "#C4783C"
                          : order.status === "in-lavorazione"
                          ? "#3d64b4"
                          : "#3d7a45",
                      border: `1px solid ${
                        order.status === "nuovo"
                          ? "rgba(196,120,58,0.25)"
                          : order.status === "in-lavorazione"
                          ? "rgba(61,100,180,0.2)"
                          : "rgba(61,122,69,0.2)"
                      }`,
                    }}
                  >
                    {order.status}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.7rem",
                      color: "rgba(26,21,16,0.3)",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("it-IT")}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/ordini"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#C4783C",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "0.8rem",
              borderBottom: "1px solid rgba(196,120,58,0.3)",
              paddingBottom: "1px",
            }}
          >
            Vedi tutti →
          </Link>
        </div>
      )}
    </div>
  );
}
