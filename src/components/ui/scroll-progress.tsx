"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "motion/react";

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className }: Readonly<ScrollProgressProps>) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-[1000] h-1 origin-left bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000] dark:from-[#91f87c] dark:via-[#8ff38c] dark:to-[#92fda4]",
        className,
      )}
      style={{
        scaleX,
      }}
    />
  );
}
