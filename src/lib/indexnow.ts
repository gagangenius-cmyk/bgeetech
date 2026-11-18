import "server-only";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const indexNowKey = () => {
  const k = process.env.INDEXNOW_KEY ?? "";
  return /^[A-Za-z0-9-]{8,128}$/.test(k) ? k : "";
};

/**
 * Tells Bing, Yandex and other IndexNow participants that URLs were added or changed (Google ignores IndexNow).
 * Fire-and-forget: a failure here must never affect the admin action that triggered it.
 * The key file is served at /<key>.txt by src/app/api/indexnow-key.
 */
export async function submitIndexNow(paths: string[]): Promise<void> {
  const key = indexNowKey();
  if (!key || paths.length === 0) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(site.url).host, key, keyLocation: `${site.url}/${key}.txt`, urlList: paths.map(absoluteUrl) }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    /* best effort */
  }
}
