import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

const prompts = [
  { title: "Системный аналитик", cat: "Product", fav: true },
  { title: "Код-ревьюер TypeScript", cat: "Engineering", fav: true },
  { title: "Позиционирование бренда", cat: "Marketing", fav: false },
  { title: "Юридический чеклист", cat: "Legal", fav: false },
  { title: "Перевод UI EN→RU", cat: "Localization", fav: true },
];

export default function PromptsPage() {
  return (
    <div>
      <PageTitle
        title="Библиотека промптов"
        subtitle="Категории, избранное, переменные, импорт и экспорт."
        action={
          <div className="flex gap-2">
            <SoftButton variant="soft">Импорт</SoftButton>
            <SoftButton variant="solid">Новый промпт</SoftButton>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {prompts.map((p) => (
          <Panel key={p.title} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg font-semibold">{p.title}</div>
                <div className="mt-2 text-[13px] text-mist">{p.cat}</div>
              </div>
              {p.fav && (
                <span className="text-[11px] uppercase tracking-[0.12em] text-mist">
                  Fav
                </span>
              )}
            </div>
            <div className="mt-5 text-[13px] text-mist">
              Переменные: {"{{project}}"} · {"{{tone}}"} · {"{{audience}}"}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
