"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/sign-in/");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-ink text-white">
        <div className="animate-fade-in text-center">
          <div className="font-display text-2xl font-semibold tracking-tight">
            Adelai
          </div>
          <p className="mt-3 text-sm text-mist">Проверяем сессию…</p>
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
