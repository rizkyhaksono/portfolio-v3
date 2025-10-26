import BlurFade from "@/components/magicui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Wrench,
  Languages,
  Sparkles,
  Download,
  Keyboard,
  FolderOpen,
  Code,
} from "lucide-react";
import { getJLPTLevels } from "@/services/visitor/japanese";
import type { ToolTab, JLPTLevel } from "@/commons/types/tools";
import { JapaneseQuizTab } from "./_components/japanese-quiz-tab";
import { AnimeGeneratorTab } from "./_components/anime-generator-tab";
import { DownloaderTab } from "./_components/downloader-tab";
import { WpmTab } from "./_components/wpm-tab";
import { FilesTab } from "./_components/files-tab";
import { CompilerTab } from "./_components/compiler-tab";
import Link from "next/link";

interface ToolsPageProps {
  searchParams: Promise<{
    tab?: ToolTab;
  }>;
}

const TOOL_CATEGORIES = [
  {
    id: "japanese-quiz" as ToolTab,
    name: "Japanese Quiz",
    description: "JLPT vocabulary & quiz practice",
    icon: Languages,
    color: "bg-blue-500",
  },
  {
    id: "anime-generator" as ToolTab,
    name: "Anime Generator",
    description: "Random anime image generator",
    icon: Sparkles,
    color: "bg-pink-500",
  },
  {
    id: "downloader" as ToolTab,
    name: "Downloader",
    description: "Social media video downloader",
    icon: Download,
    color: "bg-purple-500",
  },
  {
    id: "wpm" as ToolTab,
    name: "WPM Test",
    description: "Typing speed test",
    icon: Keyboard,
    color: "bg-green-500",
  },
  {
    id: "files" as ToolTab,
    name: "File Manager",
    description: "Manage your files",
    icon: FolderOpen,
    color: "bg-orange-500",
  },
  {
    id: "compiler" as ToolTab,
    name: "Compiler",
    description: "Online code compiler",
    icon: Code,
    color: "bg-red-500",
  },
];

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const activeTab = params?.tab || "japanese-quiz";

  let jlptLevels: JLPTLevel[] = [];
  try {
    const response = await getJLPTLevels();
    jlptLevels = response.levels;
  } catch (error) {
    console.error("Failed to fetch JLPT levels:", error);
  }

  return (
    <BlurFade delay={0.25} inView>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wrench className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Tools</h1>
          </div>
          <p className="text-muted-foreground">
            A collection of useful tools to help with your daily tasks
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Note:</strong> Some features are under development. Feel free to try them out!
            </p>
          </CardContent>
        </Card>

        {/* Tools Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
          {TOOL_CATEGORIES.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = activeTab === tool.id;

            return (
              <Link
                key={tool.id}
                href={`/tools?tab=${tool.id}`}
                className="block"
              >
                <Card
                  className={`hover:shadow-lg transition-all cursor-pointer  ${isActive ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="japanese-quiz" className="mt-6">
            <JapaneseQuizTab initialLevels={jlptLevels} />
          </TabsContent>

          <TabsContent value="anime-generator" className="mt-6">
            <AnimeGeneratorTab />
          </TabsContent>

          <TabsContent value="downloader" className="mt-6">
            <DownloaderTab />
          </TabsContent>

          <TabsContent value="wpm" className="mt-6">
            <WpmTab />
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <FilesTab />
          </TabsContent>

          <TabsContent value="compiler" className="mt-6">
            <CompilerTab />
          </TabsContent>
        </Tabs>
      </div>
    </BlurFade>
  );
}