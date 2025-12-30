import { publicDashboardMenu } from "@/commons/constants/navigation-menu"
import { MdVerified as VerifiedIcon } from "react-icons/md"
import Typography from "@/components/ui/typography"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"
import SidebarSecondary from "./sidebar-secondary"
import MobileNavbarRightSidebar from "./mobile-navbar-right-sidebar"

interface NavbarExpandProps {
  onItemClick?: () => void
}

const MobileNavbarExpand = ({ onItemClick }: NavbarExpandProps) => {
  return (
    <div className="flex flex-col overflow-y-auto w-full md:w-52 lg:w-64">
      <div className="mb-4 px-1">
        <div className="relative flex items-center gap-4 md:flex-col md:items-start">
          <Avatar className="w-16 h-16 md:w-24 md:h-24 transition-transform duration-300 shrink-0">
            <Image height={200} width={200} alt="natee" src={"/rizky.jpg"} draggable="false" />
          </Avatar>

          <div className="space-y-1 flex-1">
            <Typography.H4 className="flex items-center text-base md:text-xl">
              Rizky Haksono
              <VerifiedIcon size={18} className="text-blue-400 ml-2" />
            </Typography.H4>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <Typography.P className="text-xs font-medium text-green-600 dark:text-green-400">Online</Typography.P>
              </div>
              <Typography.P className="text-xs text-primary/55">@nateenese</Typography.P>
            </div>
          </div>
        </div>
      </div>
      <SidebarSecondary menu={publicDashboardMenu} onItemClick={onItemClick} />
      <MobileNavbarRightSidebar />
    </div>
  )
}

export default MobileNavbarExpand
