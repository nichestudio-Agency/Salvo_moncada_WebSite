import type { Metadata } from 'next'
import Image from 'next/image'
import ContactForm from '@/components/contatti/ContactForm'

export const metadata: Metadata = {
  title: 'Contatti | Salvo Moncada',
  description: 'Contatta Salvo Moncada per informazioni sulle opere, commissioni personalizzate o collaborazioni.',
}

export default function ContattiPage() {
  return (
    <main className="min-h-screen bg-cream lg:flex">

      {/* ── PANNELLO SINISTRO ── */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-espresso px-8 py-32 lg:sticky lg:top-0 lg:h-screen lg:w-[42%] lg:px-14 lg:py-28 xl:px-20">

        {/* Foto sfondo */}
        <div className="absolute inset-0">
          <Image
            src="/profilo.png"
            alt="Salvo Moncada"
            fill
            className="object-cover object-top opacity-20"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/40 to-espresso/90" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }}
        />

        {/* Contenuto */}
        <div className="relative z-10 flex flex-col gap-10">
          {/* Titolo */}
          <div>
            <p className="mb-4 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.36em] text-gold/70">
              Scrivimi
            </p>
            <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] font-black leading-[0.88] tracking-[-0.05em] text-ivory">
              Parlia-<br />moci
            </h1>
            <p className="mt-3 font-script text-[clamp(1.3rem,2.5vw,2rem)] text-gold/70">
              sono felice di sentirti
            </p>
          </div>

          {/* Testo */}
          <p className="max-w-[340px] font-body text-[0.95rem] leading-relaxed text-ivory/50">
            Hai visto un&apos;opera che ti ha colpito? Vuoi una commissione su misura?
            Scrivimi — rispondo personalmente a ogni messaggio.
          </p>

          {/* Info contatto */}
          <div className="flex flex-col gap-6">
            <div className="border-t border-ivory/10 pt-6">
              <p className="mb-1.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-ivory/30">
                Email
              </p>
              <a
                href="mailto:info@salvomoncada.it"
                className="font-body text-base text-ivory/70 transition-colors duration-200 hover:text-gold"
              >
                info@salvomoncada.it
              </a>
            </div>

            <div className="border-t border-ivory/10 pt-6">
              <p className="mb-1.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-ivory/30">
                Studio
              </p>
              <p className="font-body text-base text-ivory/70">Sicilia, Italia</p>
              <p className="mt-0.5 font-sans text-[0.65rem] text-ivory/35">Su appuntamento</p>
            </div>

            <div className="border-t border-ivory/10 pt-6">
              <p className="mb-3 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-ivory/30">
                Seguimi
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com/salvomoncada" target="_blank" rel="noopener noreferrer"
                  className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/45 transition-colors hover:text-gold">
                  Instagram
                </a>
                <span className="text-ivory/20">·</span>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/45 transition-colors hover:text-gold">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Citazione in basso */}
        <div className="relative z-10 border-t border-ivory/10 pt-8 hidden lg:block">
          <p className="font-script text-[1.3rem] text-gold/60 leading-snug">
            &ldquo;Ogni opera è un pezzo di Sicilia<br />che porta con sé il calore del sole.&rdquo;
          </p>
        </div>
      </div>

      {/* ── PANNELLO DESTRO — FORM ── */}
      <div className="flex flex-1 items-start px-8 py-16 lg:overflow-y-auto lg:px-14 lg:py-28 xl:px-20">
        <div className="w-full max-w-[560px]">
          <p className="mb-2 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-coral">
            Modulo di contatto
          </p>
          <h2 className="mb-10 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-black tracking-[-0.04em] text-ink leading-none">
            Invia un messaggio
          </h2>
          <ContactForm />
        </div>
      </div>

    </main>
  )
}
