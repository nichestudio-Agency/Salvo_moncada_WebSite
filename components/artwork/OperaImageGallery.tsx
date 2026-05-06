'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface OperaImageGalleryProps {
  images: string[]
  titolo: string
}

const ZOOM_SCALE = 2.8
const ZOOM_SIZE = 420 // px — dimensione pannello zoom

export default function OperaImageGallery({ images, titolo }: OperaImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightbox, setLightbox]       = useState(false)
  const [mousePos, setMousePos]       = useState<{ x: number; y: number } | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const activeImage = images[activeIndex] ?? null
  const total = images.length

  function prev() { setActiveIndex((i) => (i - 1 + total) % total) }
  function next() { setActiveIndex((i) => (i + 1) % total) }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    setMousePos({ x, y })
  }

  // Lightbox keyboard
  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightbox, activeIndex])

  return (
    <>
      {/* Wrapper esterno — position relative per il pannello zoom */}
      <div className="relative flex gap-4">

        {/* ── Thumbnails verticali ── */}
        {total > 1 && (
          <div className="flex flex-col gap-2.5">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={[
                  'relative h-[72px] w-[56px] shrink-0 overflow-hidden rounded-xl bg-[#ede6dc] transition-all duration-200',
                  activeIndex === i ? 'ring-2 ring-coral ring-offset-1 opacity-100' : 'opacity-45 hover:opacity-80',
                ].join(' ')}
                aria-label={`Immagine ${i + 1}`}
              >
                <div className="absolute inset-1.5">
                  <div className="relative h-full w-full">
                    <Image src={src} alt={`${titolo} — ${i + 1}`} fill className="object-contain" sizes="56px" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Immagine principale ── */}
        <div className="flex-1">
          <div
            ref={imageRef}
            className="relative overflow-hidden rounded-2xl bg-[#ede6dc] shadow-[0_8px_40px_rgba(28,16,8,0.1)] cursor-crosshair select-none"
            style={{ aspectRatio: '3/4' }}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setMousePos(null)}
            onClick={() => setLightbox(true)}
          >
            {activeImage ? (
              <div className="absolute inset-5">
                <div className="relative h-full w-full">
                  <Image
                    src={activeImage}
                    alt={titolo}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-sans text-sm text-charcoal/30">Opera</span>
              </div>
            )}

            {/* Lente — area evidenziata che segue il mouse */}
            {mousePos && (
              <div
                className="pointer-events-none absolute rounded-sm border border-charcoal/20 bg-white/15 backdrop-blur-[1px]"
                style={{
                  width: `${(1 / ZOOM_SCALE) * 100}%`,
                  height: `${(1 / ZOOM_SCALE) * 100}%`,
                  left: `${mousePos.x * 100}%`,
                  top: `${mousePos.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}

            {/* Icona hint */}
            {!mousePos && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-espresso/50 px-2.5 py-1 backdrop-blur-sm">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <circle cx="5" cy="5" r="3.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3"/>
                  <path d="M8 8L11 11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M3.5 5H6.5M5 3.5V6.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span className="font-sans text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-ivory/70">Passa il mouse per ingrandire</span>
              </div>
            )}

            {/* Frecce */}
            {total > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 shadow-md backdrop-blur-sm transition-all hover:bg-cream hover:scale-110"
                  aria-label="Precedente">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7L9 12" stroke="#3d2b1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cream/80 shadow-md backdrop-blur-sm transition-all hover:bg-cream hover:scale-110"
                  aria-label="Successiva">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2L10 7L5 12" stroke="#3d2b1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="absolute bottom-3 right-3 rounded-full bg-espresso/60 px-2.5 py-1 backdrop-blur-sm">
                  <span className="font-sans text-[0.58rem] font-semibold text-ivory/80">{activeIndex + 1} / {total}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Pannello zoom (appare a destra) ── */}
        {mousePos && activeImage && (
          <div
            className="pointer-events-none absolute top-0 z-50 overflow-hidden rounded-2xl border border-black/8 bg-[#ede6dc] shadow-[0_16px_60px_rgba(28,16,8,0.22)]"
            style={{
              left: 'calc(100% + 16px)',
              width: ZOOM_SIZE,
              height: ZOOM_SIZE,
              backgroundImage: `url(${activeImage})`,
              backgroundSize: `${ZOOM_SCALE * 100}%`,
              backgroundPosition: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

      </div>

      {/* ── Lightbox ── */}
      {lightbox && activeImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-espresso/95 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <div
            className="relative max-h-[90vh] cursor-zoom-out"
            style={{ aspectRatio: '3/4', height: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={activeImage} alt={titolo} fill className="object-contain" sizes="90vw" />
          </div>

          {total > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 bg-ivory/10 text-ivory transition-all hover:bg-ivory/20">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 bg-ivory/10 text-ivory transition-all hover:bg-ivory/20">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2L10 7L5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          <button onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-ivory/10 text-ivory transition-all hover:bg-ivory/20">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

          {total > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ivory/10 px-4 py-1.5">
              <span className="font-sans text-[0.65rem] font-semibold text-ivory/70">{activeIndex + 1} / {total}</span>
            </div>
          )}
        </div>
      )}
    </>
  )
}
