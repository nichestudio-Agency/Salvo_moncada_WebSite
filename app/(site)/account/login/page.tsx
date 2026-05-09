import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthCard from "@/components/account/AuthCard";
import LoginForm from "@/components/account/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Accedi | Salvo Moncada" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ next?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next || "/account");

  return (
    <AuthCard
      title="Bentornato"
      subtitle="Accedi al tuo account"
      footer={
        <>
          Non hai un account?{" "}
          <Link href="/account/registrati" className="font-semibold text-coral hover:underline">
            Crea il tuo account
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
      <div className="mt-4 text-center">
        <Link href="/account/recupero" className="font-sans text-[0.7rem] text-stone underline-offset-4 hover:text-coral hover:underline">
          Password dimenticata?
        </Link>
      </div>
    </AuthCard>
  );
}
