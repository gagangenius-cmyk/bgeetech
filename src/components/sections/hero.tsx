import { HeroSlider } from "@/components/sections/hero-slider";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-24 pt-28 text-white sm:pt-36">
      {/* shared animated aurora + grid background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 size-[44rem] animate-aurora rounded-full bg-blue-600/40 blur-[120px]" />
        <div className="absolute -right-32 top-20 size-[38rem] animate-aurora rounded-full bg-amber-400/30 blur-[120px] [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 size-[30rem] animate-aurora rounded-full bg-blue-700/30 blur-[120px] [animation-delay:-12s]" />
        <div className="grid-lines absolute inset-0" />
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <HeroSlider />
      </div>
    </section>
  );
}
