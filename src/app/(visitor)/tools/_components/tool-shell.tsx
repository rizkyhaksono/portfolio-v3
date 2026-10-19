"use client"

import type { ComponentType } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import type { ToolTab } from "@/commons/types/tools"
import { cn } from "@/lib/utils"
import { ToolSkeleton } from "./tool-status"

const loading = () => <ToolSkeleton />

// Only the open tool's code is fetched.
const PokemonTab = dynamic(() => import("./pokemon-tab").then((m) => m.PokemonTab), { loading })
const StarWarsTab = dynamic(() => import("./starwars-tab").then((m) => m.StarWarsTab), { loading })
const WpmTest = dynamic(() => import("./wpm/wpm-test"), { loading })
const JapaneseQuizTab = dynamic(() => import("./japanese-quiz-tab").then((m) => m.JapaneseQuizTab), { loading })
const IeltsTab = dynamic(() => import("./ielts-tab").then((m) => m.IeltsTab), { loading })
const DownloaderTab = dynamic(() => import("./downloader-tab").then((m) => m.DownloaderTab), { loading })
const PostalCodeTab = dynamic(() => import("./postal-code-tab").then((m) => m.PostalCodeTab), { loading })
const Web3CryptoTab = dynamic(() => import("./web3-crypto-tab").then((m) => m.Web3CryptoTab), { loading })

interface Tool {
  id: ToolTab
  name: string
  group: string
  note: string
  Panel: ComponentType
}

const TOOLS: Tool[] = [
  { id: "pokemon", name: "Pokédex", group: "Play", note: "Every Pokémon, with its types, base stats and abilities.", Panel: PokemonTab },
  { id: "starwars", name: "Star Wars", group: "Play", note: "Characters and starships from the films and series.", Panel: StarWarsTab },
  { id: "wpm", name: "WPM test", group: "Play", note: "How many words a minute you type, and how cleanly.", Panel: WpmTest },
  { id: "japanese-quiz", name: "Japanese quiz", group: "Learn", note: "JLPT vocabulary from N5 to N1, as a word list or a ten-question quiz.", Panel: JapaneseQuizTab },
  { id: "ielts", name: "IELTS flashcards", group: "Learn", note: "Band 7 academic words for the writing and speaking papers.", Panel: IeltsTab },
  { id: "downloader", name: "Downloader", group: "Utilities", note: "Save a video or post from TikTok, Instagram, YouTube, X or Facebook.", Panel: DownloaderTab },
  { id: "postal-code", name: "Postal code", group: "Utilities", note: "Indonesian postal codes by place, or the places behind a postal code.", Panel: PostalCodeTab },
  { id: "web3-crypto", name: "Web3 crypto", group: "Utilities", note: "Coin prices, what is trending, and a price chart.", Panel: Web3CryptoTab },
]

const GROUPS = ["Play", "Learn", "Utilities"]
const DEFAULT_TOOL: ToolTab = "pokemon"

/** Cabinet: a sticky index of tools beside the open one. `tab` is null in the static fallback, before the URL is read. */
export function ToolCabinet({ tab }: Readonly<{ tab: ToolTab | null }>) {
  const tool = TOOLS.find((t) => t.id === tab)

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Tools" className="flex flex-col gap-5 self-start lg:sticky lg:top-[calc(var(--head-h)+1.5rem)]">
        {GROUPS.map((group) => (
          <div key={group}>
            <p className="font-display text-caption text-ink-soft">{group}</p>
            <ul role="list" className="mt-1 grid grid-cols-2 gap-x-6 border-t border-rule lg:grid-cols-1">
              {TOOLS.filter((t) => t.group === group).map((t) => {
                const active = t.id === tab
                return (
                  <li key={t.id} className="border-b border-rule">
                    <Link
                      href={`/tools?tab=${t.id}#tool-title`}
                      replace
                      aria-current={active ? "page" : undefined}
                      data-track="tool-open"
                      data-track-tool={t.id}
                      className={cn(
                        "flex min-h-11 items-center py-2 text-body text-ink underline-offset-[0.18em]",
                        active ? "font-semibold underline decoration-2" : "decoration-1 hover:underline",
                      )}
                    >
                      {t.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {tool ? (
        <section aria-labelledby="tool-title" className="min-w-0">
          <header className="border-b border-rule pb-4">
            <h2 id="tool-title" className="font-display text-h2 text-ink">
              {tool.name}
            </h2>
            <p className="mt-2 max-w-[60ch] text-body text-ink-soft">{tool.note}</p>
          </header>
          <div className="mt-6">
            <tool.Panel />
          </div>
        </section>
      ) : (
        <ToolSkeleton />
      )}
    </div>
  )
}

/** Reads `?tab=`; unknown or retired tabs (the old anime generator) open the default tool. */
export function ToolShell() {
  const param = useSearchParams().get("tab")
  const tab = TOOLS.some((t) => t.id === param) ? (param as ToolTab) : DEFAULT_TOOL
  return <ToolCabinet tab={tab} />
}
