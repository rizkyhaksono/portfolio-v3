"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlateFigure } from "@/components/ui/plate-figure"
import { track } from "@/lib/analytics"
import { Upload } from "lucide-react"
import { ErrorNote } from "./error-note"

type Mode = "classify" | "extract"
const MODES: { id: Mode; label: string }[] = [
  { id: "extract", label: "Extract the fields" },
  { id: "classify", label: "Name the document only" },
]
const MAX_BYTES = 2 * 1024 * 1024
const MAX_SIDE = 1600

interface OcrResult {
  mode: Mode
  raw: string
  parsed: unknown
}

function encode(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, 0.85))
}

// Phone photos (often HEIC, 3-12 MB) are decoded by the browser and re-encoded small before upload.
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const webp = await encode(canvas, "image/webp")
  // Older Safari cannot encode WebP and silently returns PNG, which is far larger.
  const blob = webp?.type === "image/webp" ? webp : await encode(canvas, "image/jpeg")
  if (!blob) throw new Error("Could not encode image")
  return blob
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result))
    fr.onerror = () => reject(new Error("Could not read file"))
    fr.readAsDataURL(file)
  })
}

export default function OcrDemo() {
  const [preview, setPreview] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string>("")
  const [base64, setBase64] = useState<string>("")
  const [mode, setMode] = useState<Mode>("extract")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OcrResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    let image: Blob
    try {
      image = await downscale(file)
    } catch {
      setError("Your browser cannot open this image. Try PNG, JPEG or WebP.")
      return
    }
    if (image.size > MAX_BYTES) {
      setError("The image is still over 2 MB after resizing. Try a smaller photo.")
      return
    }
    try {
      const dataUrl = await readAsDataUrl(image)
      setPreview(dataUrl)
      setMimeType(image.type)
      setBase64(dataUrl.split(",")[1] ?? "")
      setResult(null)
    } catch {
      setError("Could not read the image.")
    }
  }

  const reset = () => {
    setPreview(null)
    setMimeType("")
    setBase64("")
    setResult(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const analyze = async () => {
    if (!base64 || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch("/api/ai/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType, mode }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || json?.status >= 400) {
        const status = res.ok ? json.status : res.status
        track("ai-error", { feature: "ocr", status })
        track("ai-ocr-run", { mode, status: status === 429 ? "limited" : "error" })
        setError(json?.message || `OCR failed (${status})`)
        return
      }
      setResult(json.data as OcrResult)
      track("ai-ocr-run", { mode, status: "ok" })
    } catch {
      track("ai-error", { feature: "ocr", status: 0 })
      track("ai-ocr-run", { mode, status: "error" })
      setError("Could not reach Etan AI. Try again in a minute.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="min-w-0 space-y-5">
        <p className="max-w-[60ch] text-body text-ink-soft">
          Upload a photo or scan of a document. Etan names the kind of document and pulls its fields out as JSON. Nothing
          is stored.
        </p>

        {preview ? (
          <div>
            <PlateFigure tone="color" caption="Your document, resized for upload.">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="The document you uploaded" className="max-h-72 w-full object-contain" />
            </PlateFigure>
            <Button variant="link" size="sm" className="mt-2 px-0" onClick={reset}>
              Remove image
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-48 w-full flex-col items-center justify-center gap-2 border border-dashed border-rule-strong px-4 text-center text-ink transition-colors [transition-duration:var(--dur-ui)] hover:bg-tint"
          >
            <Upload className="size-5" strokeWidth={1.5} aria-hidden />
            <span className="text-body font-semibold">Choose a document image</span>
            <span className="font-display text-caption text-ink-soft">PNG, JPEG, WebP or HEIC. Large photos are resized first.</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
          className="hidden"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        <fieldset>
          <legend className="text-small font-semibold text-ink">What Etan should do</legend>
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)} className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {MODES.map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-body text-ink [@media(pointer:coarse)]:min-h-11">
                <RadioGroupItem value={m.id} />
                {m.label}
              </label>
            ))}
          </RadioGroup>
        </fieldset>

        <Button onClick={analyze} disabled={!base64 || loading} aria-busy={loading}>
          {loading ? "Reading…" : "Read document"}
        </Button>
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>

      <div className="min-w-0">
        <h2 className="text-small font-semibold text-ink">Result</h2>
        {result ? (
          <pre tabIndex={0} className="mt-2 max-h-[60svh] overflow-auto whitespace-pre-wrap break-words bg-tint p-4 text-[0.84375rem] leading-[1.55] text-ink sm:max-h-96">
            {JSON.stringify(result.parsed ?? result.raw, null, 2)}
          </pre>
        ) : (
          <p aria-live="polite" className="mt-2 font-display text-caption text-ink-soft">
            {loading ? "Reading the document…" : "The fields appear here as JSON once the document is read."}
          </p>
        )}
      </div>
    </div>
  )
}
