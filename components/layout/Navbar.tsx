"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "/galleria", label: "Galleria" },
  { href: "/chi-sono", label: "Chi è Salvo" },
  { href: "/ordina", label: "Ordina" },
];

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();
  const [isOverDark, setIsOverDark] = useState(pathname === "/");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setIsOverDark(false);
      return;
    }
    setIsOverDark(true);
    const onScroll = () => {
      setIsOverDark(window.scrollY < window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const textColor = isOverDark
    ? "rgba(237,232,224,0.88)"
    : "rgba(26,21,16,0.85)";
  const accentColor = isOverDark ? "rgba(212,160,74,0.85)" : "#C4783C";
  const activeColor = isOverDark ? "rgba(212,160,74,0.9)" : "#C4783C";
  const inactiveColor = isOverDark
    ? "rgba(237,232,224,0.45)"
    : "rgba(26,21,16,0.45)";

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ padding: "1.6rem clamp(1.5rem, 5vw, 4rem)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      >
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.3rem",
              fontWeight: 300,
              color: textColor,
              letterSpacing: "0.07em",
              transition: "color 0.4s",
            }}
          >
            Salvo Moncada
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.55rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: accentColor,
              marginTop: "0.15rem",
              transition: "color 0.4s",
            }}
          >
            Tegole in Maiolica
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative group"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: active ? activeColor : inactiveColor,
                  transition: "color 0.25s",
                  textDecoration: "none",
                }}
              >
                {label}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{
                    width: active ? "100%" : "0%",
                    backgroundColor: active ? accentColor : accentColor,
                  }}
                />
              </Link>
            );
          })}
          <Link
            href="/carrello"
            className="relative inline-flex items-center justify-center"
            style={{ color: pathname === "/carrello" ? activeColor : textColor, transition: "color 0.25s" }}
            aria-label={`Carrello (${cartCount})`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6" />
              <circle cx="10" cy="20.5" r="1.2" />
              <circle cx="17" cy="20.5" r="1.2" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute", top: -6, right: -8,
                  minWidth: 18, height: 18, padding: "0 5px",
                  background: "#C4783C", color: "#FAF8F4",
                  fontFamily: "var(--font-inter)", fontSize: "0.58rem", fontWeight: 600,
                  borderRadius: 999,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5"
          style={{ width: 28, height: 28, background: "none", border: "none", padding: 0 }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Apri menu"
        >
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1.5,
              backgroundColor: textColor,
              transition: "all 0.3s",
              transformOrigin: "center",
              transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1.5,
              backgroundColor: textColor,
              transition: "all 0.3s",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1.5,
              backgroundColor: textColor,
              transition: "all 0.3s",
              transformOrigin: "center",
              transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
            style={{ background: "#0C0A07" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(2rem, 8vw, 3rem)",
                    fontWeight: 300,
                    color: pathname === href ? "#C4783C" : "rgba(237,232,224,0.75)",
                    textDecoration: "none",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
