"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { InkLink } from "@/components/ui/ink-link"
import { useRoadmapProgress } from "@/hooks/use-roadmap-progress"

interface LessonCompleteButtonProps {
  courseId: string
  slug: string
}

/** Marks a lesson done in this browser. Done reads as a tick and words, never as a colour. */
export function LessonCompleteButton({ courseId, slug }: Readonly<LessonCompleteButtonProps>) {
  const { isLoaded, isModuleComplete, markAsComplete } = useRoadmapProgress()
  const complete = isLoaded && isModuleComplete(courseId, slug)
  const [justDone, setJustDone] = useState(false)
  // The button goes away once pressed, so focus moves to the result instead of falling to the page.
  const status = useCallback((node: HTMLParagraphElement | null) => (justDone ? node?.focus() : undefined), [justDone])

  return (
    // Reserves its height while progress loads, so nothing below it moves.
    <div className="mt-12 min-h-[5.5rem] border-t border-ink pt-4">
      {isLoaded &&
        (complete ? (
          <>
            <p ref={status} tabIndex={-1} className="flex items-center gap-2 font-display text-h4 text-ink">
              <svg aria-hidden viewBox="0 0 16 16" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M2.5 8.5l3.5 3.5 7.5-8" />
              </svg>
              Section completed
            </p>
            <p className="mt-2 text-body">
              <InkLink href={`/roadmap#${courseId}`} className="inline-flex min-h-11 items-center md:min-h-0">
                Back to the course
              </InkLink>
            </p>
          </>
        ) : (
          <>
            <p className="text-body text-ink-soft">Finished reading? Mark it done to track your progress in this browser.</p>
            <Button
              type="button"
              className="mt-3"
              onClick={() => {
                markAsComplete(courseId, slug)
                setJustDone(true)
              }}
              data-umami-event="roadmap-lesson-complete"
              data-umami-event-course={courseId}
            >
              Mark this lesson done
            </Button>
          </>
        ))}
    </div>
  )
}
