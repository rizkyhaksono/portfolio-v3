import BlurFade from "@/components/magicui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Wrench, Languages, Sparkles, Download, Keyboard, Code, MapPin, TrendingUp } from "lucide-react"
import { getJLPTLevels } from "@/services/visitor/japanese"
import type { ToolTab, JLPTLevel } from "@/commons/types/tools"
import { JapaneseQuizTab } from "./_components/japanese-quiz-tab"
import { AnimeGeneratorTab } from "./_components/anime-generator-tab"
import { DownloaderTab } from "./_components/downloader-tab"
import { WpmTab } from "./_components/wpm-tab"
import { CompilerTab } from "./_components/compiler-tab"
import { PostalCodeTab } from "./_components/postal-code-tab"
import { Web3CryptoTab } from "./_components/web3-crypto-tab"
import Link from "next/link"

interface ToolsPageProps {
  searchParams: Promise<{
    tab?: ToolTab
  }>
}

const TOOL_CATEGORIES = [
  {
    id: "japanese-quiz" as ToolTab,
    name: "Japanese Quiz",
    description: "JLPT vocabulary & quiz practice",
    icon: Languages,
  },
  {
    id: "anime-generator" as ToolTab,
    name: "Anime Generator",
    description: "Random anime image generator",
    icon: Sparkles,
  },
  {
    id: "downloader" as ToolTab,
    name: "Downloader",
    description: "Social media video downloader",
    icon: Download,
  },
  {
    id: "wpm" as ToolTab,
    name: "WPM Test",
    description: "Typing speed test",
    icon: Keyboard,
  },
  {
    id: "compiler" as ToolTab,
    name: "Compiler",
    description: "Online code compiler",
    icon: Code,
  },
  {
    id: "postal-code" as ToolTab,
    name: "Postal Code",
    description: "Indonesian postal code lookup",
    icon: MapPin,
  },
  {
    id: "web3-crypto" as ToolTab,
    name: "Web3 Crypto",
    description: "Cryptocurrency prices & charts",
    icon: TrendingUp,
  },
]

export default async function ToolsPage({ searchParams }: Readonly<ToolsPageProps>) {
  const params = await searchParams
  const activeTab = params?.tab || "japanese-quiz"

  let jlptLevels: JLPTLevel[] = []
  try {
    const response = await getJLPTLevels()
    jlptLevels = response.levels
  } catch (error) {
    console.error("Failed to fetch JLPT levels:", error)
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
          <p className="text-muted-foreground">A collection of useful tools to help with your daily tasks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
          {TOOL_CATEGORIES.map((tool) => {
            const IconComponent = tool.icon
            const isActive = activeTab === tool.id

            return (
              <Link key={tool.id} href={`/tools?tab=${tool.id}`} className="block">
                <Card className={`hover:shadow-lg transition-all cursor-pointer  ${isActive ? "ring-2 ring-primary shadow-lg" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-foreground text-background">
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{tool.name}</h3>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                      {isActive && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
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

          <TabsContent value="compiler" className="mt-6">
            <CompilerTab />
          </TabsContent>

          <TabsContent value="postal-code" className="mt-6">
            <PostalCodeTab />
          </TabsContent>

          <TabsContent value="web3-crypto" className="mt-6">
            <Web3CryptoTab />
          </TabsContent>
        </Tabs>
      </div>
    </BlurFade>
  )
}
