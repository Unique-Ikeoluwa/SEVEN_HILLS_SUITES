import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
},

  allowedDevOrigins: ["172.20.10.2"],
};

export default nextConfig;