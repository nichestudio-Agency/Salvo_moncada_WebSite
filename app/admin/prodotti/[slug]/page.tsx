import { notFound } from "next/navigation";
import { readArtworks } from "@/lib/data";
import EditArtworkForm from "@/components/admin/EditArtworkForm";

export const dynamic = "force-dynamic";

export default async function ModificaProdottoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artworks = await readArtworks();
  const artwork = artworks.find((a) => a.slug === slug);

  if (!artwork) notFound();

  return <EditArtworkForm artwork={artwork} />;
}
