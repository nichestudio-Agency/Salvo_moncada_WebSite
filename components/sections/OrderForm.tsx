"use client";

import { useState, useActionState } from "react";
import { motion } from "framer-motion";
import { createOrder } from "@/lib/actions";

type Dimensione = "20×20" | "25×25" | "30×30" | "personalizzato";
type Budget = "100-200" | "200-350" | "350+" | "da-definire";

export default function OrderForm() {
  const [dimensione, setDimensione] = useState<Dimensione | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [state, formAction, pending] = useActionState(createOrder, null);

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter)",
    fontSize: "0.65rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(26,21,16,0.45)",
    display: "block",
    marginBottom: "0.5rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid rgba(26,21,16,0.15)",
    padding: "0.75rem 1rem",
    fontFamily: "var(--font-inter)",
    fontSize: "0.88rem",
    color: "#1A1510",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const pillBase: React.CSSProperties = {
    fontFamily: "var(--font-inter)",
    fontSize: "0.65rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.5rem 1.1rem",
    border: "1px solid rgba(26,21,16,0.15)",
    background: "transparent",
    color: "rgba(26,21,16,0.4)",
    transition: "all 0.2s",
    cursor: "none",
  };

  const pillActive: React.CSSProperties = {
    ...pillBase,
    border: "1px solid #C4783C",
    background: "rgba(196,120,58,0.07)",
    color: "#C4783C",
  };

  if (state?.success) {
    return (
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          padding: "4rem 0",
          textAlign: "center",
        }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1.5px solid #C4783C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#C4783C",
            fontSize: "1.4rem",
          }}
        >
          ✓
        </div>
        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2.2rem",
            fontWeight: 300,
            color: "#1A1510",
          }}
        >
          Grazie!
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.88rem",
            color: "#6B5C4A",
            maxWidth: 420,
            lineHeight: 1.75,
          }}
        >
          Il messaggio è stato inviato. Salvo ti risponderà presto per
          discutere la tua opera e ogni dettaglio della commissione.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {state?.error && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.82rem",
            color: "#b94040",
            padding: "0.7rem 1rem",
            border: "1px solid rgba(185,64,64,0.25)",
            background: "rgba(185,64,64,0.04)",
          }}
        >
          {state.error}
        </p>
      )}

      {/* Hidden fields for pill selections */}
      <input type="hidden" name="dimensione" value={dimensione ?? ""} />
      <input type="hidden" name="budget" value={budget ?? ""} />

      {/* Nome + Email */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}
        className="md:grid-cols-2"
      >
        <div>
          <label style={labelStyle} htmlFor="nome">Nome *</label>
          <input required id="nome" name="nome" type="text" placeholder="Mario Rossi" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="email">Email *</label>
          <input required id="email" name="email" type="email" placeholder="mario@esempio.it" style={inputStyle} />
        </div>
      </div>

      {/* Descrizione scena */}
      <div>
        <label style={labelStyle} htmlFor="scena">Descrivi la scena che vorresti *</label>
        <textarea
          required
          id="scena"
          name="scena"
          rows={5}
          placeholder="Es: il mercato del pesce di mio nonno a Catania, con le casse di pesce e il banco di marmo..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Dimensione */}
      <div>
        <label style={labelStyle}>Dimensione</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(
            [
              ["20×20", "20×20 cm"],
              ["25×25", "25×25 cm"],
              ["30×30", "30×30 cm"],
              ["personalizzato", "Personalizzato"],
            ] as [Dimensione, string][]
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setDimensione(val)}
              style={dimensione === val ? pillActive : pillBase}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label style={labelStyle}>Budget indicativo</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(
            [
              ["100-200", "€ 100 – 200"],
              ["200-350", "€ 200 – 350"],
              ["350+", "€ 350+"],
              ["da-definire", "Da definire"],
            ] as [Budget, string][]
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setBudget(val)}
              style={budget === val ? pillActive : pillBase}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Messaggio aggiuntivo */}
      <div>
        <label style={labelStyle} htmlFor="messaggio">Messaggio aggiuntivo</label>
        <textarea
          id="messaggio"
          name="messaggio"
          rows={3}
          placeholder="Qualsiasi dettaglio in più che possa aiutare Salvo a capire la tua visione..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          alignSelf: "flex-start",
          fontFamily: "var(--font-inter)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "0.9rem 2.2rem",
          background: pending ? "rgba(196,120,58,0.5)" : "#C4783C",
          color: "#FAF8F4",
          border: "none",
          transition: "background 0.2s",
          cursor: "none",
        }}
      >
        {pending ? "Invio in corso…" : "Invia richiesta →"}
      </button>
    </form>
  );
}
