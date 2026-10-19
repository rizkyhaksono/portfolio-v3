import type { Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout"
import { MetadataConstants } from "@/commons/constants/metadata"
import { getMetadataBaseUrl } from "@/lib/site-url"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Chat | Rizky Haksono",
  metadataBase: getMetadataBaseUrl(),
  description: "A public chat on natee.my.id. Say hello, ask a question, or answer someone.",
  keywords: MetadataConstants.keyword,
  creator: MetadataConstants.creator,
  authors: {
    name: MetadataConstants.creator,
    url: MetadataConstants.openGraph.url,
  },
  openGraph: {
    title: MetadataConstants.ogPersonTitle,
    images: MetadataConstants.profile,
    url: `${MetadataConstants.openGraph.url}/chat`,
    siteName: MetadataConstants.openGraph.siteName,
    locale: MetadataConstants.openGraph.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BaseLayout footer="none" fit>
      {children}
    </BaseLayout>
  )
}
