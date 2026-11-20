import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { setTicketStatus } from "@/actions/admin-tickets";
import { TicketReply } from "@/components/admin/ticket-reply";
import { StatusBadge } from "@/components/portal-ui";
import { getTicketThread } from "@/lib/portal-data";
import { cn } from "@/lib/utils";

const stamp = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

async function Thread({ params }: { params: PageProps<"/admin/tickets/[ref]">["params"] }) {
  const { ref } = await params;
  const data = await getTicketThread(ref, null); // admin layout already verified the session
  if (!data) notFound();
  const { ticket, messages } = data;
  return (
    <div className="max-w-3xl">
      <Link href="/admin/tickets" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> All requests
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground">
            {ticket.ref} · {ticket.email}
            {ticket.website ? ` · ${ticket.website}` : ""}
          </p>
        </div>
        <span className="flex items-center gap-2">
          {ticket.priority === "urgent" && <StatusBadge status="urgent" />}
          <StatusBadge status={ticket.status} />
        </span>
      </div>

      <ol className="mt-6 space-y-3">
        {messages.map((m) => (
          <li key={m.id} className={cn("rounded-2xl border p-4", m.author === "team" ? "border-brand/40 bg-brand/5" : "border-border bg-card")}>
            <p className="text-xs font-semibold text-muted-foreground">
              {m.author === "team" ? "Team" : "Client"} · {stamp(m.createdAt)}
            </p>
            <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-4">
        <TicketReply refId={ticket.ref} />
        <div className="flex flex-wrap gap-2">
          {(["open", "answered", "closed"] as const).map((s) => (
            <form key={s} action={setTicketStatus.bind(null, ticket.ref, s)}>
              <button type="submit" disabled={ticket.status === s} className="min-h-10 rounded-full border border-border px-4 text-sm font-semibold capitalize hover:bg-muted disabled:opacity-40">
                Mark {s}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminTicketPage({ params }: PageProps<"/admin/tickets/[ref]">) {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-muted" />}>
      <Thread params={params} />
    </Suspense>
  );
}
