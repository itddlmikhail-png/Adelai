"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type Session } from "../../lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSessionState] = useState<Session | null | undefined>(
    undefined
  );

  useEffect(() => {
    const sync = () => setSessionState(getSession());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("adelai:auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("adelai:auth", sync);
    };
  }, []);

  useEffect(() => {
    if (session === null) {
      router.replace("/sign-in/");
    }
  }, [session, router]);

  if (session === undefined) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-ink text-white">
        <div className="animate-fade-in text-center">
          <div className="font-display text-2xl font-semibold tracking-tight">
            Adelai
          </div>
          <p className="mt-3 text-sm text-mist">Открываем кабинет…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-ink text-white">
        <p className="text-sm text-mist">Переход ко входу…</p>
      </div>
    );
  }

  return <>{children}</>;
}
