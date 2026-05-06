import { redirect } from "next/navigation";
export default async function GalleriaSlugRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/opere/${slug}`);
}
