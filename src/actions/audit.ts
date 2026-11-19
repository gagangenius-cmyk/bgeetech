"use server";

import { headers } from "next/headers";
import { auditSite, normalizeUrl, type AuditResult } from "@/lib/audit";
import { rateLimit } from "@/lib/leads";

export type AuditResponse = { ok: true; result: AuditResult } | { ok: false; error: string };

export async function runAudit(input: string): Promise<AuditResponse> {
  const url = normalizeUrl(String(input ?? ""));
  if (!url) return { ok: false, error: "Enter a public website address, for example yourcompany.com." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`audit:${ip}`, 6, 10 * 60_000)) return { ok: false, error: "You have run a few checks already. Please try again in a few minutes." };

  try {
    return { ok: true, result: await auditSite(url) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "blocked_address") return { ok: false, error: "That address cannot be checked. Please enter a public website." };
    if (/ENOTFOUND|EAI_AGAIN/.test(msg)) return { ok: false, error: "We could not find that website. Check the address and try again." };
    if (/timeout|ETIMEDOUT/i.test(msg)) return { ok: false, error: "The website took too long to respond. That itself is worth fixing! Try again, or contact us." };
    return { ok: false, error: "We could not read that website. It may block automated checks. Try another page or contact us for a manual review." };
  }
}
