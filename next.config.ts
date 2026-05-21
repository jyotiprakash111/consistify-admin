import type { NextConfig } from 'next';
import path from 'path';

const API_ORIGIN =
  process.env.API_ORIGIN ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://persistify-production.up.railway.app';

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
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
