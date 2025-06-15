"use client";

import { usePathname } from "next/navigation";
import ProfileSideCard from "./profile-side-card";
import { SidebarMenu } from "@/commons/constants/sidebar-menu";
import { cn } from "@/libs/utils";
import Typography from "@/components/ui/typography";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import SidebarTheming from "./sidebar-theming";

const SidebarSecondary = ({
  menu,
  disableProfileCard,
  disableThemeSetting,
}: {
  menu: SidebarMenu[];
  disableProfileCard?: boolean;
  disableThemeSetting?: boolean;
}) => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-col items-start space-y-1">
        {!disableProfileCard && <ProfileSideCard />}
        {menu.map(({ groupLabel, menus }, index) => (
          <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={groupLabel + index}>
            <Typography.P className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
              {groupLabel}
            </Typography.P>
            {menus.map(({ href, label, icon: Icon }, index) => {
              return (
                <Button
                  key={href + index}
                  variant={pathname.endsWith(href) ? "secondary" : "ghost"}
                  className="w-full justify-start h-10 mb-1"
                  asChild
                >
                  <Link href={href}>
                    <span className="mr-4">
                      <Icon size={18} />
                    </span>
                    <Typography.P className="flex flex-grow max-w-[200px] truncate">
                      {label}
                    </Typography.P>
                    <ArrowRightIcon
                      className={
                        pathname.endsWith(href) ? "block opacity-60" : "hidden"
                      }
                      height={14}
                      width={14}
                    />
                  </Link>
                </Button>
              );
            })}
          </li>
        ))}
        {!disableThemeSetting && <SidebarTheming key="theme-settings" />}
      </ul>
    </nav>
  );
};

export default SidebarSecondary;