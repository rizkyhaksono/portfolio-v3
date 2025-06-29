"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { useState } from "react";
import { Download, Play, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DownloadResult {
  title: string;
  thumbnail: string;
  downloadLinks: {
    quality: string;
    url: string;
    size?: string;
  }[];
  author?: string;
  duration?: string;
}

const TOOLS = [
  {
    id: "tiktok",
    name: "TikTok Downloader",
    description: "Download TikTok videos without watermark",
    icon: Video,
    color: "bg-pink-500",
    supportedFormats: ["MP4", "MP3"],
  },
  {
    id: "facebook",
    name: "Facebook Downloader",
    description: "Download Facebook videos and posts",
    icon: Video,
    color: "bg-blue-500",
    supportedFormats: ["MP4", "HD"],
  },
  {
    id: "instagram",
    name: "Instagram Downloader",
    description: "Download Instagram posts, stories, and reels",
    icon: Image,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    supportedFormats: ["MP4", "JPG"],
  },
  {
    id: "youtube",
    name: "YouTube Downloader",
    description: "Download YouTube videos and audio",
    icon: Play,
    color: "bg-red-500",
    supportedFormats: ["MP4", "MP3", "HD", "4K"],
  },
  {
    id: "twitter",
    name: "Twitter Downloader",
    description: "Download Twitter videos and GIFs",
    icon: Video,
    color: "bg-blue-400",
    supportedFormats: ["MP4", "GIF"],
  },
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("tiktok");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

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

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center mb-6">
        <p className="text-center text-xl font-semibold">Tools</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {`These tools are my personal projects to help your needs..`}
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 mb-4">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Disclaimer:</strong> {`Under development....`}
          </p>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TOOLS.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{tool.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.supportedFormats.map((format) => (
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

      {/* Main Downloader */}
      <Card>
        <CardHeader>
          <CardTitle>Download Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {TOOLS.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="text-xs">
                  {tool.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {TOOLS.map((tool) => (
              <TabsContent key={tool.id} value={tool.id} className="space-y-4">
                <div className="text-center py-4">
                  <div className={`inline-flex p-3 rounded-full ${tool.color} text-white mb-3`}>
                    <tool.icon size={24} />
                  </div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Paste ${tool.name.split(" ")[0]} URL here...`}
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
                    {tool.supportedFormats.map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Download Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Download Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <img
                src={result.thumbnail}
                alt="Thumbnail"
                className="w-32 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{result.title}</h3>
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
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Why Use Our Tools?</CardTitle>
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
    </BlurFade>
  );
}