import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { closeTicket } from "@/actions/portal";
import { ReplyForm } from "@/components/portal-forms";
import { PortalShell, StatusBadge } from "@/components/portal-ui";
import { requireClient } from "@/lib/client-auth";
import { getTicketThread } from "@/lib/portal-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Support request", robots: { index: false, follow: false } };

const stamp = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

async function Thread({ params }: { params: PageProps<"/portal/tickets/[ref]">["params"] }) {
  const { ref } = await params;
  const client = await requireClient();
  const data = await getTicketThread(ref, client.email); // scoped to the signed-in client, so other clients tickets are never found
  if (!data) notFound();
  const { ticket, messages } = data;
  return (
    <PortalShell title={ticket.subject} sub={`${ticket.ref}${ticket.website ? ` · ${ticket.website}` : ""}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/portal" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand hover:underline">
          <ArrowLeft className="size-4" aria-hidden /> All requests
        </Link>
        <span className="flex items-center gap-2">
          {ticket.priority === "urgent" && <StatusBadge status="urgent" />}
          <StatusBadge status={ticket.status} />
        </span>
      </div>
      <ol className="space-y-4">
        {messages.map((m) => (
          <li key={m.id} className={cn("rounded-3xl border p-5", m.author === "team" ? "border-brand/40 bg-brand/5" : "border-border bg-card")}>
            <p className="text-xs font-semibold text-muted-foreground">
              {m.author === "team" ? "BGeetech team" : "You"} · {stamp(m.createdAt)}
            </p>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{m.body}</p>
          </li>
        ))}
      </ol>
      {ticket.status !== "closed" ? (
        <div className="mt-8 space-y-4">
          <ReplyForm refId={ticket.ref} />
          <form action={closeTicket.bind(null, ticket.ref)}>
            <button type="submit" className="min-h-10 text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline">
              Mark as resolved
            </button>
          </form>
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">This request is closed. Need more help? Start a new request.</p>
      )}
    </PortalShell>
  );
}

export default function TicketPage({ params }: PageProps<"/portal/tickets/[ref]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <Thread params={params} />
    </Suspense>
  );
}
