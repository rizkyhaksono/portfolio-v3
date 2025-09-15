/** @type {import('postcss-load-config').Config} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      }
    ],
  },
}

export default nextConfig
