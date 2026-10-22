import type { NextConfig } from 'next'
import { RESUME_GOOGLE_DRIVE_URL } from './src/commons/constants/external-links'

const originOf = (url?: string) => {
  try {
    return url ? new URL(url).origin : undefined
  } catch {
    return undefined
  }
}

const isDev = process.env.NODE_ENV !== 'production'
const supabaseOrigin = originOf(process.env.NEXT_PUBLIC_SUPABASE_URL)
const umamiOrigins = [originOf(process.env.NEXT_PUBLIC_UMAMI_SRC), originOf(process.env.NEXT_PUBLIC_UMAMI_RECORDER_SRC)]
const TURNSTILE = 'https://challenges.cloudflare.com'
const sources = (...list: (string | undefined)[]) => [...new Set(list.filter(Boolean))].join(' ')

// Nonces would make every page dynamic, so inline scripts stay allowed; the value is in pinning
// where scripts, connections and frames may come from, and in refusing to be framed.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src ${sources("'self'", "'unsafe-inline'", isDev ? "'unsafe-eval'" : undefined, ...umamiOrigins, TURNSTILE)}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src ${sources(
    "'self'",
    originOf(process.env.NEXT_PUBLIC_API_URL),
    supabaseOrigin,
    ...umamiOrigins,
    'https://api.emailjs.com',
    'https://api.dictionaryapi.dev',
    TURNSTILE,
    isDev ? 'ws: http://localhost:*' : undefined,
  )}`,
  "media-src 'self' blob: https:",
  `frame-src ${TURNSTILE} https://www.youtube-nocookie.com`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
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
    // Admin-entered images (blog covers, project shots) are rendered `unoptimized`, so any host works
    // without turning this server into an open image proxy.
    remotePatterns: [
      // Project covers (Supabase Storage signed/public URLs), from this site's own project only
      ...(supabaseOrigin
        ? [{ protocol: "https" as const, hostname: new URL(supabaseOrigin).hostname, pathname: "/storage/v1/object/**" }]
        : []),
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
