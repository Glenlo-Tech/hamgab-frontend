
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_AGENT_URL || 'https://agent.domain.com' 
    : '',
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@propflow/types', '@propflow/utils', '@propflow/hooks'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'domain.com',
      },
      {
        protocol: 'https',
        hostname: 'agent.domain.com',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Turbopack root is set via environment or inferred
  // To silence the warning, ensure pnpm-lock.yaml is in the workspace root
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig

