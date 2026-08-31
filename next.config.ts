import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render free tier: avoid broken images from the Next.js image optimizer
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
