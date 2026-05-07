import { getOrdini, getMessaggi } from "@/lib/supabase/db";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — Salvo Moncada",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ordini, messaggi] = await Promise.all([
    getOrdini().catch(() => []),
    getMessaggi().catch(() => []),
  ]);
  const ordiniNuovi = ordini.filter((o) => o.status === "nuovo").length;
  const messaggiNonLetti = messaggi.filter((m) => !m.letto).length;

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", display: "flex" }}>
      <AdminSidebar messaggiNonLetti={messaggiNonLetti} ordiniNuovi={ordiniNuovi} />
      <main style={{ flex: 1, minWidth: 0, padding: "2.5rem clamp(1.5rem, 3.5vw, 3rem)" }}>
        {children}
      </main>
    </div>
  );
}
