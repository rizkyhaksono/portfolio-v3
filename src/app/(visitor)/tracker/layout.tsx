import type { Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout"
import { MetadataConstants } from "@/commons/constants/metadata"
import { getMetadataBaseUrl } from "@/lib/site-url"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tracker | Rizky Haksono",
  metadataBase: getMetadataBaseUrl(),
  description:
    "A public kanban board of index cards. Anyone can read it; signed-in readers can add cards and move their own.",
  keywords: [...MetadataConstants.keyword, "kanban", "tracker", "board", "drag and drop", "jira"],
  creator: MetadataConstants.creator,
  authors: { name: MetadataConstants.creator, url: MetadataConstants.openGraph.url },
  openGraph: {
    title: "Tracker",
    description: "A public kanban board of index cards. Sign in to add cards and move your own.",
    images: MetadataConstants.profile,
    url: `${MetadataConstants.openGraph.url}/tracker`,
    siteName: MetadataConstants.openGraph.siteName,
    locale: MetadataConstants.openGraph.locale,
    type: "website",
  },
  robots: { index: true, follow: true },
}

export default function TrackerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  )
}
