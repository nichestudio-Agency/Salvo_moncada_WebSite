import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProfilo } from "@/lib/supabase/db";
import type { Profilo } from "@/types/db";

// Restituisce l'utente loggato. Da usare nei server components / server actions.
export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return null;
  return { id: user.id, email: user.email };
}

// Restituisce profilo + email; redirect a /account/login se non loggato.
export async function requireUser(): Promise<{ id: string; email: string; profilo: Profilo }> {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");
  const profilo = await getProfilo(user.id);
  if (!profilo) redirect("/account/login");
  return { ...user, profilo };
}
