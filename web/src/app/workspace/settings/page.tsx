import { PageTitle, Panel } from "../../../components/workspace/ui";

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
  return (
    <div>
      <PageTitle
        title="Настройки"
        subtitle="Профиль, подписка, безопасность и внешний вид — без шума."
      />
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
                  <span>{item}</span>
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
