"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./data";
import { Icon } from "./ui";

function normalize(path: string) {
  const p = path.replace(/\/+$/, "") || "/";
  return p;
}

export function Sidebar() {
  const pathname = usePathname();
  const current = normalize(pathname || "/workspace");

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-white/[0.06] bg-ink/80 px-4 py-5 backdrop-blur-xl">
      <Link href="/workspace" className="mb-8 px-3">
        <div className="font-display text-[18px] font-semibold tracking-tight">Adelai</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-mist">Workspace</div>
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1">
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
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] transition ${
                active
                  ? "bg-white text-ink"
                  : "text-white/70 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-[17px] w-[17px] ${active ? "opacity-90" : "opacity-70 group-hover:opacity-100"}`}
              />
              <span className="font-medium tracking-[-0.01em]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-[20px] border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="text-[12px] uppercase tracking-[0.14em] text-mist">Plan</div>
        <div className="mt-2 font-display text-lg font-semibold">Pro</div>
        <div className="mt-1 text-[13px] text-mist">Неограниченные Projects</div>
        <Link
          href="/workspace/settings"
          className="mt-4 inline-flex text-[13px] text-white/80 transition hover:text-white"
        >
          Управление →
        </Link>
      </div>
    </aside>
  );
}
