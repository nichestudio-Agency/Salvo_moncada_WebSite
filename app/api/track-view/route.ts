import { NextRequest, NextResponse } from 'next/server'
import { incrementViews } from '@/lib/supabase/db'

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json()
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Slug mancante' }, { status: 400 })
    }
    await incrementViews(slug)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
