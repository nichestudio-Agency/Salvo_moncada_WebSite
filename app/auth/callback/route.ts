import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { mergeGuestCartIntoUser } from "@/lib/cart";

// Handler per i link inviati via email da Supabase Auth (conferma email,
// reset password, magic link). Scambia il code con una sessione, poi
// redirect alla pagina specificata in `next` (default: /account).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (!code) {
    return NextResponse.redirect(`${origin}/account/login?error=missing_code`);
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/account/login?error=invalid_code`);
  }

  // Merge eventuale carrello ospite con quello dell'utente appena loggato.
  await mergeGuestCartIntoUser(data.session.user.id).catch(() => {});

  return NextResponse.redirect(`${origin}${next}`);
}
