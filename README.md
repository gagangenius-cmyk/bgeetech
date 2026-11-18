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

## Scripts

- `npm run dev`, `npm run build`, `npm run lint`
- Builds use `--webpack` so they also work on hosts whose glibc is too old for the native SWC/Turbopack binaries.

## Deploying

`next.config.mjs` uses `output: "standalone"`. Build, then run `node .next/standalone/server.js` (copy `public/` and `.next/static/` next to it). All server dependencies (Sequelize, mysql2, bcryptjs, jose) are pure JavaScript.

## Notes

- Placeholder content to replace before launch: prices, estimator rates, builder plans (`src/lib/builder/config.ts`), legal pages, demo content.
- Admin API routes verify a signed session on every request; `src/proxy.ts` is only a first-line redirect.
- Lead and order PII lives in the database; `data/` (fallback files, uploaded logos) is git-ignored.
