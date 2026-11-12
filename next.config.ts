import type { NextConfig } from "next";

// Set at build time; leave empty when the app is served from the domain root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
if (basePath && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(basePath)) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a path such as /private (without a trailing slash)");
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Preserve existing prefetch behavior until the application is reviewed for migration.
  partialPrefetching: false,
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
