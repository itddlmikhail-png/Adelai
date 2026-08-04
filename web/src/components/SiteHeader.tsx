import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 md:px-8 md:py-6">
        <Link
          href="/"
          className="font-display text-[17px] font-semibold tracking-tight text-white"
        >
          Adelai
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/plan"
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            План
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-white/90"
          >
            Early Access
          </Link>
        </nav>
      </div>
    </header>
  );
}
