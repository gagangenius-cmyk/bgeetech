// Shared (client + server) description of each admin resource. No server-only imports here.

export type FieldType = "text" | "textarea" | "markdown" | "select" | "checkbox" | "number" | "url" | "date";
export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  required?: boolean;
  placeholder?: string;
};
export type ColumnDef = { key: string; label: string; kind?: "text" | "bool" | "date" | "badge" | "money" };
export type ResourceConfig = {
  key: string;
  label: string;
  singular: string;
  canCreate: boolean;
  canDelete: boolean;
  columns: ColumnDef[];
  fields: FieldDef[];
  searchHint: string;
  exportable?: boolean;
};

const statusLead = ["new", "contacted", "won", "lost"];
const statusOrder = ["pending", "paid", "confirmed", "cancelled"];

export const resourceConfigs: Record<string, ResourceConfig> = {
  posts: {
    key: "posts",
    label: "Blog posts",
    singular: "post",
    canCreate: true,
    canDelete: true,
    searchHint: "Search title or category",
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category", kind: "badge" },
      { key: "published", label: "Published", kind: "bool" },
      { key: "publishedAt", label: "Date", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", help: "Leave empty to generate from the title" },
      { name: "category", label: "Category", type: "text", placeholder: "Guides" },
      { name: "excerpt", label: "Short summary", type: "textarea", help: "Shown on the blog list and in search results" },
      { name: "body", label: "Content", type: "markdown", help: "Use ## for headings, - for bullet points, **bold**, [link](https://...)" },
      { name: "coverUrl", label: "Cover image URL", type: "url" },
      { name: "publishedAt", label: "Publish date", type: "date" },
      { name: "published", label: "Published", type: "checkbox", help: "Unpublished posts are hidden from the website" },
    ],
  },
  demos: {
    key: "demos",
    label: "Demos",
    singular: "demo",
    canCreate: true,
    canDelete: true,
    searchHint: "Search title or category",
    columns: [
      { key: "title", label: "Demo" },
      { key: "category", label: "Category", kind: "badge" },
      { key: "url", label: "Live URL" },
      { key: "published", label: "Published", kind: "bool" },
      { key: "sortOrder", label: "Order" },
    ],
    fields: [
      { name: "title", label: "Demo name", type: "text", required: true, placeholder: "Real Estate CRM" },
      { name: "slug", label: "URL slug", type: "text", help: "Leave empty to generate from the name" },
      { name: "category", label: "Category", type: "text", placeholder: "CRM, POS, HRMS...", help: "Used for the filter chips on /demos" },
      { name: "summary", label: "Short summary", type: "textarea" },
      { name: "description", label: "Full description", type: "markdown" },
      { name: "features", label: "Key features", type: "textarea", help: "One feature per line" },
      { name: "url", label: "Live demo URL", type: "url", help: "Leave empty to show 'Request a demo' instead" },
      { name: "demoUser", label: "Demo login (optional)", type: "text", help: "Shown publicly. Use a dedicated demo account only." },
      { name: "demoPass", label: "Demo password (optional)", type: "text", help: "Shown publicly. Never use a real password." },
      { name: "imageUrl", label: "Screenshot URL", type: "url" },
      { name: "sortOrder", label: "Sort order", type: "number", help: "Lower numbers appear first" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
  },
  bookings: {
    key: "bookings",
    label: "Bookings",
    singular: "booking",
    canCreate: false,
    canDelete: false,
    exportable: true,
    searchHint: "Search reference, name, email or service",
    columns: [
      { key: "createdAt", label: "Booked", kind: "date" },
      { key: "ref", label: "Reference" },
      { key: "service", label: "Service" },
      { key: "slotDate", label: "Session date" },
      { key: "slotTime", label: "Time" },
      { key: "minutes", label: "Minutes" },
      { key: "name", label: "Client" },
      { key: "amountCents", label: "Total", kind: "money" },
      { key: "status", label: "Status", kind: "badge" },
    ],
    fields: [
      { name: "status", label: "Status", type: "select", options: statusOrder },
      { name: "notes", label: "Internal notes", type: "textarea" },
    ],
  },
  leads: {
    key: "leads",
    label: "Leads",
    singular: "lead",
    canCreate: false,
    canDelete: true,
    exportable: true,
    searchHint: "Search name, email or service",
    columns: [
      { key: "createdAt", label: "Received", kind: "date" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "service", label: "Interested in" },
      { key: "source", label: "Source", kind: "badge" },
      { key: "status", label: "Status", kind: "badge" },
    ],
    fields: [
      { name: "status", label: "Status", type: "select", options: statusLead },
      { name: "notes", label: "Internal notes", type: "textarea" },
    ],
  },
  orders: {
    key: "orders",
    label: "Website orders",
    singular: "order",
    canCreate: false,
    canDelete: false,
    exportable: true,
    searchHint: "Search reference, business, domain or email",
    columns: [
      { key: "createdAt", label: "Date", kind: "date" },
      { key: "ref", label: "Reference" },
      { key: "businessName", label: "Business" },
      { key: "domain", label: "Domain" },
      { key: "industry", label: "Industry" },
      { key: "tier", label: "Plan", kind: "badge" },
      { key: "cycle", label: "Billing" },
      { key: "amountCents", label: "Total", kind: "money" },
      { key: "status", label: "Status", kind: "badge" },
    ],
    fields: [
      { name: "status", label: "Status", type: "select", options: statusOrder },
      { name: "notes", label: "Internal notes", type: "textarea" },
    ],
  },
};
