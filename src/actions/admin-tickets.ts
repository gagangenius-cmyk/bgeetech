"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { deliver } from "@/lib/mailer";
import { siteOrigin } from "@/lib/stripe";

export type ReplyState = { ok: boolean; error?: string };

/** Team reply on a support request. Emails the client a link to the portal. Admin only. */
export async function replyAsTeam(ref: string, _prev: ReplyState, fd: FormData): Promise<ReplyState> {
  await requireAdmin();
  const body = z.string().trim().min(2, "Write a reply").max(5000).safeParse(fd.get("message"));
  if (!body.success) return { ok: false, error: body.error.issues[0]?.message ?? "Write a reply" };

  const db = await getDb();
  const t = await db.Ticket.findOne({ where: { ref } });
  if (!t) return { ok: false, error: "Request not found." };
  await db.TicketMessage.create({ ticketId: t.get("id") as number, author: "team", body: body.data });
  await t.update({ status: "answered" });

  void deliver({
    to: String(t.get("email")),
    subject: `Update on your request ${ref}: ${t.get("subject")}`,
    html: `<p>We replied to your support request <b>${ref}</b>.</p><p><a href="${siteOrigin()}/portal/tickets/${ref}">Open the request in your client portal</a></p>`,
  }).catch(() => {});
  revalidatePath(`/admin/tickets/${ref}`);
  revalidatePath("/admin/tickets");
  return { ok: true };
}

export async function setTicketStatus(ref: string, status: "open" | "answered" | "closed") {
  await requireAdmin();
  const db = await getDb();
  await db.Ticket.update({ status }, { where: { ref } });
  revalidatePath(`/admin/tickets/${ref}`);
  revalidatePath("/admin/tickets");
}
