"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Ruler, Sparkle, Tag, Weight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pager } from "@/components/ui/pager"
import { PlateFigure } from "@/components/ui/plate-figure"
import { Properties } from "@/components/ui/properties"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getPokemonList, getPokemonDetail, type PokemonDetail } from "@/services/visitor/pokemon"
import { ToolError, ToolLoading, useToolData } from "./tool-status"

const PAGE_SIZE = 24

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  specialAttack: "Special attack",
  specialDefense: "Special defense",
  speed: "Speed",
}

type Detail = { status: "loading" } | { status: "ready"; data: PokemonDetail } | { status: "error"; query: string | number }

const numbered = (id: number) => `No. ${String(id).padStart(3, "0")}`
/** The API sends names and types in lower case ("mr-mime", "grass"). */
const sentence = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export function PokemonTab() {
  const [page, setPage] = useState(1)
  const list = useToolData(useCallback(() => getPokemonList(page, PAGE_SIZE), [page]))
  const [search, setSearch] = useState("")
  const [missing, setMissing] = useState<string | null>(null)
  const [detail, setDetail] = useState<Detail | null>(null)

  const openDetail = async (query: string | number) => {
    setMissing(null)
    setDetail({ status: "loading" })
    try {
      const data = await getPokemonDetail(query)
      if (data) {
        setDetail({ status: "ready", data })
      } else {
        setDetail(null)
        setMissing(String(query))
      }
    } catch {
      setDetail({ status: "error", query })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) openDetail(search.trim())
  }

  const loading = list.status === "loading"

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <Label htmlFor="pokemon-search">Name or number</Label>
          <Input
            id="pokemon-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pikachu or 25"
            aria-invalid={missing ? true : undefined}
            aria-describedby={missing ? "pokemon-search-error" : undefined}
          />
        </div>
        <Button type="submit">Look up</Button>
      </form>
      {missing && (
        <p id="pokemon-search-error" className="-mt-3 flex gap-2 text-caption text-foreground">
          <X aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          No Pokémon called &ldquo;{missing}&rdquo;. Check the spelling, or try its number.
        </p>
      )}

      {list.status === "error" && (
        <ToolError onRetry={list.retry}>The Pokédex did not load.</ToolError>
      )}
      {(list.status !== "error" || list.data) && (
        <>
          <ul role="list" aria-busy={loading} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 [&>li]:min-w-0">
            {loading
              ? Array.from({ length: 12 }, (_, i) => (
                  <li key={i}>
                    <Skeleton className="h-44 rounded-lg" />
                  </li>
                ))
              : list.data?.data.map((p) => (
                  <li key={p.id}>
                    {/* A Notion gallery card that opens the entry in a dialog. */}
                    <button
                      type="button"
                      onClick={() => openDetail(p.id)}
                      className="block w-full overflow-hidden rounded-lg border border-border bg-background text-left transition-colors duration-ui ease-out hover:bg-tint"
                    >
                      <span className="flex h-28 items-center justify-center border-b border-border bg-muted">
                        <span className="relative block size-20">
                          {p.image && <Image src={p.image} alt="" fill sizes="80px" className="object-contain" unoptimized />}
                        </span>
                      </span>
                      <span className="block px-2.5 pb-2.5 pt-2">
                        <span className="block truncate text-small font-medium text-foreground">{sentence(p.name)}</span>
                        <span className="mt-0.5 block truncate text-caption tabular-nums text-muted-foreground">
                          {numbered(p.id)}, {p.types.map(sentence).join(", ")}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
          </ul>
          <Pager page={page} totalPages={list.data?.totalPages ?? 1} loading={loading} onPage={(p) => { setPage(p); document.getElementById("tool-title")?.scrollIntoView() }} />
        </>
      )}

      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          {detail?.status === "loading" && (
            <>
              <DialogTitle className="sr-only">Loading a Pokémon</DialogTitle>
              <ToolLoading />
            </>
          )}
          {detail?.status === "error" && (
            <>
              <DialogTitle>Not loaded</DialogTitle>
              <ToolError onRetry={() => openDetail(detail.query)}>This Pokémon did not load.</ToolError>
            </>
          )}
          {detail?.status === "ready" && <PokemonSheet pokemon={detail.data} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PokemonSheet({ pokemon: p }: Readonly<{ pokemon: PokemonDetail }>) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{sentence(p.name)}</DialogTitle>
        <p className="text-caption tabular-nums text-muted-foreground">{numbered(p.id)}</p>
      </DialogHeader>

      {p.image && (
        <PlateFigure className="mx-auto w-40">
          <div className="relative aspect-square w-full">
            <Image src={p.image} alt={p.name} fill sizes="160px" className="object-contain" unoptimized />
          </div>
        </PlateFigure>
      )}

      <Properties
        items={[
          { label: "Types", icon: <Tag aria-hidden strokeWidth={1.5} />, value: p.types.map((t) => <Chip key={t}>{sentence(t)}</Chip>) },
          { label: "Height", icon: <Ruler aria-hidden strokeWidth={1.5} />, value: <span className="tabular-nums">{(p.height / 10).toFixed(1)} m</span> },
          { label: "Weight", icon: <Weight aria-hidden strokeWidth={1.5} />, value: <span className="tabular-nums">{(p.weight / 10).toFixed(1)} kg</span> },
          {
            label: "Abilities",
            icon: <Sparkle aria-hidden strokeWidth={1.5} />,
            value: <span className="capitalize">{p.abilities.map((a) => `${a.name.replace(/-/g, " ")}${a.isHidden ? " (hidden)" : ""}`).join(", ")}</span>,
          },
        ]}
      />

      <div>
        <h3 className="text-h4 text-foreground">Base stats</h3>
        <ul role="list" className="mt-2">
          {Object.entries(p.stats).map(([key, value]) => (
            <li key={key} className="grid grid-cols-[7.5rem_2.5rem_minmax(0,1fr)] items-center gap-3 py-1 text-small">
              <span className="text-muted-foreground">{STAT_LABELS[key] ?? key}</span>
              <span className="text-right tabular-nums text-foreground">{value}</span>
              <span aria-hidden className="block h-1.5 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-foreground" style={{ width: `${Math.min(100, (value / 200) * 100)}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
