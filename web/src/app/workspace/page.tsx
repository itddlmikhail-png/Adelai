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

const AI_USAGE_PERCENT = 42;

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

      <Panel className="mb-8 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <div className="text-[12px] uppercase tracking-[0.14em] text-mist">
            AI usage
          </div>
          <div className="font-display text-[22px] font-semibold tracking-tight tabular-nums sm:text-[24px]">
            {AI_USAGE_PERCENT}%
          </div>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.08]"
          role="progressbar"
          aria-label="AI usage"
          aria-valuenow={AI_USAGE_PERCENT}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-white/75 to-white transition-[width] duration-700 ease-out"
            style={{ width: `${AI_USAGE_PERCENT}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-mist">
          <span>Использовано в этом цикле</span>
          <span className="tabular-nums text-white/70">
            {AI_USAGE_PERCENT} / 100
          </span>
        </div>
      </Panel>

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
