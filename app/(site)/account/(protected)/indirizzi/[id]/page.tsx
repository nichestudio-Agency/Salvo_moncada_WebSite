import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getIndirizzo } from "@/lib/supabase/db";
import AddressForm from "@/components/account/AddressForm";

export const metadata: Metadata = { title: "Modifica indirizzo | Salvo Moncada" };
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModificaIndirizzoPage({ params }: PageProps) {
  const { id: routeId } = await params;
  const { id: profiloId } = await requireUser();
  const indirizzo = await getIndirizzo(routeId, profiloId);
  if (!indirizzo) notFound();

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Modifica indirizzo</h2>
      <AddressForm indirizzo={indirizzo} />
    </div>
  );
}
