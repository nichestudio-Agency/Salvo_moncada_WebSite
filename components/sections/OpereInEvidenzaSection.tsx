import Image from 'next/image'
import Link from 'next/link'
import type { Opera } from '@/types/db'
import ScrollReveal from '@/components/ui/ScrollReveal'

const disponibilitaLabel: Record<string, { label: string; color: string }> = {
  disponibile:    { label: 'Disponibile',     color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  venduta:        { label: 'Venduta',          color: 'text-rose-600 bg-rose-50 border-rose-200' },
  riservata:      { label: 'Riservata',        color: 'text-amber-700 bg-amber-50 border-amber-200' },
  non_in_vendita: { label: 'Non in vendita',   color: 'text-charcoal/60 bg-sand border-black/10' },
}

function ArtworkCard({ opera }: { opera: Opera }) {
  const imageUrl = opera.immagini[0] ?? null
  const dispo = disponibilitaLabel[opera.disponibilita] ?? disponibilitaLabel.non_in_vendita

  return (
    <Link href={`/opere/${opera.slug}`} className="group flex flex-col">
      <div
        className="relative overflow-hidden rounded-2xl bg-[#ede6dc] shadow-[0_4px_24px_rgba(28,16,8,0.07)] transition-shadow duration-500 group-hover:shadow-[0_12px_40px_rgba(28,16,8,0.14)]"
        style={{ aspectRatio: '3/4' }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={opera.titolo}
            fill
            className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-xs text-charcoal/30">Opera</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`inline-block rounded-full border px-3 py-1 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.16em] ${dispo.color}`}>
            {dispo.label}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-coral px-5 py-2.5 shadow-lg">
            <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cream">
              Scopri →
            </span>
          </div>
        </div>
      </div>
      <div className="pt-4 px-1">
        <h3 className="font-display text-[1.2rem] font-bold text-ink leading-tight transition-colors duration-300 group-hover:text-coral">
          {opera.titolo}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          {opera.tecnica && (
            <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
              {opera.tecnica}
            </span>
          )}
          {opera.tecnica && opera.anno && <span className="text-charcoal/25 text-xs">·</span>}
          {opera.anno && (
            <span className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.16em] text-charcoal/45">
              {opera.anno}
            </span>
          )}
          {opera.dimensioni && (
            <>
              <span className="text-charcoal/25 text-xs">·</span>
              <span className="font-sans text-[0.6rem] text-charcoal/40">{opera.dimensioni}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}


export default function OpereInEvidenzaSection({ opere }: { opere: Opera[] }) {
  if (!opere || opere.length === 0) return null

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-site">
        <ScrollReveal direction="up" className="mb-14 md:mb-18">
          <div className="flex items-end justify-between gap-6 border-b border-black/8 pb-8">
            <div>
              <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-coral mb-3">
                Ultime opere
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-black tracking-[-0.04em] text-ink leading-[0.92]">
                Tegole che<br />
                <em className="font-script font-normal not-italic text-[0.68em] tracking-normal text-terracotta">
                  raccontano la Sicilia
                </em>
              </h2>
            </div>
            <Link
              href="/opere"
              className="hidden shrink-0 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-charcoal/50 transition-colors duration-300 hover:text-coral md:block"
            >
              Vedi tutte →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {opere.map((opera, i) => (
            <ScrollReveal key={opera.id} direction="up" delay={i * 0.12}>
              <ArtworkCard opera={opera} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/opere"
            className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-charcoal/50 transition-colors duration-300 hover:text-coral"
          >
            Vedi tutte le opere →
          </Link>
        </div>
      </div>
    </section>
  )
}
