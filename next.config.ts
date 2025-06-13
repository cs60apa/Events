import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporary fix for Turbopack font loading issues
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
