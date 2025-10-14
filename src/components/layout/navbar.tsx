"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "./mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { mainNavData } from "@/commons/constants/navigation-menu";
import MobileNavbarExpand from "./mobile-navbar-expand";

interface NavbarProps {
  isHaveToken: boolean;
}

export default function Navbar({ isHaveToken }: Readonly<NavbarProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>

      <TooltipProvider delayDuration={0}>
        <div className="relative mx-auto">
          {/* Expanded Dock */}
          <AnimatePresence>
            {isExpanded && (
              <>
                {/* Mobile overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden pointer-events-auto"
                  onClick={() => setIsExpanded(false)}
                />

                {/* Mobile bottom sheet */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 md:hidden pointer-events-auto z-50"
                >
                  <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[80vh] overflow-y-auto pb-20">
                    <div className="p-4">
                      <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
                      <MobileNavbarExpand onItemClick={() => setIsExpanded(false)} />
                    </div>
                  </div>
                </motion.div>

                {/* Desktop expanded view */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="hidden md:block absolute bottom-20 right-0 pointer-events-auto"
                >
                  <div className="bg-background rounded-2xl shadow-xl border border-border my-20">
                    <MobileNavbarExpand onItemClick={() => setIsExpanded(false)} />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Dock */}
          <Dock
            direction="middle"
            className="rounded-full z-50 pointer-events-auto relative flex items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
          >
            {mainNavData(isHaveToken).map((item) => (
              <DockIcon key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12 rounded-full hover:bg-accent/50 transition-colors",
                      )}
                    >
                      <item.icon className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
            <Separator orientation="vertical" className="h-full" />
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleExpanded}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full hover:bg-accent/50 transition-colors",
                    )}
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronUp className="size-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isExpanded ? "Collapse" : "More"}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ModeToggle />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          </Dock>
        </div>
      </TooltipProvider>
    </div>
  );
}