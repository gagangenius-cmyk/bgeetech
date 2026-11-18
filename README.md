# BGeetech

Website for a web and software services company (websites, apps, CRM, ERP, AI and support), built with Next.js 16 (App Router), Tailwind CSS 4, Motion, TanStack Query and MySQL (Sequelize).

## Features

- Product catalogue (15): websites, web and mobile apps, CRM, ERP, POS and HRMS, e-commerce, AI, automation, bug fixing and maintenance, design, SEO, hosting, security and consulting
- **Free first 30-minute consultation** (no payment); 60-minute deep-dives are paid via Stripe
- Pricing with 6 packages plus a **custom package calculator**; project estimator; animated **AI-style hero slider**
- **Dynamic blog** and **product demos** (CRM, POS, HRMS...) managed from the admin panel
- **Website builder** (`/builder`): business details, 90+ business types, 100 colour themes + custom colours, 8 styles, live Desktop/Tablet/Mobile preview, plans from $10/month (monthly, quarterly, annual)
- **Admin panel** (`/admin`): blog posts, demos, leads, website orders (search, create, edit, delete, CSV export)
- **Currency switcher** (USD / AED / INR) for all prices, with matching Stripe charges (rates in `src/lib/currency.ts`)
- **Stripe Checkout**: website-builder subscriptions and paid consultation bookings, signature-verified webhook
- **Search**: full results page (`/search`) over services, articles, demos, team and website types, plus a Cmd/Ctrl+K palette
- **Team** page with vector avatars (`src/lib/team.ts`)
- **Juju**, the animated site guide: a robot mascot whose eyes follow the cursor, who greets first-time visitors, gives a tip per page, offers shortcuts, and runs a spotlight tour of the current page. Content lives in `src/lib/juju-content.ts` (tips, tours, shortcuts); tour targets are `data-juju="..."` attributes on page sections. Visitors can hide Juju, and it respects reduced-motion settings.
- Illustrated banners for every service, article and demo (`scripts/generate-page-images.mjs`), plus the hero artwork (`scripts/generate-hero-images.mjs`)
- Contact page with a click-to-load Google Map (set the location in `site.address` in `src/lib/site.ts`; add a street address there for an exact pin)
- **App-like on phones and tablets**: installable PWA (manifest, generated icons, offline page), bottom tab bar in the thumb zone, safe-area aware layout (`viewport-fit=cover`), sticky Back/Continue bars in multi-step flows, 16px+ form text (no iOS zoom), 44px touch targets, correct mobile keyboards
- AI chatbot (Claude), WhatsApp button, lead popup

## Setup

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev                  # http://localhost:3000
```

Requires Node 20.9+ and a MySQL or MariaDB database. Tables are created automatically on first start, and starter blog posts and demos are seeded.

### Environment

See [.env.example](.env.example). The essentials:

| Variable | Purpose |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` | MySQL connection |
| `AUTH_SECRET` | 32+ random characters; signs admin session cookies |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Creates the first admin on first start (change the password, then remove these) |
| `ANTHROPIC_API_KEY` | Enables the AI chatbot (otherwise scripted answers) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Builder payments (otherwise orders are saved and a payment link is sent manually) |
| `LEAD_WEBHOOK_URL`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL` | Optional lead and order notifications |

Stripe: add a webhook endpoint at `/api/stripe/webhook` with events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired` and `invoice.paid`. Amounts are calculated on the server in the chosen currency. AED and INR must be enabled on your Stripe account (INR subscriptions have extra Indian e-mandate rules). The INR rate in `src/lib/currency.ts` is a placeholder, so keep it current.

## SEO, AEO and GEO

What is built in:

- **Technical SEO**: self-referencing canonicals, unique titles and descriptions on every page, `robots.txt` (private paths blocked), `sitemap.xml` (pages, services, demos, articles with real last-modified dates), noindex on utility pages, security headers, security.txt, RSS feed at `/feed.xml`, generated Open Graph and Twitter cards for every page, service, article and demo.
- **Structured data (JSON-LD)**: Organization, WebSite (with site search), Service, BlogPosting, SoftwareApplication, Person, ItemList, FAQPage and BreadcrumbList, plus visible breadcrumbs. Helpers live in `src/lib/jsonld.tsx`. Note: Google has retired FAQ rich results, but the visible answers still feed search and AI answers.
- **Answer engines (AEO/GEO)**: answer-first "at a glance" summary on the home page, a full `/faq` page, per-service FAQs, bylines and dates on articles, consistent brand facts everywhere, and four starter articles targeting real buyer questions.
- **AI crawlers**: `robots.txt` always allows search and answer bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot...). Model-training bots (GPTBot, ClaudeBot, Google-Extended...) follow `allowAiTraining` in `src/lib/site.ts`.
- **`/llms.txt` and `/llms-full.txt`**: curated index and full Markdown content, generated from the same data as the site. Honest note: studies so far show no measurable effect of llms.txt on AI citations or Google rankings. It is cheap and harmless, but the real levers are the content and structured data above.
- **IndexNow**: set `INDEXNOW_KEY` and Bing and Yandex are notified whenever you publish a post or demo in the admin. Google ignores IndexNow and uses the sitemap.

Your launch checklist (needs your accounts, so it cannot be automated):

1. Add the site to **Google Search Console** and **Bing Webmaster Tools** (set `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`), then submit `https://bgeetech.com/sitemap.xml`.
2. Add your real social profile URLs to `socials` in `src/lib/site.ts` (LinkedIn, Facebook, Instagram, X, YouTube). They become Organization `sameAs`, which helps search and AI engines recognise the brand.
3. Create a **Google Business Profile** if you serve a local area, and keep the name, email and phone identical everywhere.
4. Set `NEXT_PUBLIC_GA_ID` to enable Google Analytics 4 (loads only after the visitor accepts the cookie notice).
5. Publish new articles regularly from `/admin/posts`, and replace placeholder content (prices, demo links, team bios) with real details. Real reviews, case studies and client names are the strongest trust signals you can add.
6. Test pages with the Rich Results Test and PageSpeed Insights after deploying.

## Scripts

- `npm run dev`, `npm run build`, `npm run lint`
- Builds use `--webpack` so they also work on hosts whose glibc is too old for the native SWC/Turbopack binaries.

## Deploying

`next.config.mjs` uses `output: "standalone"`. Build, then run `node .next/standalone/server.js` (copy `public/` and `.next/static/` next to it). All server dependencies (Sequelize, mysql2, bcryptjs, jose) are pure JavaScript.

## Notes

- Placeholder content to replace before launch: prices, estimator rates, builder plans (`src/lib/builder/config.ts`), legal pages, demo content.
- Admin API routes verify a signed session on every request; `src/proxy.ts` is only a first-line redirect.
- Lead and order PII lives in the database; `data/` (fallback files, uploaded logos) is git-ignored.
