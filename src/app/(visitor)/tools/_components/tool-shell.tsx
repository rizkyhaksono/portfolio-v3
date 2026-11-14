"use client"

import { useEffect, useRef, type ComponentType } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import type { ToolTab } from "@/commons/types/tools"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolSkeleton } from "./tool-status"

const loading = () => <ToolSkeleton />

// Only the open tool's code is fetched.
const PokemonTab = dynamic(() => import("./pokemon-tab").then((m) => m.PokemonTab), { loading })
const StarWarsTab = dynamic(() => import("./starwars-tab").then((m) => m.StarWarsTab), { loading })
const AnimeGeneratorTab = dynamic(() => import("./anime-generator-tab").then((m) => m.AnimeGeneratorTab), { loading })
const WpmTest = dynamic(() => import("./wpm/wpm-test"), { loading })
const JapaneseQuizTab = dynamic(() => import("./japanese-quiz-tab").then((m) => m.JapaneseQuizTab), { loading })
const IeltsTab = dynamic(() => import("./ielts-tab").then((m) => m.IeltsTab), { loading })
const DownloaderTab = dynamic(() => import("./downloader-tab").then((m) => m.DownloaderTab), { loading })
const PostalCodeTab = dynamic(() => import("./postal-code-tab").then((m) => m.PostalCodeTab), { loading })
const Web3CryptoTab = dynamic(() => import("./web3-crypto-tab").then((m) => m.Web3CryptoTab), { loading })

interface Tool {
  id: ToolTab
  name: string
  note: string
  Panel: ComponentType
}

const TOOLS: Tool[] = [
  { id: "pokemon", name: "Pokédex", note: "Every Pokémon, with its types, base stats and abilities.", Panel: PokemonTab },
  { id: "starwars", name: "Star Wars", note: "Characters and starships from the films and series.", Panel: StarWarsTab },
  { id: "anime-generator", name: "Anime generator", note: "A random anime image by mood, or a random anime quote.", Panel: AnimeGeneratorTab },
  { id: "wpm", name: "WPM test", note: "How many words a minute you type, and how cleanly.", Panel: WpmTest },
  { id: "japanese-quiz", name: "Japanese quiz", note: "JLPT vocabulary from N5 to N1, as a word list or a ten-question quiz.", Panel: JapaneseQuizTab },
  { id: "ielts", name: "IELTS flashcards", note: "Band 7 academic words for the writing and speaking papers.", Panel: IeltsTab },
  { id: "downloader", name: "Downloader", note: "Save a video or post from TikTok, Instagram, YouTube, X or Facebook.", Panel: DownloaderTab },
  { id: "postal-code", name: "Postal code", note: "Indonesian postal codes by place, or the places behind a postal code.", Panel: PostalCodeTab },
  { id: "web3-crypto", name: "Web3 crypto", note: "Coin prices, what is trending, and a price chart.", Panel: Web3CryptoTab },
]

const DEFAULT_TOOL: ToolTab = "pokemon"

/**
 * Notion's view tabs over the open tool. Each tab is a link to `?tab=`, so a tool can be shared or opened in a new
 * tab; manual activation keeps the arrow keys moving focus without loading every tool on the way.
 * `tab` is null in the static fallback, before the URL is read.
 */
export function ToolCabinet({ tab }: Readonly<{ tab: ToolTab | null }>) {
  const tool = TOOLS.find((t) => t.id === tab)
  const listRef = useRef<HTMLDivElement>(null)

  // On phones the tabs scroll sideways: bring the open one into view, so a shared link shows which tool it is.
  useEffect(() => {
    listRef.current?.querySelector("[data-state=active]")?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [tab])

  return (
    <Tabs value={tab ?? ""} activationMode="manual">
      <TabsList ref={listRef} aria-label="Tools" className="sm:flex-wrap">
        {TOOLS.map((t) => (
          <TabsTrigger key={t.id} value={t.id} asChild>
            <Link href={`/tools?tab=${t.id}`} replace scroll={false} data-track="tool-open" data-track-tool={t.id}>
              {t.name}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>

      {tool ? (
        <TabsContent value={tool.id} className="relative">
          <h2 id="tool-title" className="sr-only">
            {tool.name}
          </h2>
          <p className="text-small text-muted-foreground">{tool.note}</p>
          <div className="mt-6">
            <tool.Panel />
          </div>
        </TabsContent>
      ) : (
        <div className="mt-6">
          <ToolSkeleton />
        </div>
      )}
    </Tabs>
  )
}

/** Reads `?tab=`; an unknown tab opens the default tool. */
export function ToolShell() {
  const param = useSearchParams().get("tab")
  const tab = TOOLS.some((t) => t.id === param) ? (param as ToolTab) : DEFAULT_TOOL
  return <ToolCabinet tab={tab} />
}
