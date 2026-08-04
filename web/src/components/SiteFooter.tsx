export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">Adelai</p>
          <p className="mt-1 text-sm text-mist">AI Operating System</p>
        </div>
        <div className="flex gap-6 text-sm text-mist">
          <a href="#product" className="hover:text-white">
            Product
          </a>
          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
          <a href="#waitlist" className="hover:text-white">
            Waitlist
          </a>
        </div>
        <p className="text-sm text-mist">© {new Date().getFullYear()} Adelai</p>
      </div>
    </footer>
  );
}
