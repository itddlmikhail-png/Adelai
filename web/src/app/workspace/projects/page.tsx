import { PROJECTS } from "../../../components/workspace/data";
import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

export default function ProjectsPage() {
  return (
    <div>
      <PageTitle
        title="Проекты"
        subtitle="Каждый проект независим: свои чаты, документы, файлы, агенты и история."
        action={<SoftButton variant="solid">Новый проект</SoftButton>}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {PROJECTS.map((p) => (
          <Panel key={p.name} className="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-2xl font-semibold tracking-tight">
                  {p.name}
                </div>
                <div className="mt-2 text-[13px] text-mist">{p.status}</div>
              </div>
              {p.favorite && (
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-mist">
                  Избранное
                </span>
              )}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-[13px] text-mist sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.03] p-4">
                <div className="text-white">{p.chats}</div>
                Чаты
              </div>
              <div className="rounded-2xl bg-white/[0.03] p-4">
                <div className="text-white">{p.files}</div>
                Файлы
              </div>
              <div className="rounded-2xl bg-white/[0.03] p-4">
                <div className="text-white">Docs</div>
                Документы
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[12px] text-mist">
              <span>AI Агенты</span>·<span>Заметки</span>·<span>История изменений</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
