import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity/client'
import { operaBySlugQuery, tutteLeOpereQuery } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import type { Opera } from '@/types/sanity'
import type { OperaConSrc } from '@/components/galleria/GalleriaClient'
import OperaImageGallery from '@/components/artwork/OperaImageGallery'

// ---------------------------------------------------------------------------
// Static fallback
// ---------------------------------------------------------------------------

const staticMap: Record<string, {
  src: string; titolo: string; anno: number
  dimensioni: { larghezza: number; altezza: number }
  disponibilita: Opera['disponibilita']; tecnica: string; numeroPezzo?: string
}> = {
  'scena-di-paese':   { src: '/opere/opera-01.jpg', titolo: 'Scena di Paese',   anno: 2024, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '001' },
  'la-raccolta':      { src: '/opere/opera-02.jpg', titolo: 'La Raccolta',       anno: 2024, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '002' },
  'il-mercato':       { src: '/opere/opera-03.jpg', titolo: 'Il Mercato',        anno: 2023, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'venduta',        tecnica: 'Acrilico su tegola', numeroPezzo: '003' },
  'la-fontana':       { src: '/opere/opera-04.jpg', titolo: 'La Fontana',        anno: 2023, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '004' },
  'festa-del-santo':  { src: '/opere/opera-05.jpg', titolo: 'Festa del Santo',   anno: 2024, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'riservata',      tecnica: 'Acrilico su tegola', numeroPezzo: '005' },
  'la-vendemmia':     { src: '/opere/opera-06.jpg', titolo: 'La Vendemmia',      anno: 2022, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '006' },
  'vita-quotidiana':  { src: '/opere/opera-07.jpg', titolo: 'Vita Quotidiana',   anno: 2023, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '007' },
  'le-lavandaie':     { src: '/opere/opera-08.jpg', titolo: 'Le Lavandaie',      anno: 2022, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'venduta',        tecnica: 'Acrilico su tegola', numeroPezzo: '008' },
  'il-frantoio':      { src: '/opere/opera-09.jpg', titolo: 'Il Frantoio',       anno: 2024, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '009' },
  'la-passeggiata':   { src: '/opere/opera-10.jpg', titolo: 'La Passeggiata',    anno: 2023, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '010' },
  'il-pescatore':     { src: '/opere/opera-11.jpg', titolo: 'Il Pescatore',      anno: 2022, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'non_in_vendita', tecnica: 'Acrilico su tegola', numeroPezzo: '011' },
  'sera-al-paese':    { src: '/opere/opera-12.jpg', titolo: 'Sera al Paese',     anno: 2024, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '012' },
  'la-chiesa':        { src: '/opere/opera-13.jpg', titolo: 'La Chiesa',         anno: 2023, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'riservata',      tecnica: 'Acrilico su tegola', numeroPezzo: '013' },
  'giochi-in-piazza': { src: '/opere/opera-14.jpg', titolo: 'Giochi in Piazza',  anno: 2022, dimensioni: { larghezza: 20, altezza: 30 }, disponibilita: 'disponibile',    tecnica: 'Acrilico su tegola', numeroPezzo: '014' },
}

const staticOpereList: OperaConSrc[] = Object.entries(staticMap).map(([slug, data], i) => ({
  _id: String(i + 1), _type: 'opera' as const,
  titolo: data.titolo, slug: { current: slug }, anno: data.anno, tecnica: data.tecnica,
  disponibilita: data.disponibilita, inEvidenza: false, immaginiPrincipali: [],
  staticSrc: data.src, serie: undefined, dimensioni: data.dimensioni, tags: [],
}))

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  let titolo = staticMap[slug]?.titolo ?? slug
  try {
    const opera = await sanityClient.fetch<Opera | null>(operaBySlugQuery, { slug })
    if (opera?.titolo) titolo = opera.titolo
  } catch {}
  return { title: `${titolo} | Salvo Moncada` }
}

// ---------------------------------------------------------------------------
// Disponibilità config
// ---------------------------------------------------------------------------

const disponibilitaConfig = {
  disponibile:    { label: 'Disponibile',    pill: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  venduta:        { label: 'Venduta',         pill: 'bg-rose-50 border-rose-200 text-rose-600' },
  riservata:      { label: 'Riservata',       pill: 'bg-amber-50 border-amber-200 text-amber-700' },
  non_in_vendita: { label: 'Non in vendita',  pill: 'bg-sand border-black/10 text-charcoal/60' },
} as const

// ---------------------------------------------------------------------------
// Info Panel
// ---------------------------------------------------------------------------

function OperaInfoPanel({
  titolo, anno, tecnica, serie, dimensioni, numeroPezzo, disponibilita, descrizione,
}: {
  titolo: string; anno: number; tecnica: string; serie?: string
  dimensioni?: { larghezza: number; altezza: number }
  numeroPezzo?: string; disponibilita: Opera['disponibilita']
  descrizione?: string
}) {
  const dispo = disponibilitaConfig[disponibilita] ?? disponibilitaConfig.non_in_vendita
  const encodedTitle = encodeURIComponent(titolo)

  return (
    <div className="flex flex-col gap-0">

      {/* Intestazione */}
      <div className="pb-8 border-b border-black/8">
        <div className="flex items-start justify-between gap-4">
          <div>
            {serie && (
              <p className="mb-2 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-coral">
                {serie}
              </p>
            )}
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black tracking-[-0.04em] text-ink leading-[0.92]">
              {titolo}
            </h1>
            <p className="mt-2 font-script text-[1.5rem] text-terracotta">
              {tecnica}
            </p>
          </div>
          <span className={`mt-1 shrink-0 inline-block rounded-full border px-3 py-1 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.14em] ${dispo.pill}`}>
            {dispo.label}
          </span>
        </div>
      </div>

      {/* Dettagli tecnici */}
      <div className="grid grid-cols-2 gap-px bg-black/6 border border-black/6 rounded-xl overflow-hidden mt-8">
        {[
          { label: 'Anno',       value: String(anno) },
          { label: 'Dimensioni', value: dimensioni ? `${dimensioni.larghezza} × ${dimensioni.altezza} cm` : '—' },
          { label: 'Tecnica',    value: tecnica },
          { label: 'N° Pezzo',   value: numeroPezzo ? `#${numeroPezzo}` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-cream px-5 py-4">
            <p className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.26em] text-charcoal/40 mb-1">
              {label}
            </p>
            <p className="font-body text-sm font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Descrizione */}
      <div className="mt-8">
        <p className="font-body text-[0.95rem] leading-relaxed text-charcoal/65">
          {descrizione ?? `Un'opera che cattura la quotidianità della vita siciliana. Salvo Moncada ha immortalato questa scena con maestria, trasformando una semplice tegola in un racconto visivo ricco di dettagli e memoria collettiva.`}
        </p>
      </div>

      {/* Garanzia */}
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

      {/* CTA */}
      <div className="mt-8">
        {disponibilita === 'disponibile' && (
          <Link
            href={`/contatti?opera=${encodedTitle}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream shadow-[0_8px_24px_rgba(212,82,42,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,82,42,0.4)]"
          >
            Richiedi informazioni
          </Link>
        )}
        {disponibilita !== 'disponibile' && (
          <div className={`w-full rounded-full px-8 py-4 text-center font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
            disponibilita === 'venduta' ? 'bg-rose-50 text-rose-500' :
            disponibilita === 'riservata' ? 'bg-amber-50 text-amber-600' :
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

// ---------------------------------------------------------------------------
// Opere correlate
// ---------------------------------------------------------------------------

function OpereCorrelate({ currentSlug, opere }: { currentSlug: string; opere: OperaConSrc[] }) {
  const mostrate = opere.filter(op => op.slug.current !== currentSlug).slice(0, 3)
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
            const imageUrl = opera.immaginiPrincipali?.[0]
              ? urlFor(opera.immaginiPrincipali[0]).width(800).url()
              : (opera.staticSrc ?? null)
            const dispo = disponibilitaConfig[opera.disponibilita] ?? disponibilitaConfig.non_in_vendita

            return (
              <Link key={opera._id} href={`/opere/${opera.slug.current}`} className="group flex flex-col">
                <div
                  className="relative overflow-hidden rounded-2xl bg-[#ede6dc] shadow-[0_4px_20px_rgba(28,16,8,0.07)] transition-shadow duration-500 group-hover:shadow-[0_12px_36px_rgba(28,16,8,0.13)]"
                  style={{ aspectRatio: '3/4' }}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl} alt={opera.titolo} fill
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
                    {opera.anno}{opera.serie ? ` — ${opera.serie.nome}` : ''}
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function OperaDetailPage({ params }: PageProps) {
  const { slug } = await params

  let opera: Opera | null = null
  let altreOpere: OperaConSrc[] = staticOpereList

  try {
    const [fetchedOpera, fetchedOpere] = await Promise.all([
      sanityClient.fetch<Opera | null>(operaBySlugQuery, { slug }),
      sanityClient.fetch<Opera[]>(tutteLeOpereQuery),
    ])
    if (fetchedOpera) opera = fetchedOpera
    if (fetchedOpere?.length) altreOpere = fetchedOpere.map((op, i) => ({ ...op, _id: op._id ?? String(i) }))
  } catch {}

  const titolo       = opera?.titolo       ?? staticMap[slug]?.titolo
  const anno         = opera?.anno         ?? staticMap[slug]?.anno
  const tecnica      = opera?.tecnica      ?? staticMap[slug]?.tecnica
  const dimensioni   = opera?.dimensioni   ?? staticMap[slug]?.dimensioni
  const numeroPezzo  = opera?.numeroPezzo  ?? staticMap[slug]?.numeroPezzo
  const disponibilita = opera?.disponibilita ?? staticMap[slug]?.disponibilita
  const serieNome    = opera?.serie?.nome

  if (!titolo || !anno || !tecnica || !disponibilita) notFound()

  const images: string[] = []
  if (opera?.immaginiPrincipali?.length) {
    opera.immaginiPrincipali.forEach(img => images.push(urlFor(img).width(1400).url()))
  }
  if (images.length === 0 && staticMap[slug]?.src) images.push(staticMap[slug].src)

  return (
    <main className="bg-cream min-h-screen">

      {/* Hero header scuro */}
      <div className="relative overflow-hidden bg-espresso pt-32 pb-12 md:pt-40 md:pb-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }}
        />
        <div className="container-site relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 font-sans text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ivory/35">
            <Link href="/" className="transition-colors hover:text-ivory/70">Home</Link>
            <span>/</span>
            <Link href="/opere" className="transition-colors hover:text-ivory/70">Galleria</Link>
            {serieNome && <><span>/</span><span>{serieNome}</span></>}
            <span>/</span>
            <span className="text-ivory/60">{titolo}</span>
          </nav>
          <h1 className="font-display text-[clamp(2.4rem,7vw,6rem)] font-black leading-[0.88] tracking-[-0.05em] text-ivory">
            {titolo}
          </h1>
          {serieNome && (
            <p className="mt-3 font-script text-[clamp(1.2rem,2.5vw,2rem)] text-gold/75">{serieNome}</p>
          )}
        </div>
      </div>

      {/* Corpo pagina */}
      <div className="container-site py-14 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          {/* Sinistra — immagine sticky */}
          <div className="lg:sticky lg:top-20">
            <OperaImageGallery images={images} titolo={titolo} />
          </div>

          {/* Destra — info */}
          <OperaInfoPanel
            titolo={titolo} anno={anno} tecnica={tecnica}
            serie={serieNome} dimensioni={dimensioni}
            numeroPezzo={numeroPezzo} disponibilita={disponibilita}
          />
        </div>
      </div>

      {/* Opere correlate */}
      <OpereCorrelate currentSlug={slug} opere={altreOpere} />

    </main>
  )
}
