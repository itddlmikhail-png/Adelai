"use client";

import { useEffect, useMemo, useState } from "react";
import { AGENT_ROLES, type AgentRole, type AgentRoleId } from "./data";
import { Icon, SoftButton } from "./ui";

export type CreatedAgent = {
  id: string;
  name: string;
  roleId: AgentRoleId;
  roleTitle: string;
  roleSubtitle: string;
  answers: Record<string, string>;
  notes: string;
  createdAt: string;
};

type Step = "role" | "train" | "done";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (agent: CreatedAgent) => void;
};

export function CreateAgentWizard({ open, onClose, onCreated }: Props) {
  const [step, setStep] = useState<Step>("role");
  const [roleId, setRoleId] = useState<AgentRoleId | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const role: AgentRole | null = useMemo(
    () => AGENT_ROLES.find((r) => r.id === roleId) ?? null,
    [roleId]
  );

  useEffect(() => {
    if (!open) return;
    setStep("role");
    setRoleId(null);
    setAnswers({});
    setNotes("");
    setName("");
    setQuestionIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const currentQuestion = role?.questions[questionIndex];
  const answeredCount = role
    ? role.questions.filter((q) => (answers[q.id] || "").trim()).length
    : 0;

  const pickRole = (id: AgentRoleId) => {
    const picked = AGENT_ROLES.find((r) => r.id === id);
    setRoleId(id);
    setName(picked?.title || "");
    setAnswers({});
    setNotes("");
    setQuestionIndex(0);
    setStep("train");
  };

  const setAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const finish = () => {
    if (!role) return;
    onCreated({
      id: `agent-${Date.now()}`,
      name: name.trim() || role.title,
      roleId: role.id,
      roleTitle: role.title,
      roleSubtitle: role.subtitle,
      answers,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    });
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-agent-title"
        className="animate-rise-in relative z-10 flex max-h-[92svh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0b0d12] shadow-2xl shadow-black/50 sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.14em] text-mist">
              Создать агента
            </div>
            <h2
              id="create-agent-title"
              className="mt-1 font-display text-[22px] font-semibold tracking-tight"
            >
              {step === "role" && "Выберите роль"}
              {step === "train" && "Обучение агента"}
              {step === "done" && "Агент готов"}
            </h2>
            <p className="mt-1 text-[13px] text-mist">
              {step === "role" && "10 цифровых профессий — просто нажмите на нужную."}
              {step === "train" &&
                "Ответьте на короткие вопросы или добавьте свою информацию."}
              {step === "done" && "Можно сразу открыть агента в Workspace."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] text-white/70 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-5 pt-4 sm:px-6">
          {(
            [
              ["role", "Роль"],
              ["train", "Обучение"],
              ["done", "Готово"],
            ] as const
          ).map(([id, label], i) => {
            const active =
              step === id ||
              (step === "train" && id === "role") ||
              (step === "done" && id !== "done");
            const current = step === id;
            return (
              <div key={id} className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-semibold ${
                    current
                      ? "bg-white text-ink"
                      : active
                        ? "bg-white/15 text-white"
                        : "bg-white/[0.04] text-mist"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`truncate text-[12px] ${
                    current ? "text-white" : "text-mist"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {step === "role" && (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {AGENT_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => pickRole(r.id)}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.05] active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-[16px] font-semibold tracking-tight">
                        {r.title}
                      </div>
                      <div className="mt-0.5 text-[12px] text-mist">{r.subtitle}</div>
                    </div>
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] text-[12px] font-semibold text-white/80 transition group-hover:bg-white group-hover:text-ink">
                      {r.title.slice(0, 1)}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/70">
                    {r.blurb}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === "train" && role && currentQuestion && (
            <div className="mx-auto max-w-xl">
              <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <div className="text-[12px] uppercase tracking-[0.14em] text-mist">
                  Роль
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-display text-lg font-semibold">
                      {role.title}
                    </div>
                    <div className="text-[13px] text-mist">{role.subtitle}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("role")}
                    className="text-[13px] text-white/75 transition hover:text-white"
                  >
                    Сменить роль
                  </button>
                </div>
              </div>

              <label className="mb-5 block">
                <span className="mb-2 block text-[13px] text-mist">Имя агента</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role.title}
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[15px] outline-none transition placeholder:text-white/25 focus:border-white/25"
                />
              </label>

              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-[12px] uppercase tracking-[0.14em] text-mist">
                  Вопрос {questionIndex + 1} из {role.questions.length}
                </div>
                <div className="text-[12px] text-mist">
                  Заполнено {answeredCount}/{role.questions.length}
                </div>
              </div>

              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{
                    width: `${((questionIndex + 1) / role.questions.length) * 100}%`,
                  }}
                />
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
                <p className="font-display text-[17px] font-semibold leading-snug tracking-tight">
                  {currentQuestion.prompt}
                </p>
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                  rows={4}
                  placeholder={currentQuestion.placeholder}
                  className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[14px] leading-relaxed outline-none transition placeholder:text-white/25 focus:border-white/25"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {role.questions.map((q, i) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setQuestionIndex(i)}
                      className={`h-8 min-w-8 rounded-full px-2.5 text-[12px] font-medium transition ${
                        i === questionIndex
                          ? "bg-white text-ink"
                          : (answers[q.id] || "").trim()
                            ? "bg-white/15 text-white"
                            : "bg-white/[0.04] text-mist hover:bg-white/[0.08]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-[13px] text-mist">
                  Дополнительная информация
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Любые материалы: бриф, правила, ссылки, примеры…"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] leading-relaxed outline-none transition placeholder:text-white/25 focus:border-white/25"
                />
              </label>
            </div>
          )}

          {step === "done" && role && (
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white font-display text-2xl font-semibold text-ink">
                {(name || role.title).slice(0, 1)}
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
                {name.trim() || role.title}
              </h3>
              <p className="mt-2 text-[14px] text-mist">
                {role.subtitle} · обучен на ваших ответах
              </p>
              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-left text-[13px] text-white/75">
                <div className="flex justify-between gap-3">
                  <span className="text-mist">Ответов</span>
                  <span>
                    {answeredCount}/{role.questions.length}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-mist">Доп. информация</span>
                  <span>{notes.trim() ? "Добавлена" : "—"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4 sm:px-6">
          {step === "role" && (
            <>
              <p className="text-[13px] text-mist">Выберите роль — откроется обучение</p>
              <SoftButton variant="ghost" onClick={onClose}>
                Отмена
              </SoftButton>
            </>
          )}

          {step === "train" && role && (
            <>
              <SoftButton
                variant="ghost"
                onClick={() => {
                  if (questionIndex === 0) setStep("role");
                  else setQuestionIndex((i) => i - 1);
                }}
              >
                Назад
              </SoftButton>
              <div className="flex flex-wrap gap-2">
                {questionIndex < role.questions.length - 1 ? (
                  <SoftButton
                    variant="solid"
                    onClick={() => setQuestionIndex((i) => i + 1)}
                  >
                    Далее
                  </SoftButton>
                ) : (
                  <SoftButton variant="solid" onClick={finish}>
                    Создать агента
                  </SoftButton>
                )}
              </div>
            </>
          )}

          {step === "done" && (
            <>
              <SoftButton
                variant="ghost"
                onClick={() => {
                  setStep("role");
                  setRoleId(null);
                }}
              >
                Создать ещё
              </SoftButton>
              <SoftButton variant="solid" onClick={onClose}>
                В список агентов
              </SoftButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
