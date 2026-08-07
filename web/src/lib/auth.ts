export type AuthProvider = "email" | "google" | "apple";

export type Session = {
  email: string;
  name: string;
  initials: string;
  provider: AuthProvider;
  signedInAt: string;
};

const SESSION_KEY = "adelai.session";

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

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("adelai:auth"));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("adelai:auth"));
}

export function createSession(
  email: string,
  provider: AuthProvider,
  displayName?: string
): Session {
  const normalized = email.trim().toLowerCase();
  const name = displayName?.trim() || nameFromEmail(normalized);
  return {
    email: normalized,
    name,
    initials: initialsFrom(name, normalized),
    provider,
    signedInAt: new Date().toISOString(),
  };
}

export function signInWithEmail(email: string, password: string): Session {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes("@")) {
    throw new Error("Введите корректную почту.");
  }
  if (password.trim().length < 4) {
    throw new Error("Пароль слишком короткий.");
  }
  const session = createSession(trimmed, "email");
  setSession(session);
  return session;
}

export function signInWithProvider(provider: "google" | "apple"): Session {
  const demoEmail =
    provider === "google" ? "mikhail@gmail.com" : "mikhail@icloud.com";
  const session = createSession(demoEmail, provider, "Mikhail");
  setSession(session);
  return session;
}
