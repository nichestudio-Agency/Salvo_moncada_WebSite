import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: "L'Artista | Salvo Moncada",
  description: 'Scopri la storia di Salvo Moncada, maestro delle tegole dipinte e narratore della vita siciliana.',
}


export default function ArtistaPage() {
  return (
    <main className="bg-cream">

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] overflow-hidden bg-espresso">
        {/* Foto artista */}
        <div className="absolute inset-0">
          <Image
            src="/profilo.png"
            alt="Salvo Moncada"
            fill
            className="object-cover object-top opacity-50"
            priority
          />
        </div>
        {/* Gradiente drammatico */}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-transparent to-espresso" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/60 via-transparent to-transparent" />

        {/* Texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }}
        />

        {/* Contenuto in basso a sinistra */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-site pb-16 md:pb-20">
            <p className="mb-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.36em] text-gold/80">
              L&apos;Artista
            </p>
            <h1 className="font-display text-[clamp(3.5rem,9vw,9rem)] font-black leading-[0.85] tracking-[-0.05em] text-ivory">
              Salvo<br />Moncada
            </h1>
            <p className="mt-4 font-script text-[clamp(1.4rem,3vw,2.6rem)] text-gold/75">
              Maestro delle tegole dipinte
            </p>

            {/* Scroll indicator */}
            <div className="mt-10 flex items-center gap-3">
              <div className="h-px w-12 bg-ivory/20" />
              <span className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-ivory/35">
                Scorri per scoprire
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO EDITORIALE ────────────────────────────── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-site">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20 items-end">
              <div>
                <p className="mb-4 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-coral">
                  La storia
                </p>
                <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-black tracking-[-0.05em] text-ink leading-[0.9]">
                  Un artista nato<br />
                  <em className="font-script font-normal not-italic text-[0.68em] tracking-normal text-terracotta">
                    dalla tradizione
                  </em>
                </h2>
              </div>
              <p className="font-body text-[1.05rem] leading-relaxed text-charcoal/65 md:pb-2">
                Salvo Moncada nasce e cresce in Sicilia, immerso in una cultura ricca di colori,
                tradizioni e storie tramandate di generazione in generazione. Fin da bambino,
                le tegole dei tetti del suo paese rappresentano per lui non semplici elementi
                architettonici, ma frammenti di memoria collettiva.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CITAZIONE GRANDE ────────────────────────────── */}
      <section className="relative overflow-hidden bg-espresso py-24 md:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }}
        />
        <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/6 blur-[80px]" />

        <ScrollReveal direction="none">
          <div className="container-site relative z-10">
            <div className="mx-auto max-w-[780px] text-center">
              <span className="font-display text-[5rem] leading-none text-coral/20 select-none">&ldquo;</span>
              <blockquote className="-mt-6">
                <p className="font-display text-[clamp(1.5rem,3.5vw,2.6rem)] font-bold italic leading-[1.3] text-ivory">
                  Ogni tegola porta già con sé la memoria del tempo.
                  Io mi limito ad{' '}
                  <span className="text-gold">aggiungere la mia.</span>
                </p>
              </blockquote>
              <div className="mx-auto my-8 h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <cite className="font-script text-[1.7rem] text-gold/80 not-italic">— Salvo Moncada</cite>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── STORIA IN 2 COLONNE ─────────────────────────── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20 items-start">

            {/* Foto */}
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[2rem] border border-terracotta/15" />
                <div className="relative overflow-hidden rounded-[2rem] shadow-[0_32px_80px_rgba(28,16,8,0.15)]" style={{ aspectRatio: '4/5' }}>
                  <Image
                    src="/opere/opera-01.jpg"
                    alt="Opera di Salvo Moncada"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent" />
                </div>
                {/* Caption flottante */}
                <div className="absolute -right-4 bottom-12 rounded-xl border border-black/8 bg-cream px-4 py-3 shadow-lg md:-right-8">
                  <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-charcoal/50">Tecnica</p>
                  <p className="mt-0.5 font-display text-base font-bold text-ink">Acrilico su Tegola</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Testo */}
            <ScrollReveal direction="right" delay={0.1}>
              <div className="flex flex-col gap-7 md:pt-8">
                <p className="font-body text-[1.02rem] leading-relaxed text-charcoal/65">
                  La svolta arriva quando, durante un restauro di una vecchia masseria, si trova
                  tra le mani una tegola consumata dal tempo. Anziché gettarla, la osserva a lungo.
                  Vede in essa la forma perfetta per raccontare una storia.
                </p>
                <p className="font-body text-[1.02rem] leading-relaxed text-charcoal/65">
                  Da quel momento, inizia il suo percorso artistico unico nel suo genere. Ogni
                  tegola viene selezionata una ad una tra mercati e vecchie masserie siciliane —
                  antiche, vissute, con la patina del tempo.
                </p>

                {/* Pull quote inline */}
                <div className="border-l-2 border-coral/50 pl-5">
                  <p className="font-display text-[1.2rem] font-bold italic text-ink leading-snug">
                    Uno dei pochi artisti al mondo a praticare questa tecnica a livello professionale.
                  </p>
                </div>

                <p className="font-body text-[1.02rem] leading-relaxed text-charcoal/65">
                  Le sue opere sono apprezzate da collezionisti privati e istituzioni culturali,
                  e rappresentano un ponte tra l&apos;artigianato tradizionale siciliano e
                  l&apos;arte contemporanea.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>


      {/* ── GALLERIA STUDIO ─────────────────────────────── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-site">
          <ScrollReveal direction="up" className="mb-12 border-b border-black/8 pb-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="mb-3 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-coral">
                  Le opere
                </p>
                <h2 className="font-display text-[clamp(2rem,5vw,3.8rem)] font-black tracking-[-0.04em] text-ink leading-[0.92]">
                  Dalla tegola<br />
                  <em className="font-script font-normal not-italic text-[0.7em] tracking-normal text-terracotta">all&apos;opera d&apos;arte</em>
                </h2>
              </div>
              <Link href="/opere" className="hidden font-sans text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-charcoal/45 transition-colors hover:text-coral md:block">
                Vedi la galleria →
              </Link>
            </div>
          </ScrollReveal>

          {/* Griglia mista */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
            {[
              { src: '/opere/opera-01.jpg', tall: true },
              { src: '/opere/opera-02.jpg', tall: false },
              { src: '/opere/opera-03.jpg', tall: false },
              { src: '/opere/opera-04.jpg', tall: false },
              { src: '/opere/opera-05.jpg', tall: false },
              { src: '/opere/opera-06.jpg', tall: true },
              { src: '/opere/opera-07.jpg', tall: false },
              { src: '/opere/opera-08.jpg', tall: false },
            ].map(({ src, tall }, i) => (
              <ScrollReveal key={src} delay={i * 0.05}>
                <div
                  className={`group relative overflow-hidden rounded-2xl bg-[#ede6dc] ${tall ? 'md:row-span-2' : ''}`}
                  style={{ aspectRatio: tall ? '3/4' : '1/1' }}
                >
                  <Image
                    src={src}
                    alt={`Opera ${i + 1} di Salvo Moncada`}
                    fill
                    className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINALE ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-espresso py-28 md:py-36 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/6 blur-[90px]" />

        <ScrollReveal direction="up">
          <div className="container-site relative z-10">
            <p className="mb-5 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.36em] text-gold/70">
              Ogni pezzo è unico
            </p>
            <h2 className="mx-auto max-w-[640px] font-display text-[clamp(2.4rem,6vw,5rem)] font-black tracking-[-0.05em] leading-[0.9] text-ivory">
              Porta a casa un frammento di{' '}
              <em className="font-script font-normal not-italic text-[0.75em] tracking-normal text-gold">
                Sicilia
              </em>
            </h2>
            <div className="mx-auto my-10 h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/opere"
                className="rounded-full bg-coral px-8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream shadow-[0_8px_24px_rgba(212,82,42,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,82,42,0.45)]"
              >
                Esplora la collezione
              </Link>
              <Link
                href="/contatti"
                className="rounded-full border border-ivory/20 bg-ivory/8 px-8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory/70 transition-all hover:border-ivory/40 hover:text-ivory"
              >
                Contatta Salvo
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
