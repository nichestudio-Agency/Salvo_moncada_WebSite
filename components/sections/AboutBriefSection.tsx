import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface AboutBriefSectionProps {
  artistaImage?: string
}

export default function AboutBriefSection({ artistaImage }: AboutBriefSectionProps) {
  const imageSrc = artistaImage ?? '/profilo.png'

  return (
    <section className="relative overflow-hidden bg-espresso py-24 md:py-32">
      {/* Texture sottile */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 0.8px, transparent 0.8px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Luce ambientale in alto a destra */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-gold/8 blur-[80px]" />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Colonna sinistra — immagine */}
          <ScrollReveal direction="left">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Cornice decorativa offset */}
              <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] border border-gold/15" />

              <div className="relative overflow-hidden rounded-[2rem] bg-espresso-warm shadow-[0_32px_80px_rgba(0,0,0,0.4)]" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={imageSrc}
                  alt="Salvo Moncada — Artista"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 80vw, 45vw"
                />
                {/* Vignetta in basso */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso/80 to-transparent" />
              </div>

              {/* Tag flottante */}
              <div className="absolute -left-4 bottom-10 rounded-xl border border-white/8 bg-white/6 px-4 py-3 backdrop-blur-md md:-left-8">
                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-ivory/50">
                  Artista
                </p>
                <p className="mt-0.5 font-display text-lg font-bold text-ivory">
                  Salvo Moncada
                </p>
                <p className="font-sans text-[0.6rem] text-gold/80">Sicilia</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Colonna destra — testo */}
          <ScrollReveal direction="right" delay={0.15}>
            <div>
              <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-gold mb-5">
                L&apos;Artista
              </p>

              <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-black tracking-[-0.04em] text-ivory leading-[0.92]">
                Ogni tegola
                <br />
                <em className="font-script font-normal not-italic text-[0.65em] tracking-normal text-gold">
                  è una storia
                </em>
              </h2>

              <p className="mt-8 font-body text-[1.05rem] leading-relaxed text-ivory/65">
                Salvo Moncada nasce in Sicilia, dove le tegole antiche raccontano storie
                dimenticate. Da anni trasforma questi frammenti di storia in opere d&apos;arte
                uniche, dipingendo scene di vita quotidiana con colori vivaci e tecnica
                raffinata.
              </p>

              {/* Citazione */}
              <div className="mt-10 border-l-2 border-gold/40 pl-6">
                <blockquote className="font-script text-[1.7rem] leading-snug text-gold/90">
                  &laquo;La tegola porta già con sé<br />la memoria del tempo&raquo;
                </blockquote>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <Link
                  href="/artista"
                  className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-ivory/8 px-6 py-3 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory transition-all duration-300 hover:border-gold/50 hover:bg-ivory/12 hover:text-gold"
                >
                  Scopri la storia di Salvo
                  <span className="text-sm">→</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  )
}
