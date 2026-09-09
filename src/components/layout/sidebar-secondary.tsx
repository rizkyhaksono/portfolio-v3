"use client";

import { usePathname } from "next/navigation";
import ProfileSideCard from "./profile-side-card";
import { SidebarMenu } from "@/commons/constants/navigation-menu";
import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import SidebarTheming from "./sidebar-theming";

const SidebarSecondary = ({
  menu,
  disableProfileCard,
  disableThemeSetting,
  onItemClick,
}: {
  menu: SidebarMenu[];
  disableProfileCard?: boolean;
  disableThemeSetting?: boolean;
  onItemClick?: () => void;
}) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav>
      <ul className="flex flex-col items-start">
        {!disableProfileCard && <ProfileSideCard />}
        {menu.map(({ groupLabel, menus }, index) => (
          <li className={cn("w-full", groupLabel ? "pt-2" : "")} key={groupLabel + index}>
            <Typography.P className="max-w-[248px] truncate px-3 pb-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {groupLabel}
            </Typography.P>
            {menus.map(({ href, label, icon: Icon }, index) => {
              const active = isActive(href);

              return (
                <Button
                  key={href + index}
                  variant={active ? "secondary" : "ghost"}
                  className="h-8 w-full justify-between px-3"
                  asChild
                >
                  <Link href={href} onClick={onItemClick}>
                    <div className="flex items-center">
                      <span className="mr-3">
                        <Icon size={16} />
                      </span>
                      <Typography.P className="flex flex-grow max-w-[200px] truncate">
                        {label}
                      </Typography.P>
                    </div>
                    <ArrowRightIcon
                      className={active ? "block opacity-60" : "hidden"}
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
