"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { PlateFigure } from "@/components/ui/plate-figure"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAnimeImage, getAnimeQuote, type AnimeImageType, type AnimeQuote } from "@/services/visitor/anime"
import { ToolError } from "./tool-status"

// Waifu and neko are hidden on purpose (the owner's call in 55c7fa7); the service still serves them, so add them back here.
const CATEGORIES: { id: AnimeImageType; name: string }[] = [
  { id: "cringe", name: "Cringe" },
  { id: "blush", name: "Blush" },
  { id: "dance", name: "Dance" },
]

interface Picture {
  url: string
  category: AnimeImageType
  extension: string
}

function Images() {
  const [category, setCategory] = useState<AnimeImageType>("cringe")
  const [picture, setPicture] = useState<Picture | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const request = useRef<AbortController | null>(null)

  // Object URLs hold the whole picture in memory: free one when the next replaces it and when the tool closes.
  useEffect(() => () => { if (picture) URL.revokeObjectURL(picture.url) }, [picture])
  useEffect(() => () => request.current?.abort(), [])

  const generate = async () => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    setFailed(false)
    try {
      const blob = await getAnimeImage(category, controller.signal)
      setPicture({ url: URL.createObjectURL(blob), category, extension: blob.type.split("/")[1] || "png" })
    } catch {
      if (!controller.signal.aborted) setFailed(true)
    } finally {
      if (request.current === controller) setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button key={c.id} type="button" size="sm" variant={category === c.id ? "default" : "outline"} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
            {c.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={generate} disabled={loading} aria-busy={loading} data-umami-event="anime-generate" data-umami-event-category={category}>
          {loading ? "Generating…" : "Generate image"}
        </Button>
        {picture && (
          <Button variant="outline" asChild>
            <a href={picture.url} download={`anime-${picture.category}.${picture.extension}`}>
              Download
            </a>
          </Button>
        )}
      </div>

      {failed && <ToolError onRetry={generate}>The image did not load. Try again in a moment.</ToolError>}

      {picture ? (
        <PlateFigure tone="color" className="w-fit max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picture.url} alt={`A random ${picture.category} image`} className="mx-auto h-auto max-h-[32rem] w-auto max-w-full" />
        </PlateFigure>
      ) : (
        !failed && <p className="text-body text-ink-soft">Pick a category, then press Generate image.</p>
      )}
    </div>
  )
}

function Quotes() {
  const [quote, setQuote] = useState<AnimeQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuote = async () => {
    setLoading(true)
    setError(null)
    try {
      setQuote(await getAnimeQuote())
    } catch (err) {
      const limited = err instanceof Error && /too many/i.test(err.message)
      setError(limited ? "Too many quotes asked for. The limit resets in about an hour." : "The quote did not load. Try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button type="button" onClick={fetchQuote} disabled={loading} aria-busy={loading} data-umami-event="anime-quote">
        {loading ? "Fetching…" : "Get a quote"}
      </Button>

      {error && <ToolError>{error}</ToolError>}

      {quote ? (
        <figure className="border-l-2 border-ink pl-5">
          <blockquote className="max-w-[60ch] font-display text-lead text-ink">&ldquo;{quote.content}&rdquo;</blockquote>
          <figcaption className="mt-3 text-small text-ink-soft">
            {quote.character.name}, {quote.anime.name}
          </figcaption>
        </figure>
      ) : (
        !error && <p className="text-body text-ink-soft">Press Get a quote for a random line from an anime.</p>
      )}
    </div>
  )
}

export function AnimeGeneratorTab() {
  // Both panels stay mounted, so switching tabs keeps the picture and the quote.
  return (
    <Tabs defaultValue="images" className="w-full">
      <TabsList>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="quotes">Quotes</TabsTrigger>
      </TabsList>
      <TabsContent value="images" forceMount className="data-[state=inactive]:hidden">
        <Images />
      </TabsContent>
      <TabsContent value="quotes" forceMount className="data-[state=inactive]:hidden">
        <Quotes />
      </TabsContent>
    </Tabs>
  )
}
