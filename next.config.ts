import type { NextConfig } from 'next'
import { RESUME_GOOGLE_DRIVE_URL } from './src/commons/constants/external-links'
import { OPTIMIZED_IMAGE_HOSTS, SUPABASE_IMAGE_HOST, SUPABASE_STORAGE_PATH } from './src/lib/image-hosts'

// CSP (nonce-based script-src) is set per request in src/proxy.ts.
const DOCUMENT_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)' },
]

const nextConfig: NextConfig = {
  headers() {
    return [
      { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
      { source: '/:path((?!_next/static|_next/image).*)', headers: DOCUMENT_HEADERS },
    ]
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
      { source: '/tracker', destination: '/', permanent: true },
      { source: '/status', destination: '/stats#status', permanent: true },
      { source: '/playground', destination: '/', permanent: true },
      // Etan AI is hidden for now (owner, 2026-11-05); temporary so it can come back.
      { source: '/ai', destination: '/', permanent: false },
      { source: '/ai/:path*', destination: '/', permanent: false },
      { source: '/admin', destination: '/admin/dashboard', permanent: true },
      { source: '/admin/auth', destination: '/admin/auth/login', permanent: true },
    ]
  },
  // Keeps the TypeScript compiler (pulled in by tracing) out of the standalone image.
  outputFileTracingExcludes: { '*': ['node_modules/typescript/**'] },
  // print-assets.ts reads this font from disk at runtime, which tracing cannot see.
  outputFileTracingIncludes: {
    '/api/og': ['./src/assets/fonts/plus-jakarta-sans-latin-600-normal.woff'],
    '/api/certificate': ['./src/assets/fonts/plus-jakarta-sans-latin-600-normal.woff'],
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
