import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getOperaBySlug, getOpere } from '@/lib/supabase/db'
import type { Opera } from '@/types/db'
import OperaImageGallery from '@/components/artwork/OperaImageGallery'
import ViewTracker from '@/components/artwork/ViewTracker'

export const revalidate = 3600

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const opera = await getOperaBySlug(slug)
  return { title: `${opera?.titolo ?? slug} | Salvo Moncada` }
}

// ── Disponibilità ────────────────────────────────────────────────────────────

const disponibilitaConfig = {
  disponibile:    { label: 'Disponibile',   pill: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  venduta:        { label: 'Venduta',        pill: 'bg-rose-50 border-rose-200 text-rose-600' },
  riservata:      { label: 'Riservata',      pill: 'bg-amber-50 border-amber-200 text-amber-700' },
  non_in_vendita: { label: 'Non in vendita', pill: 'bg-sand border-black/10 text-charcoal/60' },
} as const

// ── Info Panel ───────────────────────────────────────────────────────────────

function OperaInfoPanel({ opera }: { opera: Opera }) {
  const dispo = disponibilitaConfig[opera.disponibilita] ?? disponibilitaConfig.non_in_vendita
  const encodedTitle = encodeURIComponent(opera.titolo)

  return (
    <div className="flex flex-col gap-0">
      <div className="pb-8 border-b border-black/8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black tracking-[-0.04em] text-ink leading-[0.92]">
              {opera.titolo}
            </h1>
            {opera.tecnica && (
              <p className="mt-2 font-script text-[1.5rem] text-terracotta">{opera.tecnica}</p>
            )}
          </div>
          <span className={`mt-1 shrink-0 inline-block rounded-full border px-3 py-1 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] ${dispo.pill}`}>
            {dispo.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-black/6 border border-black/6 rounded-xl overflow-hidden mt-8">
        {[
          { label: 'Anno',       value: opera.anno ? String(opera.anno) : '—' },
          { label: 'Dimensioni', value: opera.dimensioni || '—' },
          { label: 'Tecnica',    value: opera.tecnica || '—' },
          { label: 'Prezzo',     value: opera.prezzo ? `€ ${opera.prezzo}` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-cream px-5 py-4">
            <p className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.26em] text-charcoal/40 mb-1">
              {label}
            </p>
            <p className="font-body text-sm font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {opera.descrizione && (
        <div className="mt-8">
          <p className="font-body text-[0.95rem] leading-relaxed text-charcoal/65">{opera.descrizione}</p>
        </div>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-xl bg-[#ede6dc]/60 px-5 py-4">
        <span className="mt-0.5 text-terracotta text-lg leading-none">✦</span>
        <div>
          <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-charcoal/60">
            Opera originale certificata
          </p>
          <p className="mt-0.5 font-body text-xs text-charcoal/45 leading-relaxed">
            Ogni pezzo è unico, firmato dall&apos;artista e accompagnato da certificato di autenticità.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {opera.disponibilita === 'disponibile' && (
          <Link
            href={`/contatti?opera=${encodedTitle}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream shadow-[0_8px_24px_rgba(212,82,42,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,82,42,0.4)]"
          >
            Richiedi informazioni
          </Link>
        )}
        {opera.disponibilita !== 'disponibile' && (
          <div className={`w-full rounded-full px-8 py-4 text-center font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
            opera.disponibilita === 'venduta'   ? 'bg-rose-50 text-rose-500' :
            opera.disponibilita === 'riservata' ? 'bg-amber-50 text-amber-600' :
            'bg-sand text-charcoal/50'
          }`}>
            {dispo.label}
          </div>
        )}
        <p className="mt-3 text-center font-sans text-[0.6rem] text-charcoal/35 tracking-[0.1em]">
          Risposta entro 24 ore · Spedizione in tutta Italia
        </p>
      </div>
    </div>
  )
}

// ── Opere correlate ──────────────────────────────────────────────────────────

function OpereCorrelate({ currentSlug, opere }: { currentSlug: string; opere: Opera[] }) {
  const mostrate = opere.filter(op => op.slug !== currentSlug).slice(0, 3)
  if (mostrate.length === 0) return null

  return (
    <section className="bg-cream border-t border-black/6 py-20 md:py-24">
      <div className="container-site">
        <div className="mb-10 flex items-end justify-between border-b border-black/8 pb-6">
          <div>
            <p className="mb-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-coral">
              Scopri anche
            </p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-black tracking-[-0.04em] text-ink leading-none">
              Altre opere
            </h2>
          </div>
          <Link href="/opere" className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-charcoal/45 transition-colors hover:text-coral">
            Vedi tutte →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {mostrate.map(opera => {
            const dispo = disponibilitaConfig[opera.disponibilita] ?? disponibilitaConfig.non_in_vendita
            return (
              <Link key={opera.id} href={`/opere/${opera.slug}`} className="group flex flex-col">
                <div
                  className="relative overflow-hidden rounded-2xl bg-[#ede6dc] shadow-[0_4px_20px_rgba(28,16,8,0.07)] transition-shadow duration-500 group-hover:shadow-[0_12px_36px_rgba(28,16,8,0.13)]"
                  style={{ aspectRatio: '3/4' }}
                >
                  {opera.immagini[0] ? (
                    <Image
                      src={opera.immagini[0]} alt={opera.titolo} fill
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-sans text-xs text-charcoal/25">Opera</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.14em] ${dispo.pill}`}>
                      {dispo.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-coral px-5 py-2 shadow-lg">
                      <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-cream">Scopri →</span>
                    </div>
                  </div>
                </div>
                <div className="px-1 pt-3">
                  <h3 className="font-display text-lg font-bold text-ink leading-tight transition-colors duration-300 group-hover:text-coral">
                    {opera.titolo}
                  </h3>
                  <p className="mt-1 font-sans text-[0.6rem] font-medium uppercase tracking-[0.16em] text-charcoal/40">
                    {opera.anno ?? ''}{opera.tecnica ? ` — ${opera.tecnica}` : ''}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function OperaDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [opera, altreOpere] = await Promise.all([
    getOperaBySlug(slug),
    getOpere().catch(() => []),
  ])

  if (!opera) notFound()

  return (
    <main className="bg-cream min-h-screen">
      <ViewTracker slug={slug} />

      <div className="relative overflow-hidden bg-espresso pt-32 pb-12 md:pt-40 md:pb-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }}
        />
        <div className="container-site relative z-10">
          <nav className="mb-6 flex items-center gap-2 font-sans text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ivory/35">
            <Link href="/" className="transition-colors hover:text-ivory/70">Home</Link>
            <span>/</span>
            <Link href="/opere" className="transition-colors hover:text-ivory/70">Galleria</Link>
            <span>/</span>
            <span className="text-ivory/60">{opera.titolo}</span>
          </nav>
          <h1 className="font-display text-[clamp(2.4rem,7vw,6rem)] font-black leading-[0.88] tracking-[-0.05em] text-ivory">
            {opera.titolo}
          </h1>
          {opera.sottotitolo && (
            <p className="mt-3 font-script text-[clamp(1.2rem,2.5vw,2rem)] text-gold/75">{opera.sottotitolo}</p>
          )}
        </div>
      </div>

      <div className="container-site py-14 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="lg:sticky lg:top-20">
            <OperaImageGallery images={opera.immagini} titolo={opera.titolo} />
          </div>
          <OperaInfoPanel opera={opera} />
        </div>
      </div>

      <OpereCorrelate currentSlug={slug} opere={altreOpere} />

    </main>
  )
}
