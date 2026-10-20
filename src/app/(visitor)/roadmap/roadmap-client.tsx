"use client"

import { useEffect, useRef, useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRoadmapProgress } from "@/hooks/use-roadmap-progress"
import type { RoadmapContent, RoadmapLevel } from "@/lib/mdx"
import { ogImageUrl } from "@/lib/site-url"
import { courseTitle, minutesOf } from "./course-title"

interface Course {
  course: string
  lessons: Omit<RoadmapContent, "content">[]
}

const LEVELS: [RoadmapLevel, string][] = [
  ["beginner", "Beginner"],
  ["intermediate", "Intermediate"],
  ["advanced", "Advanced"],
]

const NAME_KEY = "roadmap-cert-name"

/** Under sm the slips stack above the panel and push it below the fold, so bring its heading into view. */
const revealPanel = (id: string) => {
  if (!matchMedia("(min-width: 640px)").matches) document.getElementById(`${id}-title`)?.scrollIntoView()
}

function Tick() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  )
}

/** Shown once every lesson of the course is done in this browser. */
function Certificate({ course, name, onName }: Readonly<{ course: string; name: string; onName: (name: string) => void }>) {
  const href = ogImageUrl({ course, name: name.trim() }, "/api/certificate")
  return (
    <div className="mt-6 border-t border-ink pt-4">
      <p className="flex items-center gap-2 font-display text-h4 text-ink">
        <Tick />
        Course completed
      </p>
      <label htmlFor={`${course}-name`} className="mt-4 block text-small font-semibold text-ink">
        Name on the certificate
      </label>
      <Input id={`${course}-name`} value={name} onChange={(event) => onName(event.target.value)} maxLength={48} autoComplete="name" className="max-w-sm" />
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
        Download the certificate<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  )
}

/** Hatched progress rule: the share of lessons done in this browser. */
function Progress({ done, total }: Readonly<{ done: number; total: number }>) {
  return (
    <span aria-hidden className="mt-3 block h-1.5 border border-rule-strong">
      <span className="bg-hatch block h-full border-r border-ink" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
    </span>
  )
}

/** One course open at a time: pick it from the index of slips, read its lessons below. The choice lives in the URL hash. */
export function RoadmapClient({ courses }: Readonly<{ courses: Course[] }>) {
  const { isLoaded, isModuleComplete, completedCount } = useRoadmapProgress()
  const [name, setName] = useState("")
  const ids = courses.map(({ course }) => course)
  const [open, setOpen] = useState(ids[0] ?? "")
  // A hash landing opens a panel after the effect, and the hash names no element, so the browser cannot scroll to it.
  const revealPending = useRef(false)

  const doneOf = (course: Course) => (isLoaded ? completedCount(course.course, course.lessons.map((lesson) => lesson.slug)) : 0)

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "")
    } catch {
      // Storage blocked: the name lasts for this visit only.
    }
  }, [])

  // Start on the hashed course (old #course links keep working), else the one in progress, else the first.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!ids.includes(id)) return
      setOpen(id)
      revealPending.current = true
    }
    if (window.location.hash) fromHash()
    else if (isLoaded) {
      const inProgress = courses.find((course) => {
        const done = doneOf(course)
        return done > 0 && done < course.lessons.length
      })
      if (inProgress) setOpen(inProgress.course)
    }
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  useEffect(() => {
    if (!revealPending.current) return
    revealPending.current = false
    revealPanel(open)
  }, [open])

  const choose = (id: string) => {
    revealPending.current = false
    setOpen(id)
    history.replaceState(null, "", `#${id}`)
  }

  const saveName = (value: string) => {
    setName(value)
    try {
      localStorage.setItem(NAME_KEY, value)
    } catch {
      // As above.
    }
  }

  return (
    <Tabs value={open} onValueChange={choose} className="mt-8">
      <TabsList aria-label="Courses" className="grid grid-cols-1 gap-0 border-b-0 sm:grid-cols-2 lg:grid-cols-5">
        {courses.map((course) => {
          const done = doneOf(course)
          const total = course.lessons.length
          const minutes = course.lessons.reduce((sum, lesson) => sum + minutesOf(lesson.meta.duration), 0)
          return (
            <TabsTrigger
              key={course.course}
              value={course.course}
              data-track="roadmap-course"
              data-track-course={course.course}
              // Radix activates on mousedown, so the panel is mounted by the time click fires.
              onClick={() => revealPanel(course.course)}
              className="block h-full whitespace-normal border-b border-r-0 border-rule px-4 py-3 sm:py-4 text-left font-normal text-ink-soft hover:bg-tint hover:text-ink data-[state=active]:border-b-2 data-[state=active]:border-ink data-[state=active]:bg-tint data-[state=active]:text-ink sm:border-r lg:[&:nth-child(5n)]:border-r-0"
            >
              <span className="block font-display text-h4 text-ink">{courseTitle(course.course)}</span>
              <span className="mt-1 hidden text-small tabular-nums sm:block">
                {total} lessons{minutes > 0 && `, about ${minutes} minutes`}
              </span>
              <Progress done={done} total={total} />
              <span className="mt-1.5 block min-h-[1.35em] font-display text-caption tabular-nums">
                {done === 0 ? "Not started" : done === total ? "Completed" : `${done} of ${total} done`}
              </span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {courses.map((course) => {
        const { course: id, lessons } = course
        const done = doneOf(course)
        const minutes = lessons.reduce((total, lesson) => total + minutesOf(lesson.meta.duration), 0)

        return (
          <TabsContent key={id} value={id} className="mt-12">
            <section aria-labelledby={`${id}-title`}>
              <h2 id={`${id}-title`} className="font-display text-h2 text-balance text-ink">
                {courseTitle(id)}
              </h2>
              <p className="mt-2 max-w-[60ch] text-body text-ink-soft">
                From beginner to advanced in {lessons.length} lessons{minutes > 0 && `, about ${minutes} minutes of reading`}.
                {done > 0 && done < lessons.length && ` You have finished ${done}.`}
              </p>

              {LEVELS.map(([level, label]) => {
                const rows = lessons.filter((lesson) => (lesson.meta.level ?? "beginner") === level)
                if (rows.length === 0) return null
                return (
                  <LedgerList key={level} marker={<h3>{label}</h3>} className="mt-6 md:grid-cols-[10rem_minmax(0,1fr)]">
                    {rows.map(({ slug, meta }) => (
                      <LedgerRow key={slug} titleAs="h4" title={meta.title} href={`/roadmap/${slug}`} meta={meta.duration}>
                        <p>{meta.description}</p>
                        {isLoaded && isModuleComplete(id, slug) && (
                          <p className="mt-1 flex items-center gap-1.5 text-ink">
                            <Tick />
                            Done
                          </p>
                        )}
                      </LedgerRow>
                    ))}
                  </LedgerList>
                )
              })}

              {done === lessons.length ? (
                <Certificate course={id} name={name} onName={saveName} />
              ) : (
                <p className="mt-6 text-small text-ink-soft">Finish all {lessons.length} lessons to download a certificate with your name on it.</p>
              )}
            </section>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
