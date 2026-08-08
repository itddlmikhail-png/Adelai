"use client";

import { useMemo, useState } from "react";
import { AGENT_ROLES, AGENTS } from "../../../components/workspace/data";
import {
  CreateAgentWizard,
  type CreatedAgent,
} from "../../../components/workspace/CreateAgentWizard";
import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

type ListedAgent = {
  id: string;
  name: string;
  role: string;
  tone: string;
  trained?: boolean;
  answersCount?: number;
};

const seedAgents: ListedAgent[] = AGENTS.map((a, i) => ({
  id: `seed-${i}`,
  name: a.name,
  role: a.role,
  tone: a.tone,
}));

export default function AgentsPage() {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<CreatedAgent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const agents = useMemo<ListedAgent[]>(() => {
    const fresh = created.map((a) => ({
      id: a.id,
      name: a.name,
      role: a.roleSubtitle,
      tone: "custom",
      trained: true,
      answersCount: Object.values(a.answers).filter((v) => v.trim()).length,
    }));
    return [...fresh, ...seedAgents];
  }, [created]);

  const selected = created.find((a) => a.id === selectedId) || null;

  return (
    <div>
      <PageTitle
        title="AI Агенты"
        subtitle="Выберите роль, ответьте на короткие вопросы — и получите своего AI-сотрудника."
        action={
          <SoftButton variant="solid" onClick={() => setOpen(true)}>
            Создать агента
          </SoftButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <Panel key={a.id} className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-ink">
                {a.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-lg font-semibold">
                  {a.name}
                </div>
                <div className="truncate text-[13px] text-mist">{a.role}</div>
              </div>
            </div>

            <dl className="mt-5 space-y-2 text-[13px] text-mist">
              <div className="flex justify-between gap-3">
                <dt>Обучение</dt>
                <dd className="text-white/80">
                  {a.trained
                    ? `Готово · ${a.answersCount || 0} ответа`
                    : "Базовый профиль"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Память</dt>
                <dd className="text-white/80">Project-scoped</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Тон</dt>
                <dd className="text-white/80">{a.tone}</dd>
              </div>
            </dl>

            {a.trained && (
              <SoftButton
                variant="soft"
                className="mt-5 w-full"
                onClick={() => setSelectedId(a.id)}
              >
                Открыть
              </SoftButton>
            )}
          </Panel>
        ))}
      </div>

      <CreateAgentWizard
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(agent) => {
          setCreated((prev) => [agent, ...prev]);
          setSelectedId(agent.id);
        }}
      />

      {selected && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setSelectedId(null)}
          />
          <div className="relative z-10 max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#0b0d12] p-5 shadow-2xl sm:rounded-[28px] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-mist">
                  Агент
                </div>
                <h3 className="mt-1 font-display text-2xl font-semibold">
                  {selected.name}
                </h3>
                <p className="mt-1 text-[13px] text-mist">
                  {selected.roleTitle} · {selected.roleSubtitle}
                </p>
              </div>
              <SoftButton variant="ghost" onClick={() => setSelectedId(null)}>
                Закрыть
              </SoftButton>
            </div>

            <div className="mt-6 space-y-3">
              {(
                AGENT_ROLES.find((r) => r.id === selected.roleId)?.questions ||
                []
              )
                .filter((q) => (selected.answers[q.id] || "").trim())
                .map((q) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
                  >
                    <div className="text-[13px] font-medium text-white/90">
                      {q.prompt}
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/75">
                      {selected.answers[q.id]}
                    </p>
                  </div>
                ))}
              {selected.notes.trim() && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-mist">
                    Доп. информация
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/85">
                    {selected.notes}
                  </p>
                </div>
              )}
              {!Object.values(selected.answers).some((v) => v.trim()) &&
                !selected.notes.trim() && (
                  <p className="text-[14px] text-mist">
                    Агент создан без подробных ответов — можно дообучить позже.
                  </p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
