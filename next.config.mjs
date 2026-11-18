/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Self-contained server output: deploy `.next/standalone` without needing a build on the host.
  output: "standalone",
  // Keep the ORM and its driver out of the bundle (they load dialects dynamically).
  serverExternalPackages: ["sequelize", "mysql2"],
  async rewrites() {
    // IndexNow ownership file: /<key>.txt is answered by an API route that only returns the configured key.
    return [{ source: "/:key([A-Za-z0-9-]{16,128}).txt", destination: "/api/indexnow-key/:key" }];
  },
  async headers() {
    return [
      {
        // Baseline security headers (trust signal for visitors, browsers and security scanners).
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
      {
        // The service worker must never be cached, so updates reach visitors immediately.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
