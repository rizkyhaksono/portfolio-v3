import type { Metadata } from "next";
import { MetadataConstants } from "@/commons/constants/metadata";
import { getMetadataBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Roadmap | Rizky Haksono",
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
};

export default function RoadmapSlugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  )
}