"use client"

import { useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Opera } from "@/types/db"

const disponibilitaConfig: Record<string, { label: string; classes: string }> = {
  disponibile:    { label: "Disponibile",   classes: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  venduta:        { label: "Venduta",        classes: "text-rose-600 bg-rose-50 border-rose-200" },
  riservata:      { label: "Riservata",      classes: "text-amber-700 bg-amber-50 border-amber-200" },
  non_in_vendita: { label: "Non in vendita", classes: "text-charcoal/60 bg-sand border-black/10" },
}

export default function ArtworkCard({
  opera,
  ratio = "3/4",
  titleSize = "text-xl",
}: {
  opera: Opera
  ratio?: string
  titleSize?: string
}) {
  const badgeRef = useRef<HTMLDivElement>(null)
  const imageUrl = opera.immagini[0] ?? null
  const dispo = disponibilitaConfig[opera.disponibilita] ?? disponibilitaConfig.non_in_vendita

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const badge = badgeRef.current
    if (!badge) return
    const rect = e.currentTarget.getBoundingClientRect()
    badge.style.transform = `translate(calc(${e.clientX - rect.left}px - 50%), calc(${e.clientY - rect.top}px - 50%))`
  }, [])

  const onMouseEnter = useCallback(() => {
    if (badgeRef.current) badgeRef.current.style.opacity = "1"
  }, [])

  const onMouseLeave = useCallback(() => {
    if (badgeRef.current) badgeRef.current.style.opacity = "0"
  }, [])

  return (
    <Link href={`/opere/${opera.slug}`} className="group flex flex-col">
      <div
        className="relative overflow-hidden rounded-2xl bg-[#ede6dc] shadow-[0_4px_20px_rgba(28,16,8,0.06)] transition-shadow duration-700 group-hover:shadow-[0_24px_56px_rgba(28,16,8,0.16)]"
        style={{ aspectRatio: ratio }}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={opera.titolo}
            fill
            className="object-contain p-4 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-xs text-charcoal/25">Opera</span>
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.14em] ${dispo.classes}`}>
            {dispo.label}
          </span>
        </div>

        {/* Cursor-following label */}
        <div
          ref={badgeRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 20,
            opacity: 0,
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.4s ease",
          }}
        >
          <span style={{
            display: "block",
            background: "#FDFAF5",
            border: "1px solid rgba(26,21,16,0.07)",
            borderRadius: "100px",
            padding: "0.5rem 1.1rem",
            fontFamily: "var(--font-inter)",
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#1A1510",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(28,16,8,0.12)",
          }}>
            Vedi opera
          </span>
        </div>
      </div>

      <div className="px-1 pt-3 pb-1">
        <h3 className={`font-display font-bold text-ink leading-tight transition-colors duration-500 group-hover:text-coral ${titleSize}`}>
          {opera.titolo}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2">
          {opera.tecnica && (
            <span className="font-sans text-[0.57rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
              {opera.tecnica}
            </span>
          )}
          {opera.anno && (
            <span className="font-sans text-[0.57rem] text-charcoal/40">{opera.anno}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
