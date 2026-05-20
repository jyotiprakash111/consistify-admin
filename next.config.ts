import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // use an absolute path to ensure Turbopack resolves modules from this app
    root: path.resolve(__dirname),
  },
  // Add the rewrites function here:
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;
