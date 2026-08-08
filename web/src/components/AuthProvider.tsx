"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getAuthProfile, type AuthProfile } from "../lib/auth";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  configured: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((next: Session | null) => {
    setSession(next);
    setUser(next?.user ?? null);
  }, []);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      applySession(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase.auth.getSession();
    applySession(data.session);
    setLoading(false);
  }, [applySession]);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      applySession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      applySession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile: getAuthProfile(user),
      loading,
      configured: isSupabaseConfigured,
      refresh,
    }),
    [session, user, loading, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
