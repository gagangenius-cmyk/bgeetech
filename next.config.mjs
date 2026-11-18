/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Self-contained server output: deploy `.next/standalone` without needing a build on the host.
  output: "standalone",
  // Keep the ORM and its driver out of the bundle (they load dialects dynamically).
  serverExternalPackages: ["sequelize", "mysql2"],
  async headers() {
    return [
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
