export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden atmosphere"
    >
      <div className="noise" aria-hidden />
      <div className="pointer-events-none absolute inset-0 grid-fade" aria-hidden />

      <div className="relative mx-auto flex min-h-[100svh] max-w-content flex-col px-6 pb-0 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-rise-in font-display text-[clamp(3.4rem,10vw,6.5rem)] font-bold leading-[0.92] tracking-tighter2 text-white">
            Adelai
          </h1>
          <p
            className="animate-rise-in mt-6 font-display text-[clamp(1.35rem,3.2vw,2rem)] font-medium leading-snug tracking-tight text-white/90 text-balance"
            style={{ animationDelay: "80ms" }}
          >
            AI Operating System для мышления и создания
          </p>
          <p
            className="animate-rise-in mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-mist text-balance"
            style={{ animationDelay: "140ms" }}
          >
            Всё живёт внутри Projects. У каждого проекта — своя память и свой AI,
            который понимает контекст.
          </p>
          <div
            className="animate-rise-in mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "200ms" }}
          >
            <a
              href="#waitlist"
              className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-ink transition hover:bg-white/90"
            >
              Получить доступ
            </a>
            <a
              href="#product"
              className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 text-[15px] font-medium text-white transition hover:bg-white/[0.06]"
            >
              Смотреть продукт
            </a>
          </div>
        </div>

        <div
          className="animate-rise-in relative mt-14 flex-1 md:mt-16"
          style={{ animationDelay: "280ms" }}
        >
          <ProductStage />
        </div>
      </div>
    </section>
  );
}

function ProductStage() {
  return (
    <div className="relative mx-auto w-full max-w-5xl animate-float">
      <div className="absolute -inset-x-10 -top-10 h-40 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-t-[22px] border border-white/[0.08] border-b-0 bg-ink-soft shadow-[0_-20px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 text-xs text-mist">Atlas Redesign — Workspace</span>
        </div>
        <div className="grid min-h-[320px] grid-cols-1 md:min-h-[420px] md:grid-cols-[200px_1fr_220px]">
          <aside className="hidden border-r border-white/[0.06] p-4 md:block">
            <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-mist">Project</p>
            {["Overview", "AI", "Documents", "Notes", "Tasks", "Memory"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`mb-1 rounded-lg px-3 py-2 text-sm ${
                    i === 1 ? "bg-white text-ink" : "text-mist"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </aside>
          <main className="flex flex-col border-r border-white/[0.06] p-5">
            <p className="text-xs text-mist">Project partner</p>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
              How should memory work?
            </h3>
            <div className="mt-6 space-y-3">
              <div className="ml-auto max-w-[85%] rounded-2xl border border-white/[0.06] bg-ink-card px-4 py-3 text-sm leading-relaxed text-white/90">
                Keep memory as durable facts with sources — not chat logs.
              </div>
              <div className="max-w-[90%] rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-mist">
                For Atlas, store goals and decisions. Cite quietly unless asked.
                The interface stays calm while the partner stays informed.
              </div>
            </div>
            <div className="mt-auto pt-8">
              <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-mist">
                Ask your project partner…
              </div>
            </div>
          </main>
          <aside className="hidden p-4 md:block">
            <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-mist">
              AI Memory
            </p>
            {[
              ["Design language", "Dark, monochrome, typography-led"],
              ["Primary user", "Builders who want Cursor-like precision"],
              ["Non-goals", "No colorful dashboards"],
            ].map(([title, detail]) => (
              <div
                key={title}
                className="mb-3 rounded-xl border border-white/[0.06] bg-ink-card p-3"
              >
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist">{detail}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
