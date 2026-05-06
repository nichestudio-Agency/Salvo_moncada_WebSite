import { notFound } from "next/navigation";
import { getOperaBySlug } from "@/lib/supabase/db";
import EditArtworkForm from "@/components/admin/EditArtworkForm";

export const dynamic = "force-dynamic";

export default async function ModificaProdottoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opera = await getOperaBySlug(slug);
  if (!opera) notFound();
  return <EditArtworkForm opera={opera} />;
}
