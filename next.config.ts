import type { NextConfig } from 'next'
import { RESUME_GOOGLE_DRIVE_URL } from './src/commons/constants/external-links'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/resume',
        destination: RESUME_GOOGLE_DRIVE_URL,
        permanent: false,
      },
    ]
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    unoptimized: false,
  },
  experimental: {
    mdxRs: true,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "recharts",
      "date-fns",
      "date-fns-tz",
      "motion",
      "@radix-ui/react-icons",
    ],
  },
}

export default nextConfig
