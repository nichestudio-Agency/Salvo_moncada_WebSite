"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateArtwork } from "@/lib/actions";
import type { Opera, Categoria } from "@/types/db";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#FFFFFF", border: "1px solid rgba(26,21,16,0.15)",
  padding: "0.7rem 0.9rem", fontFamily: "var(--font-inter)", fontSize: "0.85rem",
  color: "#1A1510", outline: "none",
};
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.2em",
  textTransform: "uppercase", color: "rgba(26,21,16,0.4)", display: "block", marginBottom: "0.4rem",
};

export default function EditArtworkForm({ opera, categorie }: { opera: Opera; categorie: Categoria[] }) {
  const boundAction = updateArtwork.bind(null, opera.slug);
  const [state, formAction, pending] = useActionState(boundAction, null);

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/prodotti" style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(26,21,16,0.35)", textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}>
          ← Prodotti
        </Link>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#1A1510", marginBottom: "0.2rem" }}>
          Modifica opera
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem", color: "rgba(26,21,16,0.35)" }}>
          {opera.slug}
        </p>
      </div>

      <form action={formAction} encType="multipart/form-data" style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        {state?.error && (
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "#b94040", padding: "0.6rem 0.9rem", border: "1px solid rgba(185,64,64,0.2)", background: "rgba(185,64,64,0.04)" }}>
            {state.error}
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="titolo">Titolo *</label>
            <input id="titolo" name="titolo" required defaultValue={opera.titolo} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="sottotitolo">Sottotitolo</label>
            <input id="sottotitolo" name="sottotitolo" defaultValue={opera.sottotitolo} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="descrizione">Descrizione</label>
            <textarea id="descrizione" name="descrizione" rows={4} defaultValue={opera.descrizione} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="anno">Anno</label>
            <input id="anno" name="anno" type="number" defaultValue={opera.anno ?? ""} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="dimensioni">Dimensioni</label>
            <input id="dimensioni" name="dimensioni" defaultValue={opera.dimensioni} style={inputStyle} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="tecnica">Tecnica</label>
            <input id="tecnica" name="tecnica" defaultValue={opera.tecnica} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="categoria">
              Categoria
              <Link href="/admin/categorie" style={{ marginLeft: "0.5rem", color: "#C4783C", fontSize: "0.52rem", textDecoration: "none" }}>
                Gestisci →
              </Link>
            </label>
            <select id="categoria" name="categoria" defaultValue={opera.categoria} style={{ ...inputStyle, appearance: "auto" }}>
              {categorie.length === 0 && (
                <option value={opera.categoria}>{opera.categoria}</option>
              )}
              {categorie.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="prezzo">Prezzo (€)</label>
            <input id="prezzo" name="prezzo" type="number" min={0} defaultValue={opera.prezzo ?? ""} style={inputStyle} placeholder="Vuoto = nessun prezzo" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="disponibilita">Disponibilità</label>
            <select id="disponibilita" name="disponibilita" defaultValue={opera.disponibilita} style={{ ...inputStyle, appearance: "auto" }}>
              <option value="disponibile">Disponibile</option>
              <option value="riservata">Riservata</option>
              <option value="venduta">Venduta</option>
              <option value="non_in_vendita">Non in vendita</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="in_evidenza">In evidenza (homepage)</label>
            <select id="in_evidenza" name="in_evidenza" defaultValue={String(opera.in_evidenza)} style={{ ...inputStyle, appearance: "auto" }}>
              <option value="false">No</option>
              <option value="true">Sì</option>
            </select>
          </div>

          {/* Immagine attuale */}
          {opera.immagini[0] && (
            <div style={{ gridColumn: "1 / -1" }}>
              <p style={labelStyle}>Immagine attuale</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={opera.immagini[0]} alt={opera.titolo} style={{ height: 120, objectFit: "contain", background: "#f0ebe4", padding: 8 }} />
            </div>
          )}

          {/* Upload nuova immagine */}
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid rgba(26,21,16,0.08)", paddingTop: "1rem" }}>
            <label style={labelStyle}>Sostituisci immagine</label>
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
                <input id="immagine_url" name="immagine_url" defaultValue={opera.immagini[0] ?? ""} style={inputStyle} placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <button type="submit" disabled={pending} style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.8rem 1.8rem", background: pending ? "rgba(196,120,58,0.5)" : "#C4783C", color: "#FAF8F4", border: "none", cursor: pending ? "default" : "pointer" }}>
            {pending ? "Salvataggio…" : "Salva modifiche →"}
          </button>
          <Link href="/admin/prodotti" style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.8rem 1.4rem", border: "1px solid rgba(26,21,16,0.15)", color: "rgba(26,21,16,0.5)", textDecoration: "none" }}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
