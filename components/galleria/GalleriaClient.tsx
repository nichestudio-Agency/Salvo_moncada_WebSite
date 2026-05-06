'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Opera, Serie } from '@/types/sanity'
import { urlFor } from '@/lib/sanity/image'

export type OperaConSrc = Opera & { staticSrc?: string }

const disponibilitaConfig: Record<string, { label: string; classes: string }> = {
  disponibile:    { label: 'Disponibile',   classes: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  venduta:        { label: 'Venduta',        classes: 'text-rose-600 bg-rose-50 border-rose-200' },
  riservata:      { label: 'Riservata',      classes: 'text-amber-700 bg-amber-50 border-amber-200' },
  non_in_vendita: { label: 'Non in vendita', classes: 'text-charcoal/60 bg-sand border-black/10' },
}

function getImageUrl(opera: OperaConSrc, w: number): string | null {
  return opera.immaginiPrincipali?.[0]
    ? urlFor(opera.immaginiPrincipali[0]).width(w).url()
    : (opera.staticSrc ?? null)
}

function CardBase({
  opera,
  ratio = '3/4',
  titleSize = 'text-xl',
}: {
  opera: OperaConSrc
  ratio?: string
  titleSize?: string
}) {
  const imageUrl = getImageUrl(opera, 800)
  const dispo = disponibilitaConfig[opera.disponibilita] ?? disponibilitaConfig.non_in_vendita

  return (
    <Link href={`/opere/${opera.slug.current}`} className="group flex flex-col">
      <div
        className="relative overflow-hidden rounded-2xl bg-[#ede6dc] shadow-[0_4px_20px_rgba(28,16,8,0.07)] transition-shadow duration-500 group-hover:shadow-[0_16px_48px_rgba(28,16,8,0.15)]"
        style={{ aspectRatio: ratio }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={opera.titolo}
            fill
            className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-xs text-charcoal/25">Opera</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-block rounded-full border px-2.5 py-0.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.14em] ${dispo.classes}`}>
            {dispo.label}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-coral px-5 py-2 shadow-lg">
            <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream">
              Scopri →
            </span>
          </div>
        </div>
      </div>
      <div className="px-1 pt-3 pb-1">
        <h3 className={`font-display font-bold text-ink leading-tight transition-colors duration-300 group-hover:text-coral ${titleSize}`}>
          {opera.titolo}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2">
          {opera.serie && (
            <span className="font-sans text-[0.57rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
              {opera.serie.nome}
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

function SerieDropdown({
  serie,
  value,
  onChange,
}: {
  serie: Serie[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = serie.find((s) => s.slug.current === value)
  const label = selected ? selected.nome : 'Tutte le serie'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex items-center gap-2 rounded-full border px-4 py-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition-all duration-200',
          value !== 'tutte'
            ? 'border-coral bg-coral text-cream'
            : 'border-black/10 text-charcoal/55 hover:border-coral/50 hover:text-coral',
        ].join(' ')}
      >
        {label}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[160px] overflow-hidden rounded-xl border border-black/8 bg-cream shadow-[0_8px_32px_rgba(28,16,8,0.12)]"
          >
            {[{ slug: { current: 'tutte' }, nome: 'Tutte le serie', _id: '__all__', _type: 'serie' as const }, ...serie].map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => { onChange(s.slug.current); setOpen(false) }}
                className={[
                  'w-full px-4 py-2.5 text-left font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-150',
                  value === s.slug.current
                    ? 'bg-coral/8 text-coral'
                    : 'text-charcoal/65 hover:bg-black/4 hover:text-ink',
                ].join(' ')}
              >
                {s.nome}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EditorialGrid({ opere }: { opere: OperaConSrc[] }) {
  if (opere.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
      {opere.map((opera) => (
        <CardBase key={opera._id} opera={opera} ratio="3/4" titleSize="text-base" />
      ))}
    </div>
  )
}

export default function GalleriaClient({ opere, serie, totale }: {
  opere: OperaConSrc[]
  serie: Serie[]
  totale: number
}) {
  const [filtraSerie, setFiltraSerie]                 = useState('tutte')
  const [filtraDisponibilita, setFiltraDisponibilita] = useState('tutte')
  const [filtraAnno, setFiltraAnno]                   = useState('tutti')
  const [filtriAperti, setFiltriAperti]               = useState(false)

  const anniDisponibili = useMemo(
    () => [...new Set(opere.map((op) => op.anno))].sort((a, b) => b - a),
    [opere]
  )

  const opereFiltrate = useMemo(() => {
    return opere.filter((op) => {
      const okSerie = filtraSerie === 'tutte' || op.serie?.slug?.current === filtraSerie
      const okDisp =
        filtraDisponibilita === 'tutte' ||
        (filtraDisponibilita === 'disponibili' && op.disponibilita === 'disponibile') ||
        (filtraDisponibilita === 'vendute'     && op.disponibilita === 'venduta')
      const okAnno = filtraAnno === 'tutti' || String(op.anno) === filtraAnno
      return okSerie && okDisp && okAnno
    })
  }, [opere, filtraSerie, filtraDisponibilita, filtraAnno])

  const filtriAttivi = filtraSerie !== 'tutte' || filtraDisponibilita !== 'tutte' || filtraAnno !== 'tutti'

  function resetFiltri() {
    setFiltraSerie('tutte')
    setFiltraDisponibilita('tutte')
    setFiltraAnno('tutti')
  }

  function Pill({ active, onClick, children }: {
    active: boolean; onClick: () => void; children: React.ReactNode
  }) {
    return (
      <button
        onClick={onClick}
        className={[
          'rounded-full border px-4 py-1.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition-all duration-200 whitespace-nowrap',
          active
            ? 'border-coral bg-coral text-cream'
            : 'border-black/10 bg-transparent text-charcoal/55 hover:border-coral/50 hover:text-coral',
        ].join(' ')}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO HEADER ─────────────────────────────────── */}
      <header className="relative overflow-hidden bg-espresso">
        {/* Texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/4 translate-x-1/4 rounded-full bg-coral/8 blur-[80px]" />

        <div className="container-site relative z-10 pb-16 pt-36 md:pb-20 md:pt-44">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.36em] text-coral">
                Galleria
              </p>
              <h1 className="font-display text-[clamp(4rem,12vw,10rem)] font-black leading-[0.85] tracking-[-0.06em] text-ivory">
                Opere
              </h1>
              <p className="mt-3 font-script text-[clamp(1.6rem,3vw,2.8rem)] text-gold/80">
                una collezione di storie
              </p>
            </div>

            {/* Stat + intro */}
            <div className="max-w-xs md:mb-2 md:text-right">
              <p className="font-display text-[4rem] font-black leading-none tracking-[-0.05em] text-ivory/10">
                {totale}
              </p>
              <p className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.22em] text-ivory/35 -mt-2">
                opere originali
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-ivory/45">
                Tegole antiche trasformate in scene di vita siciliana. Ogni pezzo è unico e irripetibile.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── BARRA FILTRI ────────────────────────────────── */}
      <div className="sticky z-40 border-b border-black/6 bg-cream/96 backdrop-blur-sm" style={{ top: 0 }}>
        <div className="container-site">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Filtri inline su desktop */}
            <div className="hidden flex-wrap items-center gap-2 md:flex">
              {/* Disponibilità */}
              {(['tutte', 'disponibili', 'vendute'] as const).map((v) => (
                <Pill key={v} active={filtraDisponibilita === v} onClick={() => setFiltraDisponibilita(v)}>
                  {v === 'tutte' ? 'Tutte' : v === 'disponibili' ? 'Disponibili' : 'Vendute'}
                </Pill>
              ))}

              {serie.length > 0 && (
                <>
                  <div className="h-4 w-px bg-black/10 mx-1" />
                  <SerieDropdown serie={serie} value={filtraSerie} onChange={setFiltraSerie} />
                </>
              )}

              {anniDisponibili.length > 1 && (
                <>
                  <div className="h-4 w-px bg-black/10 mx-1" />
                  {anniDisponibili.map((a) => (
                    <Pill key={a} active={filtraAnno === String(a)} onClick={() => setFiltraAnno(String(a))}>
                      {a}
                    </Pill>
                  ))}
                </>
              )}
            </div>

            {/* Mobile: bottone apri filtri */}
            <button
              className="flex items-center gap-2 md:hidden font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-charcoal/60"
              onClick={() => setFiltriAperti((v) => !v)}
            >
              <span>Filtra</span>
              {filtriAttivi && (
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              )}
            </button>

            {/* Contatore + reset */}
            <div className="ml-auto flex items-center gap-4 shrink-0">
              {filtriAttivi && (
                <>
                  <span className="font-sans text-[0.6rem] text-charcoal/35 hidden md:block">
                    {opereFiltrate.length} risultat{opereFiltrate.length === 1 ? 'o' : 'i'}
                  </span>
                  <button
                    onClick={resetFiltri}
                    className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-charcoal/40 transition-colors hover:text-coral"
                  >
                    × Rimuovi
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Mobile filtri espansi */}
          <AnimatePresence>
            {filtriAperti && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden md:hidden"
              >
                <div className="flex flex-wrap gap-2 pb-4">
                  {(['tutte', 'disponibili', 'vendute'] as const).map((v) => (
                    <Pill key={v} active={filtraDisponibilita === v} onClick={() => setFiltraDisponibilita(v)}>
                      {v === 'tutte' ? 'Tutte' : v === 'disponibili' ? 'Disponibili' : 'Vendute'}
                    </Pill>
                  ))}
                  {anniDisponibili.map((a) => (
                    <Pill key={a} active={filtraAnno === String(a)} onClick={() => setFiltraAnno(String(a))}>
                      {a}
                    </Pill>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── GRIGLIA ─────────────────────────────────────── */}
      <section className="container-site py-12 pb-28">
        <AnimatePresence mode="wait">
          {opereFiltrate.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <p className="font-display text-[6rem] font-black leading-none text-black/5">∅</p>
              <h2 className="font-display text-2xl font-bold text-ink mb-2 mt-4">Nessuna opera trovata</h2>
              <p className="font-sans text-sm text-charcoal/45 mb-8">Nessuna opera corrisponde ai filtri selezionati</p>
              <button
                onClick={resetFiltri}
                className="rounded-full border border-coral px-6 py-2.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-coral transition-colors hover:bg-coral hover:text-cream"
              >
                Rimuovi i filtri
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EditorialGrid opere={opereFiltrate} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </div>
  )
}
