"use client"

import { useEffect, type ComponentType } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Coins, Download, Gamepad2, GraduationCap, Keyboard, Languages, Mailbox, Rocket, Sparkles, type LucideIcon } from "lucide-react"

import type { ToolTab } from "@/commons/types/tools"
import { Gallery } from "@/components/ui/media-card"
import { cn } from "@/lib/utils"
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

type Group = "Play" | "Practise" | "Look things up"

interface Tool {
  id: ToolTab
  name: string
  group: Group
  icon: LucideIcon
  /** The card's one muted line. */
  blurb: string
  /** The open tool's line under its heading. */
  note: string
  Panel: ComponentType
}

const TOOLS: Tool[] = [
  { id: "pokemon", name: "Pokédex", group: "Play", icon: Gamepad2, blurb: "Types, stats and abilities", note: "Every Pokémon, with its types, base stats and abilities.", Panel: PokemonTab },
  { id: "starwars", name: "Star Wars", group: "Play", icon: Rocket, blurb: "Characters and starships", note: "Characters and starships from the films and series.", Panel: StarWarsTab },
  { id: "anime-generator", name: "Anime generator", group: "Play", icon: Sparkles, blurb: "Random pictures and quotes", note: "A random anime image by mood, or a random anime quote.", Panel: AnimeGeneratorTab },
  { id: "wpm", name: "Typing test", group: "Practise", icon: Keyboard, blurb: "Words a minute and accuracy", note: "How many words a minute you type, and how cleanly.", Panel: WpmTest },
  { id: "japanese-quiz", name: "Japanese quiz", group: "Practise", icon: Languages, blurb: "JLPT words, N5 to N1", note: "JLPT vocabulary from N5 to N1, as a word list or a ten-question quiz.", Panel: JapaneseQuizTab },
  { id: "ielts", name: "IELTS flashcards", group: "Practise", icon: GraduationCap, blurb: "Band 7 academic words", note: "Band 7 academic words for the writing and speaking papers.", Panel: IeltsTab },
  { id: "downloader", name: "Downloader", group: "Look things up", icon: Download, blurb: "Save a video or a post", note: "Save a video or post from TikTok, Instagram, YouTube, X or Facebook.", Panel: DownloaderTab },
  { id: "postal-code", name: "Postal codes", group: "Look things up", icon: Mailbox, blurb: "Indonesian postal codes", note: "Indonesian postal codes by place, or the places behind a postal code.", Panel: PostalCodeTab },
  { id: "web3-crypto", name: "Web3 crypto", group: "Look things up", icon: Coins, blurb: "Coin prices and charts", note: "Coin prices, what is trending, and a price chart.", Panel: Web3CryptoTab },
]

const GROUPS: Group[] = ["Play", "Practise", "Look things up"]
const DEFAULT_TOOL: ToolTab = "pokemon"
const groupId = (group: Group) => `tools-${group.toLowerCase().replace(/ /g, "-")}`

/** The tool's lucide icon on a 32px grey square, as in a Notion gallery card. */
function ToolIcon({ icon: Icon }: Readonly<{ icon: LucideIcon }>) {
  return (
    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-md bg-tint text-foreground">
      <Icon className="size-4" strokeWidth={1.5} />
    </span>
  )
}

/**
 * Notion's gallery of tools, grouped, above the open tool. Each card is a link to `?tab=`, so a tool can be shared
 * or opened in a new tab. `tab` is null in the static fallback, before the URL is read; `reveal` scrolls the open
 * tool into view when the URL named it and it sits below the fold (phones, mostly).
 */
export function ToolCabinet({ tab, reveal = false }: Readonly<{ tab: ToolTab | null; reveal?: boolean }>) {
  const tool = TOOLS.find((t) => t.id === tab)

  useEffect(() => {
    const title = document.getElementById("tool-title")
    if (reveal && title && title.getBoundingClientRect().top > window.innerHeight * 0.6) title.scrollIntoView({ block: "start" })
  }, [tab, reveal])

  return (
    <>
      <nav aria-label="Tools" className="space-y-6">
        {GROUPS.map((group) => (
          <section key={group} aria-labelledby={groupId(group)}>
            <h2 id={groupId(group)} className="mb-2 text-small font-medium text-muted-foreground">
              {group}
            </h2>
            <Gallery className="sm:grid-cols-3 lg:grid-cols-3">
              {TOOLS.filter((t) => t.group === group).map((t) => {
                const open = t.id === tab
                return (
                  <li key={t.id}>
                    <Link
                      href={`/tools?tab=${t.id}`}
                      replace
                      scroll={false}
                      aria-current={open ? "page" : undefined}
                      data-track="tool-open"
                      data-track-tool={t.id}
                      className={cn(
                        "flex h-full flex-col gap-2 rounded-lg border p-3 transition-colors duration-ui ease-out hover:bg-tint sm:flex-row sm:items-start sm:gap-3",
                        open ? "border-foreground" : "border-border",
                      )}
                    >
                      <ToolIcon icon={t.icon} />
                      <span className="min-w-0">
                        <span className="block text-small font-medium text-foreground">{t.name}</span>
                        <span className="mt-0.5 block text-caption text-muted-foreground">{t.blurb}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </Gallery>
          </section>
        ))}
      </nav>

      <section aria-labelledby="tool-title" className="mt-12 border-t border-border pt-8">
        {tool ? (
          <>
            <h2 id="tool-title" className="flex items-center gap-3 text-h2 text-foreground">
              <ToolIcon icon={tool.icon} />
              {tool.name}
            </h2>
            <p className="mt-2 text-body text-muted-foreground">{tool.note}</p>
            <div className="mt-8">
              <tool.Panel />
            </div>
          </>
        ) : (
          <>
            <h2 id="tool-title" className="sr-only">
              Loading the tool
            </h2>
            <ToolSkeleton />
          </>
        )}
      </section>
    </>
  )
}

/** Reads `?tab=`; an unknown tab opens the default tool. */
export function ToolShell() {
  const param = useSearchParams().get("tab")
  const tab = TOOLS.some((t) => t.id === param) ? (param as ToolTab) : DEFAULT_TOOL
  return <ToolCabinet tab={tab} reveal={param === tab} />
}
