import { NextRequest, NextResponse } from 'next/server'
import { insertMessaggio } from '@/lib/supabase/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, email, oggetto, opera, messaggio } = body

    if (!nome || !email || !oggetto || !messaggio) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    await insertMessaggio({
      nome: String(nome).trim(),
      email: String(email).trim(),
      oggetto: String(oggetto).trim(),
      opera: opera ? String(opera).trim() : null,
      messaggio: String(messaggio).trim(),
    })

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e)
    console.error('[/api/contact]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
