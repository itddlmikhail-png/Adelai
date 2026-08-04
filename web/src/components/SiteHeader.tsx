export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-6 md:px-8">
        <a
          href="#top"
          className="pointer-events-auto font-display text-[17px] font-semibold tracking-tight text-white"
        >
          Adelai
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#product" className="text-sm text-mist transition hover:text-white">
            Продукт
          </a>
          <a href="#memory" className="text-sm text-mist transition hover:text-white">
            Память
          </a>
          <a href="#pricing" className="text-sm text-mist transition hover:text-white">
            Тарифы
          </a>
        </nav>
        <a
          href="#waitlist"
          className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-white/90"
        >
          Early Access
        </a>
      </div>
    </header>
  );
}
