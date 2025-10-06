"use client";

import Typography from "@/components/ui/typography";
import { MdDevices, MdTrendingUp } from "react-icons/md";
import { BiCalendar, BiGlobe } from "react-icons/bi";
import { useEffect, useState } from "react";

const NavbarRightSidebar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickStats = [
    { label: "Projects", value: "15+" },
    { label: "Experience", value: "2+ Years" },
    { label: "Technologies", value: "20+" },
    { label: "Coffee Cups", value: "∞" }
  ];

  const currentlyListening = {
    song: "Bohemian Rhapsody",
    artist: "Queen",
    isPlaying: true
  };

  return (
    <div className="flex flex-col space-y-4 mt-4 pt-4 border-t border-border">
      {/* Status */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Status
          </Typography.P>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BiCalendar size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">
              Available for work
            </Typography.P>
          </div>
          <div className="flex items-center gap-2">
            <MdDevices size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">
              Building cool stuff
            </Typography.P>
          </div>
        </div>

        <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <Typography.P className="text-xs text-green-600 dark:text-green-400">
            🚀 Open to opportunities
          </Typography.P>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <MdTrendingUp size={16} className="text-blue-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Quick Stats
          </Typography.P>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-secondary/30 rounded-lg p-2 text-center">
              <Typography.P className="text-sm font-bold text-primary">
                {stat.value}
              </Typography.P>
              <Typography.P className="text-xs text-primary/60">
                {stat.label}
              </Typography.P>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Listening */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Now Playing
          </Typography.P>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">♪</span>
          </div>
          <div className="flex-1 min-w-0">
            <Typography.P className="text-xs font-medium text-primary/90 truncate">
              {currentlyListening.song}
            </Typography.P>
            <Typography.P className="text-xs text-primary/60 truncate">
              {currentlyListening.artist}
            </Typography.P>
          </div>
        </div>

        {currentlyListening.isPlaying && (
          <div className="mt-2 flex items-center gap-1">
            <div className="w-1 h-3 bg-green-500 rounded animate-pulse"></div>
            <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-75"></div>
            <div className="w-1 h-4 bg-green-500 rounded animate-pulse delay-150"></div>
            <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-200"></div>
          </div>
        )}
      </div>

      {/* Local Time */}
      {isClient && (
        <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <BiGlobe size={16} className="text-orange-500" />
            <Typography.P className="text-sm font-semibold text-primary/80">
              Local Time
            </Typography.P>
          </div>

          <div className="text-center">
            <Typography.P className="text-2xl font-bold text-primary">
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
      )}
    </div>
  );
};

export default NavbarRightSidebar;
