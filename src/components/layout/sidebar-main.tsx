"use client";

import { publicDashboardMenu } from "@/commons/constants/sidebar-menu";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import Typography from "@/components/ui/typography";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import SidebarSecondary from "./sodebar-secondary";

const SidebarMain = () => {
  return (
    <div className="hidden max-h-screen flex-col px-3 overflow-y-auto lg:w-64 md:w-52 top-0 pt-16 pb-6 sticky md:flex">
      <div className="mb-3 px-1">
        <Avatar className={`w-24 h-24 mb-3 transition-transform duration-300`}>
          <Image height={162} width={162} alt="natee" src={"/rizky.jpg"} />
        </Avatar>
        <Typography.H4 className="flex items-center">
          Rizky Haksono
          <VerifiedIcon size={18} className="text-blue-400 ml-2" />
        </Typography.H4>
        <Typography.P className="text-primary/55">@nateenese</Typography.P>
      </div>
      <SidebarSecondary menu={publicDashboardMenu} />
    </div>
  );
};

export default SidebarMain;