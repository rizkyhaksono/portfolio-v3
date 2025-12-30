import type { Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout"
import { MetadataConstants } from "@/commons/constants/metadata"
import SidebarMain from "@/components/layout/sidebar-main"

export const metadata: Metadata = {
  title: "Tools - Japanese Quiz, Anime Generator & More | Rizky Haksono",
  metadataBase: new URL(process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.DOMAIN ?? ""),
  description: "Collection of useful tools including Japanese JLPT Quiz, Anime Image Generator, Social Media Downloader, WPM Test, File Manager, and Online Compiler. Free and easy to use!",
  keywords: [
    ...MetadataConstants.keyword,
    "Japanese quiz",
    "JLPT practice",
    "anime generator",
    "video downloader",
    "tiktok downloader",
    "instagram downloader",
    "youtube downloader",
    "wpm test",
    "typing speed test",
    "online compiler",
    "file manager",
  ],
  creator: MetadataConstants.creator,
  authors: {
    name: MetadataConstants.creator,
    url: MetadataConstants.openGraph.url,
  },
  openGraph: {
    title: "Tools - Japanese Quiz, Anime Generator & More",
    description: "Collection of useful tools for learning Japanese, generating anime images, downloading videos, and more!",
    images: MetadataConstants.profile,
    url: `${MetadataConstants.openGraph.url}/tools`,
    siteName: MetadataConstants.openGraph.siteName,
    locale: MetadataConstants.openGraph.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BaseLayout sidebar={<SidebarMain />} useGridBackground={false} useInteractiveGrid={true}>
      {children}
    </BaseLayout>
  )
}
