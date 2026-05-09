import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getVenditeByProfilo, getIndirizzi } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

function StatCard({ label, value, href }: { label: string; value: string | number; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-black/8 bg-ivory p-5 transition hover:border-coral/30 hover:shadow-[0_8px_24px_rgba(28,16,8,0.05)]"
    >
      <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-stone/60">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      <p className="mt-2 font-sans text-[0.65rem] font-semibold text-coral opacity-0 transition group-hover:opacity-100">
        Apri →
      </p>
    </Link>
  );
}

export default async function AccountDashboard() {
  const { id, email } = await requireUser();
  const [vendite, indirizzi] = await Promise.all([
    getVenditeByProfilo(id),
    getIndirizzi(id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-body text-sm text-stone">
        Ciao! Da qui puoi gestire i tuoi ordini, gli indirizzi di spedizione e i dati per la fatturazione.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Ordini" value={vendite.length} href="/account/ordini" />
        <StatCard label="Indirizzi" value={indirizzi.length} href="/account/indirizzi" />
        <StatCard label="Profilo" value="✎" href="/account/profilo" />
      </div>

      <div className="rounded-2xl border border-black/8 bg-ivory p-5">
        <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-stone/60">
          Account
        </p>
        <p className="mt-1 font-body text-sm text-ink">{email}</p>
      </div>
    </div>
  );
}
