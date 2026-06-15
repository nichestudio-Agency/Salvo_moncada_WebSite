import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import ContactForm from '@/components/contatti/ContactForm'
import { getOpereTitoli } from '@/lib/supabase/db'

export const metadata: Metadata = {
  title: 'Contatti | Salvo Moncada',
  description: 'Contatta Salvo Moncada per informazioni sulle opere, commissioni personalizzate o collaborazioni.',
}

export default async function ContattiPage() {
  const opere = await getOpereTitoli().catch(() => [])
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
                href="mailto:moncadasalvo71@gmail.com"
                className="font-body text-base text-ivory/70 transition-colors duration-200 hover:text-gold"
              >
                moncadasalvo71@gmail.com
              </a>
            </div>

            <div className="border-t border-ivory/10 pt-6">
              <p className="mb-3 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-ivory/30">
                Scrivimi direttamente
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/393404143319"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/45 transition-colors hover:text-gold"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="https://m.me/artesutegola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/45 transition-colors hover:text-gold"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
                  </svg>
                  Messenger
                </a>
              </div>
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
                <a href="https://www.facebook.com/artesutegola" target="_blank" rel="noopener noreferrer"
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
          <Suspense fallback={null}>
            <ContactForm opere={opere.map((o) => o.titolo)} />
          </Suspense>
        </div>
      </div>

    </main>
  )
}
