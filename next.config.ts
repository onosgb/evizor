import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evizor.s3.us-west-1.idrivee2.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
