import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/account/AuthCard";
import SignupForm from "@/components/account/SignupForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Crea account | Salvo Moncada" };
export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <AuthCard
      title="Crea il tuo account"
      subtitle="Per acquistare le opere e seguire i tuoi ordini"
      footer={
        <>
          Hai già un account?{" "}
          <Link href="/account/login" className="font-semibold text-coral hover:underline">
            Accedi
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
