"use client";

import { useEffect, useState } from "react";
import Typography from "@/components/ui/typography";
import { MdAccessTime } from "react-icons/md";

const RightSidebarClient = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <MdAccessTime size={14} className="text-primary/60" />
      <Typography.P className="text-xs text-primary/70">
        {isClient ? (
          currentTime.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Jakarta',
            hour12: false
          }) + ' WIB'
        ) : (
          'Loading time...'
        )}
      </Typography.P>
    </div>
  );
};

export default RightSidebarClient;