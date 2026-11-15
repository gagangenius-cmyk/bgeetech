/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Self-contained server output: deploy `.next/standalone` without needing a build on the host.
  output: "standalone",
  // Keep the ORM and its driver out of the bundle (they load dialects dynamically).
  serverExternalPackages: ["sequelize", "mysql2"],
};

export default nextConfig;
