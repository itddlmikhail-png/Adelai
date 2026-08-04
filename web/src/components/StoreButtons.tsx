"use client";

export function StoreButtons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Download on the App Store"
        className="inline-flex h-[44px] w-[148px] items-center gap-2.5 rounded-[9px] bg-black px-3.5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/15 transition hover:brightness-110 active:scale-[0.98]"
      >
        <AppleIcon />
        <span className="min-w-0 text-left leading-none">
          <span className="block text-[8px] font-medium tracking-[0.02em] text-white/85">
            Download on the
          </span>
          <span className="mt-0.5 block text-[15px] font-semibold tracking-[-0.02em]">
            App Store
          </span>
        </span>
      </a>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Get it on Google Play"
        className="inline-flex h-[44px] w-[148px] items-center gap-2.5 rounded-[9px] bg-black px-3.5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/15 transition hover:brightness-110 active:scale-[0.98]"
      >
        <PlayIcon />
        <span className="min-w-0 text-left leading-none">
          <span className="block text-[8px] font-medium tracking-[0.08em] text-white/85">
            GET IT ON
          </span>
          <span className="mt-0.5 block text-[15px] font-semibold tracking-[-0.02em]">
            Google Play
          </span>
        </span>
      </a>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        aria-label="Open Web App"
        className="inline-flex h-[44px] w-[148px] items-center gap-2.5 rounded-[9px] bg-white px-3.5 text-black shadow-[0_8px_24px_rgba(255,255,255,0.12)] transition hover:bg-white/92 active:scale-[0.98]"
      >
        <WebIcon />
        <span className="min-w-0 text-left leading-none">
          <span className="block text-[8px] font-medium tracking-[0.08em] text-black/55">
            OPEN IN
          </span>
          <span className="mt-0.5 block text-[15px] font-semibold tracking-[-0.02em]">
            Web App
          </span>
        </span>
      </a>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.7 12.4c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3.1-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.3-3.3zM14.6 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 1.9-.5 2.6-1.2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 24 26" aria-hidden>
      <path d="M1.2 1.4C.6 1.8.2 2.5.2 3.4v19.2c0 .9.4 1.6 1 2l12.8-11.6L1.2 1.4z" fill="#EA4335" />
      <path d="M17.2 12.2 14 14.6l3.3 2.5 4.1-2.4c.9-.5.9-1.7 0-2.3l-4.2-2.2z" fill="#FBBC04" />
      <path d="M1.2 24.6 13.9 14.6 11 12.5 1.2 24.6z" fill="#34A853" />
      <path d="M14 11.4 1.2 1.4 11 12.5 14 11.4z" fill="#4285F4" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z" />
    </svg>
  );
}
