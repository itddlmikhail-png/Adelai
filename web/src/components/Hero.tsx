import { NightPlanet } from "./NightPlanet";
import { StoreButtons } from "./StoreButtons";

export function Hero() {
  return (
    <section className="relative isolate h-[100svh] overflow-hidden bg-ink">
      <NightPlanet />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-ink via-ink/60 to-transparent" />

      <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-content flex-col px-6 pb-6 pt-[4.75rem] md:px-8 md:pb-8 md:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="animate-rise-in font-display text-[clamp(2.8rem,9vw,5.5rem)] font-bold leading-[0.92] tracking-tighter2 text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
            Adelai
          </h1>
          <p
            className="animate-rise-in mt-4 font-display text-[clamp(1.15rem,2.8vw,1.65rem)] font-medium leading-snug tracking-tight text-white/90 text-balance"
            style={{ animationDelay: "70ms" }}
          >
            AI Operating System для мышления и создания
          </p>
          <p
            className="animate-rise-in mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-mist text-balance md:text-[16px]"
            style={{ animationDelay: "120ms" }}
          >
            Всё живёт внутри Projects. У каждого проекта — своя память и свой AI,
            который понимает контекст.
          </p>

          <div
            className="animate-rise-in pointer-events-auto mx-auto mt-6 flex max-w-md flex-col gap-2.5 sm:mt-7"
            style={{ animationDelay: "180ms" }}
          >
            <StoreButtons />
          </div>

          <p
            className="animate-fade-in mt-5 text-[10px] tracking-[0.16em] text-mist/75 uppercase md:mt-6"
            style={{ animationDelay: "280ms" }}
          >
            Проведи курсором — планета наклонится, зажгутся огни
          </p>
        </div>

        <div className="flex-1" aria-hidden />
      </div>
    </section>
  );
}
