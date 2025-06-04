/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.skill-set.ai',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['sonner'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
