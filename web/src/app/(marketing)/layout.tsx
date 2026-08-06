import { InteractiveStars } from "../../components/InteractiveStars";
import { PageTransition } from "../../components/PageTransition";
import { SiteHeader } from "../../components/SiteHeader";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <InteractiveStars />
      <SiteHeader />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
