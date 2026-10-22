"use client"

import { useCallback, useMemo, useState } from "react"

import { IELTS_WORDS, IELTS_TOPICS, type IeltsWord } from "@/commons/constants/ielts-words"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Play a word's pronunciation from the free Dictionary API (no key). Silent on failure. */
async function playPronunciation(word: string) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!res.ok) return
    const data = await res.json()
    const audio: string | undefined = data?.[0]?.phonetics?.find((p: { audio?: string }) => p.audio)?.audio
    if (audio) await new Audio(audio.startsWith("http") ? audio : `https:${audio}`).play()
  } catch {
    /* offline / not found — flashcards still work */
  }
}

export function IeltsTab() {
  const [topic, setTopic] = useState("All")
  const [deck, setDeck] = useState<IeltsWord[]>(IELTS_WORDS)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [learning, setLearning] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => (topic === "All" ? deck : deck.filter((w) => w.topic === topic)), [deck, topic])
  const card = filtered[index]

  const go = useCallback(
    (dir: 1 | -1) => {
      setFlipped(false)
      setIndex((i) => (filtered.length ? (i + dir + filtered.length) % filtered.length : 0))
    },
    [filtered.length],
  )

  const mark = (bucket: "known" | "learning") => {
    if (!card) return
    const setter = bucket === "known" ? setKnown : setLearning
    const other = bucket === "known" ? setLearning : setKnown
    setter((prev) => new Set(prev).add(card.word))
    other((prev) => {
      const next = new Set(prev)
      next.delete(card.word)
      return next
    })
    go(1)
  }

  const restart = (nextDeck: IeltsWord[] = deck) => {
    setDeck(nextDeck)
    setIndex(0)
    setFlipped(false)
  }

  // Arrow keys only while the card has focus; Space and Enter already turn it, as on any button.
  const onCardKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      go(e.key === "ArrowRight" ? 1 : -1)
    }
  }

  const pickTopic = (t: string) => {
    setTopic(t)
    restart()
  }

  return (
    <div className="flex flex-col gap-5">
      <Select value={topic} onValueChange={pickTopic}>
        <SelectTrigger aria-label="Topic" className="sm:hidden">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {IELTS_TOPICS.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div role="group" aria-label="Topic" className="hidden flex-wrap gap-2 sm:flex">
        {IELTS_TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={t === topic}
            onClick={() => pickTopic(t)}
            className={cn(
              badgeVariants({ variant: "outline" }),
              "min-h-8 transition-colors hover:border-ink [@media(pointer:coarse)]:min-h-11",
              t === topic && "border-ink bg-ink text-paper",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="font-display text-caption tabular-nums text-ink-soft">
        {filtered.length ? `Card ${index + 1} of ${filtered.length}.` : "No cards in this topic."} You know {known.size} and are still learning{" "}
        {learning.size}.
      </p>

      {card ? (
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={onCardKey}
          aria-describedby="ielts-hint"
          className="flex min-h-[16rem] w-full flex-col items-center justify-center gap-4 border border-rule p-5 text-center transition-colors hover:border-ink sm:p-8"
        >
          {flipped ? (
            <span className="flex flex-col gap-3">
              <span className="font-display text-h4 text-ink">{card.word}</span>
              <span className="text-body text-ink">{card.definition}</span>
              <span className="font-display text-body text-ink-soft">&ldquo;{card.example}&rdquo;</span>
              <span className="mt-1 flex flex-wrap justify-center gap-1.5">
                {card.synonyms.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </span>
            </span>
          ) : (
            <>
              <span className="flex items-center gap-2">
                <Chip>{card.pos}</Chip>
                <Chip>{card.topic}</Chip>
              </span>
              <span className="font-display text-h2 text-ink [overflow-wrap:anywhere] sm:text-h1">{card.word}</span>
              <span className="text-caption text-ink-soft">Select to see the meaning</span>
            </>
          )}
        </button>
      ) : (
        <p className="flex min-h-[16rem] items-center justify-center border border-rule font-display text-body text-ink-soft">No words in this topic.</p>
      )}
      <p id="ielts-hint" className="font-display text-caption text-ink-soft">
        <span className="[@media(pointer:coarse)]:hidden">
          Select the card or press Space to turn it. While it has focus, the left and right arrows move between cards.
        </span>
        <span className="hidden [@media(pointer:coarse)]:inline">Tap the card to turn it.</span>
      </p>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="contents sm:flex sm:gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => go(-1)} disabled={!card}>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => go(1)} disabled={!card}>
            Next
          </Button>
          <Button variant="outline" size="sm" className="col-span-2 w-full sm:w-auto" onClick={() => card && playPronunciation(card.word)} disabled={!card}>
            Listen
          </Button>
        </div>
        <div className="contents sm:flex sm:gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => mark("learning")} disabled={!card}>
            Still learning
          </Button>
          <Button size="sm" className="w-full sm:w-auto" onClick={() => mark("known")} disabled={!card}>
            Know it
          </Button>
        </div>
      </div>

      <div className="flex gap-x-6">
        <Button variant="ghost" size="sm" className="px-0" onClick={() => restart(shuffle(IELTS_WORDS))}>
          Shuffle
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => {
            setKnown(new Set())
            setLearning(new Set())
            restart()
          }}
        >
          Reset progress
        </Button>
      </div>
    </div>
  )
}

export default IeltsTab
