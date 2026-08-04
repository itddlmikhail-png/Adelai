const pillars = [
  {
    id: "product",
    eyebrow: "Projects",
    title: "Всё существует внутри Projects",
    body: "Документы, заметки, задачи, файлы и диалоги живут в одном пространстве. Проект — это операционная система вашей работы.",
  },
  {
    id: "memory",
    eyebrow: "AI Memory",
    title: "AI, который помнит",
    body: "Каждый проект хранит собственную память: цели, решения, файлы и историю. Adelai отвечает из контекста, а не с нуля.",
  },
  {
    id: "calm",
    eyebrow: "Workspace",
    title: "Спокойный workspace",
    body: "Минимум шума. Типографика вместо цвета. Движение вместо эффектов. Интерфейс, в котором можно думать.",
  },
];

export function Pillars() {
  return (
    <section className="relative border-t border-white/[0.06] bg-ink">
      <div className="mx-auto max-w-content px-6 py-24 md:px-8 md:py-32">
        <div className="grid gap-16 md:gap-24">
          {pillars.map((item, index) => (
            <article
              key={item.id}
              id={item.id}
              className="grid items-end gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-mist">
                  {String(index + 1).padStart(2, "0")} · {item.eyebrow}
                </p>
                <h2 className="mt-4 max-w-md font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-balance">
                  {item.title}
                </h2>
              </div>
              <p className="max-w-xl text-[17px] leading-relaxed text-mist md:pb-2">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
