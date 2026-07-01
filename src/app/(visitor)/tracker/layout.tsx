import type { Metadata } from "next"
import BaseLayout from "@/components/layout/base-layout"
import { MetadataConstants } from "@/commons/constants/metadata"
import SidebarMain from "@/components/layout/sidebar-main"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tracker - Public Kanban Board | Rizky Haksono",
  metadataBase: new URL(process.env.NODE_ENV === "development" ? "http://localhost:3000" : (process.env.DOMAIN ?? "")),
  description:
    "A public, interactive Jira-style Kanban board. Drag cards across columns. Anyone can view; sign in to add and move cards.",
  keywords: [...MetadataConstants.keyword, "kanban", "tracker", "board", "drag and drop", "jira"],
  creator: MetadataConstants.creator,
  authors: { name: MetadataConstants.creator, url: MetadataConstants.openGraph.url },
  openGraph: {
    title: "Tracker - Public Kanban Board",
    description: "An interactive, public Jira-style board — drag cards across columns; sign in to contribute.",
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
    <BaseLayout sidebar={<SidebarMain />} useGridBackground={false} useInteractiveGrid={true}>
      {children}
    </BaseLayout>
  )
}
