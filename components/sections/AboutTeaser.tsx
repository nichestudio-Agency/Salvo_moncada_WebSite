import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function AboutTeaser() {
  return (
    <section
      style={{
        background: "#F2EFE9",
        padding: "6rem clamp(1.5rem, 5vw, 4rem)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
        className="lg:grid-cols-[1.4fr_1fr]"
      >
        {/* Text column */}
        <AnimatedSection direction="left">
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C4783C",
              marginBottom: "0.8rem",
            }}
          >
            L&apos;Artigiano
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
              fontWeight: 300,
              color: "#1A1510",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Salvo Moncada
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.88rem",
              color: "#6B5C4A",
              lineHeight: 1.8,
              marginBottom: "1rem",
              maxWidth: "520px",
            }}
          >
            Cresciuto tra i mercati rionali di Catania, Salvo Moncada ha imparato
            da bambino che ogni angolo di Sicilia ha una storia da raccontare.
            Oggi quella storia la racconta in maiolica.
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.88rem",
              color: "#6B5C4A",
              lineHeight: 1.8,
              marginBottom: "2rem",
              maxWidth: "520px",
            }}
          >
            Ogni tegola è dipinta a mano con smalti tradizionali siciliani, poi
            cotta ad alta temperatura per garantire colori che durano generazioni.
            Nessuna tegola è uguale all&apos;altra.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
              marginBottom: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(26,21,16,0.1)",
            }}
          >
            {[
              { num: "200+", label: "Tegole create" },
              { num: "Catania", label: "Sicilia, Italia" },
              { num: "100%", label: "Fatto a mano" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.8rem",
                    fontWeight: 300,
                    color: "#C4783C",
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                  }}
                >
                  {num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(26,21,16,0.4)",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/chi-sono"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#1A1510",
              textDecoration: "none",
              borderBottom: "1px solid rgba(26,21,16,0.3)",
              paddingBottom: "2px",
            }}
          >
            Scopri la storia di Salvo →
          </Link>
        </AnimatedSection>

        {/* Image placeholder */}
        <AnimatedSection direction="right" delay={0.15}>
          <div
            style={{
              aspectRatio: "3/4",
              maxWidth: "380px",
              background: "linear-gradient(160deg, #EDE8DF 0%, #D8D0C4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(196,120,58,0.2), transparent)",
                border: "1px solid rgba(196,120,58,0.25)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                right: "1.5rem",
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.1rem",
                fontWeight: 400,
                color: "rgba(26,21,16,0.35)",
                fontStyle: "italic",
                letterSpacing: "0.05em",
              }}
            >
              S. Moncada
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
