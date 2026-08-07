"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession, type Session } from "../../lib/auth";
import { Icon, IconButton } from "./ui";

export function Topbar() {
  const router = useRouter();
  const [session, setSessionState] = useState<Session | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sync = () => setSessionState(getSession());
    sync();
    window.addEventListener("adelai:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("adelai:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signOut = () => {
    clearSession();
    setMenuOpen(false);
    router.replace("/sign-in/");
  };

  const name = session?.name || "Гость";
  const initials = session?.initials || "A";
  const providerLabel =
    session?.provider === "google"
      ? "Google"
      : session?.provider === "apple"
        ? "Apple"
        : "Email";

  return (
    <header className="relative flex h-[72px] shrink-0 items-center gap-4 border-b border-white/[0.06] px-6 md:px-8">
      <div className="min-w-0">
        <div className="text-[12px] uppercase tracking-[0.14em] text-mist">Workspace</div>
        <div className="truncate font-display text-[17px] font-semibold tracking-tight">
          Adelai Studio
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl items-center">
        <label className="flex h-11 w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 transition focus-within:border-white/20">
          <Icon name="search" className="h-4 w-4 text-mist" />
          <input
            type="search"
            placeholder="Глобальный поиск по чатам, файлам, проектам…"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-white/25"
          />
          <kbd className="hidden rounded-lg border border-white/10 px-1.5 py-0.5 text-[10px] text-mist sm:inline">
            ⌘K
          </kbd>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <IconButton aria-label="Уведомления">
          <Icon name="bell" className="h-[17px] w-[17px]" />
        </IconButton>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-1.5 pl-1.5 pr-3 transition hover:bg-white/[0.06]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[12px] font-semibold text-ink">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-medium leading-none">{name}</span>
              <span className="mt-1 block text-[11px] text-mist">{providerLabel}</span>
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d12] p-1.5 shadow-2xl shadow-black/50">
              <div className="px-3 py-2">
                <div className="truncate text-[13px] font-medium">{name}</div>
                <div className="truncate text-[11px] text-mist">{session?.email}</div>
              </div>
              <Link
                href="/workspace/settings/"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-[13px] transition hover:bg-white/[0.06]"
              >
                Настройки
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] text-red-300 transition hover:bg-white/[0.06]"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
