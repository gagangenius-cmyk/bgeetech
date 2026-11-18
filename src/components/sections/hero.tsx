import { HeroSlider } from "@/components/sections/hero-slider";

export function Hero() {
  return (
    <section data-bgee="hero" className="relative isolate overflow-hidden bg-ink pb-24 pt-28 text-white sm:pt-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h1 className="sr-only">BGeetech: website, app, CRM, ERP and AI development, with your first 30-minute consultation free</h1>
        <HeroSlider />
      </div>
    </section>
  );
}
