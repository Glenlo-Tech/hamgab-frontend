
/** @type {import('next').NextConfig} */
// Extract API domain from NEXT_PUBLIC_API_URL for image optimization
function getApiDomain() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  if (!apiUrl) return null
  
  try {
    const url = new URL(apiUrl)
    return {
      protocol: url.protocol.replace(':', '') || 'https',
      hostname: url.hostname,
    }
  } catch {
    // If URL parsing fails, try to extract domain manually
    const match = apiUrl.match(/https?:\/\/([^\/]+)/)
    if (match) {
      return {
        protocol: apiUrl.startsWith('https') ? 'https' : 'http',
        hostname: match[1],
      }
    }
    return null
  }
}

const apiDomain = getApiDomain()
const remotePatterns = []

// Add API domain if available
if (apiDomain) {
  remotePatterns.push({
    protocol: apiDomain.protocol,
    hostname: apiDomain.hostname,
  })
}

// Add common CDN/cloud storage domains that might be used
const commonImageDomains = [
  'res.cloudinary.com', // Cloudinary CDN for property images
  'hamgab-backend.onrender.com',
  'localhost',
  '127.0.0.1',
]

commonImageDomains.forEach(hostname => {
  if (!remotePatterns.find(p => p.hostname === hostname)) {
    remotePatterns.push({
      protocol: 'https',
      hostname,
    })
    remotePatterns.push({
      protocol: 'http',
      hostname,
    })
  }
})

const nextConfig = {
  basePath: '',
  assetPrefix: process.env.VERCEL 
    ? undefined 
    : (process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_PUBLIC_URL
      : ''),
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@propflow/types', '@propflow/utils', '@propflow/hooks'],
  images: {
    remotePatterns,
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
