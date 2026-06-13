"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Video, ImageIcon, Play, ExternalLink, Info, Copy, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import type { DownloadResult, InstagramDownloadData } from "@/commons/types/tools"

type Platform = "tiktok" | "facebook" | "instagram" | "youtube" | "twitter"

interface PlatformConfig {
  id: Platform
  name: string
  description: string
  icon: typeof Video
  supportedFormats: string[]
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "tiktok",
    name: "TikTok",
    description: "Download TikTok videos without watermark",
    icon: Video,
    supportedFormats: ["MP4", "MP3"],
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Download Facebook videos and posts",
    icon: Video,
    supportedFormats: ["MP4", "HD"],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Download Instagram posts, stories, and reels",
    icon: ImageIcon,
    supportedFormats: ["MP4", "JPG"],
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Download YouTube videos and audio",
    icon: Play,
    supportedFormats: ["MP4", "MP3", "HD", "4K"],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    description: "Download Twitter videos and GIFs",
    icon: Video,
    supportedFormats: ["MP4", "GIF"],
  },
]

// Instagram specific result type
interface InstagramResult {
  type: "instagram"
  data: InstagramDownloadData
}

// Standard download result type
interface StandardResult {
  type: "standard"
  data: DownloadResult
}

type ResultType = InstagramResult | StandardResult | null

export function DownloaderTab() {
  const [activePlatform, setActivePlatform] = useState<Platform>("tiktok")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ResultType>(null)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      await processDownload()
    } catch (error) {
      console.error("Download error:", error)
      setResult({
        type: "standard",
        data: {
          title: "Error",
          thumbnail: "/no-image.jpg",
          downloadLinks: [],
          author: error instanceof Error ? error.message : "Failed to download. Please check the URL and try again.",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const processDownload = async () => {
    switch (activePlatform) {
      case "facebook": {
        const { downloadFromFacebook } = await import("@/services/visitor/downloader")
        const downloadResult = await downloadFromFacebook(url)
        if (downloadResult?.data) {
          setResult({ type: "standard", data: downloadResult.data })
        }
        break
      }
      case "instagram": {
        const { downloadFromInstagram } = await import("@/services/visitor/downloader")
        const igResult = await downloadFromInstagram(url)
        handleInstagramResult(igResult)
        break
      }
      case "tiktok": {
        const { downloadFromTikTok } = await import("@/services/visitor/downloader")
        const downloadResult = await downloadFromTikTok(url)
        if (downloadResult?.data) {
          setResult({ type: "standard", data: downloadResult.data })
        }
        break
      }
      case "twitter": {
        const { downloadFromX } = await import("@/services/visitor/downloader")
        const downloadResult = await downloadFromX(url)
        if (downloadResult?.data) {
          setResult({ type: "standard", data: downloadResult.data })
        }
        break
      }
      case "youtube": {
        const { downloadFromYouTube } = await import("@/services/visitor/downloader")
        const downloadResult = await downloadFromYouTube(url)
        if (downloadResult?.data) {
          setResult({ type: "standard", data: downloadResult.data })
        }
        break
      }
      default:
        throw new Error("Unsupported platform")
    }
  }

  const handleInstagramResult = (igResult: unknown) => {
    if (!igResult || typeof igResult !== "object") return

    // Check if it's the new Instagram response format (with success and embedUrl)
    if ("success" in igResult && "data" in igResult) {
      const response = igResult as { success: boolean; data: InstagramDownloadData }
      if (response.success && response.data && "embedUrl" in response.data) {
        setResult({ type: "instagram", data: response.data })
        return
      }
    }

    // Fall back to standard format
    if ("data" in igResult) {
      const response = igResult as { data: DownloadResult }
      setResult({ type: "standard", data: response.data })
    }
  }

  const currentPlatform = PLATFORMS.find((p) => p.id === activePlatform)!
  const ResultIcon = currentPlatform.icon

  return (
    <div className="space-y-6">
      {/* Platform Selector - Horizontal Pills */}
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => {
          const PlatformIcon = platform.icon
          const isActive = activePlatform === platform.id
          return (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "bg-foreground text-background" : "bg-secondary/50 hover:bg-secondary text-foreground"}`}
            >
              <PlatformIcon size={16} />
              {platform.name}
            </button>
          )
        })}
      </div>

      {/* Supported Formats */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Supports:</span>
        {currentPlatform.supportedFormats.map((format) => (
          <Badge key={format} variant="outline" className="text-xs">
            {format}
          </Badge>
        ))}
      </div>

      {/* Download Input */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input placeholder={`Paste ${currentPlatform.name} URL here...`} value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
          <Button onClick={handleDownload} disabled={!url.trim() || isLoading} className="px-6">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{currentPlatform.description}</p>
      </div>

      {/* Instagram Result (New Format) */}
      {result?.type === "instagram" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Instagram Content Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.data.note && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Service Notice</AlertTitle>
                <AlertDescription>{result.data.note}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Shortcode</p>
                  <p className="text-xs text-muted-foreground truncate">{result.data.shortcode}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.data.shortcode)}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href={result.data.embedUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Embed
                  </a>
                </Button>

                <Button variant="default" className="w-full justify-start gap-2" asChild>
                  <a href={result.data.directUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" />
                    Open Direct URL
                  </a>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">Open the direct URL in your browser, then right-click on the video/image to save it.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Download Result */}
      {result?.type === "standard" && (
        <Card className="overflow-hidden border-muted/40">
          {result.data.downloadLinks && result.data.downloadLinks.length > 0 ? (
            <CardContent className="p-0">
              {/* Media preview */}
              <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background">
                {result.data.thumbnail && result.data.thumbnail !== "/no-image.jpg" ? (
                  <Image src={result.data.thumbnail} alt={result.data.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-background/60 text-primary/70 shadow-sm backdrop-blur-sm">
                    <ResultIcon className="h-8 w-8" />
                  </div>
                )}
                <Badge className="absolute left-3 top-3 gap-1 border-0 bg-green-500/90 text-white">
                  <CheckCircle2 className="h-3 w-3" />
                  Ready
                </Badge>
              </div>

              {/* Info + actions */}
              <div className="space-y-4 p-5">
                <div className="space-y-1.5">
                  <h3 className="break-all text-base font-semibold leading-snug line-clamp-2">{result.data.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">{currentPlatform.name}</Badge>
                    {result.data.duration && <Badge variant="secondary" className="text-xs">{result.data.duration}</Badge>}
                    {result.data.author && <span className="text-xs text-muted-foreground">By {result.data.author}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  {result.data.downloadLinks.map((link, i) => (
                    <Button key={link.url} variant={i === 0 ? "default" : "outline"} className="w-full justify-between gap-2" asChild>
                      <a href={link.url} download target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          {link.quality}
                        </span>
                        {link.size && <span className="text-xs opacity-70">{link.size}</span>}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <Info className="h-6 w-6 text-destructive" />
              </div>
              <p className="font-semibold">Download failed</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {result.data.author || "Couldn't fetch this URL. Check the link and try again."}
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
