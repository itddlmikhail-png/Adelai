"use client";

import { useState } from "react";
import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

export default function ImagePage() {
  const [prompt, setPrompt] = useState(
    "Quiet night earth from orbit, premium cinematic light, soft atmosphere"
  );

  return (
    <div>
      <PageTitle
        title="Изображения"
        subtitle="Создание, редактирование, удаление фона и улучшение качества."
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="p-6">
          <label className="block text-[13px] text-mist">Промпт</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-3 min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-[15px] outline-none"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <SoftButton variant="solid">Создать</SoftButton>
            <SoftButton variant="soft">Улучшить</SoftButton>
            <SoftButton variant="soft">Убрать фон</SoftButton>
            <SoftButton variant="soft">Редактировать</SoftButton>
          </div>
        </Panel>
        <Panel className="flex min-h-[320px] items-center justify-center overflow-hidden p-2">
          <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-[20px] bg-[radial-gradient(circle_at_30%_20%,#2a3340,transparent_45%),radial-gradient(circle_at_70%_70%,#1a222c,transparent_40%),#0b0d10] text-[13px] text-mist">
            Галерея / превью генерации
          </div>
        </Panel>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {["Gen 01", "Gen 02", "Gen 03", "Gen 04"].map((g) => (
          <Panel key={g} className="aspect-square p-4 text-[13px] text-mist">
            {g}
          </Panel>
        ))}
      </div>
    </div>
  );
}
