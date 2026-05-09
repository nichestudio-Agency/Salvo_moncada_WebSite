import Link from "next/link";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-24">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="mb-8 block text-center font-script text-[1.6rem] text-charcoal">
          Salvo Moncada
        </Link>

        <div className="rounded-2xl border border-black/8 bg-ivory p-7 shadow-[0_8px_28px_rgba(28,16,8,0.06)] sm:p-8">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 font-body text-sm text-stone">{subtitle}</p>
          )}

          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center font-sans text-[0.75rem] text-stone">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
