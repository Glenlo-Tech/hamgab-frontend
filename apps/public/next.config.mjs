
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_PUBLIC_URL || 'https://domain.com' 
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
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

export default nextConfig
