import type { Metadata } from "next";
import { Suspense } from "react";
import { NewTicketForm } from "@/components/portal-forms";
import { PortalShell } from "@/components/portal-ui";
import { requireClient } from "@/lib/client-auth";
import { getPortalData } from "@/lib/portal-data";

export const metadata: Metadata = { title: "New support request", robots: { index: false, follow: false } };

async function Page() {
  const client = await requireClient();
  const d = await getPortalData(client.email);
  const sites = [...new Set([...d.care.map((c) => c.website), ...d.orders.map((o) => o.domain)].filter(Boolean))];
  return (
    <PortalShell title="New support request" sub="Tell us what you need. We reply in the portal and by email.">
      <NewTicketForm websites={sites} />
    </PortalShell>
  );
}

export default function NewTicketPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <Page />
    </Suspense>
  );
}
