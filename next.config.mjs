/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  // Self-contained server output: deploy `.next/standalone` without needing a build on the host.
  output: "standalone",
};

export default nextConfig;
