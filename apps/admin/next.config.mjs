
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.domain.com' 
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
        hostname: 'admin.domain.com',
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

export default nextConfig

