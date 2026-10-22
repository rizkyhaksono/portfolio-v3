"use client"

import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatStrip } from "@/components/ui/stat-strip"
import { getRandomWords, type Language } from "./wpm-random-text"
import { scoreWord, summarize } from "./score"

const DURATIONS = [15, 30, 60, 120] as const
type Duration = (typeof DURATIONS)[number]

const LANGUAGES: { id: Language; name: string }[] = [
  { id: "en", name: "English" },
  { id: "id", name: "Indonesian" },
]

// The passage shows WINDOW words from the start of the current row of ROW words, and grows before it runs out.
const ROW = 20
const WINDOW = 40

type Phase = "idle" | "running" | "done"
type CharState = "right" | "wrong" | "caret" | "todo"

const CHAR: Record<CharState, string> = {
  right: "text-ink",
  wrong: "bg-ink text-paper",
  caret: "text-ink underline decoration-2 underline-offset-4",
  todo: "text-ink-soft",
}

function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  disabled,
}: Readonly<{ label: string; options: { id: T; name: string }[]; value: T; onChange: (id: T) => void; disabled: boolean }>) {
  return (
    <div role="group" aria-label={label}>
      <p aria-hidden className="text-small font-semibold text-ink">
        {label}
      </p>
      <div className="mt-1 grid grid-cols-2 gap-1 sm:flex sm:flex-wrap">
        {options.map((o) => (
          <Button key={o.id} type="button" size="sm" variant={o.id === value ? "default" : "outline"} aria-pressed={o.id === value} disabled={disabled} onClick={() => onChange(o.id)}>
            {o.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default function WPMTest() {
  const [language, setLanguage] = useState<Language>("en")
  const [duration, setDuration] = useState<Duration>(60)
  const [words, setWords] = useState<string[]>([])
  const [typed, setTyped] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [timeLeft, setTimeLeft] = useState<number>(duration)
  const [phase, setPhase] = useState<Phase>("idle")
  const [tally, setTally] = useState({ correct: 0, errors: 0 })

  const restart = useCallback(
    (freshWords: boolean) => {
      if (freshWords) setWords(getRandomWords(language, 200))
      setTyped([])
      setInput("")
      setTally({ correct: 0, errors: 0 })
      setTimeLeft(duration)
      setPhase("idle")
    },
    [language, duration],
  )

  // New words whenever the language or length changes (and on first mount).
  useEffect(() => restart(true), [restart])

  useEffect(() => {
    if (phase !== "running") return
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase === "running" && timeLeft <= 0) setPhase("done")
  }, [phase, timeLeft])

  const onType = (value: string) => {
    if (phase === "done") return
    if (phase === "idle") setPhase("running")
    if (!value.endsWith(" ")) {
      setInput(value)
      return
    }
    const word = value.trim()
    setInput("")
    if (!word) return

    const s = scoreWord(word, words[typed.length] ?? "")
    setTally((t) => ({ correct: t.correct + s.correct, errors: t.errors + s.errors }))
    setTyped((list) => [...list, word])
    if (typed.length + WINDOW >= words.length) setWords((list) => [...list, ...getRandomWords(language, 100)])
  }

  const { wpm, accuracy } = summarize(tally.correct, tally.errors, duration - timeLeft)
  const start = Math.floor(typed.length / ROW) * ROW

  const charState = (wordIndex: number, charIndex: number, ch: string): CharState => {
    if (wordIndex < typed.length) return typed[wordIndex][charIndex] === ch ? "right" : "wrong"
    if (wordIndex > typed.length) return "todo"
    if (charIndex < input.length) return input[charIndex] === ch ? "right" : "wrong"
    return charIndex === input.length ? "caret" : "todo"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:flex sm:flex-wrap sm:items-end sm:gap-x-8">
        <ChoiceGroup
          label="Length"
          options={DURATIONS.map((d) => ({ id: d, name: `${d} seconds` }))}
          value={duration}
          onChange={setDuration}
          disabled={phase === "running"}
        />
        <ChoiceGroup label="Language" options={LANGUAGES} value={language} onChange={setLanguage} disabled={phase === "running"} />
        <div className="flex gap-x-6">
          <Button variant="ghost" size="sm" className="px-0" onClick={() => restart(true)} disabled={phase === "running"}>
            New words
          </Button>
          <Button variant="ghost" size="sm" className="px-0" onClick={() => restart(false)} disabled={phase === "idle"}>
            Restart
          </Button>
        </div>
      </div>

      {/* One fixed line on phones: nothing above the field may grow while the keyboard is open. */}
      <p className="font-display text-caption tabular-nums text-ink-soft sm:hidden">
        {Math.max(0, timeLeft)} seconds left{phase !== "idle" && `, ${wpm} words a minute`}.
      </p>

      <p className="wpm-passage min-h-[9rem] border border-rule p-5 text-body leading-loose">
        {words.slice(start, start + WINDOW).map((word, k) => {
          const wordIndex = start + k
          return (
            <span key={wordIndex} className="mr-3 inline-block">
              {word.split("").map((ch, j) => (
                <span key={j} className={CHAR[charState(wordIndex, j, ch)]}>
                  {ch}
                </span>
              ))}
            </span>
          )
        })}
      </p>

      <div className="space-y-1">
        <Label htmlFor="wpm-input">Type the words above. The clock starts with your first letter.</Label>
        <Input
          id="wpm-input"
          value={input}
          onChange={(e) => onType(e.target.value)}
          disabled={phase === "done"}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {phase !== "idle" && (
        <StatStrip
          items={[
            { label: "Words a minute", value: wpm },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "Errors", value: tally.errors },
            { label: "Seconds left", value: Math.max(0, timeLeft) },
          ]}
        />
      )}

      {phase === "done" && (
        <div role="status" className="space-y-4 border-t border-ink pt-6">
          <p className="font-display text-h3 text-ink">
            Time is up: {wpm} words a minute at {accuracy}% accuracy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => restart(false)}>Try again</Button>
            <Button variant="outline" onClick={() => restart(true)}>
              New words
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
