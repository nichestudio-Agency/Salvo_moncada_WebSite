'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { Opera } from '@/types/db'
import ArtworkCard from '@/components/artwork/ArtworkCard'

export type OperaConSrc = Opera

function EditorialGrid({ opere }: { opere: Opera[] }) {
  if (opere.length === 0) return null
  return (
    <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
      {opere.map((opera) => (
        <ArtworkCard key={opera.id} opera={opera} ratio="3/4" titleSize="text-base" />
      ))}
    </div>
  )
}

export default function GalleriaClient({ opere, totale }: {
  opere: Opera[]
  totale: number
}) {
  const [filtraDisponibilita, setFiltraDisponibilita] = useState('tutte')
  const [filtraAnno, setFiltraAnno]                   = useState('tutti')
  const [filtriAperti, setFiltriAperti]               = useState(false)

  const anniDisponibili = useMemo(
    () => [...new Set(opere.map((op) => op.anno).filter((a): a is number => a != null))].sort((a, b) => b - a),
    [opere]
  )

  const opereFiltrate = useMemo(() => {
    return opere.filter((op) => {
      const okDisp =
        filtraDisponibilita === 'tutte' ||
        (filtraDisponibilita === 'disponibili' && op.disponibilita === 'disponibile') ||
        (filtraDisponibilita === 'vendute'     && op.disponibilita === 'venduta')
      const okAnno = filtraAnno === 'tutti' || String(op.anno) === filtraAnno
      return okDisp && okAnno
    })
  }, [opere, filtraDisponibilita, filtraAnno])

  const filtriAttivi = filtraDisponibilita !== 'tutte' || filtraAnno !== 'tutti'

  function resetFiltri() {
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

            <div className="hidden flex-wrap items-center gap-2 md:flex">
              {(['tutte', 'disponibili', 'vendute'] as const).map((v) => (
                <Pill key={v} active={filtraDisponibilita === v} onClick={() => setFiltraDisponibilita(v)}>
                  {v === 'tutte' ? 'Tutte' : v === 'disponibili' ? 'Disponibili' : 'Vendute'}
                </Pill>
              ))}

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

            <button
              className="flex items-center gap-2 md:hidden font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-charcoal/60"
              onClick={() => setFiltriAperti((v) => !v)}
            >
              <span>Filtra</span>
              {filtriAttivi && <span className="h-1.5 w-1.5 rounded-full bg-coral" />}
            </button>

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
