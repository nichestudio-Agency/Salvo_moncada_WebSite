"use client";

import { useActionState, useState } from "react";
import { createCategoria, toggleCategoriaAttiva, renameCategoriaAction, deleteCategoriaAction } from "@/lib/actions";
import type { Categoria } from "@/types/db";

const inputStyle: React.CSSProperties = {
  background: "#FFFFFF", border: "1px solid rgba(26,21,16,0.15)",
  padding: "0.6rem 0.9rem", fontFamily: "var(--font-inter)", fontSize: "0.85rem",
  color: "#1A1510", outline: "none", width: "100%",
};
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.2em",
  textTransform: "uppercase", color: "rgba(26,21,16,0.4)", display: "block", marginBottom: "0.35rem",
};

export default function CategorieClient({ categorie }: { categorie: Categoria[] }) {
  const [state, formAction, pending] = useActionState(createCategoria, null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Lista categorie */}
      <div>
        <p style={{ ...labelStyle, marginBottom: "0.8rem" }}>Categorie esistenti</p>
        {categorie.length === 0 ? (
          <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF", padding: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "rgba(26,21,16,0.35)" }}>
              Nessuna categoria. Creane una qui sotto.
            </p>
          </div>
        ) : (
          <div style={{ border: "1px solid rgba(26,21,16,0.1)", background: "#FFFFFF" }}>
            {categorie.map((cat, i) => (
              <div
                key={cat.id}
                style={{
                  padding: "0.9rem 1.2rem",
                  borderBottom: i < categorie.length - 1 ? "1px solid rgba(26,21,16,0.07)" : "none",
                  display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
                  opacity: cat.attiva ? 1 : 0.55,
                }}
              >
                {editingId === cat.id ? (
                  <div style={{ flex: 1, display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      style={{ ...inputStyle, width: "auto", flex: 1 }}
                      autoFocus
                    />
                    <button
                      onClick={async () => {
                        if (editNome.trim()) await renameCategoriaAction(cat.id, editNome.trim());
                        setEditingId(null);
                      }}
                      style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 0.9rem", background: "#C4783C", color: "#FAF8F4", border: "none", cursor: "pointer" }}
                    >
                      Salva
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 0.9rem", border: "1px solid rgba(26,21,16,0.15)", background: "transparent", color: "rgba(26,21,16,0.5)", cursor: "pointer" }}
                    >
                      Annulla
                    </button>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.88rem", color: "#1A1510" }}>{cat.nome}</p>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", color: "rgba(26,21,16,0.3)", letterSpacing: "0.1em" }}>
                      /{cat.slug}
                    </span>
                    {!cat.attiva && (
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", padding: "2px 6px", background: "rgba(26,21,16,0.06)", color: "rgba(26,21,16,0.4)", border: "1px solid rgba(26,21,16,0.12)", borderRadius: 999 }}>
                        Archiviata
                      </span>
                    )}
                  </div>
                )}

                {editingId !== cat.id && (
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button
                      onClick={() => { setEditingId(cat.id); setEditNome(cat.nome); }}
                      style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.35rem 0.75rem", border: "1px solid rgba(26,21,16,0.15)", background: "transparent", color: "rgba(26,21,16,0.5)", cursor: "pointer" }}
                    >
                      Rinomina
                    </button>
                    <form action={toggleCategoriaAttiva.bind(null, cat.id, !cat.attiva)}>
                      <button type="submit" style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.35rem 0.75rem", border: "1px solid rgba(26,21,16,0.15)", background: "transparent", color: "rgba(26,21,16,0.5)", cursor: "pointer" }}>
                        {cat.attiva ? "Archivia" : "Riattiva"}
                      </button>
                    </form>
                    <form action={deleteCategoriaAction.bind(null, cat.id)}>
                      <button type="submit" style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.35rem 0.75rem", border: "1px solid rgba(185,64,64,0.2)", background: "transparent", color: "rgba(185,64,64,0.6)", cursor: "pointer" }}>
                        Elimina
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form nuova categoria */}
      <div style={{ borderTop: "1px solid rgba(26,21,16,0.08)", paddingTop: "1.5rem" }}>
        <p style={{ ...labelStyle, marginBottom: "1rem" }}>Nuova categoria</p>
        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {state?.error && (
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "#b94040", padding: "0.5rem 0.8rem", border: "1px solid rgba(185,64,64,0.2)", background: "rgba(185,64,64,0.04)" }}>
              {state.error}
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "0.75rem", alignItems: "end" }}>
            <div>
              <label style={labelStyle} htmlFor="nome">Nome categoria</label>
              <input id="nome" name="nome" required style={inputStyle} placeholder="Es: Paesaggio marino" />
            </div>
            <div>
              <label style={labelStyle} htmlFor="ordine">Ordine</label>
              <input id="ordine" name="ordine" type="number" defaultValue={0} style={inputStyle} />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={pending}
              style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.75rem 1.6rem", background: pending ? "rgba(196,120,58,0.5)" : "#C4783C", color: "#FAF8F4", border: "none", cursor: pending ? "default" : "pointer" }}
            >
              {pending ? "Salvataggio…" : "+ Crea categoria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
