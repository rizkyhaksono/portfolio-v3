/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.nightcafe.studio",
      },
    ],
  },
}

export default nextConfig
