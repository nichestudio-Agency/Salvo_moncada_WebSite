'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

const schema = z.object({
  nome:      z.string().min(1, 'Campo obbligatorio'),
  cognome:   z.string().min(1, 'Campo obbligatorio'),
  email:     z.string().optional().or(z.literal('')),
  telefono:  z.string().optional().or(z.literal('')),
  oggetto:   z.string().min(1, 'Seleziona un oggetto'),
  opera:     z.string().optional(),
  messaggio: z.string().min(1, 'Campo obbligatorio'),
  privacy:   z.literal(true, { error: 'Accetta la privacy per continuare' }),
}).refine(
  (d) => (d.email && d.email.length > 0) || (d.telefono && d.telefono.length > 0),
  { message: 'Inserisci almeno email o numero di telefono', path: ['_contactRequired'] }
).refine(
  (d) => !d.email || d.email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),
  { message: 'Email non valida', path: ['email'] }
)

type FormData = z.infer<typeof schema>
type Status = 'idle' | 'loading' | 'success' | 'error'

const oggetti = [
  'Acquisto opera',
  'Commissione personalizzata',
  'Informazioni generali',
]

function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="group flex flex-col gap-0">
      <label className="mb-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-charcoal/45">
        {label}
        {required && <span className="ml-0.5 text-coral">*</span>}
        {optional && <span className="ml-1.5 normal-case tracking-normal text-charcoal/30">— opzionale</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 font-sans text-[0.65rem] text-rose-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

const inputClass = [
  'w-full bg-transparent border-0 border-b border-black/15 pb-3 pt-1',
  'font-body text-[0.95rem] text-ink outline-none',
  'transition-colors duration-200',
  'focus:border-coral',
  'placeholder:text-charcoal/25',
].join(' ')

const inputErrorClass = 'border-rose-400'

const WA_NUMBER = '393404143319'

function buildWhatsAppUrl(data: FormData) {
  const contatto = data.email && data.email.length > 0
    ? data.email
    : data.telefono ?? ''
  const lines = [
    `Ciao Salvo, sono ${data.nome} ${data.cognome} (${contatto}).`,
    `Oggetto: ${data.oggetto}`,
    data.opera ? `Opera: ${data.opera}` : null,
    '',
    data.messaggio,
  ].filter((l) => l !== null).join('\n')
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines)}`
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmitWhatsApp = handleSubmit((data) => {
    window.open(buildWhatsAppUrl(data), '_blank', 'noopener,noreferrer')
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 py-16 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-2xl">
          ✓
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-ink mb-2">Messaggio inviato!</h3>
          <p className="font-body text-[0.95rem] text-charcoal/55 leading-relaxed">
            Grazie per avermi scritto. Ti rispondo personalmente<br />entro 24-48 ore.
          </p>
        </div>
        <p className="font-script text-[1.4rem] text-terracotta">— Salvo</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">

      {/* Nome + Cognome */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Field label="Nome" required error={errors.nome?.message}>
          <input
            id="nome" type="text" placeholder="Il tuo nome"
            {...register('nome')}
            className={[inputClass, errors.nome ? inputErrorClass : ''].join(' ')}
          />
        </Field>
        <Field label="Cognome" required error={errors.cognome?.message}>
          <input
            id="cognome" type="text" placeholder="Il tuo cognome"
            {...register('cognome')}
            className={[inputClass, errors.cognome ? inputErrorClass : ''].join(' ')}
          />
        </Field>
      </div>

      {/* Email + Telefono (almeno uno) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-charcoal/45">
            Contatto
          </p>
          <span className="text-coral text-[0.58rem] font-semibold">*</span>
          <span className="font-sans text-[0.58rem] text-charcoal/40">— almeno uno obbligatorio</span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Email" error={errors.email?.message}>
            <input
              id="email" type="email" placeholder="La tua email"
              {...register('email')}
              className={[inputClass, errors.email ? inputErrorClass : ''].join(' ')}
            />
          </Field>
          <Field label="Telefono">
            <input
              id="telefono" type="tel" placeholder="Il tuo numero"
              {...register('telefono')}
              className={inputClass}
            />
          </Field>
        </div>
        {(errors as Record<string, { message?: string }>)._contactRequired && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-[0.65rem] text-rose-500"
          >
            {(errors as Record<string, { message?: string }>)._contactRequired.message}
          </motion.p>
        )}
      </div>

      {/* Oggetto */}
      <Field label="Oggetto" required error={errors.oggetto?.message}>
        <select
          id="oggetto"
          {...register('oggetto')}
          className={[inputClass, 'cursor-pointer', errors.oggetto ? inputErrorClass : ''].join(' ')}
        >
          <option value="">Seleziona...</option>
          {oggetti.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>

      {/* Opera */}
      <Field label="Opera di riferimento" optional>
        <input
          id="opera" type="text" placeholder="Titolo dell'opera"
          {...register('opera')}
          className={inputClass}
        />
      </Field>

      {/* Messaggio */}
      <Field label="Messaggio" required error={errors.messaggio?.message}>
        <textarea
          id="messaggio" rows={5}
          placeholder="Scrivi qui il tuo messaggio..."
          {...register('messaggio')}
          className={[inputClass, 'resize-none', errors.messaggio ? inputErrorClass : ''].join(' ')}
        />
      </Field>

      {/* Privacy */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              {...register('privacy')}
              className="peer h-4 w-4 cursor-pointer appearance-none rounded-sm border border-black/20 bg-transparent checked:border-coral checked:bg-coral transition-colors duration-200"
            />
            <svg
              className="pointer-events-none absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 text-cream transition-opacity"
              width="10" height="10" viewBox="0 0 10 10" fill="none"
            >
              <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-body text-sm text-charcoal/60 leading-snug">
            Ho letto e accetto la{' '}
            <a href="/privacy-policy" className="text-coral border-b border-coral/30 hover:border-coral transition-colors duration-200">
              privacy policy
            </a>
          </span>
        </label>
        {errors.privacy && (
          <p className="font-sans text-[0.65rem] text-rose-500 ml-7">{errors.privacy.message}</p>
        )}
      </div>

      {/* Errore globale */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
          >
            <p className="font-sans text-sm text-rose-600">
              Si è verificato un errore. Riprova o scrivimi direttamente via email.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-coral py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream shadow-[0_8px_24px_rgba(212,82,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,82,42,0.38)] disabled:opacity-60 disabled:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-cream/30 border-t-cream animate-spin" />
              Invio in corso...
            </>
          ) : (
            'Invia il messaggio'
          )}
        </button>

        <button
          type="button"
          onClick={onSubmitWhatsApp}
          className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#128C7E] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/70 hover:bg-[#25D366]/14"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Invia via WhatsApp
        </button>
      </div>

      <p className="text-center font-sans text-[0.58rem] text-charcoal/30 tracking-[0.1em]">
        Risposta entro 24 ore · Nessuno spam
      </p>

    </form>
  )
}
