import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CalendarCheck, LifeBuoy, LogOut, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { signOut } from "@/actions/portal";
import { PortalShell, StatusBadge } from "@/components/portal-ui";
import { requireClient } from "@/lib/client-auth";
import { getPortalData } from "@/lib/portal-data";
import { carePlans } from "@/lib/site";

export const metadata: Metadata = { title: "Client portal", robots: { index: false, follow: false } };

const when = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const money = (cents: number, cur: string) => new Intl.NumberFormat("en", { style: "currency", currency: cur.toUpperCase(), maximumFractionDigits: 0 }).format(cents / 100);

function Card({ icon: Icon, title, action, children }: { icon: typeof LifeBuoy; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <Icon className="size-5 text-brand" aria-hidden /> {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground">{children}</p>;

async function Dashboard() {
  const client = await requireClient();
  const d = await getPortalData(client.email);
  return (
    <PortalShell wide title="Welcome back" sub={client.email}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/portal/tickets/new" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-strong px-6 font-semibold text-white">
          <Plus className="size-4" aria-hidden /> New support request
        </Link>
        <form action={signOut}>
          <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold hover:bg-muted">
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card icon={ShieldCheck} title="Care plans" action={<Link href="/care" className="text-sm font-semibold text-brand hover:underline">View plans</Link>}>
          {d.care.length === 0 ? (
            <Empty>No active care plan yet. A plan keeps your site updated, backed up and monitored.</Empty>
          ) : (
            <ul className="space-y-3">
              {d.care.map((c) => (
                <li key={c.ref} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-semibold capitalize">{carePlans.find((p) => p.id === c.planId)?.name ?? c.planId} plan</p>
                    <p className="text-sm text-muted-foreground">
                      {c.website} · {money(c.amountCents, c.currency)}/month · since {when(c.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted-foreground">To change or cancel a plan, send us a support request.</p>
        </Card>

        <Card icon={LifeBuoy} title="Support requests">
          {d.tickets.length === 0 ? (
            <Empty>No requests yet. Ask for a fix or a change any time.</Empty>
          ) : (
            <ul className="divide-y divide-border">
              {d.tickets.map((t) => (
                <li key={t.ref}>
                  <Link href={`/portal/tickets/${t.ref}`} className="flex min-h-14 items-center justify-between gap-3 py-3 hover:text-brand">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{t.subject}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.ref} · updated {when(t.updatedAt)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {t.priority === "urgent" && <StatusBadge status="urgent" />}
                      <StatusBadge status={t.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card icon={ShoppingBag} title="Website orders">
          {d.orders.length === 0 ? (
            <Empty>
              No website orders.{" "}
              <Link href="/builder" className="font-semibold text-brand hover:underline">
                Design a website
              </Link>
            </Empty>
          ) : (
            <ul className="space-y-3">
              {d.orders.map((o) => (
                <li key={o.ref} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-semibold">{o.businessName}</p>
                    <p className="text-sm text-muted-foreground">
                      {o.domain} · {o.tier} {o.cycle} · {o.ref}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card icon={CalendarCheck} title="Consultations" action={<Link href="/book" className="text-sm font-semibold text-brand hover:underline">Book a call</Link>}>
          {d.bookings.length === 0 ? (
            <Empty>No consultations booked yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {d.bookings.map((b) => (
                <li key={b.ref} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-semibold">{b.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.slotDate} at {b.slotTime} · {b.minutes} min
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PortalShell>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <Dashboard />
    </Suspense>
  );
}
