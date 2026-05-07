import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Service-role client. Bypassa RLS. Da usare SOLO in server-side code
// (server actions, route handlers, dashboard admin) per operazioni
// che richiedono accesso completo al DB. Mai esposto al browser.
export const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false },
});
