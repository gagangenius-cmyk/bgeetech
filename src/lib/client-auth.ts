import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Passwordless client login: we email a short-lived signed link, opening it starts a session cookie.
// Clients never have a password to forget or leak. Admin sessions are a separate cookie with a different audience.

export const CLIENT_COOKIE = "bgee_client";
const SESSION_AGE = 60 * 60 * 24 * 7; // 7 days
const LINK_AGE = 15 * 60; // 15 minutes

function key() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (32+ characters)");
  return new TextEncoder().encode(s);
}

export async function signLoginToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience("client-login")
    .setIssuedAt()
    .setExpirationTime(`${LINK_AGE}s`)
    .sign(key());
}

export async function verifyLoginToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], audience: "client-login" });
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export async function startClientSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience("client")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_AGE}s`)
    .sign(key());
  (await cookies()).set(CLIENT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_AGE });
}

export async function endClientSession() {
  (await cookies()).delete(CLIENT_COOKIE);
}

export async function getClient(): Promise<{ email: string } | null> {
  const token = (await cookies()).get(CLIENT_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], audience: "client" });
    return typeof payload.email === "string" ? { email: payload.email } : null;
  } catch {
    return null;
  }
}

/** Guard for portal pages and actions. */
export async function requireClient() {
  const c = await getClient();
  if (!c) redirect("/portal/login");
  return c;
}
