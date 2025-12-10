"use client"

import { publicDashboardMenu } from "@/commons/constants/navigation-menu"
import { MdVerified as VerifiedIcon } from "react-icons/md"
import Typography from "@/components/ui/typography"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"
import SidebarSecondary from "./sidebar-secondary"

const SidebarMain = () => {
  return (
    <div className="hidden max-h-screen flex-col px-3 overflow-y-auto lg:w-64 md:w-52 top-0 pt-16 pb-6 sticky md:flex">
      <div className="mb-3 px-1">
        <div className="relative">
          <Avatar className={`w-24 h-24 mb-3 transition-transform duration-300`}>
            <Image height={200} width={200} alt="natee" src={"/rizky.jpg"} draggable="false" />
          </Avatar>
        </div>

        <div className="space-y-1">
          <Typography.H4 className="flex items-center">
            Rizky Haksono
            <VerifiedIcon size={18} className="text-blue-400 ml-2" />
          </Typography.H4>

          <div className="flex items-center gap-2 mt-2">
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
      <SidebarSecondary menu={publicDashboardMenu} />
    </div>
  )
}

export default SidebarMain
