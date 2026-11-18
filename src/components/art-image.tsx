import type { Art } from "@/lib/art";
import { cn } from "@/lib/utils";

/** Responsive illustrated banner (plain img + srcset: sharp on retina, light on phones, no image optimiser needed). */
export function ArtImage({ art, className, priority = false, sizes = "(min-width: 1024px) 33vw, 100vw" }: { art: Art; className?: string; priority?: boolean; sizes?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={art.src}
      srcSet={art.srcSet}
      sizes={sizes}
      alt=""
      width={1600}
      height={900}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("size-full object-cover", className)}
    />
  );
}
