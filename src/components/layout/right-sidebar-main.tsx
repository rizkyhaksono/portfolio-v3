import RightSidebarWindow from "./right-sidebar-window"
import VisitorPanel from "./visitor-panel"

const RightSidebarMain = ({ defaultOpen = true }: Readonly<{ defaultOpen?: boolean }>) => {
  return (
    <RightSidebarWindow defaultOpen={defaultOpen}>
      <VisitorPanel />
    </RightSidebarWindow>
  )
}

export default RightSidebarMain
