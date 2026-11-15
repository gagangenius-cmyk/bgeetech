import { BookOpen, Inbox, MonitorPlay, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { getDb } from "@/lib/db";

async function counts() {
  try {
    const db = await getDb();
    const [newLeads, leads, orders, paidOrders, posts, demos, recent] = await Promise.all([
      db.Lead.count({ where: { status: "new" } }),
      db.Lead.count(),
      db.Order.count(),
      db.Order.count({ where: { status: "paid" } }),
      db.Post.count(),
      db.Demo.count(),
      db.Lead.findAll({ order: [["id", "DESC"]], limit: 6 }),
    ]);
    return { ok: true as const, newLeads, leads, orders, paidOrders, posts, demos, recent: recent.map((r) => r.get({ plain: true }) as Record<string, string>) };
  } catch {
    return { ok: false as const };
  }
}

export default async function Dashboard() {
  await connection(); // request-time only: reads the database
  const c = await counts();
  if (!c.ok)
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <h1 className="font-display text-xl font-bold">Database unavailable</h1>
        <p className="mt-2 text-sm">Check DB_HOST, DB_NAME, DB_USER and DB_PASS in your environment, and that MySQL is running.</p>
      </div>
    );

  const cards = [
    { label: "New leads", value: c.newLeads, sub: `${c.leads} total`, href: "/admin/leads", icon: Inbox },
    { label: "Website orders", value: c.orders, sub: `${c.paidOrders} paid`, href: "/admin/orders", icon: ShoppingBag },
    { label: "Blog posts", value: c.posts, sub: "manage content", href: "/admin/posts", icon: BookOpen },
    { label: "Demos", value: c.demos, sub: "CRM, POS, HRMS...", href: "/admin/demos", icon: MonitorPlay },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((k) => (
          <Link key={k.label} href={k.href} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10">
            <k.icon className="size-5 text-brand" aria-hidden />
            <p className="mt-3 font-display text-4xl font-extrabold tabular-nums">{k.value}</p>
            <p className="text-sm font-semibold">{k.label}</p>
            <p className="text-xs text-muted-foreground">{k.sub}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-bold">Latest leads</h2>
      <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
        {c.recent.length === 0 && <p className="p-6 text-sm text-muted-foreground">No leads yet.</p>}
        {c.recent.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-sm">
            <div>
              <p className="font-semibold">{l.name}</p>
              <p className="text-muted-foreground">{l.email}</p>
            </div>
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold capitalize">{l.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
