import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server client che legge la sessione utente dai cookie. Rispetta RLS.
// Usalo nei server components / server actions per operazioni per
// conto dell'utente loggato (lettura profilo, carrello, ordini propri).
//
// Per operazioni admin (bypassa RLS) usa invece supabaseAdmin da ./admin.
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll fallisce nei Server Components (contesto read-only).
          // proxy.ts gestisce il refresh della sessione, quindi è OK.
        }
      },
    },
  });
}
