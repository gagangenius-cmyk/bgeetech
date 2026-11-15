// NOTE: All copy, prices, stats and testimonials below are PLACEHOLDERS.
// Replace with real, verifiable content before launch.

export const site = {
  name: "bgeetech",
  url: "https://bgeetech.com",
  tagline: "Technology consulting, delivered online.",
  description:
    "bgeetech helps ambitious teams plan, design and ship digital products with expert consulting delivered online. Book a consultation in under a minute.",
  email: "hello@bgeetech.com",
};

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export type Service = {
  slug: string;
  title: string;
  icon: "code" | "cloud" | "brain" | "palette" | "shield" | "compass";
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
];

export const stats = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 14, suffix: "", label: "Countries served" },
  { value: 24, suffix: "h", label: "Typical response time" },
];

export const steps = [
  { title: "Book online", body: "Choose a service and pick a time that suits you. Price and duration are shown up front." },
  { title: "Meet your expert", body: "Join a secure video session. We arrive prepared from your short intake form." },
  { title: "Get a clear plan", body: "Leave with a written summary, priorities and next steps you can act on." },
];

export const testimonials = [
  {
    quote: "Sample testimonial: replace with a real client quote and measurable result.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Sample testimonial: replace with a real client quote and measurable result.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    quote: "Sample testimonial: replace with a real client quote and measurable result.",
    name: "Client Name",
    role: "Role, Company",
  },
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
