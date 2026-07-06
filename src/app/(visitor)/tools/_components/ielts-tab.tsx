"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { IELTS_WORDS, IELTS_TOPICS, type IeltsWord } from "@/commons/constants/ielts-words"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"
import { Volume2, RotateCcw, Shuffle, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react"

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

  const mark = useCallback(
    (bucket: "known" | "learning") => {
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
    },
    [card, go],
  )

  const reshuffle = useCallback(() => {
    setDeck(shuffle(IELTS_WORDS))
    setIndex(0)
    setFlipped(false)
  }, [])

  const reset = useCallback(() => {
    setKnown(new Set())
    setLearning(new Set())
    setIndex(0)
    setFlipped(false)
  }, [])

  // Reset position when the topic filter changes.
  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [topic])

  // Keyboard: space/enter flip, arrows navigate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === "ArrowRight") go(1)
      else if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Eyebrow>
          <GraduationCap className="h-3.5 w-3.5" />
          IELTS Vocabulary
        </Eyebrow>
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Flashcards</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Band 7+ academic words for Writing &amp; Speaking. Tap the card to reveal — or press Space.
        </p>
      </div>

      {/* Topic filter */}
      <div className="flex flex-wrap gap-1.5">
        {IELTS_TOPICS.map((t) => (
          <button key={t} type="button" onClick={() => setTopic(t)}>
            <Chip className={cn(t === topic && "border-foreground bg-primary text-primary-foreground")}>{t}</Chip>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>{filtered.length ? `Card ${index + 1} / ${filtered.length}` : "No cards"}</span>
        <span className="flex gap-3">
          <span>Known {known.size}</span>
          <span>Learning {learning.size}</span>
        </span>
      </div>

      {/* Card */}
      {card ? (
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="group relative flex min-h-[16rem] w-full cursor-pointer flex-col items-center justify-center gap-4 border border-border bg-card p-8 text-center transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {!flipped ? (
            <>
              <div className="flex items-center gap-2">
                <Chip>{card.pos}</Chip>
                <Chip>{card.topic}</Chip>
              </div>
              <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{card.word}</p>
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation()
                  playPronunciation(card.word)
                }}
                className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                <Volume2 className="h-3.5 w-3.5" /> Listen
              </span>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">Tap to reveal</p>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="font-display text-lg font-bold tracking-tight">{card.word}</p>
              <p className="text-sm text-foreground">{card.definition}</p>
              <p className="text-sm italic text-muted-foreground">&ldquo;{card.example}&rdquo;</p>
              <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                {card.synonyms.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
          )}
        </button>
      ) : (
        <div className="flex min-h-[16rem] items-center justify-center border border-border bg-card text-sm text-muted-foreground">
          No words in this topic.
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={!card}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => go(1)} disabled={!card}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => mark("learning")} disabled={!card}>
            Still learning
          </Button>
          <Button size="sm" onClick={() => mark("known")} disabled={!card}>
            Know it
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={reshuffle}>
          <Shuffle className="h-4 w-4" /> Shuffle
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset progress
        </Button>
      </div>
    </div>
  )
}

export default IeltsTab
