export function StoreButtons() {
  return (
    <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
      <StoreButton label="App Store" caption="Download" icon={<AppleIcon />} />
      <StoreButton label="Google Play" caption="Get it on" icon={<PlayIcon />} />
      <StoreButton label="Web" caption="Soon" icon={<WebIcon />} soon />
    </div>
  );
}

function StoreButton({
  label,
  caption,
  icon,
  soon = false,
}: {
  label: string;
  caption: string;
  icon: React.ReactNode;
  soon?: boolean;
}) {
  return (
    <button
      type="button"
      className="group flex min-h-[52px] flex-1 items-center gap-3 rounded-2xl border border-white/[0.1] bg-black/45 px-3.5 py-2.5 text-left backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-[0.12em] text-mist">
          {soon ? "Soon" : caption}
        </span>
        <span className="block truncate text-[14px] font-semibold tracking-tight text-white">
          {label}
        </span>
      </span>
    </button>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.7 12.4c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3.1-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.3-3.3zM14.6 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 1.9-.5 2.6-1.2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.5 3.1c-.4.2-.7.7-.7 1.3v15.2c0 .6.3 1.1.8 1.3l11.8-8.9L4.5 3.1zm13.2 7.1-2.5 1.5 2.5 1.9 3.1-1.8c.7-.4.7-1.4 0-1.8l-3.1-1.8zM5.8 20.7l9.1-5.5-2.3-1.7-6.8 7.2zm9.1-12L5.9 3.3l6.7 7.1 2.3-1.7z" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" />
    </svg>
  );
}
