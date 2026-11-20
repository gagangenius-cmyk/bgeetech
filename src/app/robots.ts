import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Pages that should never be crawled: private, transactional or utility URLs.
const disallow = ["/admin", "/api/", "/search", "/offline", "/book/success", "/builder/success", "/care/success", "/portal"];

// Search and "answer engine" crawlers: they fetch pages so the site can be cited in AI answers. Always allowed.
const answerBots = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Applebot", "DuckDuckBot", "Bingbot"];

// Crawlers that collect content to train models. Controlled by `site.allowAiTraining` in src/lib/site.ts.
const trainingBots = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "meta-externalagent", "Amazonbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // A named group replaces the "*" group for that bot, so the private paths are repeated here.
      { userAgent: answerBots, allow: "/", disallow },
      site.allowAiTraining ? { userAgent: trainingBots, allow: "/", disallow } : { userAgent: trainingBots, disallow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
