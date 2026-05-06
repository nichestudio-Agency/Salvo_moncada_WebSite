import Link from 'next/link'
import Image from 'next/image'

const exploreLinks = [
  { href: '/opere', label: 'Galleria' },
  { href: '/artista', label: 'Artista' },
  { href: '/contatti', label: 'Contatti' },
]

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-espresso">
      {/* Corpo principale */}
      <div className="container-site border-t border-white/6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.6fr_1fr_1fr] md:gap-16">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-70">
              <Image src="/logo.png" alt="Logo Salvo Moncada" width={44} height={44} className="h-auto w-9 object-contain" />
              <div>
                <p className="font-display text-lg font-black uppercase tracking-[0.06em] text-cream">
                  Salvo Moncada
                </p>
                <p className="font-script text-sm text-gold/80 leading-none mt-0.5">
                  Arte su Tegola · Sicilia
                </p>
              </div>
            </Link>

            <p className="max-w-[260px] font-body text-sm leading-relaxed text-ivory/45">
              Tegole antiche trasformate in storie di vita siciliana. Ogni opera è unica, dipinta a mano.
            </p>

            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="text-ivory/35 transition-colors duration-200 hover:text-gold">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="text-ivory/35 transition-colors duration-200 hover:text-gold">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Esplora */}
          <div>
            <p className="mb-5 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-gold/70">
              Esplora
            </p>
            <ul className="flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="font-sans text-sm text-ivory/45 transition-colors duration-200 hover:text-ivory">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <p className="mb-5 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.3em] text-gold/70">
              Contatti
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="mailto:info@salvomoncada.it"
                  className="font-sans text-sm text-ivory/45 transition-colors duration-200 hover:text-ivory">
                  info@salvomoncada.it
                </a>
              </li>
              <li>
                <span className="font-sans text-sm text-ivory/35">Sicilia, Italia</span>
              </li>
              <li>
                <a href="https://instagram.com/salvomoncada" target="_blank" rel="noopener noreferrer"
                  className="font-sans text-sm text-ivory/45 transition-colors duration-200 hover:text-gold">
                  @salvomoncada
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-site border-t border-white/6 py-5">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-sans text-[0.62rem] text-ivory/25">
            © {new Date().getFullYear()} Salvo Moncada · Tutti i diritti riservati
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="font-sans text-[0.62rem] text-ivory/25 transition-colors duration-200 hover:text-ivory/60">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="font-sans text-[0.62rem] text-ivory/25 transition-colors duration-200 hover:text-ivory/60">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
