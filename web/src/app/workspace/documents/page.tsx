"use client";

import { useState } from "react";
import { PageTitle, SoftButton } from "../../../components/workspace/ui";

export default function DocumentsPage() {
  const [body, setBody] = useState(
    "# Product Vision\n\nAdelai — AI Operating System для мышления и создания.\n\nПишите спокойно. AI поможет сократить, расширить или перевести текст."
  );

  return (
    <div>
      <PageTitle
        title="Документы"
        subtitle="Редактор уровня Google Docs с AI-редактированием и экспортом."
        action={
          <div className="flex flex-wrap gap-2">
            <SoftButton variant="soft">AI сократить</SoftButton>
            <SoftButton variant="soft">AI расширить</SoftButton>
            <SoftButton variant="soft">Перевести</SoftButton>
            <SoftButton variant="solid">Экспорт</SoftButton>
          </div>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-2">
          {["Product Vision", "Pricing Notes", "Onboarding Flow", "Legal Draft"].map(
            (d, i) => (
              <button
                key={d}
                type="button"
                className={`w-full rounded-2xl px-4 py-3 text-left text-[14px] transition ${
                  i === 0 ? "bg-white text-ink" : "hover:bg-white/[0.04]"
                }`}
              >
                {d}
              </button>
            )
          )}
        </aside>
        <div className="rounded-[28px] border border-white/[0.06] bg-white/[0.025] p-6 md:p-10">
          <div className="mb-6 flex flex-wrap gap-2 text-[12px] text-mist">
            <span className="rounded-full border border-white/10 px-3 py-1">Markdown</span>
            <span className="rounded-full border border-white/10 px-3 py-1">PDF</span>
            <span className="rounded-full border border-white/10 px-3 py-1">DOCX</span>
            <span className="rounded-full border border-white/10 px-3 py-1">История версий</span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[480px] w-full resize-none bg-transparent font-sans text-[16px] leading-8 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
