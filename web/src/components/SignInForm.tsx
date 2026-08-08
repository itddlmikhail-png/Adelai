"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { mapAuthError, siteAuthUrl } from "../lib/auth";
import { supabase } from "../lib/supabase";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.7 12.4c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3.1-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.3-3.3zM14.6 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 1.9-.5 2.6-1.2z" />
    </svg>
  );
}

type Mode = "signin" | "reset";

export function SignInForm() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
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

  const onSocial = () => {
    setError("Вход через Google и Apple пока недоступен. Используйте email и пароль.");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (mode === "reset") {
        if (!email.trim()) {
          setError("Введите почту, чтобы восстановить пароль.");
          return;
        }

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: siteAuthUrl("/sign-in/") }
        );

        if (resetError) {
          setError(mapAuthError(resetError));
          return;
        }

        setMessage(
          "Если аккаунт существует, мы отправили ссылку для восстановления на почту."
        );
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(mapAuthError(signInError));
        return;
      }

      if (data.session) {
        router.push("/workspace/");
        return;
      }

      setError("Не удалось войти. Попробуйте ещё раз.");
    } catch {
      setError("Не удалось войти. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="animate-rise-in text-center">
        <h1 className="font-display text-[clamp(1.8rem,4vw,2.4rem)] font-semibold tracking-tight">
          {mode === "signin" ? "Sign in" : "Восстановить пароль"}
        </h1>
        <p className="mt-2 text-[15px] text-mist">
          {mode === "signin"
            ? "Войдите в Adelai, чтобы открыть личный кабинет."
            : "Укажите почту — пришлём ссылку для сброса пароля."}
        </p>
      </div>

      <div
        className="animate-rise-in mt-8 space-y-3"
        style={{ animationDelay: "80ms" }}
      >
        <button
          type="button"
          disabled={submitting}
          onClick={onSocial}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white text-[15px] font-semibold text-ink transition hover:bg-white/92 disabled:opacity-60 active:scale-[0.99]"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onSocial}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/12 bg-black text-[15px] font-semibold text-white transition hover:bg-black/80 disabled:opacity-60 active:scale-[0.99]"
        >
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      <div
        className="animate-fade-in my-7 flex items-center gap-3"
        style={{ animationDelay: "140ms" }}
      >
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.14em] text-mist">или</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form
        onSubmit={onSubmit}
        className="animate-rise-in space-y-4"
        style={{ animationDelay: "180ms" }}
      >
        <label className="block">
          <span className="mb-2 block text-sm text-mist">Почта</span>
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

        {mode === "signin" && (
          <label className="block">
            <span className="mb-2 block text-sm text-mist">Пароль</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/[0.05]"
            />
          </label>
        )}

        {mode === "signin" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setMode("reset");
                setMessage("");
                setError("");
              }}
              className="text-sm text-mist transition hover:text-white"
            >
              Восстановить пароль
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center rounded-full bg-white text-[15px] font-semibold text-ink transition hover:bg-white/90 disabled:opacity-60 active:scale-[0.99]"
        >
          {submitting
            ? "Секунду…"
            : mode === "signin"
              ? "Sign in"
              : "Отправить ссылку"}
        </button>

        {mode === "reset" && (
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setMessage("");
              setError("");
            }}
            className="w-full text-center text-sm text-mist transition hover:text-white"
          >
            ← Назад ко входу
          </button>
        )}

        {mode === "signin" && (
          <p className="text-center text-sm text-mist">
            Нет аккаунта?{" "}
            <Link href="/sign-up/" className="text-white transition hover:text-white/80">
              Создать аккаунт
            </Link>
          </p>
        )}

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
