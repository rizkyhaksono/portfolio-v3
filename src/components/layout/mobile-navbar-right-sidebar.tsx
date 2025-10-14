"use client";

import { useEffect, useState } from "react";
import Typography from "@/components/ui/typography";
import { MdWifi as IpIcon, MdLocationOn, MdDevices, MdTrendingUp } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";
import { SiSpotify } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import { getBrowserInfo, quickStats } from "@/commons/constants/sidebar";
import CurrentTimeCard from "@/components/layout/current-time-card";
import type { PingResponse } from "@/services/visitor/ping";
import type { SpotifyNowPlaying } from "@/services/visitor/spotify";

interface WeatherResponse {
  name?: string;
  main?: {
    temp: number;
    feels_like: number;
  };
  weather?: Array<{
    main: string;
    icon: string;
  }>;
}

const MobileNavbarRightSidebar = () => {
  const [ping, setPing] = useState<PingResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [spotify, setSpotify] = useState<SpotifyNowPlaying | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pingRes, weatherRes, spotifyRes] = await Promise.all([
          fetch('/api/ping').then(res => res.ok ? res.json() : null),
          fetch('/api/weather').then(res => res.ok ? res.json() : null),
          fetch('/api/spotify').then(res => res.ok ? res.json() : null),
        ]);

        setPing(pingRes);
        setWeather(weatherRes);
        setSpotify(spotifyRes);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array - only fetch once on mount

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 mt-4 pt-4 border-t border-border">
        <div className="bg-secondary/20 rounded-lg p-4 border border-border/30 animate-pulse">
          <div className="h-4 bg-secondary/30 rounded w-1/3 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-secondary/30 rounded w-full" />
            <div className="h-3 bg-secondary/30 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 mt-4 pt-4 border-t border-border">
      {/* Visitor Info */}
      {ping?.user_info && (
        <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <Typography.P className="text-sm font-semibold text-primary/80">
              Visitor Info
            </Typography.P>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IpIcon size={14} className="text-primary/60" />
                <Typography.P className="text-xs text-primary/70">
                  IP Address
                </Typography.P>
              </div>
              <div className="bg-secondary/30 rounded px-2 py-1">
                <Typography.P className="text-xs font-mono text-primary/90">
                  {ping.user_info.ip_address?.split(',')[0]?.trim() ?? "Unknown"}
                </Typography.P>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MdLocationOn size={14} className="text-primary/60" />
                <Typography.P className="text-xs text-primary/70">
                  Browser
                </Typography.P>
              </div>
              <div className="bg-secondary/30 rounded px-2 py-1">
                <Typography.P className="text-xs text-primary/90 truncate">
                  {getBrowserInfo(ping.user_info.user_agent)}
                </Typography.P>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MdLocationOn size={14} className="text-primary/60" />
                <Typography.P className="text-xs text-primary/70">
                  Location
                </Typography.P>
              </div>
              <div className="bg-secondary/30 rounded px-2 py-1">
                <Typography.P className="text-xs text-primary/90">
                  {weather?.name ?? "Malang"}, Indonesia
                </Typography.P>
              </div>
            </div>

            <CurrentTimeCard />
          </div>
        </div>
      )}

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

      {/* Currently Listening - Spotify */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <SiSpotify size={16} className="text-green-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            {spotify?.isPlaying ? "Now Playing" : "Spotify"}
          </Typography.P>
        </div>

        {spotify?.isPlaying && spotify.songUrl ? (
          <Link href={spotify.songUrl} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-3 hover:bg-secondary/30 rounded-lg p-2 -m-2 transition-colors">
              {spotify.albumImageUrl ? (
                <Image
                  src={spotify.albumImageUrl}
                  alt={spotify.album || "Album cover"}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <SiSpotify className="text-white" size={24} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Typography.P className="text-xs font-medium text-primary/90 truncate">
                  {spotify.title}
                </Typography.P>
                <Typography.P className="text-xs text-primary/60 truncate">
                  {spotify.artist}
                </Typography.P>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1">
              <div className="w-1 h-3 bg-green-500 rounded animate-pulse"></div>
              <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-75"></div>
              <div className="w-1 h-4 bg-green-500 rounded animate-pulse delay-150"></div>
              <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-200"></div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center justify-center py-4">
            <Typography.P className="text-xs text-primary/60">
              Not playing
            </Typography.P>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavbarRightSidebar;
