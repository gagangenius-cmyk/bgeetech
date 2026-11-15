// NOTE: All copy, prices, stats and testimonials below are PLACEHOLDERS.
// Replace with real, verifiable content before launch.

export const site = {
  name: "BGeetech",
  url: "https://bgeetech.com",
  tagline: "Technology consulting, delivered online.",
  description:
    "BGeetech helps ambitious teams plan, design and ship digital products with expert consulting delivered online. Book a consultation in under a minute.",
  email: "hello@bgeetech.com",
  whatsappNumber: "919873334283", // international format, digits only
  whatsappDisplay: "+91 98733 34283",
};

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export type Service = {
  slug: string;
  title: string;
  icon: "code" | "cloud" | "brain" | "palette" | "shield" | "compass" | "phone" | "cart" | "trend" | "bot" | "workflow" | "crown";
  summary: string;
  outcomes: string[];
  from: number; // USD
  duration: string;
};

export const services: Service[] = [
  {
    slug: "web-product-engineering",
    title: "Web & Product Engineering",
    icon: "code",
    summary: "Fast, accessible web products built on modern frameworks and shipped with confidence.",
    outcomes: ["Architecture review and roadmap", "Next.js and TypeScript delivery", "Performance and Core Web Vitals audit"],
    from: 150,
    duration: "60 min",
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    icon: "cloud",
    summary: "Reliable infrastructure, CI/CD and observability that scale with your team.",
    outcomes: ["Cloud cost and reliability review", "CI/CD pipeline design", "Monitoring and incident readiness"],
    from: 180,
    duration: "60 min",
  },
  {
    slug: "data-ai",
    title: "Data & AI Strategy",
    icon: "brain",
    summary: "Turn data and AI into practical features with clear scope, risk and ROI.",
    outcomes: ["Use-case prioritisation", "Build vs buy assessment", "Responsible AI guardrails"],
    from: 200,
    duration: "75 min",
  },
  {
    slug: "ux-ui-design",
    title: "UX / UI Design",
    icon: "palette",
    summary: "Research-led interfaces and design systems that convert and delight.",
    outcomes: ["UX audit and quick wins", "Design system foundations", "Conversion-focused flows"],
    from: 140,
    duration: "60 min",
  },
  {
    slug: "security-compliance",
    title: "Security & Compliance",
    icon: "shield",
    summary: "Practical security posture and compliance readiness without the theatre.",
    outcomes: ["Threat modelling session", "Privacy and data-handling review", "Readiness roadmap"],
    from: 220,
    duration: "75 min",
  },
  {
    slug: "digital-strategy",
    title: "Digital Strategy",
    icon: "compass",
    summary: "Clear priorities, sharper positioning and a roadmap your team can execute.",
    outcomes: ["Opportunity mapping", "Roadmap and KPIs", "Stakeholder alignment workshop"],
    from: 160,
    duration: "60 min",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Strategy",
    icon: "phone",
    summary: "Native, cross-platform or web app? Scope, architecture and launch planning for iOS and Android.",
    outcomes: ["Platform and framework choice", "MVP scope and release plan", "App store readiness checklist"],
    from: 170,
    duration: "60 min",
  },
  {
    slug: "ecommerce-payments",
    title: "E-commerce & Payments",
    icon: "cart",
    summary: "Storefront, checkout and payment flows designed to reduce friction and cart abandonment.",
    outcomes: ["Checkout and payment flow review", "Platform selection guidance", "Tax, invoicing and fraud basics"],
    from: 160,
    duration: "60 min",
  },
  {
    slug: "seo-growth",
    title: "SEO & Growth",
    icon: "trend",
    summary: "Technical SEO, content structure and AI-search readiness to earn qualified traffic.",
    outcomes: ["Technical SEO audit", "Content and keyword plan", "Analytics and conversion tracking setup"],
    from: 140,
    duration: "60 min",
  },
  {
    slug: "ai-automation",
    title: "AI & Process Automation",
    icon: "bot",
    summary: "Automate repetitive work with workflows, assistants and integrations that stay reliable.",
    outcomes: ["Automation opportunity map", "Tooling and integration plan", "Human-in-the-loop safeguards"],
    from: 180,
    duration: "60 min",
  },
  {
    slug: "crm-business-systems",
    title: "CRM & Business Systems",
    icon: "workflow",
    summary: "Connect sales, support and operations with systems your team will actually use.",
    outcomes: ["Systems and data-flow audit", "CRM selection and set-up plan", "Reporting and dashboards design"],
    from: 150,
    duration: "60 min",
  },
  {
    slug: "fractional-cto",
    title: "Fractional CTO Advisory",
    icon: "crown",
    summary: "Senior technical leadership on demand: roadmaps, hiring, vendors and due diligence.",
    outcomes: ["Technical roadmap and priorities", "Hiring and team structure advice", "Vendor and due-diligence review"],
    from: 250,
    duration: "90 min",
  },
];

export const industries = [
  "Professional services", "Healthcare", "Finance & fintech", "Education",
  "Real estate", "Retail & e-commerce", "Logistics", "Startups & SaaS",
];

export const whyUs = [
  { title: "Senior-only sessions", body: "You speak with experienced practitioners, never a hand-off to juniors." },
  { title: "Clear written outcomes", body: "Every session ends with a plain-language summary and prioritised next steps." },
  { title: "Fully online, globally", body: "Secure video sessions across time zones, with invoices for companies." },
  { title: "Honest advice", body: "If something is not worth doing, we say so. Our recommendations are independent." },
];

// Facts about how the service is run (not performance claims). Adjust to match your real offer.
export const stats = [
  { value: 12, suffix: "", label: "Specialist services" },
  { value: 100, suffix: "%", label: "Delivered online" },
  { value: 24, suffix: "h", label: "Reply target" },
  { value: 60, suffix: "min", label: "Focused sessions" },
];

export const steps = [
  { title: "Book online", body: "Choose a service and pick a time that suits you. Price and duration are shown up front." },
  { title: "Meet your expert", body: "Join a secure video session. We arrive prepared from your short intake form." },
  { title: "Get a clear plan", body: "Leave with a written summary, priorities and next steps you can act on." },
];

export const tech = [
  "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Azure", "Vercel",
  "Docker", "Kubernetes", "Stripe", "OpenAI", "Figma", "Terraform",
];

export const plans = [
  {
    name: "Starter",
    price: 150,
    blurb: "A focused one-off session to unblock a decision.",
    features: ["60-minute video consultation", "Written summary", "Email follow-up for 7 days"],
    highlight: false,
  },
  {
    name: "Growth",
    price: 450,
    blurb: "Deep-dive review with a prioritised plan.",
    features: ["3 sessions over 2 weeks", "Audit and prioritised roadmap", "Slack or email access", "Recorded sessions"],
    highlight: true,
  },
  {
    name: "Partner",
    price: 1200,
    blurb: "Ongoing advisory for teams shipping continuously.",
    features: ["Monthly advisory retainer", "Priority scheduling", "Architecture and hiring support", "Quarterly roadmap review"],
    highlight: false,
  },
];

export const faqs = [
  { q: "How does an online consultation work?", a: "You book a slot, pay securely, and receive a calendar invite with a video link. Sessions run on Google Meet, Zoom or Teams." },
  { q: "Can I reschedule or cancel?", a: "Yes. Use the secure link in your confirmation email. Our cancellation terms are shown before you pay." },
  { q: "Do you provide invoices for companies?", a: "Yes. Corporate buyers can add a tax ID at checkout and receive a compliant PDF invoice." },
  { q: "Is my information kept private?", a: "Your details are used only to deliver the service and are handled under our privacy policy." },
  { q: "Can you work with our existing team?", a: "Absolutely. Most engagements pair us with in-house engineers, designers and product owners." },
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
