// A second batch of starter articles (answer-first, practical, no invented statistics). They are added once per
// database and can be edited, unpublished or deleted from /admin/posts.
type Seed = { slug: string; title: string; excerpt: string; category: string; date: string; body: string };

export const seedPostsV3: Seed[] = [
  {
    slug: "mobile-app-vs-website-which-do-you-need",
    title: "Mobile app or website: which does your business need first?",
    excerpt: "Most businesses should start with a fast website. Here is when an app is actually worth building.",
    category: "Mobile apps",
    date: "2026-10-02",
    body: `Start with a website unless your product depends on the phone itself. A website is found through search, works on every device and costs less to build and maintain. Build an app when people will use it often, need notifications, or need the camera, GPS or offline access.

## When a website is enough
- You want to be found on Google and explain your services.
- Customers visit occasionally, for example to book or to enquire.
- You want to launch quickly and keep costs low.

## When an app makes sense
- Customers return daily or weekly (delivery, fitness, loyalty).
- You need push notifications, offline use or device features.
- Your staff need a tool in the field.

## A smart middle path
A fast, mobile-friendly website that can be installed on the home screen (a PWA) gives many of the benefits of an app for a fraction of the cost. You can build a full native app later, once you know what customers actually use.

Not sure? A free 30-minute consultation will help you decide before you spend anything.`,
  },
  {
    slug: "what-is-a-progressive-web-app",
    title: "What is a progressive web app (PWA) and should you build one?",
    excerpt: "A PWA is a website that installs like an app. Here is what it can and cannot do.",
    category: "Mobile apps",
    date: "2026-10-04",
    body: `A progressive web app is a website that can be added to a phone's home screen and opens full screen like an app. It loads quickly, can work with a poor connection and avoids app store fees and review delays. It is a good first step when you want an app-like experience without building two separate native apps.

## What a PWA can do
- Install to the home screen with its own icon.
- Open full screen with no browser bar.
- Cache pages so they load fast and show an offline message.
- Work on Android, iOS and desktop from one codebase.

## What it cannot do as well
- Some deep hardware features are limited, especially on iPhone.
- It does not appear in app stores unless you wrap it.
- Push notification support varies by device and browser.

## When to choose one
Choose a PWA for content sites, booking tools, dashboards and internal tools. Choose native when you need heavy graphics, advanced sensors or the best possible performance.

We build PWAs and native apps. Book a free consultation to see which fits your idea.`,
  },
  {
    slug: "how-long-does-it-take-to-build-a-website",
    title: "How long does it take to build a website?",
    excerpt: "Realistic timelines for a simple site, a business site and a custom web application.",
    category: "Websites",
    date: "2026-10-06",
    body: `A simple website takes about one to two weeks, a typical business site two to six weeks, and a custom web application anywhere from two to six months. The biggest delays are almost never the coding. They are late content, slow feedback and changing the scope halfway through.

## Typical timelines
- **Single page or small brochure site:** 1 to 2 weeks.
- **Business website (5 to 15 pages):** 2 to 6 weeks.
- **Online store:** 4 to 10 weeks depending on products and payments.
- **Custom web app, CRM or ERP:** 2 to 6 months or more, usually delivered in stages.

## What speeds a project up
1. Send your logo, text and photos at the start.
2. Name one person who approves decisions.
3. Agree the scope and pages in writing.
4. Review each stage within a few days.

## What slows it down
Waiting for content, adding "just one more" feature, and too many people giving conflicting feedback.

Tell us your deadline in a free consultation and we will say honestly whether it is realistic.`,
  },
  {
    slug: "website-checklist-before-you-launch",
    title: "The website launch checklist: 15 things to check before you go live",
    excerpt: "A practical pre-launch checklist so nothing embarrassing reaches your customers.",
    category: "Websites",
    date: "2026-10-08",
    body: `Before launch, check that every page works on a phone, every form delivers to the right inbox, the site loads over HTTPS, and Google is allowed to index it. These few checks prevent most launch-day problems.

## Content and design
1. Proofread every page and remove placeholder text.
2. Check images are sharp, compressed and have descriptions (alt text).
3. Test on a phone, a tablet and a laptop.

## Function
4. Submit every form and confirm the email arrives.
5. Click every link and button.
6. Test checkout and payments in test mode, if you sell online.
7. Check your phone number and WhatsApp links open correctly.

## Search and sharing
8. Each page has a unique title and description.
9. The sitemap exists and robots settings allow indexing.
10. A custom 404 page exists.
11. Social sharing previews look right.

## Safety and speed
12. HTTPS works and http redirects to https.
13. Backups are scheduled.
14. Analytics is installed, with a cookie notice if required.
15. Privacy policy and terms pages are published.

We run this checklist on every project. Need a second pair of eyes before you launch? Ask for a quick review.`,
  },
  {
    slug: "why-is-my-website-slow-and-how-to-fix-it",
    title: "Why is my website slow? Common causes and fixes",
    excerpt: "Large images, heavy plugins and cheap hosting are the usual suspects. Here is how to find and fix them.",
    category: "Support",
    date: "2026-10-10",
    body: `Most slow websites are slow for three reasons: oversized images, too many scripts or plugins, and weak hosting. Fix those and most sites become noticeably faster. Speed matters because visitors leave slow pages, and search engines favour fast ones.

## How to check
Run your page through Google PageSpeed Insights. It lists what is slow and why, in plain language.

## The usual causes
- **Huge images.** Resize them and use modern formats such as WebP.
- **Too many plugins or scripts.** Remove what you do not use. Each one adds weight.
- **Cheap or overloaded hosting.** Move to better hosting or add a CDN.
- **No caching.** Cache pages so they are not rebuilt for every visitor.
- **Heavy fonts and animations.** Use fewer font files and lighter effects.

## What to fix first
Images first (the quickest win), then unused scripts, then hosting.

If you are not comfortable making these changes, our bug fixing and maintenance service can audit and speed up your site.`,
  },
  {
    slug: "wordpress-vs-custom-website-which-is-better",
    title: "WordPress vs a custom-built website: which is better for you?",
    excerpt: "Both work well. The right choice depends on your budget, features and who will manage it.",
    category: "Websites",
    date: "2026-10-12",
    body: `Choose WordPress when you want a content-led site quickly and cheaply, and a custom build when your site needs unique features, strict performance or complex workflows. Neither is better in general. They fit different needs.

## WordPress is a good fit when
- You need a blog, brochure site or simple store.
- You want to edit content yourself.
- Your budget and timeline are tight.

## A custom build is a good fit when
- You need accounts, dashboards, bookings or special logic.
- Speed, security and control matter more than convenience.
- You do not want to depend on many third-party plugins.

## Things people forget
WordPress needs regular updates and security care. A custom site costs more at the start but can be simpler to maintain, because there are fewer moving parts.

We build both. Tell us what you need and we will recommend the simpler, cheaper option that does the job.`,
  },
  {
    slug: "how-to-choose-a-web-development-company",
    title: "How to choose a web development company without regrets",
    excerpt: "Ten questions to ask before you hire a team to build your website or software.",
    category: "Guides",
    date: "2026-10-14",
    body: `Choose a company that shows real work, explains the price clearly, names who will do the work, and agrees ownership and support in writing. Cheap quotes that are vague usually cost more later.

## Ten questions to ask
1. Can I see similar projects and talk to a past client?
2. What exactly is included in the price?
3. Who will work on my project, and who is my contact?
4. How long will it take, and what do you need from me?
5. Who owns the code, design and content when we finish?
6. How do you handle changes after the scope is agreed?
7. What happens after launch? Is there support?
8. Where is it hosted, and who controls the domain?
9. How do you test and secure the work?
10. How do we communicate, and how often?

## Warning signs
No written scope, pressure to pay everything upfront, refusing to share ownership, and promises that sound too good.

Our approach is simple: a free call, a fixed-scope proposal, then build, launch and support. Book your free 30 minutes to see if we are a fit.`,
  },
  {
    slug: "seo-basics-for-small-businesses",
    title: "SEO basics for small businesses: where to start",
    excerpt: "Five practical steps that help customers find you on Google without a big budget.",
    category: "SEO",
    date: "2026-10-16",
    body: `Good SEO for a small business means a fast, mobile-friendly site, clear pages for each service, a complete Google Business Profile, and helpful content that answers real customer questions. You do not need tricks. You need to be clear, useful and consistent.

## Five steps to start
1. **One page per service.** Describe each service, who it is for and where you work.
2. **Clear titles and descriptions.** Each page gets a unique title with the main keyword.
3. **Speed and mobile.** Most searches happen on phones.
4. **Google Business Profile.** Keep your name, address and phone identical everywhere.
5. **Helpful content.** Write short guides that answer the questions customers ask you.

## What to avoid
Buying links, copying text from other sites, and stuffing keywords. These can hurt more than help.

## Be patient
SEO usually takes months to show results. Track enquiries, not just rankings.

Our SEO service sets up the technical basics and a content plan. Ask for a free review of your current site.`,
  },
  {
    slug: "what-is-technical-seo",
    title: "What is technical SEO? A plain-English guide",
    excerpt: "Technical SEO makes sure search engines can find, read and trust your website.",
    category: "SEO",
    date: "2026-10-18",
    body: `Technical SEO is the behind-the-scenes work that lets search engines crawl, understand and index your website. If the technical side is broken, great content may never appear in search results.

## The essentials
- **Crawlability:** a clean sitemap and a robots file that does not block important pages.
- **Speed:** fast loading on mobile.
- **Mobile friendliness:** pages that work well on small screens.
- **HTTPS:** a secure connection on every page.
- **Structured data:** code that tells search engines what a page is about (business, services, FAQs, articles).
- **Clean URLs and redirects:** no broken links or redirect chains.
- **Canonical tags:** so duplicate pages do not compete with each other.

## How to check
Google Search Console shows indexing problems, mobile issues and speed. It is free.

## Why it matters for AI search
Clear structure and structured data also help AI assistants understand and cite your pages.

We build these basics into every website. Want an audit of your existing site? Just ask.`,
  },
  {
    slug: "how-to-get-found-in-ai-search",
    title: "How to get your business found in AI search (ChatGPT, Gemini, Perplexity)",
    excerpt: "AI assistants answer questions directly. Here is how to make your site easy for them to understand and cite.",
    category: "SEO",
    date: "2026-10-20",
    body: `To appear in AI answers, make your site clear, factual and well structured: answer questions directly, state who you are and what you do consistently, and mark up your pages with structured data. There is no secret trick, and nobody can guarantee a citation.

## What helps
- **Answer-first writing.** Put the direct answer in the first sentences, then explain.
- **Consistent facts.** Use the same business name, services, location and contact details everywhere.
- **Structured data.** Organisation, service, FAQ and article markup help machines read your pages.
- **Real expertise.** Name authors, show dates and share original, specific advice.
- **Open access.** Allow search and answer crawlers in your robots file.

## What we know and do not know
An llms.txt file is cheap and harmless, but so far there is no strong evidence it changes how often you are cited. Quality content and clear structure matter far more.

## Start with questions
List the 20 questions customers ask before buying, and answer each on a page. That helps search engines and AI assistants alike.

We set this up as part of our SEO service.`,
  },
  {
    slug: "how-to-write-website-content-that-converts",
    title: "How to write website content that turns visitors into enquiries",
    excerpt: "Clear headlines, simple language and one obvious next step. Here is how to write copy that works.",
    category: "Websites",
    date: "2026-10-22",
    body: `Website copy converts when it says clearly what you do, who it is for and what to do next. Use short sentences, speak about the customer's problem first, and give each page one clear action.

## A simple structure for every page
1. **Headline:** the outcome the customer gets.
2. **Short explanation:** what you do, in plain words.
3. **Proof:** reviews, examples, numbers you can verify.
4. **Next step:** one button, such as "Book a free call".

## Writing tips
- Write "you" more than "we".
- Replace jargon with everyday words.
- Use headings and short paragraphs so people can scan.
- Answer the questions people hesitate about: price, time, risk.

## Common mistakes
Vague headlines like "Welcome to our website", long paragraphs, and five competing buttons.

Our content writers can write or polish your pages as part of a website project.`,
  },
  {
    slug: "ecommerce-platform-comparison-shopify-woocommerce-custom",
    title: "Shopify, WooCommerce or custom: how to choose an online store platform",
    excerpt: "A simple way to pick the right e-commerce platform for your products and budget.",
    category: "E-commerce",
    date: "2026-10-24",
    body: `Pick Shopify for speed and simplicity, WooCommerce for flexibility inside WordPress, and a custom store when you have unusual products, pricing or integrations. The best platform is the one you can run comfortably, not the one with the most features.

## Shopify
Quick to launch, secure and well supported. You pay a monthly fee plus transaction costs, and customisation is limited by the platform.

## WooCommerce
Free to start and very flexible, but you manage hosting, updates and security.

## Custom store
Best for complex catalogues, subscriptions, marketplaces or deep system integration. Higher cost and longer build, but full control.

## Questions to decide
- How many products will you sell?
- Do you need special pricing, bundles or subscriptions?
- Which payment methods do your customers use?
- Who will manage the store day to day?

We build on all three. A free consultation will help you choose before you commit.`,
  },
  {
    slug: "how-to-set-up-online-payments-for-your-business",
    title: "How to accept online payments on your website",
    excerpt: "Cards, wallets and local methods: what you need to start taking payments safely.",
    category: "E-commerce",
    date: "2026-10-26",
    body: `To accept payments online you need a payment provider such as Stripe, a secure website, and clear terms for refunds and delivery. Use the provider's hosted checkout so card details never touch your own server.

## The steps
1. **Open a merchant account** with a provider that supports your country and currencies.
2. **Verify your business.** You will provide identity and bank details to the provider.
3. **Add checkout to your site.** A hosted checkout page is the simplest and safest.
4. **Test in test mode** with the provider's test cards before going live.
5. **Publish policies:** refunds, delivery, privacy and terms.

## Tips
- Show prices in the customer's currency where you can.
- Offer popular local methods as well as cards.
- Send an email receipt after every payment.
- Use webhooks so orders update automatically.

## Safety
Never store card numbers yourself. Let the provider handle them.

We integrate Stripe and other gateways, including subscriptions and multi-currency pricing.`,
  },
  {
    slug: "what-is-an-api-and-why-your-business-uses-them",
    title: "What is an API? A non-technical explanation for business owners",
    excerpt: "APIs let your software talk to other software. Here is why that saves you time and money.",
    category: "Engineering",
    date: "2026-10-28",
    body: `An API (application programming interface) is a set of rules that lets one piece of software talk to another. When your website shows a map, takes a card payment or sends a WhatsApp message, it is using an API. Think of it as a waiter between your kitchen and your customers: it carries requests and answers back and forth.

## Everyday examples
- Your online store sends an order to your accounting software.
- A booking form creates an event in your calendar.
- A chatbot looks up an order status in your database.

## Why it matters to you
APIs remove double data entry, reduce mistakes and let you connect tools you already use instead of replacing them.

## What to ask a developer
- Which systems will connect, and how?
- What happens if one of them is down?
- Who pays for any per-use API charges?

Our automation and integration service connects your website, CRM, WhatsApp and accounting tools.`,
  },
  {
    slug: "how-to-choose-a-crm-for-a-small-business",
    title: "How to choose a CRM for a small business",
    excerpt: "Features to look for, mistakes to avoid and when a custom CRM beats an off-the-shelf one.",
    category: "Business software",
    date: "2026-10-30",
    body: `Choose a CRM that your team will actually use. Start with your sales process, list the handful of features you need (contacts, pipeline, reminders, reports), and pick the simplest tool that covers them. A CRM nobody updates is worse than a spreadsheet.

## Features worth having
- Contact and company records with notes.
- A visual sales pipeline.
- Follow-up reminders and tasks.
- Email and WhatsApp integration.
- Simple reports for the owner.

## Off-the-shelf or custom?
Off-the-shelf tools are cheaper to start and fine for standard sales. Custom is worth it when you have an unusual process, such as real estate, immigration or education cases, or need it tied to your own systems.

## Rollout tips
Import clean data, train the team in one short session, and review after a month.

See our CRM demos in the Demos section, or book a free call to discuss a custom build.`,
  },
  {
    slug: "pos-system-for-retail-and-restaurants",
    title: "Choosing a POS system for a shop or restaurant",
    excerpt: "What a modern point-of-sale system should do, and how to avoid paying for features you will not use.",
    category: "Business software",
    date: "2026-11-01",
    body: `A good point-of-sale system records sales quickly, tracks stock, works when the internet drops and gives you simple daily reports. Pick one that fits how your counter or kitchen actually works.

## Must-haves
- Fast billing with barcode or touch entry.
- Stock tracking with low-stock alerts.
- Multiple payment methods and tax handling.
- Daily and monthly sales reports.
- Offline mode that syncs later.

## Nice-to-haves
Loyalty points, table management, online ordering, and multi-branch reporting.

## Questions before you buy
- Does it run on the devices you already own?
- What are the monthly fees and card fees?
- Can you export your data if you leave?
- Is support available in your time zone?

We build custom POS and HRMS tools and also integrate existing ones. Try the POS demo to see how it works.`,
  },
  {
    slug: "what-hrms-software-does",
    title: "What does HRMS software do, and does your business need it?",
    excerpt: "Attendance, leave, payroll and records in one place. Here is when it is worth it.",
    category: "Business software",
    date: "2026-11-03",
    body: `HRMS (human resource management system) software keeps staff records, attendance, leave and payroll in one place. If you manage more than a handful of employees with spreadsheets and messages, an HRMS saves time and reduces errors.

## Core features
- Employee profiles and documents.
- Attendance and shift tracking.
- Leave requests and approvals.
- Payroll calculation and payslips.
- Reports for the owner.

## Signs you need one
Payroll takes days each month, leave balances are disputed, or documents are scattered across email and phones.

## Local rules
Payroll and labour rules differ by country, so check that the system supports yours, such as UAE wage protection or Indian PF and ESI.

Try our HRMS demo, or ask us about a custom build for your rules.`,
  },
  {
    slug: "when-should-a-business-move-to-erp",
    title: "When should a growing business move to an ERP?",
    excerpt: "Signs your spreadsheets are holding you back, and how to start without a huge project.",
    category: "Business software",
    date: "2026-11-05",
    body: `Move to an ERP when the same data is typed into several places, month-end takes days, stock is often wrong, or you cannot see the real numbers without asking three people. An ERP connects sales, stock, purchasing and accounts so everyone works from one truth.

## Warning signs
- Spreadsheets multiply and disagree.
- Stock counts do not match the shelf.
- Invoices and orders are re-entered by hand.
- Reports take a week to prepare.

## How to start small
You do not need everything on day one. Begin with the area that hurts most, usually inventory or invoicing, then add modules.

## Avoid these mistakes
Buying features you will not use, skipping staff training, and not cleaning data before importing.

Book a free consultation and we will map your process and recommend a phased plan.`,
  },
  {
    slug: "how-to-protect-your-website-from-hackers",
    title: "How to protect your website from hackers: 10 practical steps",
    excerpt: "Most attacks exploit simple weaknesses. These steps close the common ones.",
    category: "Security",
    date: "2026-11-06",
    body: `Most website hacks use simple weaknesses: outdated software, weak passwords and missing backups. Fixing those basics blocks the majority of attacks. No site is perfectly safe, but a few habits make you a hard target.

## Ten steps
1. Keep your CMS, plugins and servers updated.
2. Use strong, unique passwords and a password manager.
3. Turn on two-factor authentication for admin accounts.
4. Use HTTPS everywhere.
5. Limit admin access to people who need it.
6. Take automatic backups and test restoring them.
7. Add a web application firewall or rate limiting.
8. Validate and sanitise all form input.
9. Remove unused plugins, themes and old accounts.
10. Monitor for unusual activity and alerts.

## If you are hacked
Take the site offline, change all passwords, restore from a clean backup and find how they got in.

Our security audit and maintenance plans handle this for you.`,
  },
  {
    slug: "website-backups-explained",
    title: "Website backups explained: how often, where and how to restore",
    excerpt: "A backup you have never tested is just a hope. Here is how to do it properly.",
    category: "Security",
    date: "2026-11-07",
    body: `Back up your website automatically, keep copies in a different place from your hosting, and test a restore at least twice a year. A backup that has never been restored might not work when you need it.

## How often
- **Busy stores and sites with orders:** daily or more often.
- **Brochure sites:** weekly is usually enough.
- **Before any update or change:** always.

## What to back up
The database, uploaded files and configuration. Code that lives in a repository is also safe there.

## The 3-2-1 idea
Keep three copies, on two kinds of storage, with one stored off site.

## Test it
Restore to a test copy and check pages, forms and logins. Write down the steps so anyone can do it under pressure.

Our care plans include automatic backups and restore testing.`,
  },
  {
    slug: "cloud-hosting-vs-shared-hosting",
    title: "Cloud hosting vs shared hosting: what is the difference?",
    excerpt: "Shared hosting is cheap, cloud hosting is flexible. Here is how to pick.",
    category: "Cloud",
    date: "2026-11-08",
    body: `Shared hosting puts many websites on one server and costs little, which is fine for small brochure sites. Cloud hosting uses flexible resources that scale up when traffic grows and is better for stores, apps and busy sites.

## Shared hosting
- Low monthly cost and easy setup.
- Performance can suffer when neighbours use many resources.
- Limited control and scaling.

## Cloud hosting
- Resources scale with traffic.
- Better speed and reliability.
- More control, with a bit more setup or management.

## How to choose
Small, steady site: shared is fine. Online store, web app, or traffic spikes from campaigns: choose cloud. Always check backups, support hours and where the servers are located.

Our hosting and DevOps service sets up, secures and monitors your environment so you do not have to.`,
  },
  {
    slug: "what-is-devops-for-small-teams",
    title: "What is DevOps, and does a small team need it?",
    excerpt: "DevOps means shipping changes safely and often. Even small teams benefit from the basics.",
    category: "Cloud",
    date: "2026-11-09",
    body: `DevOps is a way of building and running software so changes ship quickly and safely. For a small team it comes down to a few habits: use version control, test automatically, deploy with one command and monitor what is live.

## The basics worth having
- **Version control** so every change is recorded and reversible.
- **Automatic tests** that catch mistakes before customers do.
- **Continuous deployment** so releasing is routine, not scary.
- **Monitoring and alerts** so you hear about problems first.
- **Backups and rollback** so a bad release can be undone quickly.

## What you can skip at first
Complex clusters and tooling you do not need yet. Start simple and grow.

We set up these foundations as part of our hosting and DevOps service.`,
  },
  {
    slug: "ui-ux-design-mistakes-that-cost-you-customers",
    title: "Seven UI and UX mistakes that cost you customers",
    excerpt: "Small design problems quietly lose enquiries. Here is what to look for and fix.",
    category: "Design",
    date: "2026-11-10",
    body: `Most lost enquiries come from simple design problems: unclear buttons, slow pages, hard-to-read text and forms that ask for too much. Fixing them is usually cheaper than buying more traffic.

## Seven common mistakes
1. **No clear next step.** Give each page one obvious action.
2. **Tiny, low-contrast text.** Use readable sizes and strong contrast.
3. **Menus with too many items.** Keep navigation short.
4. **Long forms.** Ask only what you need to reply.
5. **Poor mobile layout.** Test with your thumb, not a mouse.
6. **Slow or jumping pages.** Optimise images and reserve space for content.
7. **Hidden contact details.** Show phone, email or WhatsApp where people expect them.

## How to find problems
Watch five real people try to complete a task on your site. You will spot issues within minutes.

Our UI/UX design service includes a review and a prioritised fix list.`,
  },
  {
    slug: "why-mobile-first-design-matters",
    title: "Why mobile-first design matters more than ever",
    excerpt: "Most visitors arrive on a phone. Designing for small screens first makes every version better.",
    category: "Design",
    date: "2026-11-11",
    body: `Mobile-first means designing for the phone first, then expanding to larger screens. Because most visitors use phones, a site that works well in one thumb-reach is better for everyone, and it forces you to focus on what matters.

## What it looks like
- Large tap targets and readable text.
- One clear action per screen.
- Short forms with the right keyboard for each field.
- Fast loading on slow connections.
- Navigation within thumb reach, such as a bottom bar.

## Common mistakes
Shrinking a desktop site instead of redesigning it, hover-only menus and tiny buttons.

## Test it
Open your site on a real phone and try to book or buy with one hand.

Every BGeetech site is designed mobile-first, and we offer an installable app-like experience.`,
  },
  {
    slug: "how-to-automate-repetitive-business-tasks",
    title: "How to automate repetitive tasks in your business",
    excerpt: "Start with the boring, frequent tasks. Here are practical automations you can set up quickly.",
    category: "Automation",
    date: "2026-11-12",
    body: `Automate tasks that are frequent, rule-based and boring: sending confirmations, copying data between tools, chasing invoices and routing enquiries. Start with one task, measure the time saved, then expand.

## Good first automations
- A website enquiry creates a CRM contact and notifies the right person.
- A booking sends a confirmation and a reminder.
- A paid order updates stock and creates an invoice.
- A new lead receives a WhatsApp message within a minute.
- Weekly reports are emailed automatically.

## How to start
1. List tasks that repeat every week.
2. Pick the one that wastes the most time.
3. Map the steps and the rules.
4. Automate it, test it, then monitor it.

## Keep humans in the loop
Let automation do the routine and send exceptions to a person.

Our automation service connects your website, CRM, WhatsApp and accounting tools.`,
  },
  {
    slug: "ai-for-small-business-practical-uses",
    title: "Practical ways a small business can use AI today",
    excerpt: "Support answers, drafts, summaries and search. Here is where AI helps and where to be careful.",
    category: "AI",
    date: "2026-11-13",
    body: `Small businesses get the most from AI by using it for repetitive language work: answering common questions, drafting emails, summarising documents and searching their own knowledge. It saves time when a person reviews the result and breaks when trusted blindly.

## Where it helps
- **Customer questions** answered from your own information, around the clock.
- **Drafts** of emails, product descriptions and social posts.
- **Summaries** of long documents and call notes.
- **Search** across your files and help articles.
- **Data entry** from forms and invoices.

## Where to be careful
- Do not paste sensitive customer data into tools you do not control.
- Check facts, numbers and legal text.
- Tell customers when they are talking to an AI, and offer a person.

## Start small
Pick one task, run a two-week trial and measure time saved.

We build AI assistants and automations connected to your website and WhatsApp.`,
  },
  {
    slug: "how-to-build-a-minimum-viable-product",
    title: "How to build an MVP: launch your software idea without wasting money",
    excerpt: "A minimum viable product tests your idea with real users using the smallest useful version.",
    category: "Strategy",
    date: "2026-11-14",
    body: `An MVP is the smallest version of your product that real users can use and give feedback on. Build only the core feature that solves one problem well, launch to a small group, and learn before adding more. This reduces risk and cost.

## Steps
1. **Define the problem** and who has it.
2. **Choose one core feature** that solves it.
3. **Sketch the flow** on paper before any code.
4. **Build the simplest version** that works.
5. **Test with real users** and watch what they do.
6. **Improve or pivot** based on what you learn.

## What to leave out
Perfect design, extra roles, advanced reports and anything users do not ask for yet.

## Choose tools that can grow
Pick a stack you can extend, so the MVP does not need a full rewrite.

Book a free consultation to scope your MVP and get a realistic budget and timeline.`,
  },
  {
    slug: "software-maintenance-why-it-matters",
    title: "Why software maintenance matters (and what it should include)",
    excerpt: "Launching is the beginning. Updates, security and fixes keep software healthy and affordable.",
    category: "Support",
    date: "2026-11-15",
    body: `Software needs regular maintenance, just like a vehicle. Without updates, security fixes and monitoring, small issues grow into outages and costly emergencies. A modest monthly plan is usually cheaper than fixing a crisis.

## What maintenance should include
- Security and dependency updates.
- Backups and restore tests.
- Monitoring and uptime alerts.
- Bug fixes and small improvements.
- Performance checks.
- A named contact and response times.

## Signs you need it now
The site is slow, errors appear, plugins are out of date, or the original developer is gone.

## Choosing a plan
Look for clear response times, a monthly report and no long lock-in.

Our bug fixing and maintenance plans cover websites, apps, CRMs and ERPs.`,
  },
  {
    slug: "how-to-choose-a-domain-name",
    title: "How to choose a domain name that customers remember",
    excerpt: "Short, clear and easy to say. Practical rules for picking and protecting your web address.",
    category: "Websites",
    date: "2026-11-16",
    body: `A good domain name is short, easy to spell, easy to say aloud and matches your brand. Choose a .com if you can, or a trusted local extension such as .ae or .in for local businesses.

## Simple rules
- Keep it under about 15 characters.
- Avoid hyphens and numbers, which people mishear.
- Say it out loud. If you have to spell it, simplify it.
- Match your business name and social handles.
- Check trademarks before you commit.

## Protect it
Register for several years, turn on auto-renew and lock the domain. Keep the account in your own name, not your developer's.

## Email matters too
A domain-based email such as name@yourcompany.com looks more trustworthy than a free address.

Our website builder checks domain ideas and helps you set up the domain and email.`,
  },
  {
    slug: "what-to-prepare-before-your-first-consultation",
    title: "How to prepare for your free consultation (and get the most from 30 minutes)",
    excerpt: "A few notes beforehand help us give you specific, useful advice in half an hour.",
    category: "Guides",
    date: "2026-11-17",
    body: `You get the most from a 30-minute consultation by knowing your goal, your rough budget and your deadline. Bring examples of sites or apps you like, and a list of the problems you want solved. We will do the rest.

## What to bring
- **Your goal:** more enquiries, online sales, saving time, replacing a spreadsheet.
- **Your users:** who will use it and how.
- **Examples:** two or three sites or apps you like, and why.
- **Constraints:** budget range, deadline, existing systems.
- **Questions:** anything you are unsure about.

## What you will leave with
Honest advice on options, a rough range for cost and timeline, and clear next steps. There is no obligation, and the first 30 minutes are free.

## How to book
Choose a topic and time on our booking page. You will receive the video link by email.

Ready? Book your free consultation today.`,
  },
];
