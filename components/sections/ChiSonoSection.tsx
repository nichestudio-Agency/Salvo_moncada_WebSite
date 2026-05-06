"use client";

import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

const processSteps = [
  {
    num: "01",
    title: "La Tegola",
    body: "Si parte da una tegola tradizionale siciliana, levigata e preparata a mano. La base è il cuore dell'opera.",
  },
  {
    num: "02",
    title: "Il Disegno",
    body: "La scena viene abbozzata a matita, poi incisa con strumenti sottili. Ogni dettaglio è studiato prima del colore.",
  },
  {
    num: "03",
    title: "La Maiolica",
    body: "Gli smalti tradizionali vengono applicati a pennello, layer dopo layer, con colori che richiamano la Sicilia più autentica.",
  },
  {
    num: "04",
    title: "La Cottura",
    body: "L'opera viene cotta ad alta temperatura. I colori si fissano per sempre nella ceramica. Nessuna tegola uscirà uguale.",
  },
];

export default function ChiSonoSection() {
  return (
    <>
      {/* Hero della pagina */}
      <section
        style={{
          background: "#FAF8F4",
          padding: "8rem clamp(1.5rem, 5vw, 4rem) 5rem",
        }}
      >
        <AnimatedSection style={{ maxWidth: "700px" }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C4783C",
              marginBottom: "1rem",
            }}
          >
            L&apos;Artigiano
          </p>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 300,
              color: "#1A1510",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              marginBottom: "1.8rem",
            }}
          >
            Chi è Salvo
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "1rem",
              color: "#6B5C4A",
              lineHeight: 1.75,
              maxWidth: "560px",
            }}
          >
            Un artigiano catanese che racconta la Sicilia una tegola alla volta.
            Scene di vita quotidiana dipinte a mano su maiolica.
          </p>
        </AnimatedSection>
      </section>

      {/* Storia — 2 colonne */}
      <section
        style={{
          background: "#FAF8F4",
          padding: "0 clamp(1.5rem, 5vw, 4rem) 6rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            maxWidth: "1100px",
          }}
          className="lg:grid-cols-2"
        >
          <AnimatedSection direction="left">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.9rem",
                  color: "#6B5C4A",
                  lineHeight: 1.85,
                }}
              >
                Cresciuto tra i mercati rionali di Catania, Salvo Moncada ha
                imparato da bambino che ogni angolo di Sicilia ha una storia da
                raccontare. La pescheria dell&apos;alba, il fruttivendolo del quartiere,
                il vicolo con i panni stesi — luoghi che molti attraversano senza
                fermarsi a guardare.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.9rem",
                  color: "#6B5C4A",
                  lineHeight: 1.85,
                }}
              >
                Salvo si è fermato. E ha iniziato a dipingere. Le tegole in
                maiolica sono il suo medium: un materiale povero e antico,
                trasformato in arte attraverso la pazienza e il colore.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.9rem",
                  color: "#6B5C4A",
                  lineHeight: 1.85,
                }}
              >
                Ogni opera viene dipinta a mano con smalti tradizionali siciliani
                e cotta ad alta temperatura. I colori che ne emergono durano
                generazioni. Come i ricordi che rappresentano.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.15}>
            <div
              style={{
                aspectRatio: "4/5",
                background: "linear-gradient(160deg, #EDE8DF 0%, #D8D0C4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(196,120,58,0.2), transparent)",
                  border: "1px solid rgba(196,120,58,0.2)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  right: "1.5rem",
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  color: "rgba(26,21,16,0.3)",
                  letterSpacing: "0.05em",
                }}
              >
                S. Moncada
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Processo — 4 step */}
      <section
        style={{
          background: "#F2EFE9",
          padding: "6rem clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <AnimatedSection style={{ marginBottom: "3.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C4783C",
              marginBottom: "0.7rem",
            }}
          >
            Come Nasce un&apos;Opera
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              color: "#1A1510",
              lineHeight: 1.1,
            }}
          >
            Il Processo Creativo
          </h2>
        </AnimatedSection>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
            gap: "2rem",
          }}
        >
          {processSteps.map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 0.1}>
              <div
                style={{
                  borderTop: "1px solid rgba(26,21,16,0.1)",
                  paddingTop: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "2.5rem",
                    fontWeight: 300,
                    color: "rgba(196,120,58,0.25)",
                    lineHeight: 1,
                    marginBottom: "0.8rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step.num}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    color: "#1A1510",
                    marginBottom: "0.7rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.82rem",
                    color: "#6B5C4A",
                    lineHeight: 1.75,
                  }}
                >
                  {step.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          background: "#FAF8F4",
          padding: "5rem clamp(1.5rem, 5vw, 4rem)",
          borderTop: "1px solid rgba(26,21,16,0.08)",
          borderBottom: "1px solid rgba(26,21,16,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {[
            { num: "200+", label: "Tegole create" },
            { num: "15+", label: "Anni di arte" },
            { num: "100%", label: "Fatto a mano" },
            { num: "Sicilia", label: "Ogni opera è unica" },
          ].map(({ num, label }) => (
            <AnimatedSection key={label}>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "2.8rem",
                  fontWeight: 300,
                  color: "#C4783C",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {num}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(26,21,16,0.4)",
                }}
              >
                {label}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA banner dark */}
      <section
        style={{
          background: "#0C0A07",
          padding: "6rem clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <AnimatedSection>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(196,120,58,0.7)",
              marginBottom: "1rem",
            }}
          >
            Commissioni
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "rgba(237,232,224,0.92)",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Ordina un&apos;opera unica
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.88rem",
              color: "rgba(237,232,224,0.45)",
              maxWidth: "460px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
            }}
          >
            Racconta la tua storia, il tuo luogo del cuore. Ogni commissione è
            unica e nasce da un dialogo diretto con Salvo.
          </p>
          <Link
            href="/ordina"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.9rem 2.2rem",
              background: "#C4783C",
              color: "#FAF8F4",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Inizia la tua commissione
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
