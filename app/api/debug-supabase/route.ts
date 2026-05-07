import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const info: Record<string, unknown> = {
    url_set: !!url,
    url_format_ok: url?.startsWith('https://') && url?.includes('.supabase.co'),
    anon_key_set: !!anonKey,
    service_key_set: !!serviceKey,
    url_preview: url ? url.slice(0, 30) + '…' : null,
  }

  if (!url || !anonKey) {
    return NextResponse.json({ ...info, error: 'Variabili d\'ambiente mancanti' }, { status: 500 })
  }

  const key = serviceKey ?? anonKey
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  try {
    const { data, error } = await supabase.from('opere').select('id').limit(1)
    if (error) return NextResponse.json({ ...info, db_error: error.message, db_code: error.code }, { status: 500 })
    return NextResponse.json({ ...info, ok: true, opere_count_sample: data?.length })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ...info, fetch_error: msg }, { status: 500 })
  }
}
