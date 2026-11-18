import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}: ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#050d24",
    theme_color: "#1a3aa8",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Long-press the installed app icon for quick actions.
    shortcuts: [
      { name: "Free consultation", short_name: "Book call", url: "/book" },
      { name: "Website builder", short_name: "Builder", url: "/builder" },
      { name: "Pricing & packages", short_name: "Pricing", url: "/pricing" },
    ],
  };
}
