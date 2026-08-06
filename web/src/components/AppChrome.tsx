"use client";

import { usePathname } from "next/navigation";
import { InteractiveStars } from "./InteractiveStars";
import { PageTransition } from "./PageTransition";
import { SiteHeader } from "./SiteHeader";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isWorkspace = pathname.includes("/workspace");

  if (isWorkspace) {
    return <>{children}</>;
  }

  return (
    <>
      <InteractiveStars />
      <SiteHeader />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
