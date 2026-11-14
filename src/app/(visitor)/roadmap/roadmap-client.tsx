"use client"

import { useEffect, useRef, useState } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { StatusLine } from "@/components/ui/status-line"
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

/** On phones the course rows push the panel below the fold, so bring its heading into view. */
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
    <div className="mt-10">
      <p className="flex items-center gap-2 text-body text-foreground">
        <Tick />
        Course completed
      </p>
      <label htmlFor={`${course}-name`} className="mt-4 block text-small text-foreground">
        Name on the certificate
      </label>
      <Input id={`${course}-name`} value={name} onChange={(event) => onName(event.target.value)} maxLength={48} autoComplete="name" className="max-w-sm" />
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
        Download the certificate<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  )
}

/** The share of lessons done in this browser; the words beside it carry the value. */
function Progress({ done, total }: Readonly<{ done: number; total: number }>) {
  return (
    <span aria-hidden className="mt-2 block h-1 rounded-full bg-muted">
      <span className="block h-full rounded-full bg-foreground" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
    </span>
  )
}

type LevelFilter = RoadmapLevel | "all"

/** One course open at a time: pick it from the course rows, read its lessons below. The choice lives in the URL hash. */
export function RoadmapClient({ courses }: Readonly<{ courses: Course[] }>) {
  const { isLoaded, isModuleComplete, completedCount } = useRoadmapProgress()
  const [name, setName] = useState("")
  const [level, setLevel] = useState<LevelFilter>("all")
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

  if (courses.length === 0) return <StatusLine kind="empty">No courses published yet.</StatusLine>

  return (
    <Tabs value={open} onValueChange={choose} orientation="vertical">
      {/* Radix directly: the ui trigger is a segmented pill, and these are plain rows. */}
      <TabsPrimitive.List aria-label="Courses" className="flex flex-col">
        {courses.map((course) => {
          const done = doneOf(course)
          const total = course.lessons.length
          const minutes = course.lessons.reduce((sum, lesson) => sum + minutesOf(lesson.meta.duration), 0)
          return (
            <TabsPrimitive.Trigger
              key={course.course}
              value={course.course}
              data-track="roadmap-course"
              data-track-course={course.course}
              // Radix activates on mousedown, so the panel is mounted by the time click fires.
              onClick={() => revealPanel(course.course)}
              className="group block w-full py-2 text-left"
            >
              <span className="block text-body text-foreground underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-foreground/40 group-data-[state=active]:decoration-foreground">
                {courseTitle(course.course)}
              </span>
              <span className="block text-body tabular-nums text-muted-foreground">
                {total} lessons{minutes > 0 && `, about ${minutes} minutes`}.{" "}
                {done === 0 ? "Not started." : done === total ? "Completed." : `${done} of ${total} done.`}
              </span>
              <Progress done={done} total={total} />
            </TabsPrimitive.Trigger>
          )
        })}
      </TabsPrimitive.List>

      {courses.map((course) => {
        const { course: id, lessons } = course
        const done = doneOf(course)
        const minutes = lessons.reduce((total, lesson) => total + minutesOf(lesson.meta.duration), 0)
        const levels = LEVELS.filter(([value]) => lessons.some((lesson) => (lesson.meta.level ?? "beginner") === value))
        const shown = levels.some(([value]) => value === level) ? level : "all"

        const rowsOf = (value: RoadmapLevel, label: string, marker: boolean) => {
          const rows = lessons.filter((lesson) => (lesson.meta.level ?? "beginner") === value)
          return (
            <LedgerList key={value} marker={marker ? <h3>{label}</h3> : undefined}>
              {rows.map(({ slug, meta }) => (
                <LedgerRow key={slug} titleAs="h4" title={meta.title} href={`/roadmap/${slug}`} meta={meta.duration}>
                  <p>{meta.description}</p>
                  {isLoaded && isModuleComplete(id, slug) && (
                    <p className="mt-1 flex items-center gap-1.5 text-foreground">
                      <Tick />
                      Done
                    </p>
                  )}
                </LedgerRow>
              ))}
            </LedgerList>
          )
        }

        return (
          <TabsContent key={id} value={id} className="mt-14">
            <section aria-labelledby={`${id}-title`}>
              <h2 id={`${id}-title`} className="text-h2 text-balance text-foreground">
                {courseTitle(id)}
              </h2>
              <p className="mt-1 text-body text-muted-foreground">
                From beginner to advanced in {lessons.length} lessons{minutes > 0 && `, about ${minutes} minutes of reading`}.
                {done > 0 && done < lessons.length && ` You have finished ${done}.`}
              </p>

              {levels.length > 1 ? (
                <Tabs value={shown} onValueChange={(value) => setLevel(value as LevelFilter)} className="mt-6">
                  <TabsList aria-label="Level">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {levels.map(([value, label]) => (
                      <TabsTrigger key={value} value={value}>
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="all">{levels.map(([value, label]) => rowsOf(value, label, true))}</TabsContent>
                  {levels.map(([value, label]) => (
                    <TabsContent key={value} value={value}>
                      {rowsOf(value, label, false)}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="mt-6">{levels.map(([value, label]) => rowsOf(value, label, false))}</div>
              )}

              {done === lessons.length ? (
                <Certificate course={id} name={name} onName={saveName} />
              ) : (
                <p className="mt-10 text-small text-muted-foreground">Finish all {lessons.length} lessons to download a certificate with your name on it.</p>
              )}
            </section>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
