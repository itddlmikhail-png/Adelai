"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession, type Session } from "../../../lib/auth";
import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

const sections = [
  {
    title: "Профиль",
    items: ["Имя", "Email", "Аватар", "Часовой пояс"],
  },
  {
    title: "Подписка",
    items: ["Pro · $20/мес", "Лимиты AI", "Счета"],
  },
  {
    title: "API ключи",
    items: ["Personal key", "OpenRouter", "Provider keys"],
  },
  {
    title: "Язык",
    items: ["Русский", "English"],
  },
  {
    title: "Уведомления",
    items: ["Email", "Push", "Slack"],
  },
  {
    title: "Безопасность",
    items: ["2FA", "Сессии", "Устройства"],
  },
  {
    title: "Подключенные сервисы",
    items: ["Google", "Apple", "GitHub"],
  },
  {
    title: "Внешний вид",
    items: ["Тёмная тема", "Плотность", "Акцент"],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<Session | null>(null);

  useEffect(() => {
    setSessionState(getSession());
  }, []);

  const signOut = () => {
    clearSession();
    router.replace("/sign-in/");
  };

  return (
    <div>
      <PageTitle
        title="Настройки"
        subtitle="Профиль, подписка, безопасность и внешний вид — без шума."
      />

      <Panel className="mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <div className="text-[12px] uppercase tracking-[0.14em] text-mist">Аккаунт</div>
          <div className="mt-2 font-display text-xl font-semibold">
            {session?.name || "Гость"}
          </div>
          <div className="mt-1 text-[14px] text-mist">{session?.email}</div>
        </div>
        <SoftButton variant="soft" onClick={signOut}>
          Выйти из кабинета
        </SoftButton>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <Panel key={s.title} className="p-6">
            <h2 className="font-display text-lg font-semibold">{s.title}</h2>
            <ul className="mt-5 space-y-3">
              {s.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3 text-[14px]"
                >
                  <span>
                    {item === "Имя"
                      ? session?.name || item
                      : item === "Email"
                        ? session?.email || item
                        : item}
                  </span>
                  <span className="text-mist">→</span>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
