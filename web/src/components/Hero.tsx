import { NightPlanet } from "./NightPlanet";
import { StoreButtons } from "./StoreButtons";

export function Hero() {
  return (
    <section className="relative isolate h-[100svh] overflow-hidden bg-black">
      <NightPlanet />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/85 to-transparent" />

      <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-content flex-col px-6 pb-5 pt-[4.5rem] md:px-8 md:pb-7 md:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="animate-rise-in font-display text-[clamp(2.4rem,7vw,4.2rem)] font-bold leading-[0.92] tracking-tighter2 text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
            Adelai
          </h1>
          <p
            className="animate-rise-in mt-3 font-display text-[clamp(1.05rem,2.4vw,1.4rem)] font-medium leading-snug tracking-tight text-white/90 text-balance"
            style={{ animationDelay: "70ms" }}
          >
            AI Operating System для мышления и создания
          </p>
          <p
            className="animate-fade-in mt-4 text-[10px] tracking-[0.16em] text-mist/75 uppercase"
            style={{ animationDelay: "160ms" }}
          >
            Двигай курсор — огоньки вспыхивают, Земля следует
          </p>
        </div>

        <div className="flex-1" aria-hidden />

        <div
          className="animate-rise-in pointer-events-auto mx-auto w-full max-w-xl pb-[env(safe-area-inset-bottom)]"
          style={{ animationDelay: "220ms" }}
        >
          <StoreButtons />
        </div>
      </div>
    </section>
  );
}
