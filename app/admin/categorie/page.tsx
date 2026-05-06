import { getCategorie } from "@/lib/supabase/db";
import CategorieClient from "@/components/admin/CategorieClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriePage() {
  const categorie = await getCategorie().catch(() => []);

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#1A1510", marginBottom: "0.3rem" }}>
          Categorie
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.82rem", color: "#6B5C4A" }}>
          Gestisci le categorie delle opere. Le categorie archiviate non appaiono nei form ma le opere collegate restano visibili.
        </p>
      </div>
      <CategorieClient categorie={categorie} />
    </div>
  );
}
