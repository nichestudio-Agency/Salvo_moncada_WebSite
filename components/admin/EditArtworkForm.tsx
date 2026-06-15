"use client";

import { useActionState, useState } from "react";
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

  // Immagini esistenti che l'utente vuole mantenere
  const [keptImages, setKeptImages] = useState<string[]>(opera.immagini);

  function removeImage(url: string) {
    setKeptImages((prev) => prev.filter((u) => u !== url));
  }

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

        {/* Hidden inputs per le immagini da mantenere */}
        {keptImages.map((url) => (
          <input key={url} type="hidden" name="immagine_existing" value={url} />
        ))}

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
            <input id="prezzo" name="prezzo" type="number" min={0} defaultValue={opera.prezzo ?? ""} placeholder="Vuoto = nessun prezzo" style={inputStyle} />
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

          {/* Foto esistenti */}
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid rgba(26,21,16,0.08)", paddingTop: "1rem" }}>
            <p style={labelStyle}>Foto attuali {opera.immagini.length > 0 && `(${keptImages.length}/${opera.immagini.length})`}</p>

            {opera.immagini.length === 0 ? (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(26,21,16,0.35)" }}>Nessuna foto caricata.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {opera.immagini.map((url, i) => {
                  const kept = keptImages.includes(url);
                  return (
                    <div key={url} style={{ position: "relative", opacity: kept ? 1 : 0.35 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Foto ${i + 1}`}
                        style={{ width: 100, height: 100, objectFit: "cover", background: "#f0ebe4", display: "block" }}
                      />
                      <button
                        type="button"
                        onClick={() => kept ? removeImage(url) : setKeptImages((p) => [...p, url])}
                        title={kept ? "Rimuovi" : "Ripristina"}
                        style={{
                          position: "absolute", top: 4, right: 4,
                          width: 22, height: 22,
                          background: kept ? "rgba(185,64,64,0.85)" : "rgba(61,122,69,0.85)",
                          color: "#fff", border: "none", cursor: "pointer",
                          fontFamily: "var(--font-inter)", fontSize: "0.7rem", lineHeight: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {kept ? "×" : "↺"}
                      </button>
                      {i === 0 && kept && (
                        <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-inter)", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(196,120,58,0.85)", color: "#fff", padding: "2px 0" }}>
                          Copertina
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {keptImages.length === 0 && opera.immagini.length > 0 && (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem", color: "#b94040", marginTop: "0.5rem" }}>
                Tutte le foto verranno rimosse al salvataggio.
              </p>
            )}
          </div>

          {/* Aggiungi nuove foto */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle} htmlFor="immagine_files">Aggiungi foto (puoi selezionarne più di una)</label>
            <input
              id="immagine_files"
              name="immagine_files"
              type="file"
              accept="image/*"
              multiple
              style={{ ...inputStyle, padding: "0.5rem 0.9rem" }}
            />
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.62rem", color: "rgba(26,21,16,0.35)", marginTop: "0.4rem" }}>
              JPG, PNG, WEBP — tieni premuto Ctrl (o ⌘) per selezionare più foto
            </p>
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
