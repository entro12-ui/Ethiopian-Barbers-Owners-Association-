import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access during `next dev` (phone/other devices via local IP)
  allowedDevOrigins: ["192.168.0.3", "localhost", "127.0.0.1"],
  // Render free tier: avoid broken images from the Next.js image optimizer
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
