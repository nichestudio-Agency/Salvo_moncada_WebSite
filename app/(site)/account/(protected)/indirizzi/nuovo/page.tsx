import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import AddressForm from "@/components/account/AddressForm";

export const metadata: Metadata = { title: "Nuovo indirizzo | Salvo Moncada" };
export const dynamic = "force-dynamic";

export default async function NuovoIndirizzoPage() {
  await requireUser();

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Aggiungi indirizzo</h2>
      <AddressForm />
    </div>
  );
}
