"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { InkLink } from "@/components/ui/ink-link"
import { track } from "@/lib/analytics"
import { ErrorNote } from "./error-note"

interface Source {
  sourceType: string
  sourceId: string
  score: number
}
interface JdFitResult {
  fitScore: number
  verdict: string
  matchingSkills: string[]
  matchingProjects: string[]
  gaps: string[]
  summary: string
  sources: Source[]
}

type ShareState = "idle" | "copied" | "failed"

const MIN_LENGTH = 20
const SHARE_LABEL: Record<ShareState, string> = { idle: "Share result", copied: "Link copied", failed: "Could not share" }

const bandOf = (score: number) => (score >= 70 ? "strong" : score >= 40 ? "partial" : "weak")
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** 0 to 100 ruler: hatched up to the score, ticks every ten, a 2px ink mark at the score. The numeral carries the value. */
function FitRuler({ score }: Readonly<{ score: number }>) {
  return (
    <div aria-hidden className="mt-4">
      <div className="relative h-6 border-b border-ink">
        <div className="bg-hatch absolute inset-y-0 left-0" style={{ width: `${score}%` }} />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className={i % 5 === 0 ? "h-3 w-px bg-ink" : "h-1.5 w-px bg-ink"} />
          ))}
        </div>
        <span className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `calc(${score}% - ${score / 50}px)` }} />
      </div>
      <div className="mt-1 flex justify-between font-display text-caption tabular-nums text-ink-soft">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

function TagList({ title, items }: Readonly<{ title: string; items: string[] }>) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="text-small font-semibold text-ink">{title}</h3>
      <ul role="list" className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <li key={i}>
            <Badge variant="outline">{item}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function JdMatcher() {
  const [jd, setJd] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JdFitResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [share, setShare] = useState<ShareState>("idle")

  const score = result ? Math.max(0, Math.min(100, Math.round(result.fitScore))) : 0

  const analyze = async () => {
    const text = jd.trim()
    if (text.length < MIN_LENGTH || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    setShare("idle")
    try {
      const res = await fetch("/api/ai/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: text }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || json?.status >= 400) {
        const status = res.ok ? json.status : res.status
        track("ai-error", { feature: "jd-match", status })
        track("ai-jd-run", { band: "none", status: status === 429 ? "limited" : "error" })
        setError(json?.message || `Analysis failed (${status})`)
        return
      }
      const data = json.data as JdFitResult
      setResult(data)
      track("ai-jd-run", { band: bandOf(data.fitScore), status: "ok" })
    } catch {
      track("ai-error", { feature: "jd-match", status: 0 })
      track("ai-jd-run", { band: "none", status: "error" })
      setError("Could not reach Etan AI. Try again in a minute.")
    } finally {
      setLoading(false)
    }
  }

  // Shares the score and verdict with a link to the tool, never the job description itself.
  const shareResult = async () => {
    if (!result) return
    const band = bandOf(score)
    const text = `Rizky Haksono scored ${score} out of 100 for a role I checked with Etan AI${result.verdict ? ` (${result.verdict})` : ""}.`
    const url = `${window.location.origin}/ai?tab=hirefit`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Hire fit", text, url })
        track("hirefit-share", { band, status: "shared" })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setShare("copied")
        track("hirefit-share", { band, status: "copied" })
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      setShare("failed")
      track("hirefit-share", { band, status: "error" })
    }
  }

  const short = jd.trim().length < MIN_LENGTH

  return (
    <div className="max-w-[66ch] space-y-5">
      <p className="text-body text-ink-soft">
        Paste a job description. Etan weighs it against Rizky&apos;s real experience and says where he fits and where he
        does not.
      </p>
      <div>
        <Label htmlFor="ai-jd">Job description</Label>
        <Textarea
          id="ai-jd"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={6}
          maxLength={6000}
          placeholder="Paste the posting here"
          className="resize-y"
          disabled={loading}
          aria-describedby="ai-jd-hint"
        />
        <p id="ai-jd-hint" className="mt-1 font-display text-caption text-ink-soft">
          At least {MIN_LENGTH} characters, up to 6,000.
        </p>
      </div>
      <Button onClick={analyze} disabled={loading || short} aria-busy={loading}>
        {loading ? "Checking…" : "Check the fit"}
      </Button>

      {error && <ErrorNote>{error}</ErrorNote>}

      {result && (
        <section aria-labelledby="ai-fit-title" className="space-y-6 border-t border-ink pt-6">
          <div>
            <h2 id="ai-fit-title" className="text-small font-semibold text-ink">
              Fit score
            </h2>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-numeral tabular-nums text-ink">{score}</span>
              <span className="font-display text-lead text-ink-soft">out of 100</span>
            </p>
            {result.verdict && <p className="mt-1 font-display text-lead text-ink">{result.verdict}</p>}
            <FitRuler score={score} />
          </div>

          {result.summary && <p className="text-body text-ink">{result.summary}</p>}

          <TagList title="Matching skills" items={result.matchingSkills} />
          <TagList title="Relevant experience" items={result.matchingProjects} />

          {result.gaps.length > 0 && (
            <div>
              <h3 className="text-small font-semibold text-ink">Gaps</h3>
              <div className="prose prose--chat mt-2">
                <ul>
                  {result.gaps.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result.sources.length > 0 && (
            <div>
              <h3 className="text-small font-semibold text-ink">Drawn from</h3>
              <ul role="list" className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-small tabular-nums text-ink">
                {result.sources.map((src, i) => {
                  const label = `${sentence(src.sourceType)}, ${Math.round(src.score * 100)}% match`
                  return (
                    <li key={i}>
                      {src.sourceType === "project" ? <InkLink href={`/project/${encodeURIComponent(src.sourceId)}`}>{label}</InkLink> : label}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className="border-t border-rule pt-4">
            <Button variant="outline" onClick={shareResult}>
              <span aria-live="polite">{SHARE_LABEL[share]}</span>
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
