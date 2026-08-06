import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

const steps = [
  "При загрузке PDF",
  "AI анализирует документ",
  "Создает краткое содержание",
  "Переводит",
  "Сохраняет в проект",
  "Отправляет уведомление",
];

export default function AutomationsPage() {
  return (
    <div>
      <PageTitle
        title="Автоматизации"
        subtitle="Визуальный конструктор цепочек. Запускайте AI-процессы без ручной рутины."
        action={<SoftButton variant="solid">Новая автоматизация</SoftButton>}
      />
      <Panel className="p-8">
        <div className="font-display text-xl font-semibold">PDF → Summary → Notify</div>
        <div className="mt-8 flex flex-col gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-stretch gap-4">
              <div className="flex w-10 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[13px] font-semibold text-ink">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-3 h-full w-px flex-1 bg-white/10" />
                )}
              </div>
              <div className="mb-3 flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 text-[15px]">
                {s}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
