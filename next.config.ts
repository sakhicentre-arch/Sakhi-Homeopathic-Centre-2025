import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Simple configuration - no static export
  experimental: {
    appDir: true,
  },
  // Allow server-side features
  poweredByHeader: false,
}

export default nextConfig
