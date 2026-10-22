"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pager } from "@/components/ui/pager"
import { PlateFigure } from "@/components/ui/plate-figure"
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
// The API sends names and types in lower case ("mr-mime", "grass").
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
        <p id="pokemon-search-error" className="-mt-3 flex gap-2 font-display text-caption text-ink">
          <X aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          No Pokémon called &ldquo;{missing}&rdquo;. Check the spelling, or try its number.
        </p>
      )}

      {list.status === "error" && (
        <ToolError onRetry={list.retry}>The Pokédex did not answer. Check your connection and try again.</ToolError>
      )}
      {(list.status !== "error" || list.data) && (
        <>
          <ul role="list" aria-busy={loading} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {loading
              ? Array.from({ length: 12 }, (_, i) => (
                  <li key={i}>
                    <Skeleton className="h-48" />
                  </li>
                ))
              : list.data?.data.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => openDetail(p.id)}
                      className="flex h-48 w-full flex-col items-center gap-1 border border-rule p-3 text-center transition-colors hover:border-ink"
                    >
                      <PlateFigure tone="color" className="w-20 shrink-0">
                        <span className="relative block aspect-square w-full">
                          {p.image && <Image src={p.image} alt="" fill sizes="80px" className="object-contain" unoptimized />}
                        </span>
                      </PlateFigure>
                      <span className="mt-1 font-display text-caption tabular-nums text-ink-soft">{numbered(p.id)}</span>
                      <span className="w-full truncate text-small font-semibold text-ink">{sentence(p.name)}</span>
                      <span className="w-full truncate text-caption text-ink-soft">{sentence(p.types.join(", "))}</span>
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
        <p className="font-display text-caption tabular-nums text-ink-soft">{numbered(p.id)}</p>
      </DialogHeader>

      {p.image && (
        <PlateFigure tone="color" className="mx-auto w-40">
          <div className="relative aspect-square w-full">
            <Image src={p.image} alt={p.name} fill sizes="160px" className="object-contain" unoptimized />
          </div>
        </PlateFigure>
      )}

      <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-t border-rule pt-3 text-small">
        <dt className="text-ink-soft">Types</dt>
        <dd className="text-ink">{sentence(p.types.join(", "))}</dd>
        <dt className="text-ink-soft">Height</dt>
        <dd className="tabular-nums text-ink">{(p.height / 10).toFixed(1)} m</dd>
        <dt className="text-ink-soft">Weight</dt>
        <dd className="tabular-nums text-ink">{(p.weight / 10).toFixed(1)} kg</dd>
        <dt className="text-ink-soft">Abilities</dt>
        <dd className="capitalize text-ink">
          {p.abilities.map((a) => `${a.name.replace(/-/g, " ")}${a.isHidden ? " (hidden)" : ""}`).join(", ")}
        </dd>
      </dl>

      <div>
        <h3 className="font-display text-h4 text-ink">Base stats</h3>
        <ul role="list" className="mt-2">
          {Object.entries(p.stats).map(([key, value]) => (
            <li key={key} className="grid grid-cols-[7.5rem_2.5rem_minmax(0,1fr)] items-center gap-3 py-1 text-small">
              <span className="text-ink-soft">{STAT_LABELS[key] ?? key}</span>
              <span className="text-right tabular-nums text-ink">{value}</span>
              <span aria-hidden className="block h-3 border border-rule-strong">
                <span className="bg-hatch block h-full border-r border-ink" style={{ width: `${Math.min(100, (value / 200) * 100)}%` }} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
