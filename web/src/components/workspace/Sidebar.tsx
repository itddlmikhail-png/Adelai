"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./data";
import { Icon } from "./ui";
import { useWorkspaceChrome } from "./WorkspaceChrome";

function normalize(path: string) {
  const p = path.replace(/\/+$/, "") || "/";
  return p;
}

export function Sidebar() {
  const pathname = usePathname();
  const current = normalize(pathname || "/workspace");
  const { navOpen, closeNav } = useWorkspaceChrome();

  return (
    <>
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={closeNav}
        className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          navOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[min(82vw,240px)] shrink-0 flex-col border-r border-white/[0.06] bg-[#080a0e] px-3 py-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:z-auto lg:w-[220px] lg:translate-x-0 lg:bg-ink/80 lg:px-3 lg:py-5 lg:backdrop-blur-xl ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-2 px-2.5 lg:mb-7">
          <Link href="/workspace" onClick={closeNav} className="min-w-0">
            <div className="font-display text-[17px] font-semibold tracking-tight">
              Adelai
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-mist">
              Workspace
            </div>
          </Link>
          <button
            type="button"
            onClick={closeNav}
            aria-label="Закрыть меню"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/70 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain pr-0.5">
          {NAV.map((item) => {
            const href = normalize(item.href);
            const active =
              href === "/workspace"
                ? current === "/workspace" || current.endsWith("/workspace")
                : current === href || current.endsWith(href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeNav}
                className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition ${
                  active
                    ? "bg-white text-ink"
                    : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`h-4 w-4 shrink-0 ${
                    active ? "opacity-90" : "opacity-70 group-hover:opacity-100"
                  }`}
                />
                <span className="truncate font-medium tracking-[-0.01em]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5">
          <div className="text-[10px] uppercase tracking-[0.14em] text-mist">
            Plan
          </div>
          <div className="mt-1.5 font-display text-[15px] font-semibold">Pro</div>
          <div className="mt-0.5 text-[12px] leading-snug text-mist">
            Неограниченные Projects
          </div>
          <Link
            href="/workspace/settings"
            onClick={closeNav}
            className="mt-3 inline-flex text-[12px] text-white/80 transition hover:text-white"
          >
            Управление →
          </Link>
        </div>
      </aside>
    </>
  );
}
