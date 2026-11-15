import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Self-contained server output: deploy `.next/standalone` without needing a build on the host.
  output: "standalone",
};

export default nextConfig;
