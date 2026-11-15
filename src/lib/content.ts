// Editorial content. Written as practical, general guidance. Review and adjust to your real practice.

export type ServiceDetail = {
  audience: string[];
  process: { title: string; body: string }[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "web-product-engineering": {
    audience: ["Founders planning a first release", "Teams migrating to Next.js or a modern stack", "Products with slow pages or fragile deployments"],
    process: [
      { title: "Context", body: "A short intake form tells us your goals, stack and constraints before we meet." },
      { title: "Review", body: "We walk through your architecture, codebase or plan and flag the biggest risks." },
      { title: "Plan", body: "You leave with prioritised actions, trade-offs explained in plain language." },
    ],
    deliverables: ["Written summary with prioritised recommendations", "Architecture notes or diagram where useful", "A short list of quick wins you can ship this week"],
    faqs: [
      { q: "Do you write code for us?", a: "Sessions are advisory. We can recommend approaches and review work, and discuss delivery support separately." },
      { q: "Which stacks do you cover?", a: "Most work is TypeScript, React and Next.js with Node back ends and SQL databases. We will say so if something is outside our depth." },
    ],
  },
  "cloud-devops": {
    audience: ["Teams with rising cloud bills", "Companies without a reliable deploy pipeline", "Products that need better monitoring before launch"],
    process: [
      { title: "Inventory", body: "We map what runs where, how it deploys and what it costs." },
      { title: "Assess", body: "We look at reliability, security basics, cost and developer experience." },
      { title: "Roadmap", body: "A sequenced plan separates urgent fixes from longer-term improvements." },
    ],
    deliverables: ["Findings report with risk ranking", "CI/CD and environment recommendations", "Monitoring and alerting checklist"],
    faqs: [
      { q: "Do you need access to our cloud account?", a: "Not for a first session. Screen-sharing and exported cost or architecture data is usually enough." },
      { q: "Which providers do you work with?", a: "AWS, Azure, Google Cloud and Vercel-style platforms. The principles carry across providers." },
    ],
  },
  "data-ai": {
    audience: ["Teams exploring AI features for the first time", "Leaders deciding where AI is worth the investment", "Products with data that is hard to use"],
    process: [
      { title: "Use cases", body: "We list candidate ideas and score them on value, feasibility and risk." },
      { title: "Approach", body: "We discuss build versus buy, data needs, evaluation and cost." },
      { title: "Guardrails", body: "We agree how to test quality, handle errors and protect user data." },
    ],
    deliverables: ["Ranked use-case shortlist", "Build, buy or wait recommendation", "Evaluation and safety checklist"],
    faqs: [
      { q: "Will you build us a model?", a: "This session is about strategy and scoping. It helps you decide what to build and how to measure it." },
      { q: "Is our data shared with anyone?", a: "We only discuss what you choose to share, and handle it under our privacy policy." },
    ],
  },
  "ux-ui-design": {
    audience: ["Products with low sign-up or booking conversion", "Teams without a consistent design system", "Founders validating a new interface"],
    process: [
      { title: "Observe", body: "We review key journeys on desktop and mobile using your analytics and feedback." },
      { title: "Diagnose", body: "We identify friction, accessibility gaps and unclear messaging." },
      { title: "Prioritise", body: "You receive fixes ranked by impact and effort." },
    ],
    deliverables: ["UX audit with annotated screenshots", "Quick-win list with effort estimates", "Design system starting points (tokens, components)"],
    faqs: [
      { q: "Do you do accessibility reviews?", a: "Yes. We check against WCAG 2.2 AA basics such as contrast, focus, target size and keyboard use." },
      { q: "Can you work from our Figma files?", a: "Yes, share a view link or screen-share during the session." },
    ],
  },
  "security-compliance": {
    audience: ["Teams preparing for customer security reviews", "Startups handling personal or payment data", "Companies starting privacy and compliance work"],
    process: [
      { title: "Scope", body: "We agree what data and systems matter most." },
      { title: "Model", body: "We walk through realistic threats and where current controls fall short." },
      { title: "Sequence", body: "We build a practical order of work you can fit around delivery." },
    ],
    deliverables: ["Threat model summary", "Privacy and data-handling observations", "Readiness roadmap with owners and priorities"],
    faqs: [
      { q: "Is this a formal audit or certification?", a: "No. It is advisory and does not replace an independent audit or legal advice." },
      { q: "Do you cover GDPR?", a: "We can discuss practical measures. For legal interpretation, speak to a qualified privacy lawyer." },
    ],
  },
  "digital-strategy": {
    audience: ["Leaders setting next-year priorities", "Teams with too many ideas and too little focus", "Businesses moving services online"],
    process: [
      { title: "Goals", body: "We clarify outcomes, constraints and who needs to be aligned." },
      { title: "Options", body: "We map opportunities and compare them honestly." },
      { title: "Roadmap", body: "We turn the chosen direction into milestones and measurable KPIs." },
    ],
    deliverables: ["One-page strategy summary", "Roadmap with milestones and KPIs", "Stakeholder alignment notes"],
    faqs: [
      { q: "Can you run a workshop for our wider team?", a: "Yes, a longer session can be arranged. Contact us with the group size and goals." },
      { q: "How soon can we start?", a: "Most sessions can be booked within a few days." },
    ],
  },
};

Object.assign(serviceDetails, {
  "mobile-app-development": {
    audience: ["Founders deciding between native and cross-platform", "Teams extending a web product to mobile", "Businesses preparing a first app store launch"],
    process: [
      { title: "Goals", body: "We clarify users, key journeys and what the app must do on day one." },
      { title: "Options", body: "We compare native, cross-platform and web-app approaches against your constraints." },
      { title: "Launch plan", body: "You get an MVP scope, release plan and store-readiness checklist." },
    ],
    deliverables: ["Platform and framework recommendation", "MVP scope and phased roadmap", "App store and privacy-label checklist"],
    faqs: [
      { q: "Should we build native or cross-platform?", a: "It depends on performance needs, team skills and budget. We walk through the trade-offs for your case." },
      { q: "Can you help with store approval?", a: "We can review your readiness against store guidelines and common rejection reasons." },
    ],
  },
  "ecommerce-payments": {
    audience: ["Stores with high cart abandonment", "Businesses taking payments online for the first time", "Teams choosing between platforms"],
    process: [
      { title: "Journey", body: "We walk the path from product page to confirmation on desktop and mobile." },
      { title: "Friction", body: "We find where customers drop off and which payment options are missing." },
      { title: "Fixes", body: "You receive ranked changes for checkout, payments, tax and fraud basics." },
    ],
    deliverables: ["Checkout and payment flow review", "Platform comparison for your needs", "Tax, invoicing and fraud-prevention checklist"],
    faqs: [
      { q: "Which payment providers do you cover?", a: "Stripe and other major gateways, plus regional methods. Advice focuses on fit, not vendor promotion." },
      { q: "Do you handle tax advice?", a: "We cover the technical side such as automatic tax calculation. For tax law, consult a qualified accountant." },
    ],
  },
  "seo-growth": {
    audience: ["Sites that are not ranking as expected", "Businesses launching a new site or redesign", "Teams who want to be cited by AI search tools"],
    process: [
      { title: "Crawl", body: "We review indexing, speed, structured data and site structure." },
      { title: "Content", body: "We map search intent to pages and spot gaps and overlaps." },
      { title: "Measure", body: "We set up tracking so you can see what actually drives enquiries." },
    ],
    deliverables: ["Technical SEO findings", "Content and keyword plan", "Analytics and conversion tracking checklist"],
    faqs: [
      { q: "Can you guarantee rankings?", a: "No one honestly can. We focus on fixes that improve quality, visibility and measurable results." },
      { q: "What about AI search?", a: "We cover clear structure, accurate summaries and llms.txt so assistants can describe your business correctly." },
    ],
  },
  "ai-automation": {
    audience: ["Teams buried in repetitive manual work", "Support or sales teams exploring assistants", "Operations leads connecting many tools"],
    process: [
      { title: "Map", body: "We list repetitive tasks and rank them by time saved and risk." },
      { title: "Design", body: "We choose the right mix of workflows, integrations and AI assistance." },
      { title: "Safeguard", body: "We define review steps, fallbacks and monitoring so automation stays trustworthy." },
    ],
    deliverables: ["Automation opportunity map", "Tooling and integration plan", "Human-in-the-loop and monitoring checklist"],
    faqs: [
      { q: "Will automation replace our team?", a: "The aim is to remove tedious work so people focus on judgment and relationships." },
      { q: "Which tools do you use?", a: "We stay tool-agnostic: workflow platforms, APIs and AI models chosen for your needs." },
    ],
  },
  "crm-business-systems": {
    audience: ["Teams juggling spreadsheets and disconnected tools", "Businesses outgrowing their first CRM", "Leaders who need reliable reporting"],
    process: [
      { title: "Audit", body: "We map your systems, data flow and where information gets stuck." },
      { title: "Select", body: "We compare CRM and workflow options against real requirements." },
      { title: "Plan", body: "You get a phased set-up, migration and reporting plan." },
    ],
    deliverables: ["Systems and data-flow map", "CRM selection and set-up plan", "Reporting and dashboard design"],
    faqs: [
      { q: "Which CRMs do you work with?", a: "We advise across popular options and custom builds, and recommend what fits your size and process." },
      { q: "Can you help migrate data?", a: "We can plan the migration and quality checks. Larger migrations can be scoped separately." },
    ],
  },
  "fractional-cto": {
    audience: ["Founders without a technical co-founder", "Teams scaling engineering for the first time", "Investors and buyers needing a technical review"],
    process: [
      { title: "Situation", body: "We review your product, team, spend and risks." },
      { title: "Priorities", body: "We agree what matters most over the next 3 to 12 months." },
      { title: "Cadence", body: "We set up a regular advisory rhythm for decisions, hiring and vendors." },
    ],
    deliverables: ["Technical roadmap and priorities", "Hiring and team-structure advice", "Vendor and technical due-diligence notes"],
    faqs: [
      { q: "Is this a full-time role?", a: "No. It is part-time senior guidance, available as a one-off session or an ongoing retainer." },
      { q: "Can you speak to our investors?", a: "Yes, we can prepare technical summaries and join discussions where helpful." },
    ],
  },
} satisfies Record<string, ServiceDetail>);

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  date: string; // ISO
  body: { h?: string; p: string }[];
};

export const posts: Post[] = [
  {
    slug: "how-to-prepare-for-a-technology-consultation",
    title: "How to prepare for a technology consultation",
    excerpt: "A little preparation turns a one-hour call into a plan you can act on. Here is a simple checklist.",
    category: "Guides",
    readMinutes: 4,
    date: "2026-11-02",
    body: [
      { p: "A good consultation is a focused conversation, not a lecture. The more clearly you describe your situation, the more specific and useful the advice you receive." },
      { h: "1. Write down the one decision you need to make", p: "Start with a single sentence: \"We need to decide whether to rebuild or refactor our checkout.\" A clear question shapes the whole session and stops it drifting." },
      { h: "2. Gather the context people forget", p: "Bring your current stack, team size, rough budget, deadlines and anything already tried. Links to the product, a short diagram or a screenshot are enough." },
      { h: "3. Name your constraints honestly", p: "Legacy systems, compliance requirements and hiring limits all change which answers are realistic. Sharing them early saves time." },
      { h: "4. Decide how you will measure success", p: "Faster pages, fewer incidents, higher conversion: pick one or two measures so recommendations can be judged against something concrete." },
      { h: "5. Plan what happens afterwards", p: "Ask who will own the next steps and when you will review progress. A written summary is only valuable if someone acts on it." },
    ],
  },
  {
    slug: "web-performance-basics-that-move-conversion",
    title: "Web performance basics that actually move conversion",
    excerpt: "You do not need a rewrite to make a site faster. These five fixes cover most real-world slowdowns.",
    category: "Engineering",
    readMinutes: 5,
    date: "2026-10-20",
    body: [
      { p: "Speed affects how people feel about your brand, and search engines measure it through Core Web Vitals. Most slow sites share the same handful of problems." },
      { h: "Optimise the largest element first", p: "Largest Contentful Paint is usually a hero image or headline. Serve correctly sized, modern-format images, preload the key one and avoid blocking it with scripts." },
      { h: "Ship less JavaScript", p: "Render on the server by default and send client code only for genuinely interactive parts such as a booking form or menu. Frameworks like Next.js make this the default." },
      { h: "Reserve space to avoid layout shift", p: "Give images and embeds explicit dimensions and load fonts with a fallback so the page does not jump while loading." },
      { h: "Keep interactions responsive", p: "Interaction to Next Paint measures how quickly the page reacts to input. Break up long tasks and avoid heavy work on click handlers." },
      { h: "Measure on real devices", p: "Test on a mid-range phone and a slow connection, then track field data over time rather than relying on a single lab score." },
    ],
  },
  {
    slug: "build-vs-buy-for-ai-features",
    title: "Build vs buy: a practical way to choose for AI features",
    excerpt: "Before training anything, ask four questions. They usually reveal whether to use an API, a vendor product, or build.",
    category: "Strategy",
    readMinutes: 4,
    date: "2026-10-06",
    body: [
      { p: "AI features are easy to demo and hard to run well. The right choice depends less on technology and more on where your advantage actually lies." },
      { h: "Is this a differentiator?", p: "If the capability is core to why customers choose you, owning more of it can make sense. If it is a convenience feature, buying is usually faster and cheaper." },
      { h: "What data do you have?", p: "Quality, permission to use it and volume matter more than model choice. Without good data, a custom approach rarely beats a well-configured service." },
      { h: "How will you evaluate quality?", p: "Define test cases and acceptance criteria up front. If you cannot measure success, you will not know when it breaks." },
      { h: "What are the ongoing costs and risks?", p: "Consider usage costs, latency, privacy obligations, monitoring and who maintains it. Start small, ship behind a flag and review real usage before expanding." },
    ],
  },
];
