'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const sideNotes = [
  'Opere originali su tegola antica recuperata.',
  'Scene siciliane, memoria popolare, gesto pittorico.',
  'Ogni pezzo nasce come opera unica, non replicabile.',
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#ded3c7] text-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.38),transparent_38%),linear-gradient(180deg,#e6dbd0_0%,#ded3c7_52%,#d9cec2_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(61,43,26,0.22) 0.7px, transparent 0.7px), radial-gradient(rgba(255,255,255,0.18) 0.6px, transparent 0.6px)',
          backgroundPosition: '0 0, 18px 14px',
          backgroundSize: '32px 32px, 40px 40px',
        }}
      />

      <div className="container-site relative z-10 py-6 md:py-8">
        <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] border border-black/6 bg-[#f7f1eb] px-5 py-6 shadow-[0_28px_80px_rgba(28,16,8,0.12)] md:px-8 md:py-8 lg:px-10 lg:pb-10">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),transparent_22%,transparent_76%,rgba(212,82,42,0.04))]" />

          <div className="relative z-10 mt-24 min-h-[84vh] overflow-hidden pb-10 lg:mt-28 lg:min-h-[86vh] lg:pb-12">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease }}
              className="pointer-events-none absolute left-[2%] top-[2%] z-20 max-w-[42vw] leading-[0.84] sm:left-[3%] lg:left-[2%]"
            >
              <div className="font-display text-[clamp(3rem,7.6vw,7.1rem)] font-black uppercase tracking-[-0.08em] text-coral">
                ARTE
              </div>
              <div className="pl-[0.06em] font-display text-[clamp(2.8rem,7.1vw,6.6rem)] font-black uppercase tracking-[-0.09em] text-transparent [-webkit-text-stroke:1.2px_rgba(212,82,42,0.95)]">
                SU
              </div>
              <div className="font-display text-[clamp(3.1rem,7.9vw,7.4rem)] font-black uppercase tracking-[-0.09em] text-coral">
                TEGOLA
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 1, ease }}
              className="absolute inset-x-[10%] bottom-0 top-[8%] z-10 md:inset-x-[16%] lg:inset-x-[18%]"
            >
              <div className="relative h-full w-full">
                <div className="absolute inset-x-[12%] bottom-0 h-16 rounded-full bg-black/14 blur-2xl" />
                <div className="absolute left-[8%] top-[10%] h-28 w-28 rounded-full border border-coral/12" />
                <div className="absolute right-[12%] top-[12%] h-32 w-32 rounded-full bg-gold/10 blur-2xl" />

                <Image
                  src="/profilo.png"
                  alt="Ritratto di Salvo Moncada"
                  fill
                  priority
                  sizes="(max-width: 768px) 88vw, 56vw"
                  className="object-contain object-bottom scale-[0.98] drop-shadow-[0_26px_46px_rgba(28,16,8,0.22)] md:scale-[1.03]"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.85, ease }}
              className="absolute right-[2%] top-[6%] z-20 max-w-[210px] sm:right-[4%] lg:max-w-[280px]"
            >
              <div className="rotate-[-4deg]">
                <p className="font-script text-[clamp(1.9rem,3.1vw,3rem)] leading-[0.95] text-terracotta/92 [text-shadow:1px_1px_0_rgba(196,98,45,0.08)]">
                  Ogni tegola custodisce
                </p>
                <p className="mt-1 font-script text-[clamp(1.9rem,3.1vw,3rem)] leading-[0.95] text-terracotta/92 [text-shadow:1px_1px_0_rgba(196,98,45,0.08)]">
                  una storia.
                </p>
                <p className="mt-3 ml-4 font-script text-[clamp(1.65rem,2.5vw,2.35rem)] leading-[0.98] text-charcoal/78 [text-shadow:1px_1px_0_rgba(61,43,26,0.06)]">
                  Io ci costruisco sopra scene
                </p>
                <p className="ml-2 font-script text-[clamp(1.65rem,2.5vw,2.35rem)] leading-[0.98] text-charcoal/78 [text-shadow:1px_1px_0_rgba(61,43,26,0.06)]">
                  che la fanno tornare viva.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.8, ease }}
              className="absolute bottom-[12%] left-[5%] z-20 md:left-[4%]"
            >
              <Link
                href="/opere"
                className="inline-flex min-h-[9rem] min-w-[9.5rem] flex-col justify-between rounded-[0.8rem] bg-coral px-4 py-4 shadow-xl transition-transform duration-300 hover:-translate-y-1 md:min-h-[10rem] md:min-w-[11rem] md:px-5 md:py-5"
              >
                <div>
                  <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cream/80">
                    Entra nella
                  </p>
                  <p className="mt-1 font-display text-3xl font-black uppercase leading-none tracking-[-0.05em] text-cream">
                    Galleria
                  </p>
                </div>
                <div className="border-t border-dashed border-cream/40 pt-4">
                  <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cream/75">
                    Vedi le opere
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.8, ease }}
              className="pointer-events-none absolute bottom-[10%] right-[5%] z-20 text-right leading-[0.83] sm:right-[6%] lg:right-[5%]"
            >
              <div className="font-display text-[clamp(2.4rem,6.2vw,5.8rem)] font-black uppercase tracking-[-0.065em] text-coral">
                OPERE
              </div>
              <div className="font-display text-[clamp(2.4rem,6.2vw,5.8rem)] font-black uppercase tracking-[-0.065em] text-coral">
                VIVE
              </div>
              <div className="mt-[-0.2rem] font-script text-[clamp(1.35rem,2.2vw,2.2rem)] normal-case text-terracotta">
                di Sicilia
              </div>
            </motion.div>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease }}
            className="relative z-20 mt-20 grid gap-4 border-t border-black/8 pt-6 md:mt-24 md:grid-cols-[1.1fr_0.9fr_1fr] lg:mt-28"
          >
            <div>
              <p className="font-sans text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-coral">
                Salvo Moncada
              </p>
              <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-charcoal/72">
                Tegole antiche trasformate in immagini intense, narrative e profondamente
                mediterranee.
              </p>
            </div>

            <div className="grid gap-2">
              {sideNotes.slice(0, 2).map((note) => (
                <p key={note} className="font-body text-sm leading-relaxed text-charcoal/70">
                  {note}
                </p>
              ))}
            </div>

            <div className="flex items-end justify-start md:justify-end">
              <Link
                href="/artista"
                className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:text-coral"
              >
                Scopri l&apos;artista
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
