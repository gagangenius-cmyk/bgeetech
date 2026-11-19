import "server-only";
import { lookup as dnsLookup } from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";

// A free, honest website health check. It reads ONE public page (plus robots.txt and sitemap.xml) the way a
// search engine would and reports what it can see. It is a quick review, not a full audit, and says so.

export type Status = "pass" | "warn" | "fail";
export type Check = { id: string; category: Category; label: string; status: Status; detail: string; fix?: string };
export type Category = "SEO" | "Speed" | "Mobile" | "Security";
export type AuditResult = {
  url: string;
  finalUrl: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  categories: { name: Category; score: number }[];
  checks: Check[];
  topFixes: string[];
  facts: { responseMs: number; htmlKb: number; scripts: number; images: number; compressed: boolean };
  checkedAt: string;
};

/* ---------- safe fetching (SSRF protection) ---------- */

function isPrivateIp(ip: string): boolean {
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::1" || v === "::" || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb") || v.startsWith("fc") || v.startsWith("fd")) return true;
    const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return mapped ? isPrivateIp(mapped[1]) : false;
  }
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

/** DNS lookup that refuses private, loopback and link-local addresses (also stops DNS rebinding, since this is the connect-time lookup). */
const safeLookup: typeof dnsLookup = ((host: string, options: unknown, cb: (...a: unknown[]) => void) => {
  const done = typeof options === "function" ? (options as (...a: unknown[]) => void) : cb;
  dnsLookup(host, { all: true, verbatim: true }, (err, addrs) => {
    if (err) return done(err);
    const list = addrs as { address: string; family: number }[];
    if (list.length === 0 || list.some((a) => isPrivateIp(a.address))) return done(new Error("blocked_address"));
    const wantsAll = typeof options === "object" && options !== null && (options as { all?: boolean }).all;
    if (wantsAll) return done(null, list);
    return done(null, list[0].address, list[0].family);
  });
}) as typeof dnsLookup;

export function normalizeUrl(input: string): URL | null {
  let raw = input.trim();
  if (!raw || raw.length > 300) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.username || u.password) return null;
  if (u.port && u.port !== "80" && u.port !== "443") return null;
  const host = u.hostname.toLowerCase();
  if (net.isIP(host) ? isPrivateIp(host) : !host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host.endsWith(".localhost")) return null;
  u.hash = "";
  return u;
}

type Fetched = { status: number; headers: http.IncomingHttpHeaders; body: string; ms: number; bytes: number; url: URL; encoding: string };

function fetchOnce(url: URL, maxBytes: number, timeoutMs: number): Promise<Fetched> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(
      url,
      {
        method: "GET",
        lookup: safeLookup,
        timeout: timeoutMs,
        headers: { "user-agent": "BGeetechAuditBot/1.0 (+https://bgeetech.com/audit)", accept: "text/html,application/xhtml+xml,*/*;q=0.8", "accept-encoding": "gzip, br, deflate" },
      },
      (res) => {
        const encoding = String(res.headers["content-encoding"] ?? "").toLowerCase();
        let stream: NodeJS.ReadableStream = res;
        if (encoding === "gzip") stream = res.pipe(zlib.createGunzip());
        else if (encoding === "br") stream = res.pipe(zlib.createBrotliDecompress());
        else if (encoding === "deflate") stream = res.pipe(zlib.createInflate());
        const chunks: Buffer[] = [];
        let bytes = 0;
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), ms: Date.now() - started, bytes, url, encoding });
        };
        stream.on("data", (c: Buffer) => {
          bytes += c.length;
          if (bytes <= maxBytes) chunks.push(c);
          else {
            req.destroy();
            finish();
          }
        });
        stream.on("end", finish);
        stream.on("error", () => finish());
        res.on("error", () => finish());
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

async function fetchFollow(start: URL, maxBytes = 1_500_000, timeoutMs = 9000): Promise<Fetched & { redirects: number }> {
  let url = start;
  for (let i = 0; i <= 4; i++) {
    const r = await fetchOnce(url, maxBytes, timeoutMs);
    if (r.status >= 300 && r.status < 400 && r.headers.location) {
      const next = normalizeUrl(new URL(String(r.headers.location), url).toString());
      if (!next) throw new Error("bad_redirect");
      url = next;
      continue;
    }
    return { ...r, redirects: i };
  }
  throw new Error("too_many_redirects");
}

/* ---------- HTML helpers ---------- */

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(2).find((v) => v !== undefined);
const tags = (html: string, name: string) => html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
const text = (s: string) => s.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function metaContent(html: string, key: string, value: string) {
  const m = tags(html, "meta").find((t) => attr(t, key)?.toLowerCase() === value);
  return m ? attr(m, "content") : undefined;
}

/* ---------- the audit ---------- */

export async function auditSite(input: URL): Promise<AuditResult> {
  const page = await fetchFollow(input);
  const final = page.url;
  const html = page.body;
  const head = html.slice(0, html.search(/<\/head>/i) > 0 ? html.search(/<\/head>/i) : 60_000);
  const origin = final.origin;
  const [robots, sitemap] = await Promise.all([
    fetchFollow(new URL("/robots.txt", origin), 80_000, 6000).catch(() => null),
    fetchFollow(new URL("/sitemap.xml", origin), 80_000, 6000).catch(() => null),
  ]);

  const checks: Check[] = [];
  const add = (c: Check) => checks.push(c);
  const h = page.headers;
  const header = (n: string) => (Array.isArray(h[n]) ? (h[n] as string[]).join(", ") : (h[n] as string | undefined));

  // ---- SEO
  const title = text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  add(
    !title
      ? { id: "title", category: "SEO", label: "Page title", status: "fail", detail: "No title found.", fix: "Add a clear title of about 30 to 60 characters that includes your main service and brand." }
      : title.length < 20 || title.length > 70
        ? { id: "title", category: "SEO", label: "Page title", status: "warn", detail: `Title is ${title.length} characters: "${title.slice(0, 70)}".`, fix: "Aim for 30 to 60 characters so search results show it in full." }
        : { id: "title", category: "SEO", label: "Page title", status: "pass", detail: `Good length (${title.length} characters).` },
  );
  const desc = metaContent(head, "name", "description");
  add(
    !desc
      ? { id: "desc", category: "SEO", label: "Meta description", status: "fail", detail: "No meta description.", fix: "Write a 120 to 160 character summary that makes people want to click." }
      : desc.length < 70 || desc.length > 175
        ? { id: "desc", category: "SEO", label: "Meta description", status: "warn", detail: `Description is ${desc.length} characters.`, fix: "Aim for 120 to 160 characters." }
        : { id: "desc", category: "SEO", label: "Meta description", status: "pass", detail: `Good length (${desc.length} characters).` },
  );
  const h1s = (html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) ?? []).filter((x) => text(x).length > 0);
  add(
    h1s.length === 1
      ? { id: "h1", category: "SEO", label: "Main heading (H1)", status: "pass", detail: `One H1: "${text(h1s[0]).slice(0, 70)}".` }
      : h1s.length === 0
        ? { id: "h1", category: "SEO", label: "Main heading (H1)", status: "fail", detail: "No H1 heading found.", fix: "Add one H1 that says what the page is about." }
        : { id: "h1", category: "SEO", label: "Main heading (H1)", status: "warn", detail: `${h1s.length} H1 headings found.`, fix: "Use a single H1 per page and H2/H3 for sections." },
  );
  const canonical = tags(head, "link").some((t) => attr(t, "rel")?.toLowerCase() === "canonical");
  add(canonical ? { id: "canonical", category: "SEO", label: "Canonical link", status: "pass", detail: "Canonical URL is set." } : { id: "canonical", category: "SEO", label: "Canonical link", status: "warn", detail: "No canonical link.", fix: "Add a canonical link so duplicate URLs do not compete." });
  const robotsMeta = (metaContent(head, "name", "robots") ?? "").toLowerCase();
  add(/noindex/.test(robotsMeta) ? { id: "noindex", category: "SEO", label: "Indexing allowed", status: "fail", detail: "This page tells search engines NOT to index it.", fix: "Remove the noindex tag if you want this page to appear in Google." } : { id: "noindex", category: "SEO", label: "Indexing allowed", status: "pass", detail: "The page can be indexed." });
  const lang = attr(html.match(/<html\b[^>]*>/i)?.[0] ?? "", "lang");
  add(lang ? { id: "lang", category: "SEO", label: "Page language", status: "pass", detail: `Language set to "${lang}".` } : { id: "lang", category: "SEO", label: "Page language", status: "warn", detail: "No lang attribute on the html tag.", fix: 'Add lang="en" (or your language) to the html tag.' });
  const imgs = tags(html, "img");
  const missingAlt = imgs.filter((t) => attr(t, "alt") === undefined).length;
  add(
    imgs.length === 0
      ? { id: "alt", category: "SEO", label: "Image descriptions (alt text)", status: "pass", detail: "No images found on the page." }
      : missingAlt === 0
        ? { id: "alt", category: "SEO", label: "Image descriptions (alt text)", status: "pass", detail: `All ${imgs.length} images have alt text.` }
        : { id: "alt", category: "SEO", label: "Image descriptions (alt text)", status: missingAlt / imgs.length > 0.3 ? "fail" : "warn", detail: `${missingAlt} of ${imgs.length} images have no alt text.`, fix: "Describe each meaningful image in a short alt text. It helps search, accessibility and AI." },
  );
  const jsonld = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  add(jsonld ? { id: "schema", category: "SEO", label: "Structured data", status: "pass", detail: "JSON-LD structured data found." } : { id: "schema", category: "SEO", label: "Structured data", status: "warn", detail: "No structured data (JSON-LD).", fix: "Add Organization, Service and FAQ markup so search engines and AI assistants understand your business." });
  const og = Boolean(metaContent(head, "property", "og:title")) && Boolean(metaContent(head, "property", "og:image"));
  add(og ? { id: "og", category: "SEO", label: "Social sharing preview", status: "pass", detail: "Open Graph title and image are set." } : { id: "og", category: "SEO", label: "Social sharing preview", status: "warn", detail: "Open Graph title or image is missing.", fix: "Add og:title and og:image so links look good on WhatsApp, LinkedIn and Facebook." });
  const robotsOk = robots?.status === 200 && /user-agent/i.test(robots.body);
  add(robotsOk ? { id: "robots", category: "SEO", label: "robots.txt", status: "pass", detail: "robots.txt found." } : { id: "robots", category: "SEO", label: "robots.txt", status: "warn", detail: "No robots.txt found.", fix: "Add a robots.txt that allows search engines and points to your sitemap." });
  const sitemapOk = sitemap?.status === 200 && /<urlset|<sitemapindex/i.test(sitemap.body);
  add(sitemapOk ? { id: "sitemap", category: "SEO", label: "XML sitemap", status: "pass", detail: "sitemap.xml found." } : { id: "sitemap", category: "SEO", label: "XML sitemap", status: "fail", detail: "No sitemap.xml found.", fix: "Publish a sitemap.xml and submit it in Google Search Console." });

  // ---- Speed
  const ms = page.ms;
  add(ms < 800 ? { id: "ttfb", category: "Speed", label: "Server response time", status: "pass", detail: `HTML delivered in ${ms} ms.` } : ms < 1800 ? { id: "ttfb", category: "Speed", label: "Server response time", status: "warn", detail: `HTML took ${ms} ms.`, fix: "Add caching or a CDN, or move to faster hosting." } : { id: "ttfb", category: "Speed", label: "Server response time", status: "fail", detail: `HTML took ${ms} ms, which is slow.`, fix: "Upgrade hosting, enable caching and use a CDN." });
  const compressed = ["gzip", "br", "deflate"].includes(page.encoding);
  add(compressed ? { id: "compress", category: "Speed", label: "Compression", status: "pass", detail: `Responses are compressed (${page.encoding}).` } : { id: "compress", category: "Speed", label: "Compression", status: "fail", detail: "The page is not compressed.", fix: "Turn on gzip or Brotli compression on your server." });
  const htmlKb = Math.round(page.bytes / 1024);
  add(htmlKb < 200 ? { id: "size", category: "Speed", label: "Page HTML size", status: "pass", detail: `${htmlKb} KB of HTML.` } : htmlKb < 500 ? { id: "size", category: "Speed", label: "Page HTML size", status: "warn", detail: `${htmlKb} KB of HTML.`, fix: "Trim inline code and unused markup." } : { id: "size", category: "Speed", label: "Page HTML size", status: "fail", detail: `${htmlKb} KB of HTML is heavy.`, fix: "Reduce inline scripts, data and markup." });
  const scripts = tags(html, "script").filter((t) => attr(t, "src"));
  add(scripts.length <= 20 ? { id: "scripts", category: "Speed", label: "Number of scripts", status: "pass", detail: `${scripts.length} script files.` } : scripts.length <= 40 ? { id: "scripts", category: "Speed", label: "Number of scripts", status: "warn", detail: `${scripts.length} script files.`, fix: "Remove unused plugins and combine scripts." } : { id: "scripts", category: "Speed", label: "Number of scripts", status: "fail", detail: `${scripts.length} script files is a lot.`, fix: "Remove unused plugins and third-party scripts." });
  const blocking = tags(head, "script").filter((t) => attr(t, "src") && !/\s(async|defer)\b/i.test(t) && attr(t, "type")?.toLowerCase() !== "module").length;
  add(blocking <= 1 ? { id: "blocking", category: "Speed", label: "Render-blocking scripts", status: "pass", detail: blocking === 0 ? "No blocking scripts in the head." : "1 blocking script." } : { id: "blocking", category: "Speed", label: "Render-blocking scripts", status: blocking > 3 ? "fail" : "warn", detail: `${blocking} scripts in the head block the page from showing.`, fix: "Add defer or async to scripts that are not needed immediately." });
  const noLazy = imgs.length > 6 ? imgs.slice(3).filter((t) => !/loading\s*=\s*["']?lazy/i.test(t)).length : 0;
  add(imgs.length <= 6 || noLazy < imgs.length * 0.3 ? { id: "lazy", category: "Speed", label: "Lazy-loaded images", status: "pass", detail: imgs.length <= 6 ? "Few images, no lazy loading needed." : "Images below the fold are lazy loaded." } : { id: "lazy", category: "Speed", label: "Lazy-loaded images", status: "warn", detail: `${noLazy} images load immediately even if off screen.`, fix: 'Add loading="lazy" to images below the fold.' });

  // ---- Mobile
  const viewport = metaContent(head, "name", "viewport");
  add(viewport && /width\s*=\s*device-width/i.test(viewport) ? { id: "viewport", category: "Mobile", label: "Mobile viewport", status: "pass", detail: "Viewport is set for phones." } : { id: "viewport", category: "Mobile", label: "Mobile viewport", status: "fail", detail: "No mobile viewport tag.", fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' });
  const zoomBlocked = viewport ? /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport) : false;
  add(zoomBlocked ? { id: "zoom", category: "Mobile", label: "Pinch to zoom", status: "warn", detail: "Zooming is disabled.", fix: "Allow zoom. It is an accessibility need for many people." } : { id: "zoom", category: "Mobile", label: "Pinch to zoom", status: "pass", detail: "Visitors can zoom." });
  const theme = Boolean(metaContent(head, "name", "theme-color"));
  const manifest = tags(head, "link").some((t) => attr(t, "rel")?.toLowerCase() === "manifest");
  add(theme || manifest ? { id: "app", category: "Mobile", label: "App-like feel (PWA)", status: "pass", detail: manifest ? "Web app manifest found, so the site can be installed." : "Theme colour is set." } : { id: "app", category: "Mobile", label: "App-like feel (PWA)", status: "warn", detail: "No manifest or theme colour.", fix: "Add a web app manifest so visitors can install your site like an app." });
  const tapSmall = (html.match(/font-size\s*:\s*(\d+)px/gi) ?? []).filter((m) => Number(m.match(/\d+/)?.[0]) < 12).length;
  add(tapSmall > 5 ? { id: "text", category: "Mobile", label: "Readable text", status: "warn", detail: "Several inline styles use very small text.", fix: "Use at least 14 to 16px for body text on phones." } : { id: "text", category: "Mobile", label: "Readable text", status: "pass", detail: "No very small inline text found." });

  // ---- Security
  const isHttps = final.protocol === "https:";
  add(isHttps ? { id: "https", category: "Security", label: "HTTPS", status: "pass", detail: "The site is served over HTTPS." } : { id: "https", category: "Security", label: "HTTPS", status: "fail", detail: "The site is not on HTTPS.", fix: "Install an SSL certificate and redirect all traffic to https." });
  add(header("strict-transport-security") ? { id: "hsts", category: "Security", label: "HSTS", status: "pass", detail: "Strict-Transport-Security is set." } : { id: "hsts", category: "Security", label: "HSTS", status: isHttps ? "warn" : "fail", detail: "No Strict-Transport-Security header.", fix: "Add an HSTS header so browsers always use HTTPS." });
  add(header("content-security-policy") ? { id: "csp", category: "Security", label: "Content Security Policy", status: "pass", detail: "A CSP header is set." } : { id: "csp", category: "Security", label: "Content Security Policy", status: "warn", detail: "No Content-Security-Policy header.", fix: "Add a CSP to limit where scripts can load from. It blocks many injection attacks." });
  add(header("x-content-type-options")?.toLowerCase().includes("nosniff") ? { id: "nosniff", category: "Security", label: "No content sniffing", status: "pass", detail: "X-Content-Type-Options is nosniff." } : { id: "nosniff", category: "Security", label: "No content sniffing", status: "warn", detail: "X-Content-Type-Options header missing.", fix: "Add X-Content-Type-Options: nosniff." });
  const framed = header("x-frame-options") || /frame-ancestors/i.test(header("content-security-policy") ?? "");
  add(framed ? { id: "frame", category: "Security", label: "Clickjacking protection", status: "pass", detail: "Framing is restricted." } : { id: "frame", category: "Security", label: "Clickjacking protection", status: "warn", detail: "Other sites may be able to frame yours.", fix: "Add X-Frame-Options or a CSP frame-ancestors rule." });
  add(header("referrer-policy") ? { id: "referrer", category: "Security", label: "Referrer policy", status: "pass", detail: "Referrer-Policy is set." } : { id: "referrer", category: "Security", label: "Referrer policy", status: "warn", detail: "No Referrer-Policy header.", fix: "Add Referrer-Policy: strict-origin-when-cross-origin." });
  const mixed = isHttps ? (html.match(/\s(?:src|href)=["']http:\/\/(?!www\.w3\.org)[^"']+/gi) ?? []).filter((m) => /src=/i.test(m)).length : 0;
  add(mixed === 0 ? { id: "mixed", category: "Security", label: "No insecure content", status: "pass", detail: "No http:// resources on the page." } : { id: "mixed", category: "Security", label: "No insecure content", status: "fail", detail: `${mixed} resources load over insecure http.`, fix: "Load every image, script and style over https." });

  // ---- scoring
  const pts = { pass: 1, warn: 0.5, fail: 0 } as const;
  const names: Category[] = ["SEO", "Speed", "Mobile", "Security"];
  const categories = names.map((name) => {
    const list = checks.filter((c) => c.category === name);
    return { name, score: Math.round((list.reduce((s, c) => s + pts[c.status], 0) / list.length) * 100) };
  });
  const score = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 45 ? "D" : "F";
  const topFixes = [...checks.filter((c) => c.status === "fail"), ...checks.filter((c) => c.status === "warn")]
    .filter((c) => c.fix)
    .slice(0, 4)
    .map((c) => c.fix as string);

  return {
    url: input.toString(),
    finalUrl: final.toString(),
    score,
    grade,
    categories,
    checks,
    topFixes,
    facts: { responseMs: ms, htmlKb, scripts: scripts.length, images: imgs.length, compressed },
    checkedAt: new Date().toISOString(),
  };
}
