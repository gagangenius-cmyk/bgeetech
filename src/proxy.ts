import { NextResponse, type NextRequest } from "next/server";

/**
 * First-line redirect only. Real authorization happens in the Data Access Layer
 * (requireAdmin / adminOrNull), which verifies the signed session on every page,
 * action and API call.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasCookie = req.cookies.has("bgee_admin");

  if (pathname.startsWith("/api/admin") && !hasCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !hasCookie) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
