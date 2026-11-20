import "server-only";
import { connection } from "next/server";
import { Op } from "sequelize";
import { getDb, plain } from "@/lib/db";

export type PortalCare = { ref: string; planId: string; status: string; website: string; amountCents: number; currency: string; createdAt: string };
export type PortalOrder = { ref: string; status: string; tier: string; cycle: string; domain: string; businessName: string; createdAt: string };
export type PortalBooking = { ref: string; status: string; service: string; slotDate: string; slotTime: string; minutes: number };
export type PortalTicket = { ref: string; subject: string; status: string; priority: string; createdAt: string; updatedAt: string };
export type PortalMessage = { id: number; author: "client" | "team"; body: string; createdAt: string };

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v ?? ""));

/** Everything the client portal shows for one email address. Only ever called with the signed-in client's own email. */
export async function getPortalData(email: string) {
  await connection();
  const db = await getDb();
  const where = { email };
  const [care, orders, bookings, tickets] = await Promise.all([
    db.CareSub.findAll({ where: { ...where, status: { [Op.ne]: "pending" } }, order: [["id", "DESC"]] }),
    db.Order.findAll({ where, order: [["id", "DESC"]] }),
    db.Booking.findAll({ where, order: [["slotDate", "DESC"]], limit: 20 }),
    db.Ticket.findAll({ where, order: [["updatedAt", "DESC"]], limit: 50 }),
  ]);
  const rows = <T,>(list: unknown[]) => list.map((r) => plain<Record<string, unknown>>(r as never)!) as unknown as T[];
  return {
    care: rows<Record<string, unknown>>(care).map((r) => ({ ...r, createdAt: iso(r.createdAt) })) as unknown as PortalCare[],
    orders: rows<Record<string, unknown>>(orders).map((r) => ({ ...r, createdAt: iso(r.createdAt) })) as unknown as PortalOrder[],
    bookings: rows<Record<string, unknown>>(bookings) as unknown as PortalBooking[],
    tickets: rows<Record<string, unknown>>(tickets).map((r) => ({ ...r, createdAt: iso(r.createdAt), updatedAt: iso(r.updatedAt) })) as unknown as PortalTicket[],
  };
}

export async function getTicketThread(ref: string, email: string | null) {
  await connection();
  const db = await getDb();
  const t = await db.Ticket.findOne({ where: email ? { ref, email } : { ref } }); // email is null only for the admin view
  if (!t) return null;
  const ticket = plain<Record<string, unknown>>(t)!;
  const msgs = await db.TicketMessage.findAll({ where: { ticketId: ticket.id as number }, order: [["id", "ASC"]] });
  return {
    ticket: { ...ticket, createdAt: iso(ticket.createdAt), updatedAt: iso(ticket.updatedAt) } as unknown as PortalTicket & { id: number; email: string; name: string; website: string },
    messages: msgs.map((m) => {
      const r = plain<Record<string, unknown>>(m)!;
      return { ...r, createdAt: iso(r.createdAt) } as unknown as PortalMessage;
    }),
  };
}
