"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  const isPlan = path.endsWith("/plan");
  const isSignIn = path.endsWith("/sign-in");

  return (
    <header className="site-header fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 md:px-8 md:py-6">
        <Link
          href="/"
          className="font-display text-[17px] font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          Adelai
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/plan"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isPlan
                ? "border-white/20 bg-white/[0.08] text-white"
                : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
            }`}
          >
            План
          </Link>
          <Link
            href="/sign-in"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isSignIn
                ? "bg-white text-ink"
                : "bg-white text-ink hover:bg-white/90"
            }`}
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
