"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { rateLimit } from "@/lib/leads";

const schema = z.object({ email: z.string().trim().email().max(190), password: z.string().min(1).max(200) });

export type LoginState = { error?: string };

// Compared against when the email is unknown so response time does not reveal which emails exist.
let dummyHash: string | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const email = parsed.data.email.toLowerCase();
  if (!rateLimit(`login:ip:${ip}`, 10, 15 * 60_000) || !rateLimit(`login:em:${email}`, 5, 15 * 60_000)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }

  type AdminRow = { id: number; email: string; passwordHash: string };
  let user = null as AdminRow | null;
  try {
    const db = await getDb();
    user = ((await db.AdminUser.findOne({ where: { email } }))?.get({ plain: true }) as AdminRow | undefined) ?? null;
  } catch {
    return { error: "The database is unavailable. Check the server configuration." };
  }

  dummyHash ??= await bcrypt.hash("not-a-real-password", 12);
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? dummyHash);
  if (!user || !ok) return { error: "Incorrect email or password." };

  await createSession({ uid: user.id, email: user.email });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
