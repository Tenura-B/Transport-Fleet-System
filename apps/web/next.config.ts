import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const rawApiUrl = process.env.API_URL || "http://localhost:3005";
    const apiUrl = rawApiUrl.replace(/\/+$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
