import Typography from "@/components/ui/typography"
import { SPOTIFY_PROFILE_URL } from "@/commons/constants/external-links"
import type { SpotifyNowPlaying } from "@/services/visitor/spotify"
import { SiSpotify } from "react-icons/si"
import { ExternalLink, Music2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function SpotifyProfileCard() {
  return (
    <Link
      href={SPOTIFY_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg overflow-hidden border border-green-500/20 bg-gradient-to-br from-green-500/10 via-background to-background hover:border-green-500/40 transition-all"
    >
      <div className="relative h-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.25),transparent_55%)]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1">
            {[3, 5, 4, 6, 3].map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-green-500/60 group-hover:bg-green-500/90 transition-colors"
                style={{ height: `${h * 4}px` }}
              />
            ))}
          </div>
        </div>
        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
          <SiSpotify className="text-white" size={28} />
        </div>
      </div>
      <div className="px-3 pb-3 pt-2 space-y-1">
        <div className="flex items-center gap-1.5">
          <Music2 className="h-3.5 w-3.5 text-green-500" />
          <Typography.P className="text-xs font-medium text-primary/90">Playlists & discoveries</Typography.P>
        </div>
        <Typography.P className="text-[11px] text-primary/55 leading-snug">Catch what I am into on Spotify — no live widget, just good music.</Typography.P>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 group-hover:gap-1.5 transition-all pt-1">
          Open Spotify
          <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}

function SpotifyTrackCard({ spotify, showPlayingBars }: { spotify: SpotifyNowPlaying; showPlayingBars: boolean }) {
  const inner = (
    <div className="flex items-center gap-3 hover:bg-secondary/30 rounded-lg p-2 -m-2 transition-colors">
      {spotify.albumImageUrl ? (
        <Image src={spotify.albumImageUrl} alt={spotify.album || "Album cover"} width={48} height={48} className="w-12 h-12 rounded-lg shrink-0" />
      ) : (
        <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <SiSpotify className="text-white" size={24} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <Typography.P className="text-xs font-medium text-primary/90 truncate">{spotify.title}</Typography.P>
        <Typography.P className="text-xs text-primary/60 truncate">{spotify.artist}</Typography.P>
        {spotify.album && <Typography.P className="text-[11px] text-primary/50 truncate">{spotify.album}</Typography.P>}
      </div>
    </div>
  )

  const bars = showPlayingBars ? (
    <div className="mt-2 flex items-center gap-1">
      <div className="w-1 h-3 bg-green-500 rounded animate-pulse" />
      <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-75" />
      <div className="w-1 h-4 bg-green-500 rounded animate-pulse delay-150" />
      <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-200" />
    </div>
  ) : (
    <Typography.P className="mt-2 text-[11px] text-primary/60">Last played track</Typography.P>
  )

  if (spotify.songUrl) {
    return (
      <Link href={spotify.songUrl} target="_blank" rel="noopener noreferrer">
        {inner}
        {bars}
      </Link>
    )
  }

  return (
    <div>
      {inner}
      {bars}
    </div>
  )
}

export function getSpotifySidebarTitle(spotify: SpotifyNowPlaying): string {
  if (spotify.status === "playing") return "Now Playing"
  if (spotify.status === "recently_played") return "Recently Played"
  if (spotify.status === "link") return "On Spotify"
  return "Spotify"
}

export function SpotifySidebarContent({ spotify }: { spotify: SpotifyNowPlaying }) {
  if (spotify.status === "link") {
    return <SpotifyProfileCard />
  }

  const hasTrack = Boolean(spotify.title && spotify.artist)
  const isLive = spotify.status === "playing" || spotify.status === "recently_played"

  if (isLive && hasTrack) {
    return <SpotifyTrackCard spotify={spotify} showPlayingBars={spotify.status === "playing"} />
  }

  if (spotify.status === "idle" || spotify.status === "error") {
    return <SpotifyProfileCard />
  }

  return <SpotifyProfileCard />
}

export function SpotifySidebarSection({ spotify }: { spotify: SpotifyNowPlaying }) {
  return (
    <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
      <div className="flex items-center gap-2 mb-3">
        <SiSpotify size={16} className="text-green-500" />
        <Typography.P className="text-sm font-semibold text-primary/80">{getSpotifySidebarTitle(spotify)}</Typography.P>
      </div>
      <SpotifySidebarContent spotify={spotify} />
    </div>
  )
}
