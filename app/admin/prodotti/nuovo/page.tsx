"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createArtwork } from "@/lib/actions";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid rgba(26,21,16,0.15)",
  padding: "0.7rem 0.9rem",
  fontFamily: "var(--font-inter)",
  fontSize: "0.85rem",
  color: "#1A1510",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)",
  fontSize: "0.6rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(26,21,16,0.4)",
  display: "block",
  marginBottom: "0.4rem",
};

export default function NuovoProdottoPage() {
  const [state, formAction, pending] = useActionState(createArtwork, null);

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/prodotti"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(26,21,16,0.35)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            marginBottom: "1rem",
          }}
        >
          ← Prodotti
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2.2rem",
            fontWeight: 300,
            color: "#1A1510",
          }}
        >
          Nuova opera
        </h1>
      </div>

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        {state?.error && (
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.78rem",
              color: "#b94040",
              padding: "0.6rem 0.9rem",
              border: "1px solid rgba(185,64,64,0.2)",
              background: "rgba(185,64,64,0.04)",
            }}
          >
            {state.error}
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="title">Titolo *</label>
            <input id="title" name="title" required style={inputStyle} placeholder="La Pescheria del Porto" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="subtitle">Sottotitolo</label>
            <input id="subtitle" name="subtitle" style={inputStyle} placeholder="Voci e profumi all'alba" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="description">Descrizione</label>
            <textarea id="description" name="description" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="year">Anno</label>
            <input id="year" name="year" type="number" defaultValue={new Date().getFullYear()} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="dimensions">Dimensioni</label>
            <input id="dimensions" name="dimensions" style={inputStyle} placeholder="20×20 cm" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="technique">Tecnica</label>
            <input id="technique" name="technique" style={inputStyle} placeholder="Maiolica dipinta a mano, smalto lucido" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="category">Categoria</label>
            <select
              id="category"
              name="category"
              style={{ ...inputStyle, appearance: "auto" }}
            >
              <option value="pescheria">Pescheria</option>
              <option value="fruttivendolo">Fruttivendolo</option>
              <option value="paesaggio">Paesaggio</option>
              <option value="personalizzato">Su commissione</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="price">Prezzo (€)</label>
            <input id="price" name="price" type="number" min={0} style={inputStyle} placeholder="320" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="image">Percorso immagine</label>
            <input
              id="image"
              name="image"
              style={inputStyle}
              placeholder="/images/artworks/nome-file.jpg"
              defaultValue="/images/artworks/hero-tile.jpg"
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="available">Disponibilità</label>
            <select
              id="available"
              name="available"
              style={{ ...inputStyle, appearance: "auto" }}
            >
              <option value="true">Disponibile</option>
              <option value="false">Non disponibile</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.8rem 1.8rem",
              background: pending ? "rgba(196,120,58,0.5)" : "#C4783C",
              color: "#FAF8F4",
              border: "none",
              cursor: pending ? "default" : "pointer",
            }}
          >
            {pending ? "Salvataggio…" : "Salva opera →"}
          </button>
          <Link
            href="/admin/prodotti"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.8rem 1.4rem",
              border: "1px solid rgba(26,21,16,0.15)",
              color: "rgba(26,21,16,0.5)",
              textDecoration: "none",
            }}
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
