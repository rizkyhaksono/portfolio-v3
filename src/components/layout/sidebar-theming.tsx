import { MoonIcon, SunIcon } from "lucide-react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

const SidebarTheming = () => {
  return (
    <div className="mt-3 w-full border-t border-border pt-3">
      <div className="mb-1 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Appearance
      </div>
      <div className="flex h-10 w-full items-center justify-between border border-border bg-background px-3 text-sm font-medium">
        <span className="flex items-center gap-3">
          <SunIcon className="h-4 w-4 dark:hidden" />
          <MoonIcon className="hidden h-4 w-4 dark:block" />
          <span className="dark:hidden">Light</span>
          <span className="hidden dark:inline">Dark</span>
        </span>
        <AnimatedThemeToggler />
      </div>
    </div>
  );
};

export default SidebarTheming;
