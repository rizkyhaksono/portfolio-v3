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
      { source: '/signal', destination: '/', permanent: true },
      { source: '/status', destination: '/stats#status', permanent: true },
      { source: '/playground', destination: '/ai', permanent: true },
      { source: '/admin', destination: '/admin/dashboard', permanent: true },
      { source: '/admin/auth', destination: '/admin/auth/login', permanent: true },
    ]
  },
  // Keeps the TypeScript compiler (pulled in by tracing) out of the standalone image.
  outputFileTracingExcludes: { '*': ['node_modules/typescript/**'] },
  // print-assets.ts reads this font from disk at runtime, which tracing cannot see.
  outputFileTracingIncludes: {
    '/api/og': ['./src/assets/fonts/literata-italic.ttf'],
    '/api/certificate': ['./src/assets/fonts/literata-italic.ttf'],
  },
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
      // Signup illustration, roadmap images
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1200, 1600],
    imageSizes: [32, 64, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    unoptimized: false,
  },
  experimental: {
    // Profile covers go up to 5 MB (the API's own cap) plus multipart overhead; the 1 MB default refused them.
    serverActions: { bodySizeLimit: "6mb" },
  },
}

export default nextConfig
