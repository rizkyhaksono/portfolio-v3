"use client"

import { useState } from "react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlateFigure } from "@/components/ui/plate-figure"
import {
  downloadFromFacebook,
  downloadFromInstagram,
  downloadFromTikTok,
  downloadFromX,
  downloadFromYouTube,
} from "@/services/visitor/downloader"
import type { DownloadResult, InstagramDownloadData } from "@/commons/types/tools"
import { httpUrl } from "@/lib/utils"
import { ToolError } from "./tool-status"

type Platform = "tiktok" | "facebook" | "instagram" | "youtube" | "twitter"

const PLATFORMS: { id: Platform; name: string; note: string }[] = [
  { id: "tiktok", name: "TikTok", note: "Videos without the watermark, as MP4 or MP3." },
  { id: "facebook", name: "Facebook", note: "Videos and posts, as MP4 or HD." },
  { id: "instagram", name: "Instagram", note: "Posts, stories and reels, as MP4 or JPG." },
  { id: "youtube", name: "YouTube", note: "Videos and audio, as MP4, MP3, HD or 4K." },
  { id: "twitter", name: "X (Twitter)", note: "Videos and GIFs, as MP4 or GIF." },
]

const DOWNLOADERS = {
  tiktok: downloadFromTikTok,
  facebook: downloadFromFacebook,
  instagram: downloadFromInstagram,
  youtube: downloadFromYouTube,
  twitter: downloadFromX,
} satisfies Record<Platform, (url: string) => Promise<unknown>>

type Result = { type: "instagram"; data: InstagramDownloadData } | { type: "standard"; data: DownloadResult }

/** The sentence shown when a download is refused. */
const failure = (status?: number) =>
  status === 429
    ? "Too many downloads in a minute. Wait a moment, then try again."
    : status === 400
      ? "That link is not supported. Paste a public TikTok, Instagram, YouTube, X or Facebook link."
      : "That link did not work. Check that the post is public and try again."

/** Matches InkLink: an absolute sr-only box would sit on the first letter of an inline-flex link. */
const NewTabNote = () => (
  <span className="-mr-px inline-block size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]"> (opens in a new tab)</span>
)

export function DownloaderTab() {
  const [platformId, setPlatformId] = useState<Platform>("tiktok")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const platform = PLATFORMS.find((p) => p.id === platformId) ?? PLATFORMS[0]
  const downloadLinks = result?.type === "standard" ? (result.data.downloadLinks ?? []).filter((link) => httpUrl(link.url)) : []

  const copyShortcode = (text: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})

  const handleDownload = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setResult(null)
    setError(null)
    try {
      const response = await DOWNLOADERS[platformId](url.trim())
      // Instagram may answer with an embed link instead of files when the download service is down.
      const data = response.data as DownloadResult | InstagramDownloadData
      setResult("embedUrl" in data ? { type: "instagram", data } : { type: "standard", data })
    } catch (err) {
      setError(failure((err as { status?: number }).status))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Platform" className="grid min-w-0 grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {PLATFORMS.map((p) => (
          <Button
            key={p.id}
            type="button"
            size="sm"
            variant={platformId === p.id ? "default" : "outline"}
            aria-pressed={platformId === p.id}
            onClick={() => setPlatformId(p.id)}
          >
            {p.name}
          </Button>
        ))}
      </div>

      <form onSubmit={handleDownload} className="space-y-2">
        <Label htmlFor="download-url">{platform.name} link</Label>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
          <Input
            id="download-url"
            type="url"
            inputMode="url"
            required
            placeholder="https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-describedby="download-note"
            className="min-w-0 flex-1"
          />
          <Button type="submit" disabled={!url.trim() || isLoading} aria-busy={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Fetching…" : "Download"}
          </Button>
        </div>
        <p id="download-note" className="text-caption text-ink-soft">
          {platform.note}
        </p>
      </form>

      {error && <ToolError onRetry={() => handleDownload()}>{error}</ToolError>}

      {result?.type === "instagram" && (
        <article className="space-y-4 border border-rule p-5">
          <Badge variant="outline" status="outline">
            Preview only
          </Badge>
          <h3 className="font-display text-h4 text-ink">Instagram post found</h3>
          {result.data.note && <p className="text-small text-ink-soft">{result.data.note}</p>}

          <dl className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
            <dt className="text-ink-soft">Shortcode</dt>
            <dd className="min-w-0 break-all text-ink">{result.data.shortcode}</dd>
            <dd>
              <Button variant="ghost" size="sm" onClick={() => copyShortcode(result.data.shortcode)}>
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </dd>
          </dl>

          <div className="grid gap-3 md:grid-cols-2">
            {httpUrl(result.data.embedUrl) && (
              <Button variant="outline" className="w-full" asChild>
                <a href={httpUrl(result.data.embedUrl)!} target="_blank" rel="noopener noreferrer">
                  View the embed
                  <NewTabNote />
                </a>
              </Button>
            )}
            {httpUrl(result.data.directUrl) && (
              <Button className="w-full" asChild>
                <a href={httpUrl(result.data.directUrl)!} target="_blank" rel="noopener noreferrer">
                  Open the direct link
                  <NewTabNote />
                </a>
              </Button>
            )}
          </div>
          <p className="font-display text-caption text-ink-soft">Open the direct link, then save the video or image from your browser.</p>
        </article>
      )}

      {result?.type === "standard" &&
        (downloadLinks.length ? (
          <article className="border border-rule">
            {result.data.thumbnail && result.data.thumbnail !== "/no-image.jpg" && (
              <PlateFigure className="p-3 pb-0">
                <div className="relative aspect-video w-full">
                  <Image src={result.data.thumbnail} alt="" fill sizes="(min-width: 1024px) 40rem, 100vw" className="object-cover" unoptimized />
                </div>
              </PlateFigure>
            )}
            <div className="space-y-4 p-5">
              <Badge variant="outline" status="filled">
                Ready
              </Badge>
              <h3 className="line-clamp-2 break-words font-display text-h4 text-ink">{result.data.title}</h3>
              <p className="font-display text-caption text-ink-soft">
                {[`From ${platform.name}`, result.data.author && `by ${result.data.author}`, result.data.duration && `${result.data.duration} long`]
                  .filter(Boolean)
                  .join(", ")}
                .
              </p>
              <ul role="list" className="space-y-2">
                {downloadLinks.map((link, i) => (
                  <li key={link.url}>
                    <Button variant={i === 0 ? "default" : "outline"} className="w-full justify-between" asChild>
                      <a href={link.url} download target="_blank" rel="noopener noreferrer">
                        <span>
                          Download {link.quality}
                          <NewTabNote />
                        </span>
                        {link.size && <span className="text-caption font-normal tabular-nums">{link.size}</span>}
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ) : (
          <ToolError>Nothing to download came back for this link. Check that the post is public.</ToolError>
        ))}
    </div>
  )
}
