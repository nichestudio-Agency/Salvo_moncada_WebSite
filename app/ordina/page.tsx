import OrderForm from "@/components/sections/OrderForm";

export const metadata = {
  title: "Ordina — Salvo Moncada",
  description: "Richiedi una tegola in maiolica personalizzata. Racconta la tua storia e Salvo la dipingerà.",
};

export default function OrdinaPage() {
  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "8rem clamp(1.5rem, 5vw, 3rem) 6rem",
        }}
      >
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
          Commissioni
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 300,
            color: "#1A1510",
            lineHeight: 1,
            letterSpacing: "-0.01em",
            marginBottom: "1.2rem",
          }}
        >
          Ordina un&apos;Opera
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.9rem",
            color: "#6B5C4A",
            lineHeight: 1.75,
            maxWidth: "500px",
            marginBottom: "3rem",
          }}
        >
          Ogni tegola è realizzata su misura. Racconta la tua storia — il
          mercato di tuo nonno, la casa d&apos;infanzia, un vicolo del cuore — e
          Salvo la trasformerà in maiolica.
        </p>

        <OrderForm />
      </section>
    </div>
  );
}
