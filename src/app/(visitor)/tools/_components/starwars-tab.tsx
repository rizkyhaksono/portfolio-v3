"use client"

import { useCallback, useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pager } from "@/components/ui/pager"
import { PlateFigure } from "@/components/ui/plate-figure"
import { Skeleton } from "@/components/ui/skeleton"
import { getSWPeople, getSWStarships, type SWPerson, type SWStarship } from "@/services/visitor/starwars"
import { ToolError, useToolData } from "./tool-status"

const known = (value: string) => Boolean(value) && value !== "unknown" && value !== "n/a"
const capitalised = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

/** "Human, male. Born 19 BBY. 1.72 m, 73 kg." Unknown parts are left out. */
function personLine(p: SWPerson) {
  const kind = [p.species, p.gender].filter(known).join(", ")
  const body = [p.height, p.mass].filter(known).join(", ")
  return [kind && `${capitalised(kind)}.`, known(p.birthYear) && `Born ${p.birthYear}.`, body && `${body}.`].filter(Boolean).join(" ")
}

/** "Corvette. Crew of 30-165, hyperdrive class 2.0." */
function shipLine(s: SWStarship) {
  const specs = [known(s.crew) && `crew of ${s.crew}`, known(s.hyperdriveRating) && `hyperdrive class ${s.hyperdriveRating}`].filter(Boolean).join(", ")
  return [known(s.starshipClass) && `${capitalised(s.starshipClass)}.`, specs && `${capitalised(specs)}.`].filter(Boolean).join(" ")
}

interface Entry {
  id: number
  name: string
  image: string | null
  line: string
  extra?: string
}

/** A page of portraits or ships, with a pager and an inline error. */
function PlateGrid({ load, aspect, label }: Readonly<{ load: (page: number) => Promise<{ data: Entry[]; totalPages: number }>; aspect: string; label: string }>) {
  const [page, setPage] = useState(1)
  const list = useToolData(useCallback(() => load(page), [load, page]))
  const loading = list.status === "loading"

  if (list.status === "error") return <ToolError onRetry={list.retry}>The {label} did not load.</ToolError>

  return (
    <div className="space-y-6">
      <ul role="list" aria-busy={loading} className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 10 }, (_, i) => (
              <li key={i}>
                <Skeleton className={aspect} />
              </li>
            ))
          : list.data?.data.map((entry) => (
              <li key={entry.id} className="min-w-0">
                <PlateFigure>
                  {entry.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entry.image} alt="" loading="lazy" referrerPolicy="no-referrer" className={`${aspect} w-full object-cover object-top`} />
                  ) : (
                    <div className={`${aspect} w-full`} />
                  )}
                </PlateFigure>
                <h3 className="mt-3 font-display text-h4 text-ink">{entry.name}</h3>
                {entry.line && <p className="mt-1 text-caption text-ink-soft">{entry.line}</p>}
                {entry.extra && <p className="mt-1 line-clamp-2 text-caption text-ink-soft">{entry.extra}</p>}
              </li>
            ))}
      </ul>
      <Pager page={page} totalPages={list.data?.totalPages ?? 1} loading={loading} onPage={(p) => { setPage(p); document.getElementById("tool-title")?.scrollIntoView() }} />
    </div>
  )
}

const loadPeople = (page: number) =>
  getSWPeople(page).then((res) => ({
    totalPages: res.totalPages,
    data: res.data.map((p) => ({ id: p.id, name: p.name, image: p.image, line: personLine(p), extra: p.affiliations[0] })),
  }))

const loadShips = (page: number) =>
  getSWStarships(page).then((res) => ({
    totalPages: res.totalPages,
    data: res.data.map((s) => ({ id: s.id, name: s.name, image: s.image, line: shipLine(s), extra: known(s.model) && s.model !== s.name ? s.model : undefined })),
  }))

export function StarWarsTab() {
  return (
    <Tabs defaultValue="characters" className="w-full">
      <TabsList>
        <TabsTrigger value="characters">Characters</TabsTrigger>
        <TabsTrigger value="starships">Starships</TabsTrigger>
      </TabsList>
      <TabsContent value="characters">
        <PlateGrid load={loadPeople} aspect="aspect-[3/4]" label="characters" />
      </TabsContent>
      <TabsContent value="starships">
        <PlateGrid load={loadShips} aspect="aspect-[4/3]" label="starships" />
      </TabsContent>
    </Tabs>
  )
}
