import { Hero } from "../components/Hero";
import { Pillars } from "../components/Pillars";
import { Pricing } from "../components/Pricing";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { Waitlist } from "../components/Waitlist";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Pillars />
      <Pricing />
      <Waitlist />
      <SiteFooter />
    </main>
  );
}
