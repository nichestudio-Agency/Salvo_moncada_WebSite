"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createArtwork } from "@/lib/actions";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#FFFFFF", border: "1px solid rgba(26,21,16,0.15)",
  padding: "0.7rem 0.9rem", fontFamily: "var(--font-inter)", fontSize: "0.85rem",
  color: "#1A1510", outline: "none",
};
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.2em",
  textTransform: "uppercase", color: "rgba(26,21,16,0.4)", display: "block", marginBottom: "0.4rem",
};

export default function NuovoProdottoPage() {
  const [state, formAction, pending] = useActionState(createArtwork, null);

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/prodotti" style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
          ← Prodotti
        </Link>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#1A1510" }}>
          Nuova opera
        </h1>
      </div>

      <form action={formAction} encType="multipart/form-data" style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        {state?.error && (
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "#b94040", padding: "0.6rem 0.9rem", border: "1px solid rgba(185,64,64,0.2)", background: "rgba(185,64,64,0.04)" }}>
            {state.error}
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="titolo">Titolo *</label>
            <input id="titolo" name="titolo" required style={inputStyle} placeholder="La Pescheria del Porto" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="sottotitolo">Sottotitolo</label>
            <input id="sottotitolo" name="sottotitolo" style={inputStyle} placeholder="Voci e profumi all'alba" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="descrizione">Descrizione</label>
            <textarea id="descrizione" name="descrizione" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="anno">Anno</label>
            <input id="anno" name="anno" type="number" defaultValue={new Date().getFullYear()} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="dimensioni">Dimensioni</label>
            <input id="dimensioni" name="dimensioni" style={inputStyle} placeholder="20×30 cm" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="tecnica">Tecnica</label>
            <input id="tecnica" name="tecnica" style={inputStyle} placeholder="Maiolica dipinta a mano, smalto lucido" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="categoria">Categoria</label>
            <select id="categoria" name="categoria" style={{ ...inputStyle, appearance: "auto" }}>
              <option value="paesaggio">Paesaggio</option>
              <option value="pescheria">Pescheria</option>
              <option value="fruttivendolo">Fruttivendolo</option>
              <option value="personalizzato">Su commissione</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="prezzo">Prezzo (€)</label>
            <input id="prezzo" name="prezzo" type="number" min={0} style={inputStyle} placeholder="320" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="disponibilita">Disponibilità</label>
            <select id="disponibilita" name="disponibilita" style={{ ...inputStyle, appearance: "auto" }}>
              <option value="disponibile">Disponibile</option>
              <option value="riservata">Riservata</option>
              <option value="venduta">Venduta</option>
              <option value="non_in_vendita">Non in vendita</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="in_evidenza">In evidenza (homepage)</label>
            <select id="in_evidenza" name="in_evidenza" style={{ ...inputStyle, appearance: "auto" }}>
              <option value="false">No</option>
              <option value="true">Sì</option>
            </select>
          </div>

          {/* Upload immagine */}
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid rgba(26,21,16,0.08)", paddingTop: "1rem" }}>
            <label style={labelStyle}>Immagine</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div>
                <label style={{ ...labelStyle, fontSize: "0.55rem", color: "rgba(26,21,16,0.3)" }} htmlFor="immagine_file">
                  Carica file (JPG, PNG, WEBP)
                </label>
                <input id="immagine_file" name="immagine_file" type="file" accept="image/*" style={{ ...inputStyle, padding: "0.5rem 0.9rem" }} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: "0.55rem", color: "rgba(26,21,16,0.3)" }} htmlFor="immagine_url">
                  Oppure incolla un URL
                </label>
                <input id="immagine_url" name="immagine_url" style={inputStyle} placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <button type="submit" disabled={pending} style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.8rem 1.8rem", background: pending ? "rgba(196,120,58,0.5)" : "#C4783C", color: "#FAF8F4", border: "none", cursor: pending ? "default" : "pointer" }}>
            {pending ? "Salvataggio…" : "Salva opera →"}
          </button>
          <Link href="/admin/prodotti" style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.8rem 1.4rem", border: "1px solid rgba(26,21,16,0.15)", color: "rgba(26,21,16,0.5)", textDecoration: "none" }}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
