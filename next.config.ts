import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.palactix.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
      dangerouslyAllowSVG: true,
      unoptimized: process.env.NODE_ENV === "development",
    },
    // experimental: {
    //   serverActions: {
    //     allowedOrigins: ["127.0.0.1:8000", "localhost:8000"],
    //   },
    // },
};

export default nextConfig;
