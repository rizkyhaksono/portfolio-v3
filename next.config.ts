import createMDX from '@next/mdx'
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
  },
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        '*.mdx': {
          loaders: ['@mdx-js/loader'],
          as: '*.js',
        },
      },
    },
  },
}

const withMDX = createMDX({
  // Add markdown plugins here if needed
})

export default withMDX(nextConfig)
