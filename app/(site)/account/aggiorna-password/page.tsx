import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import UpdatePasswordForm from "@/components/account/UpdatePasswordForm";

export const metadata: Metadata = { title: "Nuova password | Salvo Moncada" };
export const dynamic = "force-dynamic";

export default function UpdatePasswordPage() {
  return (
    <AuthCard
      title="Imposta una nuova password"
      subtitle="Hai cliccato sul link dalla mail. Ora scegli una password nuova."
    >
      <UpdatePasswordForm />
    </AuthCard>
  );
}
