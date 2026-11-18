import { ArtImage } from "@/components/art-image";
import { ServiceFrom } from "@/components/currency";
import { serviceArt } from "@/lib/art";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ServiceIcon } from "@/components/service-icon";
import { services } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  body,
  center,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{body}</p>}
    </Reveal>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => (
        <StaggerItem key={s.slug}>
          <Link href={`/services/${s.slug}`} className="block h-full">
            <SpotlightCard className="h-full p-0">
              <div className="relative aspect-[16/9] overflow-hidden">
                <ArtImage art={serviceArt(s.slug)} className="transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-5 grid size-11 place-items-center rounded-xl bg-white/90 text-brand shadow-lg backdrop-blur transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <ServiceIcon name={s.icon} className="size-5" />
                </span>
                <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-300 group-hover:bg-white group-hover:text-brand">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.summary}</p>
                <p className="mt-5 text-sm font-semibold text-brand">
                  <ServiceFrom s={s} />
                </p>
              </div>
            </SpotlightCard>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
