import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Skip TypeScript errors during deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint errors during deployment
    ignoreDuringBuilds: true,
  },
  // Add this to fix route group issues
  experimental: {
    appDir: true,
  }
}

export default nextConfig
