import { getCategorie } from "@/lib/supabase/db";
import NuovaOperaForm from "@/components/admin/NuovaOperaForm";

export const dynamic = "force-dynamic";

export default async function NuovoProdottoPage() {
  const categorie = await getCategorie(true).catch(() => []);
  return <NuovaOperaForm categorie={categorie} />;
}
