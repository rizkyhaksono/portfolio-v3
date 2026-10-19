import type { Metadata } from "next";
import { MetadataConstants } from "@/commons/constants/metadata";
import { getMetadataBaseUrl } from "@/lib/site-url";
import BaseLayout from "@/components/layout/base-layout";

export const metadata: Metadata = {
  title: "Roadmap | Rizky Haksono",
  metadataBase: getMetadataBaseUrl(),
  description: "Learning paths in React, Vue, Express, Kubernetes and MCP, from first principles to advanced practice.",
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

export default function RoadmapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout>{children}</BaseLayout>;
}