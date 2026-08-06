"use client";

import { FILES } from "../../../components/workspace/data";
import { PageTitle, Panel, SoftButton } from "../../../components/workspace/ui";

export default function FilesPage() {
  return (
    <div>
      <PageTitle
        title="Файлы"
        subtitle="Файловый менеджер с папками, тегами, предпросмотром и drag & drop."
        action={<SoftButton variant="solid">Загрузить</SoftButton>}
      />

      <Panel className="mb-6 flex min-h-[140px] items-center justify-center border-dashed p-8 text-center">
        <div>
          <div className="font-display text-lg font-semibold">Перетащите файлы сюда</div>
          <div className="mt-2 text-[14px] text-mist">
            PDF, Word, Excel, изображения, видео и архивы
          </div>
        </div>
      </Panel>

      <div className="overflow-hidden rounded-[24px] border border-white/[0.06]">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b border-white/[0.06] text-[12px] uppercase tracking-[0.12em] text-mist">
            <tr>
              <th className="px-5 py-4 font-medium">Имя</th>
              <th className="px-5 py-4 font-medium">Тип</th>
              <th className="px-5 py-4 font-medium">Тег</th>
              <th className="px-5 py-4 font-medium">Размер</th>
            </tr>
          </thead>
          <tbody>
            {FILES.map((f) => (
              <tr
                key={f.name}
                className="border-b border-white/[0.04] transition hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4 font-medium">{f.name}</td>
                <td className="px-5 py-4 text-mist">{f.type}</td>
                <td className="px-5 py-4 text-mist">{f.tag}</td>
                <td className="px-5 py-4 text-mist">{f.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
