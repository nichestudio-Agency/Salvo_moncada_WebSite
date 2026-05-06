import { notFound } from "next/navigation";
import { getOperaBySlug, getCategorie } from "@/lib/supabase/db";
import EditArtworkForm from "@/components/admin/EditArtworkForm";

export const dynamic = "force-dynamic";

export default async function ModificaProdottoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [opera, categorie] = await Promise.all([
    getOperaBySlug(slug),
    getCategorie(false),
  ]);
  if (!opera) notFound();
  return <EditArtworkForm opera={opera} categorie={categorie} />;
}
