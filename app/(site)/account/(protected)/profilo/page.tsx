import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import ProfileForm from "@/components/account/ProfileForm";

export const metadata: Metadata = { title: "Profilo | Salvo Moncada" };
export const dynamic = "force-dynamic";

export default async function ProfiloPage() {
  const { profilo } = await requireUser();

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Profilo</h2>
      <ProfileForm profilo={profilo} />
    </div>
  );
}
