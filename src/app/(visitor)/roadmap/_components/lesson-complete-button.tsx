"use client"

import { useCallback, useState } from "react"
import { Check } from "lucide-react"
import { InkLink } from "@/components/ui/ink-link"
import { useRoadmapProgress } from "@/hooks/use-roadmap-progress"

interface LessonCompleteButtonProps {
  courseId: string
  slug: string
}

/** Marks a lesson done in this browser, as a Notion to-do. Done reads as a filled square with a tick and words, never as a colour. */
export function LessonCompleteButton({ courseId, slug }: Readonly<LessonCompleteButtonProps>) {
  const { isLoaded, isModuleComplete, markAsComplete } = useRoadmapProgress()
  const complete = isLoaded && isModuleComplete(courseId, slug)
  const [justDone, setJustDone] = useState(false)
  // The button goes away once pressed, so focus moves to the result instead of falling to the page.
  const status = useCallback((node: HTMLParagraphElement | null) => (justDone ? node?.focus() : undefined), [justDone])

  return (
    // Reserves its height while progress loads, so nothing below it moves.
    <div className="mt-12 min-h-24 text-body">
      {isLoaded &&
        (complete ? (
          <>
            <p ref={status} tabIndex={-1} className="flex min-h-11 items-center gap-2 text-foreground md:min-h-8">
              <span aria-hidden className="grid size-4 shrink-0 place-items-center rounded bg-foreground text-background">
                <Check className="size-3" strokeWidth={3} />
              </span>
              Lesson done
            </p>
            <p className="mt-1 pl-6 text-small">
              <InkLink href={`/roadmap#${courseId}`} className="inline-flex min-h-11 items-center md:min-h-0">
                Back to the course
              </InkLink>
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                markAsComplete(courseId, slug)
                setJustDone(true)
              }}
              data-umami-event="roadmap-lesson-complete"
              data-umami-event-course={courseId}
              className="group -mx-1.5 flex min-h-11 items-center gap-2 rounded-md px-1.5 text-foreground transition-colors duration-ui ease-out hover:bg-tint md:min-h-8"
            >
              <span aria-hidden className="size-4 shrink-0 rounded border-2 border-foreground/60 group-hover:border-foreground" />
              Mark as done
            </button>
            <p className="mt-1 pl-6 text-small text-muted-foreground">Finished reading? Mark it done to track your progress in this browser.</p>
          </>
        ))}
    </div>
  )
}
