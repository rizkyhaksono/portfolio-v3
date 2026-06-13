"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, User, Rocket } from "lucide-react"
import { getSWPeople, getSWStarships, type SWPerson, type SWStarship } from "@/services/visitor/starwars"

function Pager({ page, totalPages, loading, onPage }: { page: number; totalPages: number; loading: boolean; onPage: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button variant="outline" size="sm" onClick={() => onPage(page - 1)} disabled={page <= 1 || loading}><ChevronLeft className="h-4 w-4" /></Button>
      <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
      <Button variant="outline" size="sm" onClick={() => onPage(page + 1)} disabled={page >= totalPages || loading}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  )
}

function Characters() {
  const [people, setPeople] = useState<SWPerson[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await getSWPeople(p)
      setPeople(res.data); setTotalPages(res.totalPages); setPage(res.page)
    } catch { toast.error("Failed to load characters") } finally { setLoading(false) }
  }, [])
  useEffect(() => { load(1) }, [load])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />)
          : people.map((p) => (
              <Card key={p.id} className="group overflow-hidden border-muted/40 p-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><User className="h-8 w-8 text-muted-foreground" /></div>
                  )}
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">#{p.id}</span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 pt-6">
                    <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                    <p className="truncate text-[11px] capitalize text-white/70">{p.species !== "unknown" ? p.species : p.gender}</p>
                  </div>
                </div>
                <CardContent className="space-y-2 p-3">
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    {p.birthYear !== "unknown" && <Badge variant="secondary" className="px-1.5 py-0">{p.birthYear}</Badge>}
                    {p.height !== "unknown" && <Badge variant="outline" className="px-1.5 py-0">{p.height}</Badge>}
                    {p.mass !== "unknown" && <Badge variant="outline" className="px-1.5 py-0">{p.mass}</Badge>}
                  </div>
                  {p.affiliations.length > 0 && (
                    <p className="truncate text-[11px] capitalize text-muted-foreground" title={p.affiliations.join(", ")}>{p.affiliations[0]}</p>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>
      <Pager page={page} totalPages={totalPages} loading={loading} onPage={load} />
    </div>
  )
}

function Starships() {
  const [ships, setShips] = useState<SWStarship[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await getSWStarships(p)
      setShips(res.data); setTotalPages(res.totalPages); setPage(res.page)
    } catch { toast.error("Failed to load starships") } finally { setLoading(false) }
  }, [])
  useEffect(() => { load(1) }, [load])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 animate-pulse rounded-xl bg-muted" />)
          : ships.map((s) => (
              <Card key={s.id} className="group overflow-hidden border-muted/40 p-0 transition-shadow hover:shadow-md">
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-muted to-muted/40">
                  {s.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.image} alt={s.name} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><Rocket className="h-8 w-8 text-muted-foreground" /></div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Rocket className="h-4 w-4" /></div>
                    <div className="min-w-0"><p className="truncate font-semibold">{s.name}</p><p className="truncate text-xs text-muted-foreground">{s.starshipClass}</p></div>
                  </div>
                  <p className="mb-2 truncate text-xs text-muted-foreground">{s.model}</p>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <Badge variant="secondary">Crew {s.crew}</Badge>
                    {s.hyperdriveRating !== "unknown" && <Badge variant="outline">HD {s.hyperdriveRating}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
      <Pager page={page} totalPages={totalPages} loading={loading} onPage={load} />
    </div>
  )
}

export function StarWarsTab() {
  return (
    <Tabs defaultValue="characters" className="w-full">
      <TabsList className="grid w-full max-w-xs grid-cols-2">
        <TabsTrigger value="characters" className="gap-1.5"><User className="h-4 w-4" />Characters</TabsTrigger>
        <TabsTrigger value="starships" className="gap-1.5"><Rocket className="h-4 w-4" />Starships</TabsTrigger>
      </TabsList>
      <div className="mt-5">
        <TabsContent value="characters" className="mt-0"><Characters /></TabsContent>
        <TabsContent value="starships" className="mt-0"><Starships /></TabsContent>
      </div>
    </Tabs>
  )
}
