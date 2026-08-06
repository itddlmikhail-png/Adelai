import Link from "next/link";
import { CHATS, DOCS, PROJECTS } from "../../components/workspace/data";
import { Icon, PageTitle, Panel, SoftButton } from "../../components/workspace/ui";

const actions = [
  { href: "/workspace/chats", label: "Новый чат", icon: "chat" },
  { href: "/workspace/projects", label: "Новый проект", icon: "projects" },
  { href: "/workspace/files", label: "Загрузить файл", icon: "files" },
  { href: "/workspace/agents", label: "Создать AI агента", icon: "agents" },
  { href: "/workspace/image", label: "Создать изображение", icon: "image" },
];

const metrics = [
  { label: "Память", value: "42%", hint: "Project memory" },
  { label: "AI usage", value: "18.4k", hint: "токенов сегодня" },
  { label: "Запросы", value: "1 284", hint: "за 30 дней" },
  { label: "Подписка", value: "Pro", hint: "$20 / мес" },
];

export default function WorkspaceHomePage() {
  return (
    <div>
      <PageTitle
        title="Главная"
        subtitle="Спокойный обзор вашего AI Operating System — только то, что важно сейчас."
      />

      <div className="mb-10 flex flex-wrap gap-3">
        {actions.map((a) => (
          <Link key={a.href + a.label} href={a.href}>
            <SoftButton variant="soft" className="min-w-[160px]">
              <Icon name={a.icon} className="h-4 w-4" />
              {a.label}
            </SoftButton>
          </Link>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <Panel key={m.label} className="p-6">
            <div className="text-[12px] uppercase tracking-[0.14em] text-mist">{m.label}</div>
            <div className="mt-4 font-display text-[32px] font-semibold tracking-tight">
              {m.value}
            </div>
            <div className="mt-2 text-[13px] text-mist">{m.hint}</div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="p-6 lg:col-span-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Последние чаты</h2>
            <Link href="/workspace/chats" className="text-[13px] text-mist hover:text-white">
              Все
            </Link>
          </div>
          <ul className="space-y-3">
            {CHATS.slice(0, 4).map((c) => (
              <li key={c.title}>
                <Link
                  href="/workspace/chats"
                  className="block rounded-2xl px-3 py-3 transition hover:bg-white/[0.04]"
                >
                  <div className="truncate text-[14px] font-medium">{c.title}</div>
                  <div className="mt-1 text-[12px] text-mist">
                    {c.folder} · {c.time}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-6 lg:col-span-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Документы</h2>
            <Link href="/workspace/documents" className="text-[13px] text-mist hover:text-white">
              Все
            </Link>
          </div>
          <ul className="space-y-3">
            {DOCS.map((d) => (
              <li
                key={d.title}
                className="rounded-2xl px-3 py-3 transition hover:bg-white/[0.04]"
              >
                <div className="text-[14px] font-medium">{d.title}</div>
                <div className="mt-1 text-[12px] text-mist">
                  {d.kind} · {d.updated}
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-6 lg:col-span-1">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Избранные проекты</h2>
            <Link href="/workspace/projects" className="text-[13px] text-mist hover:text-white">
              Все
            </Link>
          </div>
          <ul className="space-y-3">
            {PROJECTS.filter((p) => p.favorite).map((p) => (
              <li
                key={p.name}
                className="rounded-2xl px-3 py-3 transition hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[14px] font-medium">{p.name}</div>
                  <span className="text-[11px] text-mist">{p.status}</span>
                </div>
                <div className="mt-1 text-[12px] text-mist">
                  {p.chats} чатов · {p.files} файлов
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
