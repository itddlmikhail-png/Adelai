"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { signOut } from "../../lib/auth";
import { Icon, IconButton } from "./ui";
import { useWorkspaceChrome } from "./WorkspaceChrome";

export function Topbar() {
  const router = useRouter();
  const { profile } = useAuth();
  const { toggleNav } = useWorkspaceChrome();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const onSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setMenuOpen(false);
    try {
      await signOut();
      router.replace("/sign-in/");
    } catch {
      setSigningOut(false);
    }
  };

  const name = profile?.name || "Гость";
  const initials = profile?.initials || "A";

  return (
    <header className="relative flex h-14 shrink-0 items-center gap-2.5 border-b border-white/[0.06] px-3 sm:h-16 sm:gap-4 sm:px-5 md:px-8 lg:h-[72px]">
      <IconButton
        aria-label="Открыть меню"
        onClick={toggleNav}
        className="shrink-0 lg:hidden"
      >
        <Icon name="menu" className="h-[17px] w-[17px]" />
      </IconButton>

      <div className="min-w-0 shrink">
        <div className="hidden text-[11px] uppercase tracking-[0.14em] text-mist sm:block lg:text-[12px]">
          Workspace
        </div>
        <div className="truncate font-display text-[15px] font-semibold tracking-tight sm:text-[17px]">
          Adelai Studio
        </div>
      </div>

      <div className="mx-auto hidden min-w-0 flex-1 items-center sm:flex sm:max-w-xl">
        <label className="flex h-10 w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 transition focus-within:border-white/20 lg:h-11 lg:px-4">
          <Icon name="search" className="h-4 w-4 text-mist" />
          <input
            type="search"
            placeholder="Поиск по чатам, файлам, проектам…"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-white/25 lg:text-[14px]"
          />
          <kbd className="hidden rounded-lg border border-white/10 px-1.5 py-0.5 text-[10px] text-mist md:inline">
            ⌘K
          </kbd>
        </label>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <IconButton aria-label="Поиск" className="sm:hidden">
          <Icon name="search" className="h-[17px] w-[17px]" />
        </IconButton>
        <IconButton aria-label="Уведомления">
          <Icon name="bell" className="h-[17px] w-[17px]" />
        </IconButton>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] py-1 pl-1 pr-1.5 transition hover:bg-white/[0.06] sm:gap-3 sm:pr-3"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[12px] font-semibold text-ink">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-medium leading-none">
                {name}
              </span>
              <span className="mt-1 block text-[11px] text-mist">Email</span>
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d12] p-1.5 shadow-2xl shadow-black/50">
              <div className="px-3 py-2">
                <div className="truncate text-[13px] font-medium">{name}</div>
                <div className="truncate text-[11px] text-mist">
                  {profile?.email}
                </div>
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
                onClick={onSignOut}
                disabled={signingOut}
                className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] text-red-300 transition hover:bg-white/[0.06] disabled:opacity-60"
              >
                {signingOut ? "Выходим…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
