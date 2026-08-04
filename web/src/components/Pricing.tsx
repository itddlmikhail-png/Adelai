const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    features: ["3 Projects", "Limited AI", "Local workspace"],
    cta: "Начать",
    featured: false,
  },
  {
    name: "Pro",
    price: "$20",
    period: "/мес",
    features: [
      "Unlimited Projects",
      "Unlimited AI",
      "AI Memory",
      "Cloud Sync",
      "Voice Mode",
      "Priority Models",
    ],
    cta: "Выбрать Pro",
    featured: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/мес",
    features: [
      "Unlimited Team Members",
      "Shared AI Memory",
      "Workspace Analytics",
      "Admin Panel",
      "Everything in Pro",
    ],
    cta: "Связаться",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/[0.06] bg-ink-soft">
      <div className="mx-auto max-w-content px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
            Простой выбор
          </h2>
          <p className="mt-4 text-[17px] text-mist">
            Начните бесплатно. Раскройте полный AI Operating System с Pro.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[20px] border p-6 md:p-7 ${
                plan.featured
                  ? "border-white/25 bg-white text-ink"
                  : "border-white/[0.06] bg-ink-card text-white"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {plan.name}
                </h3>
                <p className="font-display text-3xl font-bold tracking-tight">
                  {plan.price}
                  {plan.period && (
                    <span
                      className={`text-sm font-medium ${
                        plan.featured ? "text-ink/50" : "text-mist"
                      }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`text-[15px] ${
                      plan.featured ? "text-ink/70" : "text-mist"
                    }`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className={`mt-10 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-ink text-white hover:bg-ink/90"
                    : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
