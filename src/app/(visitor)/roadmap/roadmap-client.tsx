"use client"

import { useEffect, useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { useRoadmapProgress } from "@/hooks/use-roadmap-progress"
import type { RoadmapContent, RoadmapLevel } from "@/lib/mdx"
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

function Tick() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  )
}

/** Shown once every lesson of the course is done in this browser. */
function Certificate({ course, name, onName }: Readonly<{ course: string; name: string; onName: (name: string) => void }>) {
  const href = `/api/certificate?course=${encodeURIComponent(course)}&name=${encodeURIComponent(name.trim())}`
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

/** Every course as a ledger of its lessons, grouped by level. Progress and certificates live in this browser only. */
export function RoadmapClient({ courses }: Readonly<{ courses: Course[] }>) {
  const { isLoaded, isModuleComplete, completedCount } = useRoadmapProgress()
  const [name, setName] = useState("")

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "")
    } catch {
      // Storage blocked: the name lasts for this visit only.
    }
  }, [])

  const saveName = (value: string) => {
    setName(value)
    try {
      localStorage.setItem(NAME_KEY, value)
    } catch {
      // As above.
    }
  }

  return (
    <>
      <nav aria-label="Courses" className="mt-6">
        <ul role="list" className="flex flex-wrap gap-x-6 text-body">
          {courses.map(({ course }) => (
            <li key={course}>
              <a href={`#${course}`} className="inline-flex min-h-11 items-center text-ink underline decoration-1 underline-offset-[0.18em] hover:decoration-2 md:min-h-0">
                {courseTitle(course)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {courses.map(({ course, lessons }) => {
        const done = isLoaded ? completedCount(course, lessons.map((lesson) => lesson.slug)) : 0
        const minutes = lessons.reduce((total, lesson) => total + minutesOf(lesson.meta.duration), 0)

        return (
          <section key={course} id={course} aria-labelledby={`${course}-title`} className="mt-16">
            <h2 id={`${course}-title`} className="font-display text-h2 text-balance text-ink">
              {courseTitle(course)}
            </h2>
            <p className="mt-2 max-w-[60ch] text-body text-ink-soft">
              From beginner to advanced in {lessons.length} lessons{minutes > 0 && `, about ${minutes} minutes of reading`}.
            </p>
            <p className="mt-1 min-h-[1.35em] font-display text-caption tabular-nums text-ink-soft">
              {done > 0 && `${done} of ${lessons.length} lessons done.`}
            </p>

            {LEVELS.map(([level, label]) => {
              const rows = lessons.filter((lesson) => (lesson.meta.level ?? "beginner") === level)
              if (rows.length === 0) return null
              return (
                <LedgerList key={level} marker={<h3>{label}</h3>} className="mt-6 md:grid-cols-[10rem_minmax(0,1fr)]">
                  {rows.map(({ slug, meta }) => (
                    <LedgerRow key={slug} titleAs="h4" title={meta.title} href={`/roadmap/${slug}`} meta={meta.duration}>
                      <p>{meta.description}</p>
                      {isLoaded && isModuleComplete(course, slug) && (
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
              <Certificate course={course} name={name} onName={saveName} />
            ) : (
              <p className="mt-6 text-small text-ink-soft">Finish all {lessons.length} lessons to download a certificate with your name on it.</p>
            )}
          </section>
        )
      })}
    </>
  )
}
