"use client";

import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function GreetingSection() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor((theme === "dark" || theme === "system") ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-black md:text-9xl">
        Rizky Haksono
      </span>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
}
