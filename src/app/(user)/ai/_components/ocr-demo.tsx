"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { track } from "@/lib/analytics"
import { Upload, Loader2, ScanText, FileJson, X } from "lucide-react"

type Mode = "classify" | "extract"
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
    let image: Blob
    try {
      image = await downscale(file)
    } catch {
      toast.error("This image format isn't supported by your browser. Try PNG, JPEG, or WebP.")
      return
    }
    if (image.size > MAX_BYTES) {
      toast.error("Image too large even after resizing (max 2MB).")
      return
    }
    try {
      const dataUrl = await readAsDataUrl(image)
      setPreview(dataUrl)
      setMimeType(image.type)
      setBase64(dataUrl.split(",")[1] ?? "")
      setResult(null)
      setError(null)
    } catch {
      toast.error("Could not read the image.")
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
        setError(json?.message || `OCR failed (${status})`)
        return
      }
      setResult(json.data as OcrResult)
    } catch {
      track("ai-error", { feature: "ocr", status: 0 })
      setError("Could not reach Etan AI. Try again in a minute.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload a document image — the AI classifies it and extracts structured fields as JSON. Nothing is stored.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-3">
          {preview ? (
            <div className="relative overflow-hidden rounded-xl border border-border/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Document preview" className="max-h-72 w-full object-contain bg-muted/30" />
              <button onClick={reset} className="absolute right-2 top-2 rounded-none bg-black/60 p-1 text-white hover:bg-black/80" aria-label="Remove image">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40"
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">Click to upload a document image</span>
              <span className="text-xs">PNG, JPEG, WebP, HEIC · resized before upload</span>
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/heic,image/heif" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border/60 p-0.5 text-sm">
              {(["classify", "extract"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn("rounded-md px-3 py-1 capitalize transition-colors", mode === m ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                  {m}
                </button>
              ))}
            </div>
            <Button onClick={analyze} disabled={!base64 || loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanText className="h-4 w-4" />}
              Analyze
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        {/* Output */}
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <FileJson className="h-3.5 w-3.5" /> Result
          </div>
          <pre className="max-h-72 overflow-auto rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
            {loading
              ? "Analyzing…"
              : result
                ? JSON.stringify(result.parsed ?? result.raw, null, 2)
                : "// Upload an image and click Analyze"}
          </pre>
        </div>
      </div>
    </div>
  )
}
