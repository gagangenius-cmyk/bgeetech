// Industry landing pages. Each page speaks to one kind of business: its everyday problems, what we build for it,
// and answers to its common questions. All prices come from site.ts, so nothing here invents numbers.

export type Vertical = {
  slug: string;
  name: string;
  short: string;
  headline: string;
  intro: string;
  pains: string[];
  solutions: { title: string; body: string; service: string }[];
  demoCategories: string[];
  faqs: { q: string; a: string }[];
  artService: string;
};

export const verticals: Vertical[] = [
  {
    slug: "real-estate",
    name: "Real estate",
    short: "Listings, leads and site visits in one place.",
    headline: "Software and websites for real estate agencies",
    intro: "Property businesses live and die by how fast they follow up. We build listing websites and CRMs that capture every enquiry, track every viewing and remind your team before a deal goes cold.",
    pains: ["Enquiries from portals, WhatsApp and calls get lost across different apps", "Agents forget follow-ups and site visits", "Listings are updated by hand on several channels"],
    solutions: [
      { title: "Real estate CRM", body: "Leads, listings, site visits and deal pipeline with automatic reminders and agent dashboards.", service: "crm-software" },
      { title: "Property website", body: "A fast, searchable listings site with enquiry forms and WhatsApp buttons that works well on phones.", service: "website-development" },
      { title: "WhatsApp and lead automation", body: "New enquiries are logged, assigned and answered within a minute, even at night.", service: "automation-integrations" },
    ],
    demoCategories: ["CRM"],
    faqs: [
      { q: "Can the CRM import listings and leads from my current spreadsheets?", a: "Yes. We import existing contacts and listings during setup so your team starts with clean data, not an empty system." },
      { q: "Can customers search properties on the website?", a: "Yes. We build searchable listings with filters such as location, type, price and bedrooms, and connect them to the CRM so every enquiry is tracked." },
    ],
    artService: "crm-software",
  },
  {
    slug: "immigration-consultants",
    name: "Immigration consultants",
    short: "Case tracking, documents and client updates.",
    headline: "Case management software for immigration consultants",
    intro: "Immigration work runs on documents, deadlines and clear communication. We build case-tracking systems that keep every client file organised and every deadline visible.",
    pains: ["Documents arrive by email and chat and are hard to find later", "Missed deadlines and unclear case status cause stress", "Clients keep asking for updates"],
    solutions: [
      { title: "Immigration CRM", body: "Client records, case stages, document checklists, deadlines and automated reminders.", service: "crm-software" },
      { title: "Client portal and forms", body: "Clients upload documents and see their case status without calling you.", service: "web-app-development" },
      { title: "Eligibility and enquiry flow", body: "A guided online form that qualifies leads before your team spends time on them.", service: "automation-integrations" },
    ],
    demoCategories: ["CRM"],
    faqs: [
      { q: "Is client data kept private?", a: "We build with role-based access, encrypted connections and regular backups, and can run a security review before launch." },
      { q: "Can the system remind clients about missing documents?", a: "Yes. Automatic email or WhatsApp reminders go out when a document is missing or a deadline is near." },
    ],
    artService: "crm-software",
  },
  {
    slug: "clinics-healthcare",
    name: "Clinics and healthcare",
    short: "Appointments, records and patient communication.",
    headline: "Websites and software for clinics and healthcare providers",
    intro: "Patients expect to book online and get reminders. We build clinic websites and management tools that cut no-shows and free your staff from phone calls.",
    pains: ["Phone-based booking ties up reception", "No-shows waste doctor time", "Patient information is scattered or on paper"],
    solutions: [
      { title: "Online appointment booking", body: "Patients choose a doctor and a time, and get reminders by email or WhatsApp.", service: "web-app-development" },
      { title: "Clinic management software", body: "Patient records, visits, billing and reports in one secure system.", service: "erp-software" },
      { title: "Security review", body: "A check of how patient data is stored and who can see it, with clear fixes.", service: "security-audit" },
    ],
    demoCategories: ["Healthcare"],
    faqs: [
      { q: "Do you handle health-data privacy rules?", a: "We design for privacy from the start: limited access, encryption and audit trails. Your legal team should confirm the rules that apply in your country." },
      { q: "Can patients book and pay online?", a: "Yes. We can add online booking with optional online payments." },
    ],
    artService: "security-audit",
  },
  {
    slug: "restaurants-cafes",
    name: "Restaurants and cafes",
    short: "Billing, online ordering and stock.",
    headline: "POS and ordering systems for restaurants and cafes",
    intro: "A busy counter needs fast billing and simple reports. We build POS systems and ordering websites that work on the devices you already own.",
    pains: ["Slow billing at peak hours", "Stock runs out unexpectedly", "No clear view of daily sales"],
    solutions: [
      { title: "POS and billing", body: "Fast touch billing, tables, taxes, split bills and daily sales reports, with offline mode.", service: "pos-hrms-software" },
      { title: "Online ordering website", body: "Customers order and pay from your own site, so you keep more of every sale.", service: "ecommerce-development" },
      { title: "Staff and shift management", body: "Attendance, shifts and payroll without spreadsheets.", service: "pos-hrms-software" },
    ],
    demoCategories: ["POS", "Hospitality"],
    faqs: [
      { q: "Will the POS work if the internet drops?", a: "Yes. Billing continues offline and syncs when the connection returns." },
      { q: "Can it track ingredients and stock?", a: "Yes. We can add inventory with low-stock alerts and purchase tracking." },
    ],
    artService: "pos-hrms-software",
  },
  {
    slug: "retail-ecommerce",
    name: "Retail and e-commerce",
    short: "Online stores, stock and payments.",
    headline: "Online stores and retail software that sell",
    intro: "Whether you sell from a shop, online or both, your stock, orders and payments should agree with each other. We build stores and back-office tools that do.",
    pains: ["Online and in-store stock never match", "Checkout loses customers", "Manual order and invoice work"],
    solutions: [
      { title: "E-commerce store", body: "A fast, mobile-first store with secure payments in several currencies.", service: "ecommerce-development" },
      { title: "POS and inventory", body: "One stock count across the shop and the website.", service: "pos-hrms-software" },
      { title: "Order automation", body: "Orders flow to accounting, shipping and customer messages automatically.", service: "automation-integrations" },
    ],
    demoCategories: ["POS"],
    faqs: [
      { q: "Can customers pay in AED, INR and USD?", a: "Yes. We support multi-currency checkout with a payment provider such as Stripe." },
      { q: "Can you migrate my existing store?", a: "Yes. We move products, customers and orders, and keep your search rankings with correct redirects." },
    ],
    artService: "ecommerce-development",
  },
  {
    slug: "education-training",
    name: "Education and training",
    short: "Admissions, classes and student records.",
    headline: "Software for schools, institutes and training centres",
    intro: "Education businesses juggle admissions, fees, timetables and parent communication. We build tools that keep it organised and visible.",
    pains: ["Admission enquiries are tracked on paper or chat", "Fee reminders and attendance take hours", "Parents and students want online access"],
    solutions: [
      { title: "Admissions CRM", body: "Capture enquiries, track follow-ups and convert more of them into admissions.", service: "crm-software" },
      { title: "Student management system", body: "Records, attendance, fees, timetables and reports.", service: "erp-software" },
      { title: "Website and course pages", body: "A clear website with course details, online enquiry and booking.", service: "website-development" },
    ],
    demoCategories: ["Education", "CRM"],
    faqs: [
      { q: "Can parents see attendance and fee status online?", a: "Yes. We can add a simple parent and student portal with the information you choose to share." },
      { q: "Can we run online classes?", a: "We can integrate video classes and course content into your website or app." },
    ],
    artService: "web-app-development",
  },
  {
    slug: "logistics",
    name: "Logistics and operations",
    short: "Orders, stock and delivery tracking.",
    headline: "Operations software for logistics and trading companies",
    intro: "When orders, stock and deliveries live in different spreadsheets, errors multiply. We build ERP-style systems that connect them.",
    pains: ["Stock counts and orders disagree", "Deliveries are tracked on calls and messages", "Month-end reporting takes days"],
    solutions: [
      { title: "ERP and inventory", body: "Purchasing, stock, sales and accounts connected in one system.", service: "erp-software" },
      { title: "Workflow automation", body: "Orders, invoices and delivery updates move automatically between systems.", service: "automation-integrations" },
      { title: "Dashboards and reports", body: "See orders, stock and cash at a glance, not at month end.", service: "web-app-development" },
    ],
    demoCategories: ["Operations"],
    faqs: [
      { q: "Can we start with one module?", a: "Yes. Most clients start with the area that hurts most, such as inventory, then add modules over time." },
      { q: "Can it connect to our accounting software?", a: "Usually yes. We build integrations with common accounting and shipping tools." },
    ],
    artService: "erp-software",
  },
  {
    slug: "startups-saas",
    name: "Startups and SaaS",
    short: "Launch an MVP and grow it.",
    headline: "Build your MVP and grow your SaaS product",
    intro: "Startups need to launch fast and learn from real users. We build lean first versions on foundations that can grow with you.",
    pains: ["Limited budget and a tight deadline", "Unclear which features matter most", "Fear of rebuilding everything later"],
    solutions: [
      { title: "MVP development", body: "The smallest useful version of your product, built quickly and tested with real users.", service: "web-app-development" },
      { title: "Mobile app", body: "iOS and Android apps, or an installable web app to start cheaper.", service: "mobile-app-development" },
      { title: "Technology consulting", body: "Pick the right stack, scope and plan before you spend on development.", service: "technology-consulting" },
    ],
    demoCategories: [],
    faqs: [
      { q: "Can you help me scope an MVP?", a: "Yes. The free 30-minute consultation is a good place to start, and we can then prepare a fixed-scope proposal." },
      { q: "Who owns the code?", a: "Agree ownership in writing before work starts. Ask us to confirm it in your proposal." },
    ],
    artService: "web-app-development",
  },
];

export const verticalBySlug = (slug: string) => verticals.find((v) => v.slug === slug);
