import Link from "next/link";
import { adminLogout } from "@/lib/actions";

export const metadata = {
  title: "Admin — Salvo Moncada",
};

const navItems = [
  { href: "/admin",            label: "Dashboard" },
  { href: "/admin/prodotti",   label: "Prodotti" },
  { href: "/admin/ordini",     label: "Ordini" },
  { href: "/admin/messaggi",   label: "Messaggi" },
  { href: "/admin/statistiche", label: "Statistiche" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header
        style={{
          background: "#0C0A07",
          padding: "0 clamp(1.5rem, 4vw, 3rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
          borderBottom: "1px solid rgba(237,232,224,0.07)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link
            href="/admin"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.1rem",
              fontWeight: 300,
              color: "rgba(237,232,224,0.85)",
              letterSpacing: "0.06em",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Salvo Moncada
          </Link>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.52rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(196,120,58,0.6)",
            }}
          >
            Admin
          </span>

          <nav style={{ display: "flex", gap: "1.5rem", marginLeft: "1rem" }}>
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(237,232,224,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(237,232,224,0.3)",
              textDecoration: "none",
            }}
          >
            Vedi sito ↗
          </Link>

          <form action={adminLogout}>
            <button
              type="submit"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(196,120,58,0.6)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              Esci
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: "2.5rem clamp(1.5rem, 4vw, 3rem)" }}>
        {children}
      </main>
    </div>
  );
}
