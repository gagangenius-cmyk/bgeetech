import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-ink px-5 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 size-[34rem] animate-aurora rounded-full bg-blue-600/35 blur-[110px]" />
        <div className="absolute -bottom-24 -right-24 size-[28rem] animate-aurora rounded-full bg-amber-400/25 blur-[110px] [animation-delay:-7s]" />
        <div className="grid-lines absolute inset-0" />
      </div>
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-white shadow-2xl backdrop-blur-xl">
        <Logo onDark />
        <h1 className="mt-6 font-display text-2xl font-extrabold">Admin sign in</h1>
        <p className="mt-1 text-sm text-white/60">Manage blog posts, demos, leads and orders.</p>
        <LoginForm />
      </div>
    </div>
  );
}
