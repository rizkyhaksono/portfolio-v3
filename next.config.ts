import type { NextConfig } from 'next'
import { RESUME_GOOGLE_DRIVE_URL } from './src/commons/constants/external-links'

const nextConfig: NextConfig = {
  // Standalone output is required by the Docker image (Dockerfile copies .next/standalone).
  // Disabled on Windows only, where it triggers an EBUSY file-lock during local builds.
  output: process.platform === "win32" ? undefined : "standalone",
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
    // Only hosts that optimized <Image> sources actually use; `unoptimized` images skip this list.
    remotePatterns: [
      // Project covers (Supabase Storage signed/public URLs)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/**" },
      // DEV.to covers, comment avatars and article-body images
      { protocol: "https", hostname: "media2.dev.to" },
      { protocol: "https", hostname: "dev-to-uploads.s3.amazonaws.com" },
      { protocol: "https", hostname: "dev-to-uploads.s3.us-east-2.amazonaws.com" },
      // Medium feed thumbnails and admin-entered onsite blog covers
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "img-s-msn-com.akamaized.net" },
      // Education logos (Supabase `education` table)
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "images.icon-icons.com" },
      { protocol: "https", hostname: "media.licdn.com" },
      // Spotify album art, signup illustration, /signal hero
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/webp"],
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
