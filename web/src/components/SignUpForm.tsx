"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { mapAuthError, siteAuthUrl } from "../lib/auth";
import { supabase } from "../lib/supabase";

export function SignUpForm() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      router.replace("/workspace/");
    }
  }, [loading, session, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: siteAuthUrl("/sign-in/"),
        },
      });

      if (signUpError) {
        setError(mapAuthError(signUpError));
        return;
      }

      if (data.session) {
        router.push("/workspace/");
        return;
      }

      setMessage(
        "Мы отправили письмо для подтверждения аккаунта. Подтвердите email и войдите."
      );
    } catch {
      setError("Не удалось создать аккаунт. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="animate-rise-in text-center">
        <h1 className="font-display text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
          Create account
        </h1>
        <p className="mt-2 text-[15px] text-mist">
          Зарегистрируйтесь в Adelai, чтобы открыть личный кабинет.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="animate-rise-in mt-8 space-y-4"
        style={{ animationDelay: "120ms" }}
      >
        <label className="block">
          <span className="mb-2 block text-sm text-mist">Full name</span>
          <input
            type="text"
            name="full_name"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Mikhail"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/[0.05]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-mist">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/[0.05]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-mist">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/[0.05]"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center rounded-full bg-white text-[15px] font-semibold text-ink transition hover:bg-white/90 disabled:opacity-60 active:scale-[0.99]"
        >
          {submitting ? "Секунду…" : "Create account"}
        </button>

        <p className="text-center text-sm text-mist">
          Уже есть аккаунт?{" "}
          <Link href="/sign-in/" className="text-white transition hover:text-white/80">
            Войти
          </Link>
        </p>

        {(message || error) && (
          <p
            className={`animate-fade-in text-center text-sm leading-relaxed ${
              error ? "text-red-300" : "text-mist"
            }`}
          >
            {error || message}
          </p>
        )}
      </form>
    </div>
  );
}
