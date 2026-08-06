import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

const roles = ["Владелец", "Администратор", "Менеджер", "Участник", "Гость"];
const people = [
  { name: "Mikhail", role: "Владелец", email: "itddlmikhail@gmail.com" },
  { name: "Anna", role: "Администратор", email: "anna@adelai.app" },
  { name: "Leo", role: "Менеджер", email: "leo@adelai.app" },
];

export default function TeamPage() {
  return (
    <div>
      <PageTitle
        title="Команда"
        subtitle="Общие проекты, документы, агенты и чаты. Роли и доступ под контролем."
        action={<SoftButton variant="solid">Пригласить</SoftButton>}
      />
      <div className="mb-8 flex flex-wrap gap-2">
        {roles.map((r) => (
          <span
            key={r}
            className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-mist"
          >
            {r}
          </span>
        ))}
      </div>
      <div className="space-y-3">
        {people.map((p) => (
          <Panel key={p.email} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[12px] font-semibold text-ink">
                {p.name.slice(0, 1)}
              </div>
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-[13px] text-mist">{p.email}</div>
              </div>
            </div>
            <div className="text-[13px] text-mist">{p.role}</div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
