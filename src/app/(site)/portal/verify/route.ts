import { NextResponse } from "next/server";
import { startClientSession, verifyLoginToken } from "@/lib/client-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = await verifyLoginToken(url.searchParams.get("token") ?? "");
  const origin = process.env.SITE_URL?.replace(/\/$/, "") || url.origin;
  if (!email) return NextResponse.redirect(`${origin}/portal/login?error=1`);
  await startClientSession(email);
  const res = NextResponse.redirect(`${origin}/portal`);
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
