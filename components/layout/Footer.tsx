import Link from "next/link";

const navLinks = [
  { href: "/galleria", label: "Galleria" },
  { href: "/chi-sono", label: "Chi è Salvo" },
  { href: "/ordina", label: "Ordina" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0C0A07",
        padding: "4rem clamp(1.5rem, 5vw, 4rem) 2.5rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3rem",
        }}
      >
        {/* Brand */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.3rem",
              fontWeight: 300,
              color: "rgba(237,232,224,0.88)",
              letterSpacing: "0.07em",
              display: "block",
              marginBottom: "0.4rem",
            }}
          >
            Salvo Moncada
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(196,120,58,0.6)",
            }}
          >
            Tegole in Maiolica · Sicilia
          </span>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.78rem",
              color: "rgba(237,232,224,0.35)",
              lineHeight: 1.7,
              marginTop: "1rem",
              maxWidth: "280px",
            }}
          >
            Scene di vita quotidiana siciliana dipinte a mano su maiolica.
            Ogni tegola è un pezzo unico.
          </p>
        </div>

        {/* Nav */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(237,232,224,0.25)",
              marginBottom: "1.2rem",
            }}
          >
            Navigazione
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.8rem",
                  color: "rgba(237,232,224,0.45)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  letterSpacing: "0.03em",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contatti */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(237,232,224,0.25)",
              marginBottom: "1.2rem",
            }}
          >
            Contatti
          </p>
          <a
            href="mailto:info@salvomoncada.it"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.8rem",
              color: "rgba(196,120,58,0.7)",
              textDecoration: "none",
              display: "block",
              marginBottom: "0.6rem",
            }}
          >
            info@salvomoncada.it
          </a>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.75rem",
              color: "rgba(237,232,224,0.3)",
            }}
          >
            Instagram
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(237,232,224,0.07)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            color: "rgba(237,232,224,0.18)",
            letterSpacing: "0.05em",
          }}
        >
          © {new Date().getFullYear()} Salvo Moncada. Tutti i diritti riservati.
        </p>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            color: "rgba(237,232,224,0.18)",
            letterSpacing: "0.05em",
          }}
        >
          Fatto a mano in Sicilia
        </p>
      </div>
    </footer>
  );
}
