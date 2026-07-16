"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { getPokemonList, getPokemonDetail, type PokemonCard, type PokemonDetail } from "@/services/visitor/pokemon"
import { cn } from "@/lib/utils"

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-stone-400", fire: "bg-orange-500", water: "bg-blue-500", electric: "bg-yellow-400",
  grass: "bg-green-500", ice: "bg-cyan-400", fighting: "bg-red-600", poison: "bg-purple-500",
  ground: "bg-amber-600", flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-stone-500", ghost: "bg-violet-700", dragon: "bg-indigo-600", dark: "bg-neutral-700",
  steel: "bg-slate-400", fairy: "bg-pink-300",
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP", attack: "ATK", defense: "DEF", specialAttack: "Sp.ATK", specialDefense: "Sp.DEF", speed: "SPD",
}

function TypeBadge({ type }: { type: string }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize text-white", TYPE_COLORS[type] ?? "bg-stone-400")}>{type}</span>
}

export function PokemonTab() {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<PokemonDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await getPokemonList(p, 24)
      setCards(res.data)
      setTotalPages(res.totalPages)
      setPage(res.page)
    } catch {
      toast.error("Failed to load Pokémon")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(1) }, [load])

  const openDetail = async (idOrName: string | number) => {
    setDetailLoading(true)
    setDetail(null)
    try {
      const d = await getPokemonDetail(idOrName)
      if (d) setDetail(d)
      else toast.error("Pokémon not found")
    } catch {
      toast.error("Failed to load Pokémon")
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) openDetail(search.trim())
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Pokémon by name or #id…" className="pl-9" />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />)
          : cards.map((p) => (
              <button key={p.id} onClick={() => openDetail(p.id)} className="group rounded-xl border border-border bg-card p-3 text-center shadow-sm transition-colors hover:border-foreground/20">
                <div className="relative mx-auto h-20 w-20">
                  {p.image ? <Image src={p.image} alt={p.name} fill className="object-contain transition-transform group-hover:scale-110" unoptimized /> : null}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">#{String(p.id).padStart(3, "0")}</p>
                <p className="truncate text-sm font-semibold capitalize">{p.name}</p>
                <div className="mt-1 flex flex-wrap justify-center gap-1">{p.types.map((t) => <TypeBadge key={t} type={t} />)}</div>
              </button>
            ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => load(page - 1)} disabled={page <= 1 || loading}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => load(page + 1)} disabled={page >= totalPages || loading}><ChevronRight className="h-4 w-4" /></Button>
      </div>

      <Dialog open={detailLoading || !!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-md">
          {detailLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : detail ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 capitalize">
                  {detail.name}
                  <span className="text-sm font-normal text-muted-foreground">#{String(detail.id).padStart(3, "0")}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative mx-auto h-40 w-40">
                  {detail.image ? <Image src={detail.image} alt={detail.name} fill className="object-contain" unoptimized /> : null}
                </div>
                <div className="flex justify-center gap-2">{detail.types.map((t) => <TypeBadge key={t} type={t} />)}</div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-xs text-muted-foreground">Height</p><p className="font-medium">{(detail.height / 10).toFixed(1)} m</p></div>
                  <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-xs text-muted-foreground">Weight</p><p className="font-medium">{(detail.weight / 10).toFixed(1)} kg</p></div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-semibold">Base Stats</p>
                  {Object.entries(detail.stats).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="w-14 text-xs text-muted-foreground">{STAT_LABELS[k] ?? k}</span>
                      <span className="w-8 text-right text-xs font-medium">{v}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (v / 200) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="mb-1.5 text-sm font-semibold">Abilities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.abilities.map((a) => (
                      <Badge key={a.name} variant={a.isHidden ? "outline" : "secondary"} className="capitalize">
                        {a.name.replace(/-/g, " ")}{a.isHidden ? " (hidden)" : ""}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
