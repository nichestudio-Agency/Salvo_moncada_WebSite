"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/lib/actions";

const items = [
  { href: "/account",            label: "Panoramica" },
  { href: "/account/ordini",     label: "Ordini" },
  { href: "/account/indirizzi",  label: "Indirizzi" },
  { href: "/account/profilo",    label: "Profilo" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-black/8 bg-ivory p-1.5 lg:flex-col lg:gap-0 lg:p-2">
        {items.map(({ href, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "rounded-lg px-3 py-2 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition whitespace-nowrap",
                active
                  ? "bg-coral/10 text-coral"
                  : "text-stone hover:bg-cream/60 hover:text-ink",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
        <form action={logoutUser} className="lg:mt-1">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-rose-600/80 transition hover:bg-rose-50 hover:text-rose-700"
          >
            Esci
          </button>
        </form>
      </nav>
    </aside>
  );
}
