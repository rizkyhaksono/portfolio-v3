import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      }
    ],
    // Note: LinkedIn images may still fail with 403 if they require authentication headers
    // Consider proxying these images through your backend API for production
    unoptimized: false,
  },
  experimental: {
    mdxRs: true,
  },
}

export default nextConfig