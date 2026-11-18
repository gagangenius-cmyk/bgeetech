// Editorial content. Written as practical, general guidance. Review and adjust to your real practice.

export type ServiceDetail = {
  audience: string[];
  process: { title: string; body: string }[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "website-development": {
    "audience": [
      "Businesses launching or refreshing their website",
      "Freelancers and professionals who need a portfolio",
      "Brands that want to rank in search"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Design and build",
        "body": "We design, build and test your site on every device, then launch it."
      }
    ],
    "deliverables": [
      "Responsive website, ready to publish",
      "Basic SEO set-up and analytics",
      "Training so you can edit your content"
    ],
    "faqs": [
      {
        "q": "How long does a website take?",
        "a": "A typical business website takes 1 to 3 weeks once content is ready. Larger sites take longer."
      },
      {
        "q": "Can I update it myself?",
        "a": "Yes. We set it up so you can edit text and images without a developer."
      }
    ]
  },
  "web-app-development": {
    "audience": [
      "Companies replacing spreadsheets with software",
      "Startups building a web product",
      "Teams that need a client or staff portal"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Build in sprints",
        "body": "We build in short cycles with demos, so you see progress and can steer."
      }
    ],
    "deliverables": [
      "Working web application with admin dashboard",
      "User accounts, roles and permissions",
      "Documentation and handover"
    ],
    "faqs": [
      {
        "q": "Do I own the software?",
        "a": "Ownership and licensing are agreed in your proposal, and we are happy to explain the options."
      },
      {
        "q": "Can you add features later?",
        "a": "Yes. Many clients continue with monthly improvements after launch."
      }
    ]
  },
  "mobile-app-development": {
    "audience": [
      "Businesses taking their service mobile",
      "Startups validating an app idea",
      "Companies needing a staff or customer app"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Design, build, publish",
        "body": "We design the screens, build for Android and iOS, and handle store submission."
      }
    ],
    "deliverables": [
      "Android and iOS app",
      "Backend and API integration",
      "Store listing and launch support"
    ],
    "faqs": [
      {
        "q": "Native or cross-platform?",
        "a": "We recommend what fits your budget and performance needs during the free call."
      },
      {
        "q": "Do you publish to the app stores?",
        "a": "Yes. We prepare and submit the listings and help with review feedback."
      }
    ]
  },
  "crm-software": {
    "audience": [
      "Real estate agencies managing leads and listings",
      "Immigration and education consultants tracking cases",
      "Sales teams that need one source of truth"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Configure and build",
        "body": "We map your process, build the CRM around it and migrate your existing data."
      }
    ],
    "deliverables": [
      "CRM with lead and client management",
      "Pipelines, tasks and reminders",
      "Reports, dashboards and team training"
    ],
    "faqs": [
      {
        "q": "Can you build a CRM for my industry?",
        "a": "Yes. See our live demos for real estate and immigration, and we tailor the fields and workflow to you."
      },
      {
        "q": "Can it connect to WhatsApp or email?",
        "a": "Yes. We can integrate messaging, email and forms so leads flow in automatically."
      }
    ]
  },
  "erp-software": {
    "audience": [
      "Manufacturers, distributors and retailers",
      "Growing companies outgrowing separate tools",
      "Businesses needing inventory and accounting together"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Phase and roll out",
        "body": "We deliver in phases, starting with your highest-value modules, with data migration and training."
      }
    ],
    "deliverables": [
      "Integrated ERP modules",
      "Role-based access and audit trails",
      "Data migration, training and support"
    ],
    "faqs": [
      {
        "q": "Do we need every module at once?",
        "a": "No. We usually start with the most important modules and add others over time."
      },
      {
        "q": "Can you import our existing data?",
        "a": "Yes. We clean and migrate data from spreadsheets and older systems."
      }
    ]
  },
  "pos-hrms-software": {
    "audience": [
      "Shops, cafes and restaurants",
      "Multi-branch retail businesses",
      "Companies managing staff attendance and payroll"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Set up and train",
        "body": "We configure the system for your products or staff policies and train your team."
      }
    ],
    "deliverables": [
      "POS billing or HRMS system",
      "Stock, attendance and payroll reports",
      "Training and go-live support"
    ],
    "faqs": [
      {
        "q": "Does the POS work with barcode scanners and printers?",
        "a": "Yes, common barcode scanners and receipt printers are supported."
      },
      {
        "q": "Can HRMS handle leave and payroll rules?",
        "a": "Yes. We configure your leave types, shifts and payroll rules."
      }
    ]
  },
  "ecommerce-development": {
    "audience": [
      "Brands selling products online",
      "Local shops going online",
      "Sellers wanting their own store, not just marketplaces"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Build and launch",
        "body": "We build your store, connect payments and shipping, and test the full checkout."
      }
    ],
    "deliverables": [
      "Online store with catalogue and checkout",
      "Payment gateway and shipping set-up",
      "Order, stock and sales reports"
    ],
    "faqs": [
      {
        "q": "Which payment methods can you add?",
        "a": "Cards, wallets and regional methods through gateways such as Stripe and others, depending on your country."
      },
      {
        "q": "Can you move my existing store?",
        "a": "Yes. We can migrate products, customers and orders."
      }
    ]
  },
  "ai-solutions": {
    "audience": [
      "Businesses wanting a 24/7 customer assistant",
      "Teams exploring AI features in their product",
      "Companies with knowledge bases or FAQs to automate"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Prototype, test, launch",
        "body": "We build a prototype on your content, test it for accuracy and safety, then launch and monitor."
      }
    ],
    "deliverables": [
      "AI chatbot or assistant on your site or WhatsApp",
      "Connection to your knowledge and tools",
      "Testing, safety checks and monitoring"
    ],
    "faqs": [
      {
        "q": "Will the AI make things up?",
        "a": "We ground answers in your approved content, add guardrails and hand off to a human when unsure."
      },
      {
        "q": "Is my data kept private?",
        "a": "We agree data handling in your proposal and use providers with suitable privacy terms."
      }
    ]
  },
  "automation-integrations": {
    "audience": [
      "Teams doing repetitive manual work",
      "Businesses with many disconnected tools",
      "Operations wanting automatic reports and alerts"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Automate and monitor",
        "body": "We build the workflows, test them with real data and add alerts for failures."
      }
    ],
    "deliverables": [
      "Automated workflows and approvals",
      "Integrations between your tools",
      "Reports and alerts"
    ],
    "faqs": [
      {
        "q": "Which tools can you connect?",
        "a": "Most tools with an API: CRMs, accounting, WhatsApp, email, payment and spreadsheet tools."
      },
      {
        "q": "What if an automation fails?",
        "a": "We add monitoring and alerts so problems are noticed and fixed quickly."
      }
    ]
  },
  "bug-fixing-maintenance": {
    "audience": [
      "Websites or apps with errors or slow pages",
      "Software built by a previous developer",
      "Businesses that want ongoing updates and security"
    ],
    "process": [
      {
        "title": "Report the issue",
        "body": "Send us a description, screenshots or access, and we confirm the problem."
      },
      {
        "title": "Diagnose and quote",
        "body": "We find the cause and give a fixed price per fix before starting."
      },
      {
        "title": "Fix and verify",
        "body": "We fix, test and confirm with you. Care plans cover ongoing updates and priority support."
      }
    ],
    "deliverables": [
      "Fixed bug with a summary of the cause",
      "Updates, security patches and backups",
      "Optional monthly care plan with priority replies"
    ],
    "faqs": [
      {
        "q": "Can you fix software you did not build?",
        "a": "Yes. We review the code, fix the problem and document what we changed."
      },
      {
        "q": "How fast can you respond?",
        "a": "Care plan customers get a reply within 1 business day, or faster with the priority upgrade."
      }
    ]
  },
  "ui-ux-design": {
    "audience": [
      "Products with low sign-up or conversion",
      "Teams without a consistent design system",
      "Founders validating an interface"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Design and test",
        "body": "We design the screens, build a clickable prototype and test it with real users."
      }
    ],
    "deliverables": [
      "User flows and wireframes",
      "Clickable prototype",
      "Design system and brand kit"
    ],
    "faqs": [
      {
        "q": "Do you design for mobile too?",
        "a": "Yes. Every design covers desktop, tablet and mobile."
      },
      {
        "q": "Can you work with our existing brand?",
        "a": "Yes. We follow your brand or help create one."
      }
    ]
  },
  "seo-digital-marketing": {
    "audience": [
      "Businesses not showing up in search",
      "New websites that need traffic",
      "Brands that want consistent content"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Optimise monthly",
        "body": "We fix technical issues, publish content and report on results every month."
      }
    ],
    "deliverables": [
      "Technical SEO fixes and keyword plan",
      "Blog or content articles each month",
      "Monthly performance report"
    ],
    "faqs": [
      {
        "q": "Can you guarantee rankings?",
        "a": "No one honestly can. We focus on proven improvements and measurable growth in qualified traffic."
      },
      {
        "q": "Do you handle social media?",
        "a": "Yes, content planning and posting can be included."
      }
    ]
  },
  "cloud-hosting-devops": {
    "audience": [
      "Businesses needing reliable hosting",
      "Teams without automated deployments",
      "Apps that need backups and monitoring"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Set up and monitor",
        "body": "We set up hosting, deployment and backups, then monitor uptime."
      }
    ],
    "deliverables": [
      "Managed hosting with SSL",
      "Automated deployments",
      "Backups and uptime monitoring"
    ],
    "faqs": [
      {
        "q": "Can you move my site to better hosting?",
        "a": "Yes. We migrate with minimal downtime."
      },
      {
        "q": "Do you provide backups?",
        "a": "Yes. Automated backups are included and can be restored on request."
      }
    ]
  },
  "security-audit": {
    "audience": [
      "Websites handling customer data",
      "Businesses preparing for client security reviews",
      "Teams worried after a suspected breach"
    ],
    "process": [
      {
        "title": "Free call",
        "body": "A free 30-minute conversation to understand your goals, users and budget."
      },
      {
        "title": "Proposal",
        "body": "You receive a fixed scope, timeline and price to approve before any work starts."
      },
      {
        "title": "Review and harden",
        "body": "We review your site or software, fix what we can and report the rest by priority."
      }
    ],
    "deliverables": [
      "Vulnerability review",
      "Hardening of key issues",
      "Report with prioritised recommendations"
    ],
    "faqs": [
      {
        "q": "Is this a formal certification?",
        "a": "No. It is a practical security review and does not replace an independent audit."
      },
      {
        "q": "Will testing disrupt my site?",
        "a": "We plan reviews to avoid downtime and agree timing with you first."
      }
    ]
  },
  "technology-consulting": {
    "audience": [
      "Founders deciding what to build",
      "Teams unsure about technology, vendors or costs",
      "Anyone who wants an expert opinion before committing"
    ],
    "process": [
      {
        "title": "Book your free call",
        "body": "Pick a time for your free 30-minute consultation, with no obligation."
      },
      {
        "title": "Talk it through",
        "body": "We listen, ask questions and give honest advice on the best approach."
      },
      {
        "title": "Decide what next",
        "body": "Leave with clear next steps, and a proposal if you want us to build it."
      }
    ],
    "deliverables": [
      "30 minutes free, with an expert on video",
      "Honest recommendations and rough scope",
      "Optional 60-minute deep-dive with written summary"
    ],
    "faqs": [
      {
        "q": "Is the first 30 minutes really free?",
        "a": "Yes, with no obligation and no card required."
      },
      {
        "q": "What if I need more time?",
        "a": "You can book a 60-minute deep-dive at a fixed price, with a written summary."
      }
    ]
  }
};

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
