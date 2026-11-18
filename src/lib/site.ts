// NOTE: All copy, prices, stats and testimonials below are PLACEHOLDERS.
// Replace with real, verifiable content before launch.

export const site = {
  name: "BGeetech",
  url: "https://bgeetech.com",
  tagline: "Websites, software and AI, built for your business.",
  description:
    "BGeetech builds websites, web and mobile apps, CRM, ERP, POS, HRMS and AI solutions, and fixes and maintains your existing software. Your first 30-minute consultation is free.",
  email: "hello@bgeetech.com",
  whatsappNumber: "919873334283", // international format, digits only
  whatsappDisplay: "+91 98733 34283",
  /** Public location. City-level on purpose: add a street address here when you want one to appear on the map. */
  address: { label: "Dubai, United Arab Emirates", mapQuery: "Dubai, United Arab Emirates", city: "Dubai", country: "AE" },
  /** Official profile URLs (LinkedIn, Facebook, Instagram, X, YouTube...). They feed Organization "sameAs", which helps search and AI engines recognise the brand. */
  socials: [] as string[],
  /** Allow AI model-training crawlers (GPTBot, ClaudeBot...) in robots.txt. Search and answer bots are always allowed. */
  allowAiTraining: true,
};

/** Plain-text price for metadata, search and chat (USD). */
export const priceText = (s: { from: number; unit: string }) => (s.from === 0 ? s.unit : `from $${s.from} ${s.unit}`);

/** Free consultation policy, shown across the site and enforced in the booking action. */
export const consultation = { freeMinutes: 30, extendedMinutes: 60, extendedUsd: 60 } as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/demos", label: "Demos" },
  { href: "/builder", label: "Site Builder" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const;

export type ServiceIcon =
  | "code" | "cloud" | "brain" | "palette" | "shield" | "compass" | "phone" | "cart" | "trend" | "bot" | "workflow" | "crown"
  | "globe" | "database" | "bug" | "users" | "receipt";

export type Service = {
  slug: string;
  title: string;
  icon: ServiceIcon;
  summary: string;
  outcomes: string[];
  from: number; // USD starting price (0 = free)
  unit: string; // e.g. "per project", "per month", "per fix"
};

export const services: Service[] = [
  {
    slug: "website-development",
    title: "Website Development",
    icon: "globe",
    summary: "Fast, SEO-ready business websites, landing pages and portfolios, designed around your brand.",
    outcomes: ["Custom responsive design", "SEO-ready, fast-loading pages", "Easy content management"],
    from: 299,
    unit: "per project",
  },
  {
    slug: "web-app-development",
    title: "Web Application Development",
    icon: "code",
    summary: "Custom web applications, portals and dashboards built to match the way you work.",
    outcomes: ["Requirements and UX planning", "Secure accounts and user roles", "Admin dashboards and reporting"],
    from: 1500,
    unit: "per project",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: "phone",
    summary: "Android and iOS apps, native or cross-platform, from MVP to app store launch.",
    outcomes: ["iOS and Android builds", "API and backend integration", "App store submission support"],
    from: 2500,
    unit: "per project",
  },
  {
    slug: "crm-software",
    title: "CRM Software",
    icon: "users",
    summary: "CRM systems for real estate, immigration, education and more: leads, pipelines, documents and follow-ups.",
    outcomes: ["Lead capture and pipeline", "Client records and documents", "Automated reminders and reports"],
    from: 1200,
    unit: "per project",
  },
  {
    slug: "erp-software",
    title: "ERP Software",
    icon: "database",
    summary: "ERP systems that connect inventory, accounting, sales, HR and operations in one place.",
    outcomes: ["Inventory, purchase and sales", "Accounting and invoicing", "Role-based access and reports"],
    from: 3000,
    unit: "per project",
  },
  {
    slug: "pos-hrms-software",
    title: "POS & HRMS Software",
    icon: "receipt",
    summary: "POS billing for shops and restaurants, and HRMS for attendance, leave and payroll.",
    outcomes: ["Billing, stock and receipts", "Attendance, leave and payroll", "Multi-branch reports"],
    from: 900,
    unit: "per project",
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    icon: "cart",
    summary: "Online stores with catalogue, checkout, payments and shipping, built to convert.",
    outcomes: ["Store design and catalogue", "Payment and shipping set-up", "Orders, inventory and analytics"],
    from: 1200,
    unit: "per project",
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions & Chatbots",
    icon: "brain",
    summary: "AI chatbots, assistants and smart features that save time and answer customers 24/7.",
    outcomes: ["Custom AI chatbot or assistant", "Knowledge-base and data integration", "Safety, testing and monitoring"],
    from: 800,
    unit: "per project",
  },
  {
    slug: "automation-integrations",
    title: "Automation & Integrations",
    icon: "workflow",
    summary: "Connect your tools and automate repetitive work with workflows, APIs and automatic reports.",
    outcomes: ["Workflow and approval automation", "Integrations: CRM, WhatsApp, payments", "Automated reports and alerts"],
    from: 500,
    unit: "per project",
  },
  {
    slug: "bug-fixing-maintenance",
    title: "Bug Fixing & Maintenance",
    icon: "bug",
    summary: "Fast fixes, updates and ongoing care for websites, apps and software, even ones built by someone else.",
    outcomes: ["Bug diagnosis and fixes", "Security and performance updates", "Care plans with priority support"],
    from: 30,
    unit: "per fix",
  },
  {
    slug: "ui-ux-design",
    title: "UI / UX Design",
    icon: "palette",
    summary: "Research-led interface design, clickable prototypes and design systems that convert and delight.",
    outcomes: ["UX audit and user flows", "Clickable prototypes", "Design system and brand kit"],
    from: 400,
    unit: "per project",
  },
  {
    slug: "seo-digital-marketing",
    title: "SEO & Digital Marketing",
    icon: "trend",
    summary: "SEO, content and social media that bring in qualified visitors and enquiries.",
    outcomes: ["Technical SEO and keyword plan", "Content and blog writing", "Reporting and conversion tracking"],
    from: 150,
    unit: "per month",
  },
  {
    slug: "cloud-hosting-devops",
    title: "Cloud, Hosting & DevOps",
    icon: "cloud",
    summary: "Reliable hosting, deployment pipelines, backups and monitoring for your software.",
    outcomes: ["Managed hosting and SSL", "Automated deployments", "Backups and uptime monitoring"],
    from: 100,
    unit: "per month",
  },
  {
    slug: "security-audit",
    title: "Security Audit & Hardening",
    icon: "shield",
    summary: "Security reviews and hardening for websites and business software, with a clear fix list.",
    outcomes: ["Vulnerability review", "Hardening and fixes", "Security report with priorities"],
    from: 400,
    unit: "per audit",
  },
  {
    slug: "technology-consulting",
    title: "Technology Consulting",
    icon: "compass",
    summary: "Expert advice on technology choices, architecture and roadmaps. Your first 30 minutes are free.",
    outcomes: ["Free 30-minute first consultation", "Written recommendations and roadmap", "Extended 60-minute deep-dive sessions"],
    from: 0,
    unit: "first 30 minutes free",
  },
];

export const industries = [
  "Professional services", "Healthcare", "Finance & fintech", "Education",
  "Real estate", "Retail & e-commerce", "Logistics", "Startups & SaaS",
];

export const whyUs = [
  { title: "Free first consultation", body: "Talk to an expert for 30 minutes at no cost, with honest advice and no obligation." },
  { title: "One team, end to end", body: "Design, development, AI, hosting and support from the same people, so nothing falls between the cracks." },
  { title: "Clear, upfront pricing", body: "Starting prices are published, and every proposal is a fixed scope you approve before work begins." },
  { title: "Support after launch", body: "Bug fixing, updates and care plans keep your website and software running smoothly." },
];

// Facts about how the company is run (not performance claims). Adjust to match your real offer.
export const stats = [
  { value: services.length, suffix: "", label: "Products & services" },
  { value: 30, suffix: "min", label: "Free first consultation" },
  { value: 100, suffix: "%", label: "Delivered online" },
  { value: 24, suffix: "h", label: "Reply target" },
];

export const steps = [
  { title: "Tell us what you need", body: "Book a free 30-minute call or send a message. We listen, ask questions and explain your options in plain language." },
  { title: "Get a clear proposal", body: "You receive a fixed scope, timeline and price for approval before any work begins." },
  { title: "We build, launch and support", body: "We design, build and launch, then stay on hand with updates, bug fixing and care plans." },
];

export const tech = [
  "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Azure", "Vercel",
  "Docker", "Kubernetes", "Stripe", "OpenAI", "Figma", "Terraform",
];

export type Plan = {
  name: string;
  /** USD list price: 0 = free, null = custom quote. */
  price: number | null;
  period: "free" | "one-off" | "month" | "custom";
  blurb: string;
  features: string[];
  highlight: boolean;
};

// PLACEHOLDER prices (USD). Replace with your real offers.
export const plans: Plan[] = [
  {
    name: "Free Consultation",
    price: 0,
    period: "free",
    blurb: "Talk to an expert about your idea. The first 30 minutes are on us.",
    features: ["30-minute video call", "Honest advice on the best approach", "Rough scope and next steps", "No obligation"],
    highlight: false,
  },
  {
    name: "Website Launch",
    price: 299,
    period: "one-off",
    blurb: "A professional, mobile-friendly website, live fast.",
    features: ["Up to 5 responsive pages", "SEO-ready and fast-loading", "Contact form and WhatsApp button", "1 month free support"],
    highlight: false,
  },
  {
    name: "CRM & Business App",
    price: 1200,
    period: "one-off",
    blurb: "A custom CRM or web app tailored to how you work.",
    features: ["Requirements workshop", "Leads, clients and pipelines", "Dashboards and reports", "Training and 3 months support"],
    highlight: true,
  },
  {
    name: "ERP Suite",
    price: 3000,
    period: "one-off",
    blurb: "One integrated system for your whole operation.",
    features: ["Inventory, sales and purchase", "Accounting and invoicing", "HR and role-based access", "Data migration and training"],
    highlight: false,
  },
  {
    name: "AI & Automation",
    price: 800,
    period: "one-off",
    blurb: "Chatbots, assistants and automated workflows.",
    features: ["AI chatbot or assistant", "WhatsApp and CRM integrations", "Workflow automation", "Testing and monitoring"],
    highlight: false,
  },
  {
    name: "Care Plan",
    price: 49,
    period: "month",
    blurb: "Bug fixing, updates and priority support for your existing website or software.",
    features: ["Bug fixes and updates", "Security patches and backups", "Uptime and performance checks", "Reply within 1 business day"],
    highlight: false,
  },
];

// PLACEHOLDER catalogue for the custom package calculator at /pricing (USD).
export type CatalogItem = { id: string; label: string; note: string; price: number };
export const packageCatalog = {
  projects: [
    { id: "website", label: "Website", note: "Business site, landing pages", price: 299 },
    { id: "ecommerce", label: "E-commerce store", note: "Catalogue, checkout, payments", price: 1200 },
    { id: "webapp", label: "Web application", note: "Portal, dashboard, SaaS", price: 1500 },
    { id: "mobile", label: "Mobile app", note: "Android and iOS", price: 2500 },
    { id: "crm", label: "CRM software", note: "Leads, clients, pipeline", price: 1200 },
    { id: "erp", label: "ERP software", note: "Inventory, accounts, HR", price: 3000 },
    { id: "pos", label: "POS or HRMS", note: "Billing or people management", price: 900 },
    { id: "ai", label: "AI chatbot / assistant", note: "Answers customers 24/7", price: 800 },
    { id: "automation", label: "Automation & integrations", note: "Connect tools, save time", price: 500 },
    { id: "design", label: "UI / UX design", note: "Prototype and design system", price: 400 },
    { id: "security", label: "Security audit", note: "Review and hardening", price: 400 },
  ] satisfies CatalogItem[],
  monthly: [
    { id: "care", label: "Care plan: bug fixing & updates", note: "Fixes, patches, backups", price: 49 },
    { id: "hosting", label: "Cloud hosting & DevOps", note: "Hosting, SSL, monitoring", price: 100 },
    { id: "seo", label: "SEO & content", note: "Monthly SEO and blog posts", price: 150 },
    { id: "priority", label: "Priority support upgrade", note: "Reply within 4 hours", price: 80 },
  ] satisfies CatalogItem[],
  scale: [
    { id: "small", label: "Small", note: "Core features", mult: 1 },
    { id: "medium", label: "Medium", note: "Typical scope", mult: 1.6 },
    { id: "large", label: "Large", note: "Many features", mult: 2.6 },
  ],
  timeline: [
    { id: "flexible", label: "Flexible", note: "3+ months", mult: 0.95 },
    { id: "standard", label: "Standard", note: "6 to 12 weeks", mult: 1 },
    { id: "fast", label: "Fast-track", note: "Under 6 weeks", mult: 1.25 },
  ],
  // Bundle discount on one-off projects by number of projects chosen
  bundle: [
    { min: 4, off: 0.15 },
    { min: 3, off: 0.1 },
    { min: 2, off: 0.05 },
  ],
} as const;

export const faqs = [
  { q: "Is the first consultation really free?", a: "Yes. Your first 30 minutes with an expert are free, with no obligation. If you want a longer deep-dive, 60-minute sessions are available at a fixed price." },
  { q: "What do you build?", a: "Websites, web and mobile apps, CRM, ERP, POS and HRMS software, e-commerce stores, AI chatbots and automations, plus design, SEO, hosting and security." },
  { q: "Can you fix or take over software built by someone else?", a: "Yes. We diagnose and fix bugs, update outdated code and provide ongoing care plans, even for projects we did not build." },
  { q: "How does pricing and payment work?", a: "Starting prices are published. After your free call you get a fixed-scope proposal. Projects are paid in agreed milestones, and care plans are billed monthly, quarterly or annually." },
  { q: "Do you provide invoices for companies?", a: "Yes. Corporate buyers can add a tax ID at checkout and receive a compliant PDF invoice." },
  { q: "What happens after launch?", a: "We offer bug fixing, updates, hosting and monitoring. Choose a care plan or call on us as needed." },
];

// PLACEHOLDER rates for the /estimate planning tool (USD). Replace with your real pricing logic.
export const estimator = {
  types: {
    web: { label: "Marketing / business website", note: "Pages, CMS, SEO basics", base: 2500 },
    app: { label: "Web application", note: "Accounts, dashboards, workflows", base: 8000 },
    shop: { label: "E-commerce store", note: "Catalogue, checkout, payments", base: 6000 },
    mobile: { label: "Mobile app", note: "iOS and Android", base: 12000 },
    ai: { label: "AI / automation", note: "Assistants, workflows, integrations", base: 5000 },
    advisory: { label: "Advisory retainer", note: "Monthly senior guidance", base: 1200 },
  },
  sizes: {
    small: { label: "Small", note: "Core features only", mult: 1 },
    medium: { label: "Medium", note: "Typical product scope", mult: 1.8 },
    large: { label: "Large", note: "Many features or integrations", mult: 3 },
  },
  speeds: {
    flexible: { label: "Flexible", note: "3+ months", mult: 0.9 },
    standard: { label: "Standard", note: "6 to 12 weeks", mult: 1 },
    fast: { label: "Fast-track", note: "Under 6 weeks", mult: 1.3 },
  },
  extras: [
    { id: "design", label: "Design system and UI kit", price: 1500 },
    { id: "seo", label: "Technical SEO set-up", price: 800 },
    { id: "security", label: "Security review", price: 1200 },
    { id: "integrations", label: "Third-party integrations", price: 1800 },
  ],
} as const;
