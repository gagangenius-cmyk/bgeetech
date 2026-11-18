import { ServiceFrom } from "@/components/currency";
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
            <SpotlightCard className="h-full">
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" aria-hidden />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.summary}</p>
              <p className="mt-5 text-sm font-semibold text-brand">
                <ServiceFrom s={s} />
              </p>
            </SpotlightCard>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
