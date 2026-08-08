export const NAV = [
  { href: "/workspace", label: "Главная", icon: "home" },
  { href: "/workspace/chats", label: "Чаты", icon: "chat" },
  { href: "/workspace/models", label: "AI модели", icon: "models" },
  { href: "/workspace/projects", label: "Проекты", icon: "projects" },
  { href: "/workspace/documents", label: "Документы", icon: "docs" },
  { href: "/workspace/files", label: "Файлы", icon: "files" },
  { href: "/workspace/agents", label: "AI Агенты", icon: "agents" },
  { href: "/workspace/image", label: "Изображения", icon: "image" },
  { href: "/workspace/automations", label: "Автоматизации", icon: "flow" },
  { href: "/workspace/prompts", label: "Промпты", icon: "prompts" },
  { href: "/workspace/team", label: "Команда", icon: "team" },
  { href: "/workspace/integrations", label: "Интеграции", icon: "plug" },
  { href: "/workspace/settings", label: "Настройки", icon: "settings" },
] as const;

export const MODELS = [
  {
    id: "gpt-4.1",
    brand: "ChatGPT",
    name: "GPT-4.1",
    speed: 86,
    quality: 94,
    cost: "$$",
    context: "1M",
    caps: ["Vision", "Code", "Tools"],
  },
  {
    id: "claude-4",
    brand: "Claude",
    name: "Claude 4 Sonnet",
    speed: 82,
    quality: 96,
    cost: "$$",
    context: "200K",
    caps: ["Long context", "Code", "Docs"],
  },
  {
    id: "gemini-2.5",
    brand: "Gemini",
    name: "Gemini 2.5 Pro",
    speed: 88,
    quality: 92,
    cost: "$$",
    context: "1M",
    caps: ["Multimodal", "Search"],
  },
  {
    id: "grok-3",
    brand: "Grok",
    name: "Grok 3",
    speed: 90,
    quality: 88,
    cost: "$",
    context: "128K",
    caps: ["Realtime", "Humor"],
  },
  {
    id: "deepseek-r1",
    brand: "DeepSeek",
    name: "DeepSeek R1",
    speed: 78,
    quality: 91,
    cost: "$",
    context: "128K",
    caps: ["Reasoning", "Code"],
  },
  {
    id: "mistral-large",
    brand: "Mistral",
    name: "Mistral Large",
    speed: 87,
    quality: 89,
    cost: "$",
    context: "128K",
    caps: ["EU", "Fast"],
  },
  {
    id: "perplexity",
    brand: "Perplexity",
    name: "Sonar Pro",
    speed: 84,
    quality: 90,
    cost: "$$",
    context: "127K",
    caps: ["Search", "Citations"],
  },
  {
    id: "llama-4",
    brand: "Llama",
    name: "Llama 4",
    speed: 85,
    quality: 87,
    cost: "$",
    context: "128K",
    caps: ["Open", "Local"],
  },
  {
    id: "qwen-3",
    brand: "Qwen",
    name: "Qwen 3",
    speed: 86,
    quality: 88,
    cost: "$",
    context: "128K",
    caps: ["Multilingual", "Code"],
  },
  {
    id: "openrouter",
    brand: "OpenRouter",
    name: "Auto Router",
    speed: 80,
    quality: 90,
    cost: "var",
    context: "var",
    caps: ["Routing", "Fallback"],
  },
] as const;

export const AGENTS = [
  { name: "Программист", role: "Full-stack engineering", tone: "precise" },
  { name: "UX/UI дизайнер", role: "Product design", tone: "visual" },
  { name: "Маркетолог", role: "Growth & positioning", tone: "sharp" },
  { name: "Юрист", role: "Legal review", tone: "formal" },
  { name: "Финансовый аналитик", role: "Finance & models", tone: "analytical" },
  { name: "Трейдер", role: "Markets & risk", tone: "fast" },
  { name: "Психолог", role: "Coaching & clarity", tone: "calm" },
  { name: "Переводчик", role: "Localization", tone: "neutral" },
  { name: "Копирайтер", role: "Brand writing", tone: "creative" },
] as const;

export type AgentRoleId =
  | "manager"
  | "programmer"
  | "designer"
  | "marketer"
  | "analyst"
  | "copywriter"
  | "devops"
  | "sales"
  | "support"
  | "researcher";

export type AgentRole = {
  id: AgentRoleId;
  title: string;
  subtitle: string;
  blurb: string;
  questions: { id: string; prompt: string; placeholder: string }[];
};

export const AGENT_ROLES: AgentRole[] = [
  {
    id: "manager",
    title: "Менеджер",
    subtitle: "Проекты и команда",
    blurb: "Планирует задачи, держит сроки и синхронизирует людей.",
    questions: [
      {
        id: "focus",
        prompt: "Какими проектами или продуктами агент будет управлять?",
        placeholder: "Например: запуск мобильного приложения Adelai…",
      },
      {
        id: "team",
        prompt: "Кто в команде и какие роли важны?",
        placeholder: "Дизайн, разработка, маркетинг…",
      },
      {
        id: "style",
        prompt: "Какой стиль управления предпочтительнее?",
        placeholder: "Коротко и по делу / мягко и поддерживающе…",
      },
    ],
  },
  {
    id: "programmer",
    title: "Программист",
    subtitle: "Код и архитектура",
    blurb: "Пишет код, ревьюит решения и помогает с техническими задачами.",
    questions: [
      {
        id: "stack",
        prompt: "Какой стек и языки использует команда?",
        placeholder: "Next.js, TypeScript, Swift…",
      },
      {
        id: "repo",
        prompt: "Что важно знать о кодовой базе?",
        placeholder: "Монорепо, App Router, static export…",
      },
      {
        id: "rules",
        prompt: "Какие правила кода обязательны?",
        placeholder: "Без лишних зависимостей, понятные имена…",
      },
    ],
  },
  {
    id: "designer",
    title: "Дизайнер",
    subtitle: "UX / UI",
    blurb: "Думает интерфейсами, визуальной ясностью и пользовательским путём.",
    questions: [
      {
        id: "brand",
        prompt: "Какой визуальный язык у продукта?",
        placeholder: "Тёмный минимализм, крупная типографика…",
      },
      {
        id: "users",
        prompt: "Для кого делаем интерфейс?",
        placeholder: "Основатели, команды, мобильные пользователи…",
      },
      {
        id: "deliverables",
        prompt: "Что агент должен чаще всего выдавать?",
        placeholder: "Макеты экранов, UX-копирайт, дизайн-критика…",
      },
    ],
  },
  {
    id: "marketer",
    title: "Маркетолог",
    subtitle: "Рост и позиционирование",
    blurb: "Формулирует офферы, каналы и тексты, которые приводят пользователей.",
    questions: [
      {
        id: "audience",
        prompt: "Кто ваша целевая аудитория?",
        placeholder: "Стартапы, создатели AI-продуктов…",
      },
      {
        id: "offer",
        prompt: "Какой главный оффер нужно доносить?",
        placeholder: "AI Operating System для проектов…",
      },
      {
        id: "channels",
        prompt: "Где планируете расти?",
        placeholder: "Landing, Product Hunt, Telegram, SEO…",
      },
    ],
  },
  {
    id: "analyst",
    title: "Аналитик",
    subtitle: "Данные и выводы",
    blurb: "Собирает метрики, находит инсайты и предлагает решения на фактах.",
    questions: [
      {
        id: "metrics",
        prompt: "Какие метрики важнее всего?",
        placeholder: "Retention, conversion, AI usage…",
      },
      {
        id: "sources",
        prompt: "Откуда брать данные?",
        placeholder: "CSV, Notion, внутренняя аналитика…",
      },
      {
        id: "output",
        prompt: "В каком виде нужны выводы?",
        placeholder: "Краткий summary + таблица + next steps…",
      },
    ],
  },
  {
    id: "copywriter",
    title: "Копирайтер",
    subtitle: "Тексты и голос бренда",
    blurb: "Пишет ясно, в тоне продукта — от лендинга до писем.",
    questions: [
      {
        id: "voice",
        prompt: "Какой тон голоса бренда?",
        placeholder: "Спокойный, уверенный, без хайпа…",
      },
      {
        id: "formats",
        prompt: "Какие форматы нужны чаще?",
        placeholder: "Hero-тексты, email, onboarding…",
      },
      {
        id: "forbidden",
        prompt: "Чего избегать в текстах?",
        placeholder: "Клише, агрессивные CTA, канцелярит…",
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    subtitle: "Инфра и релизы",
    blurb: "Настраивает деплой, мониторинг и стабильные пайплайны.",
    questions: [
      {
        id: "infra",
        prompt: "Где сейчас живёт продукт?",
        placeholder: "GitHub Pages, Vercel, свой VPS…",
      },
      {
        id: "ci",
        prompt: "Какой процесс релиза нужен?",
        placeholder: "PR → build → preview → prod…",
      },
      {
        id: "risks",
        prompt: "Какие риски важнее закрыть первыми?",
        placeholder: "Падения деплоя, секреты, откаты…",
      },
    ],
  },
  {
    id: "sales",
    title: "Продажник",
    subtitle: "Сделки и питчи",
    blurb: "Помогает упаковать предложение и вести клиента к решению.",
    questions: [
      {
        id: "product",
        prompt: "Что именно продаём?",
        placeholder: "Adelai Pro для команд…",
      },
      {
        id: "objections",
        prompt: "Какие возражения слышите чаще?",
        placeholder: "Дорого, уже есть ChatGPT…",
      },
      {
        id: "goal",
        prompt: "Какая цель продаж на ближайший месяц?",
        placeholder: "10 демо / 3 платящих клиента…",
      },
    ],
  },
  {
    id: "support",
    title: "Саппорт",
    subtitle: "Помощь пользователям",
    blurb: "Отвечает спокойно, решает проблемы и собирает обратную связь.",
    questions: [
      {
        id: "product_area",
        prompt: "По каким разделам чаще пишут?",
        placeholder: "Вход, Workspace, биллинг…",
      },
      {
        id: "tone",
        prompt: "Какой тон ответов нужен?",
        placeholder: "Дружелюбный, короткий, с шагами…",
      },
      {
        id: "escalation",
        prompt: "Когда эскалировать человеку?",
        placeholder: "Баги оплаты, потеря данных…",
      },
    ],
  },
  {
    id: "researcher",
    title: "Исследователь",
    subtitle: "Рынок и инсайты",
    blurb: "Изучает конкурентов, тренды и помогает принимать решения.",
    questions: [
      {
        id: "topic",
        prompt: "Что исследовать в первую очередь?",
        placeholder: "AI workspace конкуренты, pricing…",
      },
      {
        id: "depth",
        prompt: "Насколько глубокий анализ нужен?",
        placeholder: "Быстрый обзор / подробный отчёт…",
      },
      {
        id: "sources_pref",
        prompt: "Каким источникам доверяете больше?",
        placeholder: "Официальные сайты, отчёты, отзывы…",
      },
    ],
  },
];

export const CHATS = [
  { title: "Архитектура Adelai Workspace", time: "2 мин", pinned: true, folder: "Product" },
  { title: "Рефакторинг NightPlanet", time: "24 мин", pinned: true, folder: "Code" },
  { title: "Тарифы Pro / Business", time: "1 ч", pinned: false, folder: "Business" },
  { title: "Системный промпт агента Designer", time: "Вчера", pinned: false, folder: "Agents" },
  { title: "Перевод лендинга на EN", time: "Вчера", pinned: false, folder: "Content" },
] as const;

export const PROJECTS = [
  { name: "Adelai OS", status: "Active", chats: 18, files: 42, favorite: true },
  { name: "Brand System", status: "Active", chats: 7, files: 15, favorite: true },
  { name: "Mobile Launch", status: "Paused", chats: 11, files: 28, favorite: false },
  { name: "Research Lab", status: "Active", chats: 23, files: 61, favorite: true },
] as const;

export const DOCS = [
  { title: "Product Vision", updated: "Сегодня", kind: "Doc" },
  { title: "Pricing Notes", updated: "Вчера", kind: "Doc" },
  { title: "Onboarding Flow", updated: "2 дня", kind: "Doc" },
] as const;

export const FILES = [
  { name: "earth-day.jpg", size: "1.3 MB", type: "Image", tag: "Design" },
  { name: "adelai-brief.pdf", size: "820 KB", type: "PDF", tag: "Product" },
  { name: "metrics.xlsx", size: "240 KB", type: "Excel", tag: "Finance" },
  { name: "pitch.docx", size: "410 KB", type: "Word", tag: "Business" },
] as const;
