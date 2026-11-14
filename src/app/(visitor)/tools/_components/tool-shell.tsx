"use client"

import { useEffect, useRef, type ComponentType } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Coins, Download, Gamepad2, GraduationCap, Keyboard, Languages, Mailbox, Rocket, Sparkles, type LucideIcon } from "lucide-react"

import type { ToolTab } from "@/commons/types/tools"
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
  /** The open tool's one muted line under its name. */
  note: string
  Panel: ComponentType
}

const TOOLS: Tool[] = [
  { id: "pokemon", name: "Pokédex", group: "Play", icon: Gamepad2, note: "Every Pokémon, with its types, base stats and abilities.", Panel: PokemonTab },
  { id: "starwars", name: "Star Wars", group: "Play", icon: Rocket, note: "Characters and starships from the films and series.", Panel: StarWarsTab },
  { id: "anime-generator", name: "Anime generator", group: "Play", icon: Sparkles, note: "A random anime image by mood, or a random anime quote.", Panel: AnimeGeneratorTab },
  { id: "wpm", name: "Typing test", group: "Practise", icon: Keyboard, note: "How many words a minute you type, and how cleanly.", Panel: WpmTest },
  { id: "japanese-quiz", name: "Japanese quiz", group: "Practise", icon: Languages, note: "JLPT vocabulary from N5 to N1, as a word list or a ten-question quiz.", Panel: JapaneseQuizTab },
  { id: "ielts", name: "IELTS flashcards", group: "Practise", icon: GraduationCap, note: "Band 7 academic words for the writing and speaking papers.", Panel: IeltsTab },
  { id: "downloader", name: "Downloader", group: "Look things up", icon: Download, note: "Save a video or post from TikTok, Instagram, YouTube, X or Facebook.", Panel: DownloaderTab },
  { id: "postal-code", name: "Postal codes", group: "Look things up", icon: Mailbox, note: "Indonesian postal codes by place, or the places behind a postal code.", Panel: PostalCodeTab },
  { id: "web3-crypto", name: "Web3 crypto", group: "Look things up", icon: Coins, note: "Coin prices, what is trending, and a price chart.", Panel: Web3CryptoTab },
]

const GROUPS: Group[] = ["Play", "Practise", "Look things up"]
const DEFAULT_TOOL: ToolTab = "pokemon"
const groupId = (group: Group) => `tools-${group.toLowerCase().replace(/ /g, "-")}`

// One set of links, two looks: a scrolling row of bordered chips on phones, Notion sidebar rows from lg.
const ROW =
  "flex min-h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-border px-3 text-small text-muted-foreground transition-colors duration-75 ease-out hover:bg-tint hover:text-foreground aria-[current=page]:border-transparent aria-[current=page]:bg-tint-strong aria-[current=page]:font-medium aria-[current=page]:text-foreground lg:min-h-8 lg:w-full lg:border-0 lg:px-2 [&>svg]:size-4 [&>svg]:shrink-0"

/**
 * The tools workspace: the list of tools (chips on phones, a sticky list from lg) beside the open tool. Each entry is
 * a link to `?tab=`, so a tool can be shared or opened in a new tab. `tab` is null in the static fallback, before the
 * URL is read.
 */
export function ToolCabinet({ tab }: Readonly<{ tab: ToolTab | null }>) {
  const tool = TOOLS.find((t) => t.id === tab)
  const nav = useRef<HTMLElement>(null)

  // On phones the open tool's chip may sit past the right edge (?tab=web3-crypto): bring it into the row's view.
  useEffect(() => {
    nav.current?.querySelector<HTMLElement>("[aria-current=page]")?.scrollIntoView?.({ block: "nearest", inline: "nearest" })
  }, [tab])

  return (
    <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-14">
      <nav
        ref={nav}
        aria-label="Tools"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:-mx-12 sm:px-12 lg:sticky lg:top-16 lg:mx-0 lg:block lg:space-y-5 lg:overflow-visible lg:p-0"
      >
        {GROUPS.map((group) => (
          <section key={group} aria-labelledby={groupId(group)} className="contents lg:block">
            <h2 id={groupId(group)} className="mb-1 hidden px-2 text-caption font-medium text-muted-foreground lg:block">
              {group}
            </h2>
            <ul role="list" className="contents lg:block lg:space-y-px">
              {TOOLS.filter((t) => t.group === group).map((t) => (
                <li key={t.id} className="contents lg:block">
                  <Link
                    href={`/tools?tab=${t.id}`}
                    replace
                    scroll={false}
                    aria-current={t.id === tab ? "page" : undefined}
                    data-track="tool-open"
                    data-track-tool={t.id}
                    className={ROW}
                  >
                    <t.icon aria-hidden strokeWidth={1.5} />
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <section aria-labelledby="tool-title" className="mt-6 min-w-0 lg:mt-0">
        {tool ? (
          <>
            <h2 id="tool-title" className="flex items-center gap-2 text-h3 text-foreground">
              <tool.icon aria-hidden strokeWidth={1.5} className="size-5 shrink-0" />
              {tool.name}
            </h2>
            <p className="mt-1 text-small text-muted-foreground">{tool.note}</p>
            <div className="mt-6">
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
    </div>
  )
}

/** Reads `?tab=`; an unknown tab opens the default tool. */
export function ToolShell() {
  const param = useSearchParams().get("tab")
  const tab = TOOLS.some((t) => t.id === param) ? (param as ToolTab) : DEFAULT_TOOL
  return <ToolCabinet tab={tab} />
}
