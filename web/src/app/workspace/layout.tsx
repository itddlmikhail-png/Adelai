"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "../../components/workspace/Sidebar";
import { Topbar } from "../../components/workspace/Topbar";

export default function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname() || "";
  const fullBleed = pathname.includes("/chats");

  return (
    <div className="workspace-root relative flex h-[100svh] overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_0%,rgba(255,255,255,0.04),transparent_55%)]" />
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main
          className={`relative min-h-0 flex-1 ${
            fullBleed ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {fullBleed ? (
            children
          ) : (
            <div className="animate-fade-in mx-auto w-full max-w-[1280px] px-6 py-8 md:px-10 md:py-10">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
