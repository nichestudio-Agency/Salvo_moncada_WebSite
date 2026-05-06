import ScrollReveal from '@/components/ui/ScrollReveal'

const steps = [
  {
    number: '01',
    title: 'La Tegola',
    description:
      'Ogni opera inizia con la ricerca della tegola giusta. Antiche, vissute, con la patina del tempo. Salvo le seleziona una ad una tra mercati e vecchie masserie siciliane.',
  },
  {
    number: '02',
    title: 'Il Disegno',
    description:
      'Prima di toccare il pennello, Salvo studia la composizione. Lo schizzo a matita definisce la scena, i personaggi, la luce. Ogni dettaglio è pensato.',
  },
  {
    number: '03',
    title: 'La Pittura',
    description:
      'Colori acrilici stesi con pazienza certosina. Le scene prendono vita layer dopo layer, rispettando la texture naturale della tegola.',
  },
  {
    number: '04',
    title: 'La Firma',
    description:
      "L'opera è completa quando Salvo la firma. Un gesto rituale: da questo momento la tegola non è più materiale da costruzione, è arte.",
  },
]

export default function ProcessoCreativoSection() {
  return (
    <section className="bg-ivory py-24 md:py-32 overflow-hidden">
      <div className="container-site">

        {/* Header */}
        <ScrollReveal direction="up" className="mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-black/8 pb-8">
            <div>
              <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-coral mb-3">
                Come nascono
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-black tracking-[-0.04em] text-ink leading-[0.92]">
                Il Processo
                <br />
                <em className="font-script font-normal not-italic text-[0.68em] tracking-normal text-terracotta">
                  Creativo
                </em>
              </h2>
            </div>
            <p className="max-w-xs font-body text-sm leading-relaxed text-charcoal/55 md:text-right">
              Quattro momenti che trasformano<br className="hidden md:block" /> una tegola antica in opera d&apos;arte.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} direction="up" delay={i * 0.1}>
              <div className="group relative flex flex-col border-l border-black/8 px-8 py-8 first:border-l-0 md:first:border-l md:odd:border-l-0 lg:first:border-l-0 lg:[&:nth-child(n)]:border-l lg:[&:first-child]:border-l-0">

                {/* Numero grande decorativo */}
                <span
                  className="pointer-events-none select-none font-display font-black leading-none text-ink/[0.04] transition-colors duration-500 group-hover:text-coral/10"
                  style={{ fontSize: 'clamp(5rem, 10vw, 8rem)' }}
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* Dot sulla linea */}
                <div className="absolute -left-[5px] top-10 h-2.5 w-2.5 rounded-full border-2 border-coral bg-ivory transition-colors duration-300 group-hover:bg-coral first:hidden" />

                {/* Contenuto */}
                <div className="mt-4 flex flex-col gap-3">
                  <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-coral">
                    {step.number}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-ink leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-charcoal/60">
                    {step.description}
                  </p>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}
