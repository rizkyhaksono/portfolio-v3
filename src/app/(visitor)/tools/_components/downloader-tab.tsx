"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Video, ImageIcon, Play } from "lucide-react";
import Image from "next/image";
import type { DownloadResult } from "@/commons/types/tools";

type Platform = "tiktok" | "facebook" | "instagram" | "youtube" | "twitter";

interface PlatformConfig {
  id: Platform;
  name: string;
  description: string;
  icon: typeof Video;
  color: string;
  supportedFormats: string[];
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "tiktok",
    name: "TikTok",
    description: "Download TikTok videos without watermark",
    icon: Video,
    color: "bg-pink-500",
    supportedFormats: ["MP4", "MP3"],
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Download Facebook videos and posts",
    icon: Video,
    color: "bg-blue-500",
    supportedFormats: ["MP4", "HD"],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Download Instagram posts, stories, and reels",
    icon: ImageIcon,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    supportedFormats: ["MP4", "JPG"],
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Download YouTube videos and audio",
    icon: Play,
    color: "bg-red-500",
    supportedFormats: ["MP4", "MP3", "HD", "4K"],
  },
  {
    id: "twitter",
    name: "Twitter",
    description: "Download Twitter videos and GIFs",
    icon: Video,
    color: "bg-blue-400",
    supportedFormats: ["MP4", "GIF"],
  },
];

export function DownloaderTab() {
  const [activePlatform, setActivePlatform] = useState<Platform>("tiktok");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    // Mock download for demo - replace with actual API call
    setTimeout(() => {
      const mockResult: DownloadResult = {
        title: "Sample Video Title - This is a demo result",
        thumbnail: "https://via.placeholder.com/320x180?text=Video+Thumbnail",
        author: "@username",
        duration: "00:45",
        downloadLinks: [
          { quality: "HD (1080p)", url: "#", size: "25.6 MB" },
          { quality: "SD (720p)", url: "#", size: "15.2 MB" },
          { quality: "Audio Only (MP3)", url: "#", size: "3.8 MB" },
        ],
      };

      setResult(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  const currentPlatform = PLATFORMS.find((p) => p.id === activePlatform)!;
  const IconComponent = currentPlatform.icon;

  return (
    <div className="space-y-6">
      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
        {PLATFORMS.map((platform) => {
          const PlatformIcon = platform.icon;
          return (
            <Card
              key={platform.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${activePlatform === platform.id ? "ring-2 ring-primary" : ""
                }`}
              onClick={() => setActivePlatform(platform.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                    <PlatformIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{platform.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {platform.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {platform.supportedFormats.map((format) => (
                    <Badge key={format} variant="secondary" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Downloader Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${currentPlatform.color} text-white`}>
              <IconComponent size={24} />
            </div>
            <div>
              <CardTitle>{currentPlatform.name} Downloader</CardTitle>
              <CardDescription>{currentPlatform.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Paste ${currentPlatform.name} URL here...`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleDownload}
              disabled={!url.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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

          <div className="flex flex-wrap gap-2">
            {currentPlatform.supportedFormats.map((format) => (
              <Badge key={format} variant="outline" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Download Ready</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Image
                src={"/no-image.jpg"}
                width={160}
                height={90}
                alt="Thumbnail"
                className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 line-clamp-2">{result.title}</h3>
                {result.author && (
                  <p className="text-sm text-muted-foreground mb-1">
                    By {result.author}
                  </p>
                )}
                {result.duration && (
                  <Badge variant="secondary" className="text-xs">
                    {result.duration}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {result.downloadLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-between"
                  asChild
                >
                  <a href={link.url} download>
                    <span>{link.quality}</span>
                    <span className="text-xs text-muted-foreground">
                      {link.size || "Unknown size"}
                    </span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Why Use Our Downloader?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">No Watermarks</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Download content without any watermarks or logos
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">High Quality</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Support for HD, 4K, and original quality downloads
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Fast & Free</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Quick processing and completely free to use
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium">Multiple Formats</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Download as video (MP4) or audio (MP3) formats
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
