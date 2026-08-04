export function StoreButtons() {
  return (
    <div className="flex items-center justify-center gap-2">
      <StoreButton
        label="App Store"
        className="bg-gradient-to-r from-[#5ac8fa] to-[#007aff] text-white shadow-[0_6px_20px_rgba(0,122,255,0.35)]"
        icon={<AppleIcon />}
      />
      <StoreButton
        label="Google Play"
        className="bg-gradient-to-r from-[#34a853] via-[#fbbc05] to-[#ea4335] text-white shadow-[0_6px_20px_rgba(52,168,83,0.28)]"
        icon={<PlayIcon />}
      />
      <StoreButton
        label="Web"
        className="bg-gradient-to-r from-[#a78bfa] to-[#6366f1] text-white shadow-[0_6px_20px_rgba(99,102,241,0.32)]"
        icon={<WebIcon />}
      />
    </div>
  );
}

function StoreButton({
  label,
  icon,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold tracking-tight transition hover:brightness-110 active:scale-[0.97] ${className}`}
    >
      <span className="flex h-4 w-4 items-center justify-center opacity-95">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function AppleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.7 12.4c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3.1-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.3-3.3zM14.6 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 1.9-.5 2.6-1.2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.5 3.1c-.4.2-.7.7-.7 1.3v15.2c0 .6.3 1.1.8 1.3l11.8-8.9L4.5 3.1zm13.2 7.1-2.5 1.5 2.5 1.9 3.1-1.8c.7-.4.7-1.4 0-1.8l-3.1-1.8zM5.8 20.7l9.1-5.5-2.3-1.7-6.8 7.2zm9.1-12L5.9 3.3l6.7 7.1 2.3-1.7z" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" />
    </svg>
  );
}
