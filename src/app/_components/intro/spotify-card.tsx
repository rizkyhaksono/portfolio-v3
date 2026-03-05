"use client"

import { useEffect, useState } from "react"
import { SpotifyNowPlaying } from "@/services/visitor/spotify"
import { SiSpotify } from "react-icons/si"
import Link from "next/link"
import { Music } from "lucide-react"

export default function SpotifyCard() {
  const [data, setData] = useState<SpotifyNowPlaying | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch("/api/spotify")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Failed to fetch Spotify status", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpotify()
    const interval = setInterval(fetchSpotify, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-background/50 p-2 max-w-[250px] animate-pulse">
        <div className="p-2 bg-muted rounded-md">
          <SiSpotify className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-2 bg-muted rounded w-3/4"></div>
          <div className="h-2 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!data?.isPlaying) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2 pr-4 max-w-[300px] text-xs transition-colors hover:bg-accent/50 cursor-default">
        <div className="p-1.5 bg-[#1DB954]/10 rounded-md text-[#1DB954]">
          <SiSpotify className="size-4" />
        </div>
        <span className="text-muted-foreground font-medium truncate">Not Playing</span>
        <Music className="size-3 text-muted-foreground ml-auto opacity-50" />
      </div>
    )
  }

  return (
    <Link
      href={data.songUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col md:flex-row items-center gap-3 rounded-xl border border-border/50 bg-white/5 dark:bg-neutral-900/40 backdrop-blur-md p-2 max-w-sm transition-all hover:bg-white/10 dark:hover:bg-neutral-800/60 hover:shadow-md hover:-translate-y-0.5"
    >
      {data.albumImageUrl ? (
        <img src={data.albumImageUrl} alt={data.album} className="size-10 object-cover rounded-md shadow-sm group-hover:shadow-md transition-shadow" />
      ) : (
        <div className="p-2 bg-[#1DB954]/10 rounded-md text-[#1DB954]">
          <SiSpotify className="size-6" />
        </div>
      )}

      <div className="flex flex-col min-w-0 pr-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <SiSpotify className="size-3 text-[#1DB954] flex-shrink-0" />
          <p className="text-sm font-semibold truncate text-foreground group-hover:text-[#1DB954] transition-colors">{data.title}</p>
        </div>
        <p className="text-xs text-muted-foreground truncate">{data.artist}</p>
      </div>

      <div className="ml-auto hidden items-end justify-center gap-0.5 pr-2 h-4 sm:flex">
        <span className="w-0.5 h-full bg-[#1DB954] animate-[bounce_1s_infinite] rounded-full" style={{ animationDelay: "0s" }}></span>
        <span className="w-0.5 h-3/4 bg-[#1DB954] animate-[bounce_1s_infinite] rounded-full" style={{ animationDelay: "0.2s" }}></span>
        <span className="w-0.5 h-1/2 bg-[#1DB954] animate-[bounce_1s_infinite] rounded-full" style={{ animationDelay: "0.4s" }}></span>
        <span className="w-0.5 h-full bg-[#1DB954] animate-[bounce_1s_infinite] rounded-full" style={{ animationDelay: "0.6s" }}></span>
      </div>
    </Link>
  )
}
