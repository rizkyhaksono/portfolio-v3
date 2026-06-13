"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search, Gamepad2, Rocket, Sparkles, Code, Keyboard, Download, Languages, MapPin, TrendingUp } from "lucide-react"
import type { ToolTab } from "@/commons/types/tools"
import { cn } from "@/lib/utils"

interface ToolItem {
  id: ToolTab
  name: string
  icon: typeof Code
  category: string
}

const TOOLS: ToolItem[] = [
  { id: "pokemon", name: "Pokédex", icon: Gamepad2, category: "Fun & Lore" },
  { id: "starwars", name: "Star Wars", icon: Rocket, category: "Fun & Lore" },
  { id: "anime-generator", name: "Anime Generator", icon: Sparkles, category: "Fun & Lore" },
  { id: "compiler", name: "Compiler", icon: Code, category: "Developer" },
  { id: "wpm", name: "WPM Test", icon: Keyboard, category: "Developer" },
  { id: "downloader", name: "Downloader", icon: Download, category: "Media" },
  { id: "japanese-quiz", name: "Japanese Quiz", icon: Languages, category: "Learning" },
  { id: "postal-code", name: "Postal Code", icon: MapPin, category: "Utilities" },
  { id: "web3-crypto", name: "Web3 Crypto", icon: TrendingUp, category: "Utilities" },
]

const CATEGORY_ORDER = ["Fun & Lore", "Developer", "Media", "Learning", "Utilities"]

export default function ToolsBrowser({ activeTab }: { activeTab: ToolTab }) {
  const [query, setQuery] = useState("")

  const filtered = TOOLS.filter((t) =>
    `${t.name} ${t.category}`.toLowerCase().includes(query.toLowerCase().trim()),
  )
  const grouped = CATEGORY_ORDER
    .map((cat) => ({ cat, tools: filtered.filter((t) => t.category === cat) }))
    .filter((g) => g.tools.length > 0)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools…" className="h-9 pl-9" />
      </div>

      <nav className="space-y-4">
        {grouped.map(({ cat, tools }) => (
          <div key={cat}>
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">{cat}</p>
            <div className="grid grid-cols-2 gap-1 lg:grid-cols-1 lg:gap-0.5">
              {tools.map((tool) => {
                const Icon = tool.icon
                const isActive = activeTab === tool.id
                return (
                  <Link
                    key={tool.id}
                    href={`/tools?tab=${tool.id}`}
                    scroll={false}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive ? "bg-primary/10 font-medium text-primary" : "text-foreground/80 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span className="truncate">{tool.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">No tools match &ldquo;{query}&rdquo;.</p>
        )}
      </nav>
    </div>
  )
}
