"use client";

import { useState } from "react";
import { MODELS } from "../../../components/workspace/data";
import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

function Bar({ value, dark }: { value: number; dark?: boolean }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full ${dark ? "bg-ink/10" : "bg-white/[0.06]"}`}>
      <div
        className={`h-full rounded-full ${dark ? "bg-ink" : "bg-white"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function ModelsPage() {
  const [selected, setSelected] = useState<string>(MODELS[0].id);

  return (
    <div>
      <PageTitle
        title="AI модели"
        subtitle="Переключайтесь между моделями одним нажатием. Скорость, качество, стоимость и контекст — всегда на виду."
        action={
          <SoftButton variant="soft">OpenRouter · Auto</SoftButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MODELS.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              className={`rounded-[24px] border p-6 text-left transition ${
                active
                  ? "border-white/25 bg-white text-ink"
                  : "border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.04]"
              }`}
            >
              <div className="text-[12px] uppercase tracking-[0.14em] opacity-60">
                {m.brand}
              </div>
              <div className="mt-2 font-display text-xl font-semibold tracking-tight">
                {m.name}
              </div>
              <div className="mt-6 space-y-3">
                <div>
                  <div className="mb-1.5 flex justify-between text-[12px]">
                    <span className={active ? "text-ink/50" : "text-mist"}>Скорость</span>
                    <span>{m.speed}</span>
                  </div>
                  <Bar value={m.speed} dark={active} />
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-[12px]">
                    <span className={active ? "text-ink/50" : "text-mist"}>Качество</span>
                    <span>{m.quality}</span>
                  </div>
                  <Bar value={m.quality} dark={active} />
                </div>
              </div>
              <div className={`mt-6 flex flex-wrap gap-2 text-[12px] ${active ? "text-ink/60" : "text-mist"}`}>
                <span>Стоимость {m.cost}</span>
                <span>·</span>
                <span>Контекст {m.context}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.caps.map((c) => (
                  <span
                    key={c}
                    className={`rounded-full px-2.5 py-1 text-[11px] ${
                      active ? "bg-ink/5 text-ink/70" : "bg-white/[0.05] text-white/70"
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <Panel className="mt-8 p-6">
        <div className="text-[13px] text-mist">Активная модель</div>
        <div className="mt-2 font-display text-2xl font-semibold">
          {MODELS.find((m) => m.id === selected)?.name}
        </div>
      </Panel>
    </div>
  );
}
