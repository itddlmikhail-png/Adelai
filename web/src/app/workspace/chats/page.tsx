"use client";

import { FormEvent, useMemo, useState } from "react";
import { CHATS, MODELS } from "../../../components/workspace/data";
import { Icon, IconButton, SoftButton } from "../../../components/workspace/ui";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const seed: Msg[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Готов работать внутри Adelai. Можно прикрепить PDF, Word, Excel или изображение — и продолжить в контексте проекта.",
  },
];

function renderContent(text: string) {
  // Minimal markdown-ish rendering for demo quality
  const blocks = text.split(/```/);
  return blocks.map((block, i) => {
    if (i % 2 === 1) {
      const [lang, ...rest] = block.split("\n");
      const code = rest.join("\n");
      return (
        <pre
          key={i}
          className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-[13px] leading-relaxed text-white/90"
        >
          <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-mist">
            {lang || "code"}
          </div>
          <code>{code}</code>
        </pre>
      );
    }
    return (
      <div key={i} className="space-y-3 text-[15px] leading-7 text-white/90">
        {block.split("\n").map((line, idx) => {
          if (line.startsWith("### "))
            return (
              <h3 key={idx} className="font-display text-lg font-semibold">
                {line.slice(4)}
              </h3>
            );
          if (line.startsWith("- "))
            return (
              <div key={idx} className="flex gap-2 pl-1">
                <span className="text-mist">•</span>
                <span>{line.slice(2)}</span>
              </div>
            );
          if (!line.trim()) return <div key={idx} className="h-2" />;
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  });
}

export default function ChatsPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [model, setModel] = useState<string>(MODELS[1].id);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(seed);

  const filtered = useMemo(
    () =>
      CHATS.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: String(Date.now()), role: "user", content: text };
    const reply: Msg = {
      id: String(Date.now() + 1),
      role: "assistant",
      content: `### Ответ Adelai\n\nПринял запрос в контексте чата «${filtered[active]?.title || "Новый чат"}».\n\n- Модель: **${MODELS.find((m) => m.id === model)?.name}**\n- Можно продолжить файлами, голосом или кодом.\n\n\`\`\`ts\nconst workspace = await adelai.openProject("Adelai OS");\nawait workspace.chat.send(${JSON.stringify(text)});\n\`\`\``,
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  };

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[300px] shrink-0 flex-col border-r border-white/[0.06] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="font-display text-xl font-semibold">Чаты</h1>
          <SoftButton variant="solid" className="h-9 px-3 text-[13px]">
            <Icon name="plus" className="h-4 w-4" />
            Новый
          </SoftButton>
        </div>
        <label className="mb-4 flex h-11 items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3">
          <Icon name="search" className="h-4 w-4 text-mist" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по чатам"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-white/25"
          />
        </label>
        <div className="space-y-1 overflow-y-auto">
          {filtered.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => setActive(i)}
              className={`w-full rounded-2xl px-3 py-3 text-left transition ${
                i === active ? "bg-white text-ink" : "hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[14px] font-medium">{c.title}</span>
                {c.pinned && <span className="text-[11px] opacity-60">pin</span>}
              </div>
              <div className={`mt-1 text-[12px] ${i === active ? "text-ink/50" : "text-mist"}`}>
                {c.folder} · {c.time}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[72px] items-center justify-between gap-4 border-b border-white/[0.06] px-6">
          <div className="min-w-0">
            <div className="truncate font-display text-[17px] font-semibold">
              {filtered[active]?.title || "Новый чат"}
            </div>
            <div className="text-[12px] text-mist">Папка · {filtered[active]?.folder || "Inbox"}</div>
          </div>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-10 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-[13px] outline-none"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-ink">
                {m.brand} · {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-8">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-3xl ${m.role === "user" ? "ml-auto" : ""}`}
            >
              <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-mist">
                {m.role === "user" ? "Вы" : "Adelai"}
              </div>
              <div
                className={`rounded-[24px] px-5 py-4 ${
                  m.role === "user"
                    ? "bg-white text-ink"
                    : "border border-white/[0.06] bg-white/[0.03]"
                }`}
              >
                {m.role === "assistant" ? renderContent(m.content) : m.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="border-t border-white/[0.06] p-5">
          <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-2 pl-3">
            <IconButton aria-label="Файл" className="shrink-0 border-0 bg-transparent">
              <Icon name="paperclip" className="h-4 w-4" />
            </IconButton>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Сообщение Adelai… Markdown, код, файлы, голос"
              className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-3 text-[15px] outline-none placeholder:text-white/25"
            />
            <IconButton aria-label="Голос" className="shrink-0 border-0 bg-transparent">
              <Icon name="mic" className="h-4 w-4" />
            </IconButton>
            <button
              type="submit"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ink transition hover:bg-white/90"
              aria-label="Отправить"
            >
              <Icon name="send" className="h-4 w-4" />
            </button>
          </div>
          <p className="mx-auto mt-3 max-w-4xl text-center text-[12px] text-mist">
            Поддержка Markdown, кода, таблиц, PDF / Word / Excel, изображений и голосовых сообщений.
          </p>
        </form>
      </section>
    </div>
  );
}
