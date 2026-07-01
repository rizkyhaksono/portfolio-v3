"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Target, Loader2, CheckCircle2, AlertTriangle, FileSearch } from "lucide-react"

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

export default function JdMatcher() {
  const [jd, setJd] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JdFitResult | null>(null)

  const analyze = async () => {
    const text = jd.trim()
    if (text.length < 20) {
      toast.error("Paste a longer job description (20+ characters).")
      return
    }
    if (loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/ai/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: text }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed (${res.status})`)
      setResult(json.data as JdFitResult)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed.")
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s: number) => (s >= 70 ? "text-green-500" : s >= 40 ? "text-amber-500" : "text-red-500")
  const barColor = (s: number) => (s >= 70 ? "bg-green-500" : s >= 40 ? "bg-amber-500" : "bg-red-500")

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Paste a job description — I&apos;ll analyze how Rizky fits, grounded in his real experience.
      </p>
      <Textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={6}
        maxLength={6000}
        placeholder="Paste the job description here…"
        className="resize-none"
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button onClick={analyze} disabled={loading || jd.trim().length < 20} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
          Analyze fit
        </Button>
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-border/50 bg-background/60 p-4">
          <div className="flex items-center gap-4">
            <div className={cn("shrink-0 text-4xl font-bold", scoreColor(result.fitScore))}>
              {result.fitScore}
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <div className="min-w-0 flex-1">
              {result.verdict && <Badge variant="secondary" className="mb-1.5">{result.verdict}</Badge>}
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full transition-all", barColor(result.fitScore))} style={{ width: `${result.fitScore}%` }} />
              </div>
            </div>
          </div>

          {result.summary && <p className="text-sm leading-relaxed">{result.summary}</p>}

          {result.matchingSkills.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Matching skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.matchingSkills.map((s, i) => (
                  <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {result.matchingProjects.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Relevant experience</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matchingProjects.map((p, i) => (
                  <Badge key={i} variant="outline">{p}</Badge>
                ))}
              </div>
            </div>
          )}

          {result.gaps.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Gaps
              </p>
              <ul className="list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
                {result.gaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          {result.sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-3">
              <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <FileSearch className="h-3 w-3" /> Sources
              </span>
              {result.sources.map((src, i) => {
                const chip = (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[11px] font-normal capitalize">
                    {src.sourceType} · {Math.round(src.score * 100)}%
                  </Badge>
                )
                return src.sourceType === "project" ? (
                  <Link key={i} href={`/project/${src.sourceId}`} className="hover:opacity-80">{chip}</Link>
                ) : (
                  <span key={i}>{chip}</span>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
