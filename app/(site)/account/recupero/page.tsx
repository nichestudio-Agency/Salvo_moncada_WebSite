import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/account/AuthCard";
import RecoveryForm from "@/components/account/RecoveryForm";

export const metadata: Metadata = { title: "Recupera password | Salvo Moncada" };

export default function RecoveryPage() {
  return (
    <AuthCard
      title="Recupera la password"
      subtitle="Ti invieremo un link per reimpostarla"
      footer={
        <Link href="/account/login" className="font-semibold text-coral hover:underline">
          ← Torna al login
        </Link>
      }
    >
      <RecoveryForm />
    </AuthCard>
  );
}
