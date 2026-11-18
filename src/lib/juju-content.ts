// What Juju says and shows on each page. Selectors point at elements marked with data-juju="..." in the pages.

export type TourStep = { selector: string; text: string };

export const greeting =
  "Hi, I'm Juju! I'm your guide to BGeetech. Your first 30 minutes with an expert are free. Tap me any time for a tour or shortcuts.";

const tips: [match: (p: string) => boolean, lines: string[]][] = [
  [(p) => p === "/", ["BGeetech builds websites, apps, CRM, ERP and AI. Tap the dots in the slider to see each one.", "Not sure where to start? Book a free 30-minute call, it costs nothing.", "Psst, press Ctrl or Cmd + K to search the whole site."]],
  [(p) => p === "/services", ["Tap any card to see what's included, who it's for and the starting price.", "Every service page ends with FAQs and related services."]],
  [(p) => p.startsWith("/services/"), ["Like it? 'Get started with a free call' books 30 free minutes with an expert.", "Scroll down for how it works, FAQs and related services."]],
  [(p) => p === "/pricing", ["Six packages with clear starting prices. Want your own mix? Try the custom package builder below, just tap the tiles!", "Tip: switch the currency (USD, AED, INR) at the top."]],
  [(p) => p === "/builder", ["Design your site in 5 steps and watch the live preview. Flip between desktop, tablet and mobile!", "Don't worry, your progress is saved if you leave."]],
  [(p) => p === "/book", ["Pick a topic, a time and your details, and you're booked. The first 30 minutes are free!", "You'll get the video link by email."]],
  [(p) => p === "/contact", ["Quick question? WhatsApp or the AI assistant answer fastest. Or send the form, we reply within one business day."]],
  [(p) => p === "/demos" || p.startsWith("/demos/"), ["These are working demos of our CRM, POS and HRMS. Open one, or ask for a guided walkthrough."]],
  [(p) => p === "/estimate", ["Answer a few questions for an instant planning price. It's a range, not a quote."]],
  [(p) => p === "/blog", ["Short, practical guides. Pick the one that matches your question."]],
  [(p) => p.startsWith("/blog/"), ["Enjoying this? The related services at the bottom help you act on it."]],
  [(p) => p === "/team", ["Meet the people behind BGeetech. They're the ones who answer your messages."]],
  [(p) => p === "/faq", ["Can't find your answer? Ask the AI assistant, or press Ctrl/Cmd + K to search."]],
  [(p) => p === "/about", ["We bring design, build and support together, so nothing falls between the cracks."]],
];

export function tipsFor(path: string): string[] {
  return tips.find(([m]) => m(path))?.[1] ?? ["Need a hand? Tap me for shortcuts."];
}

const tours: [match: (p: string) => boolean, steps: TourStep[]][] = [
  [
    (p) => p === "/",
    [
      { selector: '[data-juju="hero"]', text: "This is BGeetech: websites, apps, CRM, ERP and AI, all from one team. The slider shows each one." },
      { selector: '[data-juju="services"]', text: "Here are our products with starting prices. Tap a card to see what's included." },
      { selector: '[data-juju="process"]', text: "How it works: a free call, a fixed-scope proposal, then we build, launch and support." },
      { selector: '[data-juju="glance"]', text: "The short version of who we are and what it costs." },
      { selector: '[data-juju="pricing"]', text: "Clear starting prices. See the full list, and a custom package builder, on the pricing page." },
      { selector: '[data-juju="faq"]', text: "Quick answers to common questions. That's the tour! Ready to book your free call?" },
    ],
  ],
  [(p) => p === "/services", [{ selector: '[data-juju="service-grid"]', text: "Fifteen products, each with a starting price. Tap one to dive in." }]],
  [
    (p) => p === "/pricing",
    [
      { selector: '[data-juju="packages"]', text: "Six ready-made packages, from the free first consultation to full ERP." },
      { selector: "#custom-package", text: "Build your own! Tap the tiles you need, pick size and timeline, and the price updates live. Bundles save up to 15%." },
      { selector: '[data-juju="builder-callout"]', text: "Just need a website? Design it yourself in minutes from $10 a month." },
    ],
  ],
  [(p) => p === "/builder", [{ selector: '[data-juju="wizard"]', text: "Five steps: your details, business type, colours, style, then a plan. A live preview shows exactly how it will look." }]],
  [(p) => p === "/book", [{ selector: '[data-juju="booking"]', text: "Choose a topic, a time and your details. Your first 30 minutes are free, and you'll get a video link by email." }]],
  [
    (p) => p === "/contact",
    [
      { selector: '[data-juju="contact-form"]', text: "Send us a message here. We reply within one business day." },
      { selector: '[data-juju="contact-map"]', text: "And here's where we are. Tap 'Show map' to load Google Maps." },
    ],
  ],
  [(p) => p === "/demos", [{ selector: '[data-juju="demo-grid"]', text: "Working demos of our software. Filter by category, then open a live demo." }]],
  [(p) => p === "/estimate", [{ selector: '[data-juju="estimator"]', text: "Pick what you're building, the size and timeline. Your price range updates as you choose." }]],
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
