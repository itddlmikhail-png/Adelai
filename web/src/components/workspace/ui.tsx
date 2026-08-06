type SvgProps = { className?: string };

function Svg({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function Icon({
  name,
  className = "h-[18px] w-[18px]",
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "home":
      return (
        <Svg className={className}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
        </Svg>
      );
    case "chat":
      return (
        <Svg className={className}>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3v-3.2A2.5 2.5 0 0 1 5 13.5v-7z" />
        </Svg>
      );
    case "models":
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </Svg>
      );
    case "projects":
      return (
        <Svg className={className}>
          <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H10l2 2h5.5A2.5 2.5 0 0 1 20 10.5v7A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-9z" />
        </Svg>
      );
    case "docs":
      return (
        <Svg className={className}>
          <path d="M7 4h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <path d="M14 4v4h4M9 13h6M9 17h4" />
        </Svg>
      );
    case "files":
      return (
        <Svg className={className}>
          <path d="M5 7.5A1.5 1.5 0 0 1 6.5 6H10l1.5 2H17.5A1.5 1.5 0 0 1 19 9.5v8A1.5 1.5 0 0 1 17.5 19h-11A1.5 1.5 0 0 1 5 17.5v-10z" />
        </Svg>
      );
    case "agents":
      return (
        <Svg className={className}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 19c1.5-3.2 4-4.8 7-4.8S17.5 15.8 19 19" />
        </Svg>
      );
    case "image":
      return (
        <Svg className={className}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m7 17 3.5-3.5L14 16l2-2 3 3" />
        </Svg>
      );
    case "flow":
      return (
        <Svg className={className}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="12" r="2" />
          <circle cx="6" cy="18" r="2" />
          <path d="M8 6h4a4 4 0 0 1 4 4M8 18h4a4 4 0 0 0 4-4" />
        </Svg>
      );
    case "prompts":
      return (
        <Svg className={className}>
          <path d="M8 5h8a2 2 0 0 1 2 2v7l-4 4H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          <path d="M9 9h6M9 13h4" />
        </Svg>
      );
    case "team":
      return (
        <Svg className={className}>
          <circle cx="9" cy="9" r="2.5" />
          <circle cx="16" cy="10" r="2" />
          <path d="M4.5 18c1-2.6 2.8-4 4.5-4s3.5 1.4 4.5 4M14 18c.6-1.5 1.6-2.4 2.8-2.4 1.1 0 2 .7 2.7 2.4" />
        </Svg>
      );
    case "plug":
      return (
        <Svg className={className}>
          <path d="M8 8V5M12 8V5M7 8h6v3a4 4 0 0 1-4 4v4" />
        </Svg>
      );
    case "settings":
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v2M12 18.5v2M4.9 7.1l1.4 1.4M17.7 15.5l1.4 1.4M3.5 12h2M18.5 12h2M4.9 16.9l1.4-1.4M17.7 8.5l1.4-1.4" />
        </Svg>
      );
    case "search":
      return (
        <Svg className={className}>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </Svg>
      );
    case "bell":
      return (
        <Svg className={className}>
          <path d="M7 10a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5H5.5S7 14 7 10zM10 18.5a2 2 0 0 0 4 0" />
        </Svg>
      );
    case "plus":
      return (
        <Svg className={className}>
          <path d="M12 5v14M5 12h14" />
        </Svg>
      );
    case "send":
      return (
        <Svg className={className}>
          <path d="m5 12 14-7-7 14-2-5-5-2z" />
        </Svg>
      );
    case "mic":
      return (
        <Svg className={className}>
          <rect x="9" y="4" width="6" height="10" rx="3" />
          <path d="M6 11a6 6 0 0 0 12 0M12 17v3" />
        </Svg>
      );
    case "paperclip":
      return (
        <Svg className={className}>
          <path d="m15 8-6.5 6.5a2.5 2.5 0 0 0 3.5 3.5L18 12a4 4 0 0 0-5.5-5.5L6 13" />
        </Svg>
      );
    default:
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="7" />
        </Svg>
      );
  }
}

export function IconButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-white/80 transition hover:bg-white/[0.07] hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SoftButton({
  children,
  className = "",
  variant = "ghost",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "solid" | "soft";
}) {
  const styles =
    variant === "solid"
      ? "bg-white text-ink hover:bg-white/90"
      : variant === "soft"
        ? "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
        : "text-mist hover:bg-white/[0.04] hover:text-white";
  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium transition active:scale-[0.99] ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[24px] border border-white/[0.06] bg-white/[0.025] ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[28px] font-semibold tracking-tight md:text-[32px]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-xl text-[15px] text-mist">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
