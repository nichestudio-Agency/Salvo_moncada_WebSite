import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client. Da usare in client components per operazioni in tempo
// reale (es. ascolto cambiamenti realtime) o quando serve l'utente loggato
// lato client. Sincronizza la sessione coi cookie tramite @supabase/ssr.
export function createBrowserSupabase() {
  return createBrowserClient(url, key);
}
