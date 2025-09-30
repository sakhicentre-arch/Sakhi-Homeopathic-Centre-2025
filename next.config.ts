import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Static export to bypass database issues
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig
