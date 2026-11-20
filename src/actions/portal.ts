"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { endClientSession, requireClient, signLoginToken } from "@/lib/client-auth";
import { getDb } from "@/lib/db";
import { rateLimit, sendEmail } from "@/lib/leads";
import { deliver, mailConfigured } from "@/lib/mailer";
import { siteOrigin } from "@/lib/stripe";

const email = z.string().trim().toLowerCase().email().max(190);
const ip = async () => (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

export type LoginState = { ok: boolean; message?: string; error?: string; devLink?: string };

/**
 * Emails a sign-in link. The reply is always the same whether or not the address is known,
 * so this cannot be used to discover who our clients are.
 */
export async function requestLogin(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const parsed = email.safeParse(fd.get("email"));
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." };
  const to = parsed.data;
  if (!rateLimit(`portal:${await ip()}`, 6, 15 * 60_000) || !rateLimit(`portal-to:${to}`, 3, 15 * 60_000)) return { ok: false, error: "Too many requests. Please try again in a few minutes." };

  const generic: LoginState = { ok: true, message: "If that email belongs to a BGeetech client, a sign-in link is on its way. It works for 15 minutes." };
  try {
    const db = await getDb();
    const [care, orders, bookings, tickets] = await Promise.all([
      db.CareSub.count({ where: { email: to } }),
      db.Order.count({ where: { email: to } }),
      db.Booking.count({ where: { email: to } }),
      db.Ticket.count({ where: { email: to } }),
    ]);
    if (care + orders + bookings + tickets === 0) return generic;

    const link = `${siteOrigin()}/portal/verify?token=${await signLoginToken(to)}`;
    if (!mailConfigured()) {
      // Only ever shown outside production, so a misconfigured live site can never hand out links.
      if (process.env.NODE_ENV !== "production") return { ...generic, devLink: link };
      return { ok: false, error: "Email sign-in is not available right now. Please contact us." };
    }
    await deliver({
      to,
      subject: "Your BGeetech sign-in link",
      html: `<p>Hi,</p><p>Use this link to sign in to your BGeetech client portal. It expires in 15 minutes and can be used on this device.</p><p><a href="${link}">Sign in to the portal</a></p><p>If you did not ask for this, you can ignore this email.</p>`,
    });
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  return generic;
}

export async function signOut() {
  await endClientSession();
  redirect("/portal/login");
}

const ticketSchema = z.object({
  subject: z.string().trim().min(4, "Add a short subject").max(200),
  message: z.string().trim().min(10, "Please describe the request (10+ characters)").max(5000),
  website: z.string().trim().max(190).optional(),
  priority: z.enum(["normal", "urgent"]).default("normal"),
});

export type TicketState = { ok: boolean; error?: string };

export async function createTicket(_prev: TicketState, fd: FormData): Promise<TicketState> {
  const client = await requireClient();
  const parsed = ticketSchema.safeParse({ subject: fd.get("subject"), message: fd.get("message"), website: fd.get("website") || undefined, priority: fd.get("priority") || "normal" });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  if (!rateLimit(`ticket:${client.email}`, 8, 60 * 60_000)) return { ok: false, error: "You have sent several requests already. Please wait a little." };

  const d = parsed.data;
  const ref = `TK-${randomBytes(4).toString("hex").toUpperCase()}`;
  const db = await getDb();
  const t = await db.Ticket.create({ ref, email: client.email, subject: d.subject, website: d.website, priority: d.priority, status: "open" });
  await db.TicketMessage.create({ ticketId: (t.get("id") as number), author: "client", body: d.message });
  void sendEmail(`${d.priority === "urgent" ? "URGENT " : ""}New support request ${ref}: ${d.subject}`, { ref, from: client.email, website: d.website, priority: d.priority, message: d.message }, client.email).catch(() => {});
  redirect(`/portal/tickets/${ref}`);
}

export async function replyTicket(ref: string, _prev: TicketState, fd: FormData): Promise<TicketState> {
  const client = await requireClient();
  const body = z.string().trim().min(2, "Write a reply").max(5000).safeParse(fd.get("message"));
  if (!body.success) return { ok: false, error: body.error.issues[0]?.message ?? "Write a reply" };
  if (!rateLimit(`reply:${client.email}`, 20, 60 * 60_000)) return { ok: false, error: "Too many messages. Please wait a little." };

  const db = await getDb();
  const t = await db.Ticket.findOne({ where: { ref, email: client.email } }); // only the owner can reply
  if (!t) return { ok: false, error: "Request not found." };
  await db.TicketMessage.create({ ticketId: t.get("id") as number, author: "client", body: body.data });
  await t.update({ status: "open" });
  void sendEmail(`Reply on ${ref}: ${t.get("subject")}`, { ref, from: client.email, message: body.data }, client.email).catch(() => {});
  revalidatePath(`/portal/tickets/${ref}`);
  return { ok: true };
}

export async function closeTicket(ref: string) {
  const client = await requireClient();
  const db = await getDb();
  await db.Ticket.update({ status: "closed" }, { where: { ref, email: client.email } });
  revalidatePath(`/portal/tickets/${ref}`);
  revalidatePath("/portal");
}
