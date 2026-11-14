"use client"

import { useEffect, useRef, useState } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { Award, BookOpen, CircleCheck, FileText } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Callout } from "@/components/ui/callout"
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

/** The course rows stack above the panel at every width and push it below the fold, so bring its heading into view. */
const revealPanel = (id: string) => document.getElementById(`${id}-title`)?.scrollIntoView({ block: "start" })

/** Shown once every lesson of the course is done in this browser. */
function Certificate({ course, name, onName }: Readonly<{ course: string; name: string; onName: (name: string) => void }>) {
  const href = ogImageUrl({ course, name: name.trim() }, "/api/certificate")
  return (
    <Callout icon={<Award />} className="mt-10">
      <p className="font-semibold">Course completed</p>
      <label htmlFor={`${course}-name`} className="mt-3 block text-small text-muted-foreground">
        Name on the certificate
      </label>
      <Input id={`${course}-name`} value={name} onChange={(event) => onName(event.target.value)} maxLength={48} autoComplete="name" className="mt-1 max-w-sm bg-background" />
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "mt-3 min-h-11 bg-background md:min-h-8" })}>
        Download the certificate<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Callout>
  )
}

/** Notion's progress bar beside the count; the words carry the value. */
function Progress({ done, total }: Readonly<{ done: number; total: number }>) {
  return (
    <span aria-hidden className="block h-1 w-16 shrink-0 overflow-hidden rounded-full bg-tint-strong">
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
      {/* Radix directly: these triggers are Notion list rows, not view tabs. */}
      <h2 id="courses-label" className="mb-1 flex items-center gap-2 text-small font-medium text-muted-foreground">
        Courses <span className="tabular-nums">{courses.length}</span>
      </h2>
      <TabsPrimitive.List aria-labelledby="courses-label" className="flex flex-col">
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
              className="-mx-2 flex min-h-11 gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors duration-ui ease-out hover:bg-tint data-[state=active]:bg-tint-strong"
            >
              <BookOpen aria-hidden strokeWidth={1.5} className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <span className="grid min-w-0 flex-1 gap-x-6 sm:grid-cols-[minmax(0,1fr)_auto]">
                <span className="min-w-0">
                  <span className="block text-body font-medium text-foreground">{courseTitle(course.course)}</span>
                  <span className="block text-small tabular-nums text-muted-foreground">
                    {total} lessons{minutes > 0 && `, about ${minutes} minutes`}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-small tabular-nums text-muted-foreground sm:justify-end sm:pt-0.5">
                  <Progress done={done} total={total} />
                  {done === 0 ? "Not started" : done === total ? "Completed" : `${done} of ${total} done`}
                </span>
              </span>
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
            <LedgerList
              key={value}
              marker={
                marker ? (
                  <h3 className="flex gap-2">
                    {label} <span>{rows.length}</span>
                  </h3>
                ) : undefined
              }
            >
              {rows.map(({ slug, meta }) => (
                <LedgerRow
                  key={slug}
                  titleAs={marker ? "h4" : "h3"}
                  icon={<FileText />}
                  title={meta.title}
                  href={`/roadmap/${slug}`}
                  meta={
                    isLoaded && isModuleComplete(id, slug) ? (
                      <span className="inline-flex items-center gap-1.5 text-foreground">
                        <CircleCheck aria-hidden strokeWidth={1.5} className="size-4" />
                        Done
                      </span>
                    ) : (
                      meta.duration
                    )
                  }
                >
                  <p>{meta.description}</p>
                </LedgerRow>
              ))}
            </LedgerList>
          )
        }

        return (
          <TabsContent key={id} value={id} className="mt-12">
            <section aria-labelledby={`${id}-title`}>
              <h2 id={`${id}-title`} className="flex items-center gap-2 text-h2 text-balance text-foreground">
                <BookOpen aria-hidden strokeWidth={1.5} className="size-6 shrink-0" />
                {courseTitle(id)}
              </h2>
              <p className="mt-2 text-body text-muted-foreground">
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
                <Callout icon={<Award />} className="mt-10">
                  Finish all {lessons.length} lessons to download a certificate with your name on it.
                </Callout>
              )}
            </section>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
