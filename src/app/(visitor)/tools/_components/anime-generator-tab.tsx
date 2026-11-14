"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { PlateFigure } from "@/components/ui/plate-figure"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAnimeImage, getAnimeQuote, type AnimeImageType, type AnimeQuote } from "@/services/visitor/anime"
import { StatusLine } from "@/components/ui/status-line"
import { ChoiceGroup, TOOL_CONTROLS, ToolError } from "./tool-status"

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
      <div className={TOOL_CONTROLS}>
        <ChoiceGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />

        <div className="flex gap-2">
          <Button type="button" onClick={generate} disabled={loading} aria-busy={loading} data-umami-event="anime-generate" data-umami-event-category={category} className="flex-1 sm:flex-none">
            {loading ? "Generating…" : "Generate image"}
          </Button>
          {picture && (
            <Button variant="outline" asChild className="flex-1 sm:flex-none">
              <a href={picture.url} download={`anime-${picture.category}.${picture.extension}`}>
                Download
              </a>
            </Button>
          )}
        </div>
      </div>

      {failed && <ToolError onRetry={generate}>The image did not load. Try again in a moment.</ToolError>}

      {picture ? (
        <PlateFigure className="w-fit max-w-full sm:max-w-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picture.url} alt={`A random ${picture.category} image`} className="mx-auto h-auto max-h-[32rem] w-auto max-w-full" />
        </PlateFigure>
      ) : (
        !failed && <StatusLine kind="empty">Pick a category, then press Generate image.</StatusLine>
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
      <Button type="button" onClick={fetchQuote} disabled={loading} aria-busy={loading} data-umami-event="anime-quote" className="w-full sm:w-auto">
        {loading ? "Fetching…" : "Get a quote"}
      </Button>

      {error && <ToolError>{error}</ToolError>}

      {quote ? (
        // Notion's quote block: a 3px ink bar beside the line.
        <figure className="max-w-[60ch] border-l-[3px] border-foreground pl-4">
          <blockquote className="text-body text-foreground">&ldquo;{quote.content}&rdquo;</blockquote>
          <figcaption className="mt-2 text-small text-muted-foreground">
            {quote.character.name}, {quote.anime.name}
          </figcaption>
        </figure>
      ) : (
        !error && <StatusLine kind="empty">Press Get a quote for a random line from an anime.</StatusLine>
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
