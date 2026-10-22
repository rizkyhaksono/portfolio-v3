import type { NextConfig } from 'next'
import { RESUME_GOOGLE_DRIVE_URL } from './src/commons/constants/external-links'
import { OPTIMIZED_IMAGE_HOSTS, SUPABASE_IMAGE_HOST, SUPABASE_STORAGE_PATH } from './src/lib/image-hosts'

const originOf = (url?: string) => {
  try {
    return url ? new URL(url).origin : undefined
  } catch {
    return undefined
  }
}

const isDev = process.env.NODE_ENV !== 'production'
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
    originOf(process.env.NEXT_PUBLIC_SUPABASE_URL),
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
    // canOptimizeImage() reads the same list: images from any other host (admin-entered covers included)
    // render `unoptimized`, so this server never becomes an open image proxy.
    remotePatterns: [
      ...(SUPABASE_IMAGE_HOST
        ? [{ protocol: "https" as const, hostname: SUPABASE_IMAGE_HOST, pathname: `${SUPABASE_STORAGE_PATH}**` }]
        : []),
      ...OPTIMIZED_IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
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
