'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

const schema = z.object({
  nome:      z.string().min(2, 'Inserisci almeno 2 caratteri'),
  email:     z.string().email({ error: 'Email non valida' }),
  oggetto:   z.string().min(1, 'Seleziona un oggetto'),
  opera:     z.string().optional(),
  messaggio: z.string().min(20, 'Il messaggio deve essere di almeno 20 caratteri'),
  privacy:   z.literal(true, { error: 'Accetta la privacy per continuare' }),
})

type FormData = z.infer<typeof schema>
type Status = 'idle' | 'loading' | 'success' | 'error'

const oggetti = [
  'Acquisto opera',
  'Commissione personalizzata',
  'Informazioni generali',
  'Stampa e media',
]

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="group flex flex-col gap-0">
      <label className="mb-2 font-sans text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-charcoal/45">
        {label}
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

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
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

      {/* Nome + Email */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Field label="Nome" error={errors.nome?.message}>
          <input
            id="nome" type="text" placeholder="Il tuo nome"
            {...register('nome')}
            className={[inputClass, errors.nome ? inputErrorClass : ''].join(' ')}
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            id="email" type="email" placeholder="La tua email"
            {...register('email')}
            className={[inputClass, errors.email ? inputErrorClass : ''].join(' ')}
          />
        </Field>
      </div>

      {/* Oggetto */}
      <Field label="Oggetto" error={errors.oggetto?.message}>
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
      <Field label="Messaggio" error={errors.messaggio?.message}>
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

      {/* Submit */}
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

      <p className="text-center font-sans text-[0.58rem] text-charcoal/30 tracking-[0.1em]">
        Risposta entro 24 ore · Nessuno spam
      </p>

    </form>
  )
}
