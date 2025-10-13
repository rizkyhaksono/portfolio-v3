"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Typography from "@/components/ui/typography";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const SidebarTheming = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Typography.P className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate pt-5">
        Theming
      </Typography.P>
      <div className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full justify-between h-10 mb-1">
        <div className="flex items-center">
          <span className={cn("mr-4")}>
            <SunIcon className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
            <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
          </span>
          <Typography.P
            className={cn(
              "leading-7 flex flex-grow max-w-[200px] truncate translate-x-0 opacity-100"
            )}
          >
            Dark Mode
          </Typography.P>
        </div>

        <Switch
          checked={theme === "dark"}
          accessKey="theme-mode"
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>
    </>
  );
};

export default SidebarTheming;