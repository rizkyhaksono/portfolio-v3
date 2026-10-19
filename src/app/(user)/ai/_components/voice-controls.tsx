"use client"

import { Button } from "@/components/ui/button"
import { Mic, Volume2 } from "lucide-react"
import { useSpeechRecognition } from "./use-voice"

/** Square toggle plus a state word beside it. Nothing animates, so it reads the same under reduced motion. */
function VoiceToggle({
  on,
  label,
  word,
  icon,
  disabled,
  onClick,
}: Readonly<{ on: boolean; label: string; word: string; icon: React.ReactNode; disabled?: boolean; onClick: () => void }>) {
  return (
    <span className="inline-flex items-center gap-2">
      <Button type="button" size="icon" variant={on ? "default" : "outline"} aria-pressed={on} aria-label={label} disabled={disabled} onClick={onClick}>
        {icon}
      </Button>
      <span aria-live="polite" className="font-display text-caption text-ink-soft">
        {word}
      </span>
    </span>
  )
}

/** Mic dictation. Pushes recognised text up via onTranscript. Renders nothing where the browser has no recognition. */
export function MicButton({ onTranscript, disabled }: Readonly<{ onTranscript: (t: string) => void; disabled?: boolean }>) {
  const { supported, listening, start, stop } = useSpeechRecognition(onTranscript)
  if (!supported) return null
  return (
    <VoiceToggle
      on={listening}
      label="Dictate"
      word={listening ? "Listening" : "Dictate"}
      icon={<Mic strokeWidth={1.5} aria-hidden />}
      disabled={disabled}
      onClick={() => (listening ? stop() : start())}
    />
  )
}

/** Voice replies. The caller owns the state and calls speak() on new replies. */
export function TtsToggle({ on, onToggle }: Readonly<{ on: boolean; onToggle: () => void }>) {
  return (
    <VoiceToggle
      on={on}
      label="Read replies aloud"
      word={on ? "Voice on" : "Voice off"}
      icon={<Volume2 strokeWidth={1.5} aria-hidden />}
      onClick={onToggle}
    />
  )
}
