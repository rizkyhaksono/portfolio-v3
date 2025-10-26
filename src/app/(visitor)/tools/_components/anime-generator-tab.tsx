"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Sparkles, RefreshCw } from "lucide-react";
import Image from "next/image";
import {
  getAnimeWaifu,
  getAnimeNeko,
  getAnimeCringe,
  getAnimeBlush,
  getAnimeDance,
} from "@/services/visitor/anime";

type AnimeType = "waifu" | "neko" | "cringe" | "blush" | "dance";

interface AnimeCategory {
  id: AnimeType;
  name: string;
  description: string;
}

const ANIME_CATEGORIES: AnimeCategory[] = [
  { id: "waifu", name: "Waifu", description: "Random anime waifu images" },
  { id: "neko", name: "Neko", description: "Cute cat girl images" },
  { id: "cringe", name: "Cringe", description: "Cringe reaction images" },
  { id: "blush", name: "Blush", description: "Blushing anime characters" },
  { id: "dance", name: "Dance", description: "Dancing anime GIFs" },
];

export function AnimeGeneratorTab() {
  const [selectedType, setSelectedType] = useState<AnimeType>("waifu");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (type: AnimeType) => {
    setIsLoading(true);
    setImageUrl(null);

    try {
      let blob: Blob;

      switch (type) {
        case "waifu":
          blob = await getAnimeWaifu();
          break;
        case "neko":
          blob = await getAnimeNeko();
          break;
        case "cringe":
          blob = await getAnimeCringe();
          break;
        case "blush":
          blob = await getAnimeBlush();
          break;
        case "dance":
          blob = await getAnimeDance();
          break;
        default:
          throw new Error("Invalid anime type");
      }

      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    generateImage(selectedType);
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `anime-${selectedType}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Random Anime Image Generator
          </CardTitle>
          <CardDescription>
            Generate random anime images from various categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ANIME_CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedType === category.id
                  ? "ring-2 ring-primary shadow-md"
                  : "hover:ring-1 hover:ring-muted-foreground/20"
                  }`}
                onClick={() => setSelectedType(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Random Image
              </>
            )}
          </Button>

          {/* Image Display */}
          {imageUrl && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-muted-foreground/10">
                  <Image
                    src={imageUrl}
                    alt={`Anime ${selectedType}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <Button onClick={handleGenerate} variant="outline" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New
                  </Button>
                  <Button onClick={handleDownload} className="flex-1">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!imageUrl && !isLoading && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Image Generated Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Click the button above to generate a random anime image
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
