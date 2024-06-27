/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.nightcafe.studio",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
}

export default nextConfig
