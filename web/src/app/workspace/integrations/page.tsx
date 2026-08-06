import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

const apps = [
  "Google Drive",
  "Dropbox",
  "GitHub",
  "Slack",
  "Discord",
  "Telegram",
  "Notion",
  "Figma",
  "Zapier",
  "Webhooks",
  "API",
];

export default function IntegrationsPage() {
  return (
    <div>
      <PageTitle
        title="Интеграции"
        subtitle="Подключайте сервисы и оставляйте всю работу внутри Adelai Workspace."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((a) => (
          <Panel key={a} className="flex items-center justify-between gap-4 p-5">
            <div className="font-medium">{a}</div>
            <SoftButton variant="soft" className="h-9 px-3 text-[13px]">
              Подключить
            </SoftButton>
          </Panel>
        ))}
      </div>
    </div>
  );
}
