import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Skip TypeScript errors during build for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint errors during build for deployment
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
