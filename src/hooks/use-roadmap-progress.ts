import { useCallback, useEffect, useState } from "react"

// { courseId: ["lesson-slug", ...] }, kept in this browser only.
type ProgressData = Record<string, string[]>

const KEY = "roadmap_progress"

function read(): ProgressData {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}")
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {}
  } catch {
    return {}
  }
}

export function useRoadmapProgress() {
  const [progress, setProgress] = useState<ProgressData>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setProgress(read())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(KEY, JSON.stringify(progress))
    } catch {
      // Private mode or storage full: progress lasts for this visit only.
    }
  }, [progress, isLoaded])

  const markAsComplete = useCallback((courseId: string, slug: string) => {
    setProgress((prev) => {
      const done = Array.isArray(prev[courseId]) ? prev[courseId] : []
      return done.includes(slug) ? prev : { ...prev, [courseId]: [...done, slug] }
    })
  }, [])

  const isModuleComplete = useCallback(
    (courseId: string, slug: string) => Array.isArray(progress[courseId]) && progress[courseId].includes(slug),
    [progress],
  )

  /** Counts only lessons that still exist, so renamed or removed slugs never push progress past 100%. */
  const completedCount = useCallback(
    (courseId: string, slugs: string[]) => slugs.filter((slug) => isModuleComplete(courseId, slug)).length,
    [isModuleComplete],
  )

  return { isLoaded, markAsComplete, isModuleComplete, completedCount }
}
