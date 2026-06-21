import BlurFade from "@/components/magicui/blur-fade"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Wrench } from "lucide-react"
import { getJLPTLevels } from "@/services/visitor/japanese"
import type { ToolTab, JLPTLevel } from "@/commons/types/tools"
import { JapaneseQuizTab } from "./_components/japanese-quiz-tab"
import { AnimeGeneratorTab } from "./_components/anime-generator-tab"
import { DownloaderTab } from "./_components/downloader-tab"
import { WpmTab } from "./_components/wpm-tab"
import { CompilerTab } from "./_components/compiler-tab"
import { PostalCodeTab } from "./_components/postal-code-tab"
import { Web3CryptoTab } from "./_components/web3-crypto-tab"
import { PokemonTab } from "./_components/pokemon-tab"
import { StarWarsTab } from "./_components/starwars-tab"
import ToolsBrowser from "./_components/tools-browser"
import { MacWindow } from "@/components/ui/mac-window"
import { logNonCriticalError } from "@/lib/logging"

export const dynamic = "force-dynamic"

interface ToolsPageProps {
  searchParams: Promise<{
    tab?: ToolTab
  }>
}

export default async function ToolsPage({ searchParams }: Readonly<ToolsPageProps>) {
  const params = await searchParams
  const activeTab = params?.tab || "pokemon"

  let jlptLevels: JLPTLevel[] = []
  try {
    const response = await getJLPTLevels()
    jlptLevels = response.levels
  } catch (error) {
    logNonCriticalError("Failed to fetch JLPT levels:", error)
  }

  return (
    <BlurFade delay={0.25} inView>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Wrench className="h-6 w-6" />
            <h1 className="text-2xl sm:text-3xl font-bold">Tools</h1>
          </div>
          <p className="text-muted-foreground">A growing collection of tools — explore, build, and have fun</p>
        </div>

        {/* Sidebar nav + active tool content */}
        <MacWindow title="~/tools" bodyClassName="p-3 sm:p-5">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-60 lg:shrink-0">
            <div className="rounded-xl border border-muted/40 bg-card/40 p-3 lg:sticky lg:top-20">
              <ToolsBrowser activeTab={activeTab} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="pokemon" className="mt-0"><PokemonTab /></TabsContent>
              <TabsContent value="starwars" className="mt-0"><StarWarsTab /></TabsContent>
              <TabsContent value="japanese-quiz" className="mt-0"><JapaneseQuizTab initialLevels={jlptLevels} /></TabsContent>
              <TabsContent value="anime-generator" className="mt-0"><AnimeGeneratorTab /></TabsContent>
              <TabsContent value="downloader" className="mt-0"><DownloaderTab /></TabsContent>
              <TabsContent value="wpm" className="mt-0"><WpmTab /></TabsContent>
              <TabsContent value="compiler" className="mt-0"><CompilerTab /></TabsContent>
              <TabsContent value="postal-code" className="mt-0"><PostalCodeTab /></TabsContent>
              <TabsContent value="web3-crypto" className="mt-0"><Web3CryptoTab /></TabsContent>
            </Tabs>
          </div>
        </div>
        </MacWindow>
      </div>
    </BlurFade>
  )
}
