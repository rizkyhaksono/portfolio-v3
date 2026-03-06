"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRoadmapProgress } from "@/hooks/use-roadmap-progress"
import { toast } from "sonner"

interface LessonCompleteButtonProps {
  courseId: string
  slug: string
}

export function LessonCompleteButton({ courseId, slug }: LessonCompleteButtonProps) {
  const { isLoaded, isModuleComplete, markAsComplete } = useRoadmapProgress()
  const [complete, setComplete] = useState(false)

  // Sync state after hook loads
  useEffect(() => {
    if (isLoaded) {
      setComplete(isModuleComplete(courseId, slug))
    }
  }, [isLoaded, courseId, slug, isModuleComplete])

  const handleMarkComplete = () => {
    markAsComplete(courseId, slug)
    setComplete(true)
    toast.success("Module marked as complete!", {
      description: "Progress saved. Keep up the great work!",
      icon: <CheckCircle className="text-green-500" />,
    })
  }

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) return <div className="h-10 w-full animate-pulse bg-muted rounded-md" />

  if (complete) {
    return (
      <div className="flex flex-col items-center sm:flex-row gap-4 justify-between p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div>
            <h4 className="font-medium text-green-700 dark:text-green-400">Section Completed</h4>
            <p className="text-sm text-muted-foreground">You have finished this module.</p>
          </div>
        </div>
        <Link href="/roadmap">
          <Button variant="outline" className="gap-2">
            Return to Track
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center sm:flex-row gap-4 justify-between p-6 bg-muted/30 border rounded-xl">
      <div className="flex items-center gap-3">
        <Circle className="h-6 w-6 text-muted-foreground" />
        <div>
          <h4 className="font-medium">Finished reading?</h4>
          <p className="text-sm text-muted-foreground">Mark this module as complete to track your progress.</p>
        </div>
      </div>
      <Button onClick={handleMarkComplete} className="gap-2">
        <CheckCircle className="h-4 w-4" />
        Mark as Complete
      </Button>
    </div>
  )
}
