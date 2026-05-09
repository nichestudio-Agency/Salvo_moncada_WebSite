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
      <main
        className="pt-20 md:pt-10 pb-10"
        style={{
          flex: 1,
          minWidth: 0,
          paddingLeft:  "clamp(1rem, 3.5vw, 3rem)",
          paddingRight: "clamp(1rem, 3.5vw, 3rem)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
