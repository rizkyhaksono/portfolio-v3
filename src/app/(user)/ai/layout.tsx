import type { Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout"
import { MetadataConstants } from "@/commons/constants/metadata"
import { getMetadataBaseUrl } from "@/lib/site-url"
import SidebarMain from "@/components/layout/sidebar-main"

export const metadata: Metadata = {
  title: "AI | Rizky Haksono",
  metadataBase: getMetadataBaseUrl(),
  description: MetadataConstants.description,
  keywords: MetadataConstants.keyword,
  creator: MetadataConstants.creator,
  authors: {
    name: MetadataConstants.creator,
    url: MetadataConstants.openGraph.url,
  },
  openGraph: {
    title: MetadataConstants.ogPersonTitle,
    images: MetadataConstants.profile,
    url: MetadataConstants.openGraph.url,
    siteName: MetadataConstants.openGraph.siteName,
    locale: MetadataConstants.openGraph.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BaseLayout sidebar={<SidebarMain />}>
      {children}
    </BaseLayout>
  )
}
