"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/** Minimal typings for the (non-standard, un-typed) Web Speech recognition API. */
interface SpeechRecognitionResultLike {
  transcript: string
}
type SpeechRecognitionAlternativeList = ArrayLike<SpeechRecognitionResultLike> & { isFinal: boolean }
interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionAlternativeList>
}
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/** Speech-to-text. `onFinal` fires with the recognized text. Chromium-only (`supported`). */
export function useSpeechRecognition(onFinal: (text: string) => void) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  const onFinalRef = useRef(onFinal)
  onFinalRef.current = onFinal

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null)
    return () => recRef.current?.stop()
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = "en-US"
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e) => {
      let text = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const alt = e.results[i]
        if (alt.isFinal) text += alt[0]?.transcript ?? ""
      }
      const trimmed = text.trim()
      if (trimmed) onFinalRef.current(trimmed)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    setListening(true)
    rec.start()
  }, [])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])

  return { supported, listening, start, stop }
}

/** Text-to-speech via the browser SpeechSynthesis API (broadly supported). */
export function useSpeechSynthesis() {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window)
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const clean = text
      .replace(/```[\s\S]*?```/g, " code block ")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[#*_`>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
    if (!clean) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(clean)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utter)
  }, [])

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  return { supported, speaking, speak, cancel }
}
