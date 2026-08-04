import { Hero } from "../components/Hero";
import { SiteHeader } from "../components/SiteHeader";

export default function HomePage() {
  return (
    <main id="top" className="h-[100svh] overflow-hidden">
      <SiteHeader />
      <Hero />
    </main>
  );
}
