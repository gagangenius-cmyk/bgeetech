import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ExternalLink, Inbox, LayoutDashboard, LogOut, MonitorPlay, ShoppingBag } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { logout } from "@/actions/auth";
import { AdminProviders } from "@/components/admin/providers";
import { Logo } from "@/components/logo";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Blog posts", icon: BookOpen },
  { href: "/admin/demos", label: "Demos", icon: MonitorPlay },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/orders", label: "Website orders", icon: ShoppingBag },
];

// Session is verified here for every admin page (the proxy alone is not trusted).
async function Shell({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  return (
    <AdminProviders>
      <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
        <aside className="border-b border-border bg-ink p-4 text-white md:sticky md:top-0 md:h-dvh md:border-b-0 md:border-r md:p-5">
          <div className="flex items-center justify-between md:block">
            <Logo onDark />
            <p className="hidden pt-1 text-xs text-white/50 md:block">Admin panel</p>
          </div>
          <nav aria-label="Admin" className="mt-4 flex gap-1 overflow-x-auto md:mt-8 md:flex-col">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="flex min-h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                <l.icon className="size-4" aria-hidden /> {l.label}
              </Link>
            ))}
            <Link href="/" target="_blank" className="flex min-h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white">
              <ExternalLink className="size-4" aria-hidden /> View site
            </Link>
          </nav>
          <div className="mt-4 hidden border-t border-white/10 pt-4 text-xs text-white/60 md:block">
            <p className="truncate">{session.email}</p>
            <form action={logout}>
              <button type="submit" className="mt-2 inline-flex min-h-9 items-center gap-2 font-semibold text-amber-300 hover:text-amber-200">
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </div>
        </aside>
        <div className="min-w-0 p-4 sm:p-8">
          <form action={logout} className="mb-4 flex justify-end md:hidden">
            <button type="submit" className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-brand">
              <LogOut className="size-4" /> Sign out
            </button>
          </form>
          {children}
        </div>
      </div>
    </AdminProviders>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-muted-foreground">Loading...</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
