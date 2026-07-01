import BaseLayout from "@/components/layout/base-layout"
import SidebarMain from "@/components/layout/sidebar-main"

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout sidebar={<SidebarMain />} useGridBackground={false} useInteractiveGrid>
      {children}
    </BaseLayout>
  )
}
