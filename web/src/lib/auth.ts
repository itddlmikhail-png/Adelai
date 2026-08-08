import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabase";

export type AuthProfile = {
  email: string;
  name: string;
  initials: string;
};

function initialsFrom(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const local = email.split("@")[0] || "A";
  return local.slice(0, 2).toUpperCase();
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] || "User";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function getAuthProfile(user: User | null | undefined): AuthProfile | null {
  if (!user) return null;
  const email = user.email?.trim() || "";
  const metaName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";
  const name = metaName || nameFromEmail(email) || "User";
  return {
    email,
    name,
    initials: initialsFrom(name, email),
  };
}

export function mapAuthError(error: { message?: string; status?: number; code?: string } | null) {
  const message = (error?.message || "").toLowerCase();
  const code = (error?.code || "").toLowerCase();

  if (!isSupabaseConfigured) {
    return "Авторизация не настроена. Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials")
  ) {
    return "Неверный email или пароль";
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Подтвердите email перед входом. Проверьте почту.";
  }

  if (
    code === "user_already_exists" ||
    message.includes("user already registered") ||
    message.includes("already been registered")
  ) {
    return "Этот email уже зарегистрирован. Войдите или восстановите пароль.";
  }

  if (message.includes("password should be at least") || code === "weak_password") {
    return "Пароль слишком короткий. Используйте не менее 6 символов.";
  }

  if (
    message.includes("unable to validate email") ||
    message.includes("invalid email") ||
    code === "validation_failed"
  ) {
    return "Введите корректный email.";
  }

  if (
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    code === "over_request_rate_limit"
  ) {
    return "Слишком много попыток. Подождите немного и попробуйте снова.";
  }

  if (message.includes("fetch") || message.includes("network")) {
    return "Нет связи с сервером авторизации. Проверьте интернет и попробуйте снова.";
  }

  return "Не удалось выполнить действие. Попробуйте ещё раз.";
}

export async function signOut() {
  // Local scope keeps logout reliable on static GitHub Pages even if network fails.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw error;
}

/** Absolute auth redirect URL that respects /Adelai basePath on GitHub Pages. */
export function siteAuthUrl(path: string) {
  if (typeof window === "undefined") return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const basePath = "/Adelai";
  return `${window.location.origin}${basePath}${normalized}`;
}

export function assertSupabaseReady() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Авторизация не настроена. Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
}
