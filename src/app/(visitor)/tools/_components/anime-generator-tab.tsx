"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Sparkles, RefreshCw, Quote } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  getAnimeWaifu,
  getAnimeNeko,
  getAnimeCringe,
  getAnimeBlush,
  getAnimeDance,
  getAnimeQuote,
} from "@/services/visitor/anime";

type AnimeType = "waifu" | "neko" | "cringe" | "blush" | "dance";

interface AnimeCategory {
  id: AnimeType;
  name: string;
  description: string;
}

interface AnimeQuoteData {
  content: string;
  anime: {
    id: number;
    name: string;
    altName: string;
  };
  character: {
    id: number;
    name: string;
  };
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

  // Quote states
  const [quote, setQuote] = useState<AnimeQuoteData | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

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

  const generateQuote = async () => {
    setIsLoadingQuote(true);
    setQuote(null);

    try {
      const response = await getAnimeQuote();

      if (response?.data) {
        setQuote(response.data);
        toast.success("Quote loaded successfully!");
      }
    } catch (error: any) {
      console.error("Failed to generate quote:", error);

      // Check for rate limit error (case-insensitive)
      const errorMessage = error.message || String(error);
      if (errorMessage.toLowerCase().includes("rate limit") || errorMessage.toLowerCase().includes("too many requests")) {
        toast.error("Rate Limit Reached", {
          description: "Too many requests! Rate limit will reset in 1 hour.",
          duration: 5000,
        });
      } else {
        toast.error("Failed to Load Quote", {
          description: error.message || "Please try again later.",
        });
      }
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleGenerate = () => {
    generateImage(selectedType);
  };

  const handleGenerateQuote = () => {
    generateQuote();
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
            Anime Generator
          </CardTitle>
          <CardDescription>
            Generate random anime images or discover inspiring quotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images">
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger value="quotes">
                <Quote className="w-4 h-4 mr-2" />
                Quotes
              </TabsTrigger>
            </TabsList>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6 mt-6">
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
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-6 mt-6">
              {/* Generate Quote Button */}
              <Button
                onClick={handleGenerateQuote}
                disabled={isLoadingQuote}
                className="w-full"
                size="lg"
              >
                {isLoadingQuote ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Quote className="w-4 h-4 mr-2" />
                    Generate Random Quote
                  </>
                )}
              </Button>

              {/* Quote Display */}
              {quote && (
                <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 border-gray-300 dark:border-gray-700">
                  <CardContent className="p-6 space-y-4">
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-300 dark:text-gray-700" />
                      <p className="text-lg font-medium italic pl-6 pr-6">
                        "{quote.content}"
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {quote.character.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quote.anime.name}
                        </p>
                      </div>
                      <Button onClick={handleGenerateQuote} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty State for Quotes */}
              {!quote && !isLoadingQuote && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Quote className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Quote Generated Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Click the button above to get a random anime quote
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
