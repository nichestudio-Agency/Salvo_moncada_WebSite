"use client";

import { useActionState } from "react";
import { adminLogin } from "@/lib/actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#0C0A07",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <p
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.4rem",
            fontWeight: 300,
            color: "rgba(237,232,224,0.9)",
            letterSpacing: "0.07em",
            marginBottom: "0.3rem",
          }}
        >
          Salvo Moncada
        </p>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(196,120,58,0.7)",
            marginBottom: "2.5rem",
          }}
        >
          Pannello Admin
        </p>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {state?.error && (
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.78rem",
                color: "#e07070",
                padding: "0.6rem 0.9rem",
                border: "1px solid rgba(224,112,112,0.2)",
                background: "rgba(224,112,112,0.06)",
              }}
            >
              {state.error}
            </p>
          )}

          <div>
            <label
              htmlFor="password"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(237,232,224,0.3)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              style={{
                width: "100%",
                background: "rgba(237,232,224,0.06)",
                border: "1px solid rgba(237,232,224,0.12)",
                padding: "0.8rem 1rem",
                fontFamily: "var(--font-inter)",
                fontSize: "0.88rem",
                color: "rgba(237,232,224,0.85)",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.85rem 1.5rem",
              background: pending ? "rgba(196,120,58,0.4)" : "#C4783C",
              color: "#FAF8F4",
              border: "none",
              transition: "background 0.2s",
              width: "100%",
            }}
          >
            {pending ? "Accesso…" : "Accedi →"}
          </button>
        </form>
      </div>
    </div>
  );
}
