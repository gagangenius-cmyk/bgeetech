import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

// RFC 9116 security contact. Renew the Expires date at least once a year.
export function GET() {
  const body = [
    `Contact: mailto:${site.email}`,
    "Expires: 2027-11-18T00:00:00.000Z",
    "Preferred-Languages: en",
    `Canonical: ${absoluteUrl("/.well-known/security.txt")}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
