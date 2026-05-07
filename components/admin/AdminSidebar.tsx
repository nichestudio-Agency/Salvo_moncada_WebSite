"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/lib/actions";
import type { ReactNode } from "react";

const ICON_SIZE = 18;
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function IconDashboard() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}
function IconArt() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.7 1.5-1.5 0-1.5 1-2 2-2H17a4 4 0 0 0 4-4 9 9 0 0 0-9-10.5Z" />
      <circle cx="7.5" cy="11" r="1.2" />
      <circle cx="12" cy="7.5" r="1.2" />
      <circle cx="16.5" cy="11" r="1.2" />
    </svg>
  );
}
function IconCart() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" {...stroke}>
      <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="10" cy="20.5" r="1.2" />
      <circle cx="17" cy="20.5" r="1.2" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" {...stroke}>
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="7" cy="8" r="1.2" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" {...stroke}>
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
    </svg>
  );
}
function IconExternal() {
  return (
    <svg width={ICON_SIZE - 4} height={ICON_SIZE - 4} viewBox="0 0 24 24" {...stroke}>
      <path d="M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width={ICON_SIZE - 4} height={ICON_SIZE - 4} viewBox="0 0 24 24" {...stroke}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

type NavItem = { href: string; label: string; icon: ReactNode; badge?: number };

function Badge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span
      style={{
        marginLeft: "auto",
        minWidth: 20,
        height: 20,
        padding: "0 6px",
        background: "#C4783C",
        color: "#FAF8F4",
        fontFamily: "var(--font-inter)",
        fontSize: "0.62rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      {value > 99 ? "99+" : value}
    </span>
  );
}

export default function AdminSidebar({
  messaggiNonLetti,
  ordiniNuovi,
}: {
  messaggiNonLetti: number;
  ordiniNuovi: number;
}) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <IconDashboard /> },
    { href: "/admin/prodotti", label: "Prodotti", icon: <IconArt /> },
    { href: "/admin/ordini", label: "Ordini", icon: <IconCart />, badge: ordiniNuovi },
    { href: "/admin/messaggi", label: "Messaggi", icon: <IconMail />, badge: messaggiNonLetti },
    { href: "/admin/categorie", label: "Categorie", icon: <IconTag /> },
    { href: "/admin/statistiche", label: "Statistiche", icon: <IconChart /> },
  ];

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: "#0C0A07",
        borderRight: "1px solid rgba(237,232,224,0.07)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div style={{ padding: "1.6rem 1.4rem 1.2rem", borderBottom: "1px solid rgba(237,232,224,0.07)" }}>
        <Link href="/admin" style={{ textDecoration: "none", display: "block" }}>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.25rem",
              fontWeight: 300,
              color: "rgba(237,232,224,0.92)",
              letterSpacing: "0.06em",
              lineHeight: 1.1,
              marginBottom: "0.25rem",
            }}
          >
            Salvo Moncada
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.52rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(196,120,58,0.7)",
            }}
          >
            Pannello Admin
          </p>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: "1rem 0.7rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
        {items.map(({ href, label, icon, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.65rem 0.85rem",
                fontFamily: "var(--font-inter)",
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                color: active ? "#FAF8F4" : "rgba(237,232,224,0.55)",
                background: active ? "rgba(196,120,58,0.16)" : "transparent",
                borderLeft: `2px solid ${active ? "#C4783C" : "transparent"}`,
                textDecoration: "none",
                transition: "background-color 0.15s, color 0.15s",
              }}
            >
              <span style={{ color: active ? "#C4783C" : "rgba(237,232,224,0.5)", display: "inline-flex" }}>
                {icon}
              </span>
              <span>{label}</span>
              {badge !== undefined && <Badge value={badge} />}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "1rem 1.4rem 1.4rem", borderTop: "1px solid rgba(237,232,224,0.07)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-inter)",
            fontSize: "0.66rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(237,232,224,0.4)",
            textDecoration: "none",
          }}
        >
          <IconExternal />
          Vedi sito
        </Link>
        <form action={adminLogout}>
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-inter)",
              fontSize: "0.66rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(196,120,58,0.7)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <IconLogout />
            Esci
          </button>
        </form>
      </div>
    </aside>
  );
}
