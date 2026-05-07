"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/actions";

export default function AddToCartButton({ slug, prezzo }: { slug: string; prezzo: number }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<"idle" | "added" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  function onClick() {
    setFeedback("idle");
    startTransition(async () => {
      const res = await addToCart(slug);
      if (res.error) {
        setFeedback("error");
        setErrorMsg(res.error);
      } else {
        setFeedback("added");
        router.refresh();
        setTimeout(() => setFeedback("idle"), 2200);
      }
    });
  }

  const label =
    feedback === "added" ? "Aggiunto al carrello ✓" :
    feedback === "error" ? "Riprova" :
    isPending          ? "Aggiungo…" :
                         `Aggiungi al carrello — € ${prezzo}`;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className={[
          "flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream shadow-[0_8px_24px_rgba(212,82,42,0.3)] transition-all duration-300",
          feedback === "added" ? "bg-emerald-600" :
          feedback === "error" ? "bg-rose-600" :
                                 "bg-coral hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,82,42,0.4)]",
          isPending ? "opacity-60 cursor-wait" : "",
        ].join(" ")}
      >
        {label}
      </button>
      {feedback === "error" && errorMsg && (
        <p className="text-center font-sans text-[0.65rem] text-rose-700">{errorMsg}</p>
      )}
    </div>
  );
}
