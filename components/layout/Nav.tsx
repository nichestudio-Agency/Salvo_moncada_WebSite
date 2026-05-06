'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/opere', label: 'Galleria' },
  { href: '/artista', label: 'Artista' },
  { href: '/contatti', label: 'Contatti' },
]

export default function Nav() {
  const [visible, setVisible] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    // Home: appare dopo 80px di scroll
    if (isHome) {
      setVisible(window.scrollY > 80)
      const onScroll = () => setVisible(window.scrollY > 80)
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    // Altre pagine: sempre visibile, si nasconde scrollando giù, riappare su
    setVisible(true)
    let lastY = window.scrollY
    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY < 10) {
        setVisible(true)
      } else if (currentY > lastY) {
        setVisible(false) // scroll giù
      } else {
        setVisible(true)  // scroll su
      }
      lastY = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.header
            key="navbar"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-[100]"
          >
            <div className="border-b border-black/8 bg-[#f7f1eb]/95 backdrop-blur-md">
              <div className="container-site">
                <div className="flex h-14 items-center justify-between md:h-16">

                  {/* Logo + Nome */}
                  <Link
                    href="/"
                    aria-label="Home Salvo Moncada"
                    className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-60"
                  >
                    <Image
                      src="/logo.png"
                      alt="Logo Salvo Moncada"
                      width={40}
                      height={40}
                      className="h-auto w-7 object-contain md:w-8"
                      priority
                    />
                    <span className="font-script text-[1.5rem] leading-none text-charcoal md:text-[1.7rem]">
                      Salvo Moncada
                    </span>
                  </Link>

                  {/* Desktop links */}
                  <nav className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={[
                          'relative font-sans text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300',
                          pathname === link.href
                            ? 'text-coral'
                            : 'text-charcoal/70 hover:text-ink',
                        ].join(' ')}
                      >
                        {link.label}
                        {pathname === link.href && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute -bottom-0.5 left-0 right-0 h-px bg-coral"
                          />
                        )}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile hamburger */}
                  <button
                    className="text-ink md:hidden"
                    aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
                    onClick={() => setMobileOpen((v) => !v)}
                    type="button"
                  >
                    <span className="flex flex-col gap-[5px]">
                      <motion.span
                        animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="block h-px w-6 bg-current"
                      />
                      <motion.span
                        animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="block h-px w-6 bg-current"
                      />
                    </span>
                  </button>

                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-14 z-[90] border-b border-black/8 bg-[#f7f1eb]/98 backdrop-blur-md"
          >
            <div className="container-site py-6">
              <nav className="flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      'border-b border-black/6 py-4 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-200 last:border-0',
                      pathname === link.href ? 'text-coral' : 'text-charcoal/70 hover:text-ink',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
