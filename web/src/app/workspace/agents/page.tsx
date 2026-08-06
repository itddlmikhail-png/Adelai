import { AGENTS } from "../../../components/workspace/data";
import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

export default function AgentsPage() {
  return (
    <div>
      <PageTitle
        title="AI Агенты"
        subtitle="Создавайте собственных AI-сотрудников с памятью, файлами и инструментами."
        action={<SoftButton variant="solid">Создать агента</SoftButton>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((a) => (
          <Panel key={a.name} className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-ink">
                {a.name.slice(0, 1)}
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{a.name}</div>
                <div className="text-[13px] text-mist">{a.role}</div>
              </div>
            </div>
            <dl className="mt-6 space-y-2 text-[13px] text-mist">
              <div className="flex justify-between gap-3">
                <dt>Системный промпт</dt>
                <dd className="text-white/80">Настроен</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Память</dt>
                <dd className="text-white/80">Project-scoped</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Температура</dt>
                <dd className="text-white/80">0.4 · {a.tone}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Инструменты</dt>
                <dd className="text-white/80">Files · Web · Code</dd>
              </div>
            </dl>
            <SoftButton variant="soft" className="mt-6 w-full">
              Открыть
            </SoftButton>
          </Panel>
        ))}
      </div>
    </div>
  );
}
