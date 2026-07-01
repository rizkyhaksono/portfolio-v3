"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useSpeechRecognition } from "./use-voice"

/** Mic dictation button — pushes recognized text up via onTranscript. Hidden if unsupported. */
export function MicButton({ onTranscript, disabled }: { onTranscript: (t: string) => void; disabled?: boolean }) {
  const { supported, listening, start, stop } = useSpeechRecognition(onTranscript)
  if (!supported) return null
  return (
    <Button
      type="button"
      variant={listening ? "default" : "ghost"}
      size="icon"
      className="h-11 w-11 shrink-0 rounded-full"
      disabled={disabled}
      onClick={() => (listening ? stop() : start())}
      aria-label={listening ? "Stop dictation" : "Dictate"}
      title={listening ? "Listening… click to stop" : "Speak"}
    >
      {listening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}

/** Speaker toggle — caller owns the on/off state and calls speak() on new replies. */
export function TtsToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Button
      type="button"
      variant={on ? "default" : "ghost"}
      size="icon"
      className="h-11 w-11 shrink-0 rounded-full"
      onClick={onToggle}
      aria-label={on ? "Turn off voice replies" : "Turn on voice replies"}
      title={on ? "Voice replies on" : "Voice replies off"}
    >
      {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </Button>
  )
}
