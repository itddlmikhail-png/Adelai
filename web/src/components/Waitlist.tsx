"use client";

import { FormEvent, useState } from "react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <section id="waitlist" className="border-t border-white/[0.06] atmosphere">
      <div className="noise" aria-hidden />
      <div className="relative mx-auto max-w-content px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-balance">
            Adelai
          </h2>
          <p className="mt-4 text-[clamp(1.1rem,2.4vw,1.35rem)] text-white/90">
            Следующее поколение AI productivity
          </p>
          <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-mist">
            Оставьте email — откроем early access и пришлём приглашение первыми.
          </p>

          {done ? (
            <p className="mt-10 text-[17px] text-white">Вы в списке. Скоро напишем.</p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-12 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 text-[15px] text-white outline-none placeholder:text-mist focus:border-white/25"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-white px-6 text-[15px] font-semibold text-ink transition hover:bg-white/90"
              >
                Join waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
