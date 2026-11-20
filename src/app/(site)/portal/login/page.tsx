import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/portal-forms";
import { PortalShell } from "@/components/portal-ui";
import { getClient } from "@/lib/client-auth";

export const metadata: Metadata = { title: "Client portal sign in", robots: { index: false, follow: false } };

async function Gate({ searchParams }: { searchParams: PageProps<"/portal/login">["searchParams"] }) {
  if (await getClient()) redirect("/portal");
  const sp = await searchParams;
  return (
    <PortalShell title="Sign in to your portal" sub="We email you a secure link. No password needed.">
      {sp.error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium">
          That sign-in link has expired or was already used. Enter your email to get a new one.
        </p>
      )}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <LoginForm />
      </div>
    </PortalShell>
  );
}

export default function PortalLogin({ searchParams }: PageProps<"/portal/login">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <Gate searchParams={searchParams} />
    </Suspense>
  );
}
