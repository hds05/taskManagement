import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   experimental: {
    typedRoutes: false, // Disable auto route type generation
  },
  images: {
    domains: ['cdn-icons-png.flaticon.com'],
  },
};

export default nextConfig;
