import ScrollReveal from '@/components/ui/ScrollReveal'

export default function QuoteSection() {
  return (
    <section className="relative overflow-hidden bg-espresso py-28 md:py-36">
      {/* Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 0.8px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Luce ambientale centrale */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/6 blur-[100px]" />

      <ScrollReveal direction="none">
        <div className="container-site relative z-10">
          <div className="mx-auto max-w-[820px] text-center">

            {/* Virgolette decorative */}
            <div className="mb-8 flex justify-center">
              <span className="font-display text-[5rem] leading-none text-coral/25 select-none" aria-hidden="true">
                "
              </span>
            </div>

            <blockquote>
              <p className="font-display text-[clamp(1.6rem,4vw,3rem)] font-bold italic leading-[1.25] text-ivory">
                Trasformo quello che il tempo ha abbandonato
                <br className="hidden md:block" />{' '}
                in qualcosa che il tempo{' '}
                <span className="text-gold">non potrà dimenticare</span>
              </p>
            </blockquote>

            {/* Linea decorativa */}
            <div className="mx-auto my-8 h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <cite className="font-script text-[1.8rem] text-gold/85 not-italic">
              — Salvo Moncada
            </cite>

          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
