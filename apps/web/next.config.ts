import type { NextConfig } from "next";

// Baseline hardening headers. Add a Content-Security-Policy once you know which origins the
// app loads from — a wrong CSP breaks pages silently, so it's a per-project decision.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Workspace packages ship raw TypeScript (no build step); Next compiles them.
  transpilePackages: ["@acme/core", "@acme/api-client"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
