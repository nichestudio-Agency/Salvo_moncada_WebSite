import AccountSidebar from "@/components/account/AccountSidebar";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAccountLayout({ children }: { children: React.ReactNode }) {
  const { profilo } = await requireUser();

  return (
    <main className="min-h-screen bg-cream pt-28 pb-20 lg:pt-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mb-8 lg:mb-12">
          <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-terracotta/70">
            Il tuo account
          </p>
          <h1 className="mt-1 font-display text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[0.95] tracking-[-0.03em] text-ink">
            Ciao{profilo.nome ? `, ${profilo.nome}` : ""}
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          <AccountSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
