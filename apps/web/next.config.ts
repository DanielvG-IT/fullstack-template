import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship raw TypeScript (no build step); Next compiles them.
  transpilePackages: ["@acme/core", "@acme/api-client"],
};

export default nextConfig;
