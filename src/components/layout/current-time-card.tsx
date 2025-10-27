"use client";

import { useEffect, useState } from "react";
import Typography from "@/components/ui/typography";
import { BiGlobe } from "react-icons/bi";

export default function CurrentTimeCard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <BiGlobe size={16} className="text-orange-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Local Time
          </Typography.P>
        </div>
        <div className="text-center">
          <Typography.P className="text-xs font-bold text-primary">
            --:--:--
          </Typography.P>
          <Typography.P className="text-xs text-primary/60 mt-1">
            Loading...
          </Typography.P>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
      <div className="flex items-center gap-2 mb-3">
        <BiGlobe size={16} className="text-orange-500" />
        <Typography.P className="text-xs font-semibold text-primary/80">
          Local Time
        </Typography.P>
      </div>

      <div className="text-center">
        <Typography.P className="text-xs font-bold text-primary">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </Typography.P>
        <Typography.P className="text-xs text-primary/60 mt-1">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography.P>
      </div>
    </div>
  );
}
