import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { getDb, plain } from "@/lib/db";
import { StatusBadge } from "@/components/portal-ui";

async function List() {
  await connection();
  const db = await getDb();
  const rows = (await db.Ticket.findAll({ order: [["updatedAt", "DESC"]], limit: 200 })).map((r) => plain<Record<string, unknown>>(r)!);
  const order = { open: 0, answered: 1, closed: 2 } as Record<string, number>;
  rows.sort((a, b) => (order[String(a.status)] ?? 3) - (order[String(b.status)] ?? 3));
  if (rows.length === 0) return <p className="text-muted-foreground">No support requests yet.</p>;
  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
      {rows.map((t) => (
        <li key={String(t.ref)}>
          <Link href={`/admin/tickets/${t.ref}`} className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-5 py-3 hover:bg-muted">
            <span className="min-w-0">
              <span className="block truncate font-semibold">{String(t.subject)}</span>
              <span className="text-xs text-muted-foreground">
                {String(t.ref)} · {String(t.email)}
                {t.website ? ` · ${String(t.website)}` : ""}
              </span>
            </span>
            <span className="flex items-center gap-2">
              {t.priority === "urgent" && <StatusBadge status="urgent" />}
              <StatusBadge status={String(t.status)} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AdminTickets() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Support requests</h1>
      <p className="mt-1 text-muted-foreground">Open requests are listed first. Replying emails the client a link to the portal.</p>
      <div className="mt-6">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-muted" />}>
          <List />
        </Suspense>
      </div>
    </div>
  );
}
