"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const BASE = "/Adelai";
const OUT_MS = 340;

function stripBase(path: string) {
  let p = path;
  if (p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
}

function normalizePath(path: string) {
  const p = stripBase(path).split("?")[0].split("#")[0];
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p || "/";
}

function toPushPath(path: string) {
  const n = normalizePath(path);
  return n === "/" ? "/" : `${n}/`;
}

function resolveAppPath(anchor: HTMLAnchorElement): string | null {
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }
  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    const onBase = window.location.pathname.startsWith(BASE);
    if (onBase && !url.pathname.startsWith(BASE)) return null;
    return normalizePath(url.pathname);
  } catch {
    return null;
  }
}

type Props = { children: ReactNode };

export function PageTransition({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "out" | "in">("in");
  const busy = useRef(false);
  const outTimer = useRef(0);
  const inTimer = useRef(0);

  useEffect(() => {
    busy.current = false;
    window.clearTimeout(outTimer.current);
    setPhase("in");
    window.clearTimeout(inTimer.current);
    inTimer.current = window.setTimeout(() => setPhase("idle"), 700);
    return () => window.clearTimeout(inTimer.current);
  }, [pathname]);

  const navigate = useCallback(
    (path: string) => {
      const next = normalizePath(path);
      const current = normalizePath(pathname);
      if (next === current || busy.current) return;

      busy.current = true;
      setPhase("out");

      window.clearTimeout(outTimer.current);
      outTimer.current = window.setTimeout(() => {
        router.push(toPushPath(next));
      }, OUT_MS);
    },
    [pathname, router]
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const path = resolveAppPath(anchor as HTMLAnchorElement);
      if (!path) return;

      if (path === normalizePath(pathname)) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigate(path);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, pathname]);

  useEffect(() => {
    return () => {
      window.clearTimeout(outTimer.current);
      window.clearTimeout(inTimer.current);
    };
  }, []);

  return (
    <>
      <div
        className={`page-shell ${
          phase === "out"
            ? "page-shell--out"
            : phase === "in"
              ? "page-shell--in"
              : "page-shell--idle"
        }`}
      >
        {children}
      </div>
      <div
        className={`page-veil ${phase === "out" ? "page-veil--on" : ""}`}
        aria-hidden
      />
    </>
  );
}
