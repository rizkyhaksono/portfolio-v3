import type { Metadata } from "next";
import BaseLayout from "@/components/layout/base-layout";
import { MetadataConstants } from "@/commons/constants/metadata";
import SidebarMain from "@/components/layout/sidebar-main";

export const metadata: Metadata = {
  title: "WPM | Rizky Haksono",
  metadataBase: new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.DOMAIN ?? ""
  ),
  description: MetadataConstants.description,
  keywords: MetadataConstants.keyword,
  creator: MetadataConstants.creator,
  authors: {
    name: MetadataConstants.creator,
    url: MetadataConstants.openGraph.url,
  },
  openGraph: {
    title: "Muhammad Rizky Haksono - Software Engineer",
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

export default function WPMLayout({
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