// What BGee says and shows. Selectors point at elements marked with data-bgee="..." in the pages.

export type TourStep = { selector: string; text: string };
export type Station = { title: string; text: string; href?: string; cta?: string };

export const greeting = "Hi, I'm BGee! Walk with me and I'll show you everything inside BGeetech. Your first 30 minutes with an expert are free.";

/** The complete website introduction: BGee strolls from left to right and stops at each part of the site. */
export const walk: Station[] = [
  { title: "Welcome", text: "Hi, I'm BGee! Walk with me and I'll show you what's inside BGeetech." },
  { title: "Services", text: "15 products: websites, web and mobile apps, CRM, ERP, POS, HRMS, e-commerce, AI and bug fixing.", href: "/services", cta: "See services" },
  { title: "Pricing", text: "Six clear packages, plus a custom package builder that prices your own mix live.", href: "/pricing", cta: "See pricing" },
  { title: "Website builder", text: "Design your own website in 5 steps with a live preview. Plans start from $10 a month.", href: "/builder", cta: "Build my site" },
  { title: "Live demos", text: "Try working demos of our CRM, POS, HRMS and more before you decide.", href: "/demos", cta: "Open demos" },
  { title: "Free website audit", text: "Enter any website address and get an instant score for SEO, speed, mobile and security.", href: "/audit", cta: "Check my site" },
  { title: "Free consultation", text: "Book a 30-minute video call with an expert. The first one is free.", href: "/book", cta: "Book free call" },
  { title: "Blog and team", text: "Read our plain-English guides, and meet the people who will build your project.", href: "/team", cta: "Meet the team" },
  { title: "Ask me anything", text: "Questions about services, pricing or tech? Just ask me here, or message the team on WhatsApp.", href: "/contact", cta: "Contact us" },
];

/** Page introductions: BGee walks in and says one of these whenever a page opens. `{h1}` becomes the page heading. */
const intros: [match: (p: string) => boolean, text: string][] = [
  [(p) => p === "/", "This is the home page. Scroll to see our products, how we work, prices and answers to common questions. The slider at the top shows each thing we build."],
  [(p) => p === "/services", "Welcome to Services! Here are all 15 products with starting prices. Tap any card to see what's included and who it's for."],
  [(p) => p.startsWith("/services/"), "You're looking at {h1}. Scroll for what's included, how it works, FAQs and related services. 'Get started with a free call' books 30 free minutes."],
  [(p) => p === "/pricing", "This is Pricing: six packages with clear starting prices. Want your own mix? Use the custom package builder below, just tap the tiles."],
  [(p) => p === "/builder", "This is the website builder. Five steps, a live preview on desktop, tablet and mobile, and plans from $10 a month. Your progress is saved."],
  [(p) => p === "/book", "Here you book a consultation. Pick a topic, a time and your details. The first 30 minutes are free, and the video link arrives by email."],
  [(p) => p === "/contact", "This is Contact. Send the form, WhatsApp us, or ask me. You'll also find our location on the map. We reply within one business day."],
  [(p) => p === "/demos", "Demos! Try working versions of our CRM, POS, HRMS and more. Filter by category, then open one."],
  [(p) => p.startsWith("/demos/"), "This is the {h1} demo. Open the live demo, or ask us for a guided walkthrough."],
  [(p) => p === "/audit", "This is the free website audit. Type any website address and I will score its SEO, speed, mobile and security in seconds."],
  [(p) => p === "/estimate", "The estimator gives an instant planning price. Pick what you're building, the size and the timeline. It's a range, not a quote."],
  [(p) => p === "/blog", "Our blog: short, practical guides on costs, CRM vs ERP, AI and more. Pick the one that matches your question."],
  [(p) => p.startsWith("/blog/"), "You're reading '{h1}'. The related services at the bottom help you act on it."],
  [(p) => p === "/team", "Meet the team! These are the people who design, build and answer your messages."],
  [(p) => p === "/faq", "Quick answers live here. Can't find yours? Ask me, or press Ctrl/Cmd + K to search the whole site."],
  [(p) => p === "/about", "About BGeetech: a web and software team that brings design, build and support together, so nothing falls between the cracks."],
  [(p) => p === "/search", "Search the whole site: services, articles, demos, team and website types."],
];

export function introFor(path: string, h1: string): string {
  const text = intros.find(([m]) => m(path))?.[1] ?? "Need a hand with this page? Tap me, or ask me anything.";
  return text.replace("{h1}", h1 || "this page");
}

const tours: [match: (p: string) => boolean, steps: TourStep[]][] = [
  [
    (p) => p === "/",
    [
      { selector: '[data-bgee="hero"]', text: "This is BGeetech: websites, apps, CRM, ERP and AI, all from one team. The slider shows each one." },
      { selector: '[data-bgee="services"]', text: "Here are our products with starting prices. Tap a card to see what's included." },
      { selector: '[data-bgee="process"]', text: "How it works: a free call, a fixed-scope proposal, then we build, launch and support." },
      { selector: '[data-bgee="proof"]', text: "Don't take our word for it: open a live demo, or test your own website with the free audit." },
      { selector: '[data-bgee="glance"]', text: "The short version of who we are and what it costs." },
      { selector: '[data-bgee="pricing"]', text: "Clear starting prices. See the full list, and a custom package builder, on the pricing page." },
      { selector: '[data-bgee="faq"]', text: "Quick answers to common questions. That's the tour! Ready to book your free call?" },
    ],
  ],
  [(p) => p === "/services", [{ selector: '[data-bgee="service-grid"]', text: "Fifteen products, each with a starting price. Tap one to dive in." }]],
  [
    (p) => p === "/pricing",
    [
      { selector: '[data-bgee="packages"]', text: "Six ready-made packages, from the free first consultation to full ERP." },
      { selector: "#custom-package", text: "Build your own! Tap the tiles you need, pick size and timeline, and the price updates live. Bundles save up to 15%." },
      { selector: '[data-bgee="builder-callout"]', text: "Just need a website? Design it yourself in minutes from $10 a month." },
    ],
  ],
  [(p) => p === "/builder", [{ selector: '[data-bgee="wizard"]', text: "Five steps: your details, business type, colours, style, then a plan. A live preview shows exactly how it will look." }]],
  [(p) => p === "/book", [{ selector: '[data-bgee="booking"]', text: "Choose a topic, a time and your details. Your first 30 minutes are free, and you'll get a video link by email." }]],
  [
    (p) => p === "/contact",
    [
      { selector: '[data-bgee="contact-form"]', text: "Send us a message here. We reply within one business day." },
      { selector: '[data-bgee="contact-map"]', text: "And here's where we are. Tap 'Show map' to load Google Maps." },
    ],
  ],
  [(p) => p === "/demos", [{ selector: '[data-bgee="demo-grid"]', text: "Working demos of our software. Filter by category, then open a live demo." }]],
  [(p) => p === "/audit", [{ selector: '[data-bgee="audit"]', text: "Type a website address here. In a few seconds you get a score and the top fixes. Then our team can fix them for you." }]],
  [(p) => p === "/estimate", [{ selector: '[data-bgee="estimator"]', text: "Pick what you're building, the size and timeline. Your price range updates as you choose." }]],
];

export function tourFor(path: string): TourStep[] {
  return tours.find(([m]) => m(path))?.[1] ?? [];
}

export const actions = [
  { id: "services", label: "What do you offer?", href: "/services" },
  { id: "pricing", label: "How much does it cost?", href: "/pricing" },
  { id: "builder", label: "Build my website", href: "/builder" },
  { id: "book", label: "Book a free call", href: "/book" },
] as const;
