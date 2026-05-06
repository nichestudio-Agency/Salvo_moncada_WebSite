import Link from 'next/link'
import type { Opera } from '@/types/db'
import ScrollReveal from '@/components/ui/ScrollReveal'
import ArtworkCard from '@/components/artwork/ArtworkCard'


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
              <ArtworkCard opera={opera} ratio="3/4" titleSize="text-[1.2rem]" />
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
