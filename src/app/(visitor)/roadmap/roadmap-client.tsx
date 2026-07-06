"use client"

import { useRef, useMemo, useCallback, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Chip } from "@/components/ui/chip"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  BookOpen,
  Clock,
  ChevronRight,
  Layers,
  ArrowLeft,
  Award,
  Medal,
  CheckCircle,
  Download,
  Lock,
  GraduationCap,
} from "lucide-react"
import type { RoadmapContent, RoadmapLevel } from "@/lib/mdx"
import { useRoadmapProgress } from "@/hooks/use-roadmap-progress"

gsap.registerPlugin(useGSAP)

interface CourseGroup {
  course: string
  lessons: RoadmapContent[]
}

interface RoadmapClientProps {
  courses: CourseGroup[]
}

const LEVELS: RoadmapLevel[] = ["beginner", "intermediate", "advanced"]

const levelConfig: Record<
  RoadmapLevel,
  { label: string; dotClass: string }
> = {
  beginner: {
    label: "Beginner",
    dotClass: "bg-green-500",
  },
  intermediate: {
    label: "Intermediate",
    dotClass: "bg-yellow-500",
  },
  advanced: {
    label: "Advanced",
    dotClass: "bg-red-500",
  },
}

function getLessonLevel(lesson: RoadmapContent): RoadmapLevel {
  return lesson.meta.level ?? "beginner"
}

export function RoadmapClient({ courses }: RoadmapClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCategory = searchParams.get("category") ?? "All"
  const activeCourseId = searchParams.get("course")

  const { isLoaded, isModuleComplete, getCompletedCount, isCourseComplete } = useRoadmapProgress()

  const [certName, setCertName] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("roadmap-cert-name")
    if (stored) setCertName(stored)
  }, [])

  const handleCertNameChange = useCallback((value: string) => {
    setCertName(value)
    localStorage.setItem("roadmap-cert-name", value)
  }, [])

  const setCategory = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (category === "All") {
        params.delete("category")
      } else {
        params.set("category", category)
      }
      const query = params.toString()
      router.replace(query ? `/roadmap?${query}` : "/roadmap", { scroll: false })
    },
    [router, searchParams],
  )

  const openCourse = useCallback(
    (courseId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("course", courseId)
      router.replace(`/roadmap?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const closeCourse = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("course")
    const query = params.toString()
    router.replace(query ? `/roadmap?${query}` : "/roadmap", { scroll: false })
  }, [router, searchParams])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (activeCourseId) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
          tl.fromTo(".back-btn", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 })
          tl.fromTo(".course-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
          tl.fromTo(".level-section", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, "-=0.3")
          tl.fromTo(".cert-card", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6 }, "-=0.2")
        } else {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
          tl.fromTo(".filter-badge", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 })
          tl.fromTo(".course-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.2")
          tl.fromTo(".empty-state", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.2")
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".back-btn", ".course-header", ".level-section", ".cert-card", ".filter-badge", ".course-card", ".empty-state"], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        })
      })
    },
    { scope: containerRef, dependencies: [activeCourseId, selectedCategory] },
  )

  const allCategories = useMemo(
    () => ["All", ...Array.from(new Set(courses.flatMap(({ lessons }) => lessons.map((l) => l.meta.category))))],
    [courses],
  )

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All") return courses
    return courses
      .map(({ course, lessons }) => ({
        course,
        lessons: lessons.filter((l) => l.meta.category === selectedCategory),
      }))
      .filter(({ lessons }) => lessons.length > 0)
  }, [courses, selectedCategory])

  const formatCourseName = (course: string | undefined) => {
    if (!course) return "Untitled"
    return course
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getCourseMetadata = (courseGroup: CourseGroup) => {
    const sortedLessons = [...courseGroup.lessons].sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
    const firstLesson = sortedLessons[0]

    const totalMinutes = courseGroup.lessons.reduce((acc, lesson) => {
      if (!lesson.meta.duration) return acc
      const mins = parseInt(lesson.meta.duration.replace(/\D/g, ""))
      return acc + (isNaN(mins) ? 0 : mins)
    }, 0)

    const levelCounts = LEVELS.reduce(
      (acc, level) => {
        acc[level] = courseGroup.lessons.filter((l) => getLessonLevel(l) === level).length
        return acc
      },
      {} as Record<RoadmapLevel, number>,
    )

    return {
      title: formatCourseName(courseGroup.course),
      illustration: firstLesson?.meta.illustration || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      description: `Master ${formatCourseName(courseGroup.course)} from beginner to advanced — structured like Dicoding learning paths.`,
      category: firstLesson?.meta.category || "General",
      totalLessons: courseGroup.lessons.length,
      estimatedDuration: totalMinutes > 0 ? `${totalMinutes} min` : "Varied",
      levelCounts,
    }
  }

  const activeCourseData = activeCourseId ? courses.find((c) => c.course === activeCourseId) : null
  const metadata = activeCourseData ? getCourseMetadata(activeCourseData) : null

  const lessonsByLevel = useMemo(() => {
    if (!activeCourseData) return null
    const sorted = [...activeCourseData.lessons].sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
    return LEVELS.map((level) => ({
      level,
      lessons: sorted.filter((l) => getLessonLevel(l) === level),
    })).filter((group) => group.lessons.length > 0)
  }, [activeCourseData])

  const getLevelCompletedCount = (courseId: string, levelLessons: RoadmapContent[]) => {
    if (!isLoaded) return 0
    return levelLessons.filter((l) => isModuleComplete(courseId, l.slug)).length
  }

  if (activeCourseId && activeCourseData && metadata && lessonsByLevel) {
    const progressPercent = metadata.totalLessons > 0 ? (getCompletedCount(activeCourseId) / metadata.totalLessons) * 100 : 0
    const courseComplete = isLoaded && isCourseComplete(activeCourseId, metadata.totalLessons)

    return (
      <div ref={containerRef} className="pb-24 md:pb-8">
        {/* Sticky mobile header */}
        <div className="sticky top-0 z-30 -mx-6 px-6 py-3 mb-4 bg-background/95 backdrop-blur-sm border-b md:static md:mx-0 md:px-0 md:py-0 md:mb-0 md:bg-transparent md:backdrop-blur-none md:border-none">
          <button
            onClick={closeCourse}
            className="back-btn flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            Back to all courses
          </button>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Course Header Banner */}
          <div className="course-header relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="absolute inset-0 z-0">
              <Image src={metadata.illustration} alt={metadata.title} fill sizes="100vw" unoptimized className="object-cover opacity-20" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
            </div>
            <div className="relative z-10 p-6 md:p-12 flex flex-col gap-3 md:gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow className="text-primary">{metadata.category}</Eyebrow>
                <Chip>{metadata.totalLessons} Modules</Chip>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-foreground">{metadata.title}</h1>
              <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm md:text-base">{metadata.description}</p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <span>
                    {LEVELS.filter((l) => metadata.levelCounts[l] > 0)
                      .map((l) => `${metadata.levelCounts[l]} ${levelConfig[l].label}`)
                      .join(" · ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <span>{metadata.estimatedDuration} Total</span>
                </div>
              </div>
              {/* Progress bar in header (mobile-friendly) */}
              {isLoaded && (
                <div className="mt-2 max-w-md">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Overall progress</span>
                    <span>
                      {getCompletedCount(activeCourseId)} / {metadata.totalLessons}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Level sections — Dicoding-style accordion */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Course Curriculum
            </h3>

            <Accordion type="multiple" defaultValue={lessonsByLevel.map((g) => g.level)} className="space-y-3">
              {lessonsByLevel.map(({ level, lessons }) => {
                const config = levelConfig[level]
                const completedInLevel = getLevelCompletedCount(activeCourseId, lessons)
                const levelComplete = completedInLevel === lessons.length && lessons.length > 0

                return (
                  <AccordionItem
                    key={level}
                    value={level}
                    className="level-section border rounded-xl overflow-hidden bg-card/50 data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline hover:bg-muted/30 [&[data-state=open]]:bg-muted/20 min-h-[56px]">
                      <div className="flex flex-1 items-center gap-3 text-left pr-2">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${config.dotClass}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-base md:text-lg">{config.label}</span>
                            <Chip>
                              {lessons.length} {lessons.length === 1 ? "module" : "modules"}
                            </Chip>
                            {levelComplete && (
                              <Badge variant="default" className="text-xs gap-1 bg-primary">
                                <CheckCircle className="h-3 w-3" />
                                Selesai
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {completedInLevel} / {lessons.length} completed
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <ul className="divide-y border-t">
                        {lessons.map((lesson, index) => {
                          const isCompleted = isLoaded && isModuleComplete(activeCourseData.course, lesson.slug)
                          const globalIndex =
                            lessonsByLevel
                              .filter((g) => LEVELS.indexOf(g.level) < LEVELS.indexOf(level))
                              .reduce((acc, g) => acc + g.lessons.length, 0) + index + 1

                          return (
                            <li key={lesson.slug}>
                              <Link
                                href={`/roadmap/${lesson.slug}`}
                                className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 min-h-[64px] transition-colors hover:bg-muted/40 active:bg-muted/60 ${
                                  isCompleted ? "bg-primary/5" : ""
                                }`}
                              >
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-mono font-medium ${
                                    isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : globalIndex}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm md:text-base leading-snug line-clamp-2">{lesson.meta.title}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{lesson.meta.description}</p>
                                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                    {lesson.meta.duration && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.meta.duration}
                                      </span>
                                    )}
                                    {lesson.meta.video && (
                                      <span className="flex items-center gap-1 text-primary/80">
                                        <BookOpen className="h-3 w-3" />
                                        Video
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>

          {/* Certificate Section */}
          <div className="cert-card relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 md:p-12">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-[0.03] dark:opacity-10 pointer-events-none">
              <Medal className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-inner">
                {courseComplete ? <Award className="w-10 h-10 md:w-12 md:h-12 text-primary" /> : <Lock className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />}
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-xl md:text-3xl font-bold tracking-tight text-foreground mb-2">Certificate of Completion</h3>

                {isLoaded ? (
                  courseComplete ? (
                    <>
                      <p className="text-primary font-medium text-base md:text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
                        <CheckCircle className="h-5 w-5 shrink-0" /> Congratulations! You completed all levels.
                      </p>
                      <div className="flex flex-col gap-2 mb-4 w-full max-w-sm mx-auto md:mx-0">
                        <label htmlFor="cert-name" className="text-sm font-medium text-left">
                          Name on certificate
                        </label>
                        <Input
                          id="cert-name"
                          type="text"
                          value={certName}
                          onChange={(e) => handleCertNameChange(e.target.value)}
                          placeholder="Enter your full name"
                          maxLength={60}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 justify-center md:justify-start">
                        <a
                          href={`/api/certificate?course=${activeCourseId}&theme=light&name=${encodeURIComponent(certName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full sm:w-auto ${certName.trim() ? "" : "pointer-events-none opacity-50"}`}
                          aria-disabled={!certName.trim()}
                        >
                          <Button variant="default" className="gap-2 w-full sm:w-auto min-h-[44px]" disabled={!certName.trim()}>
                            <Download className="w-4 h-4" />
                            Download (Light)
                          </Button>
                        </a>
                        <a
                          href={`/api/certificate?course=${activeCourseId}&theme=dark&name=${encodeURIComponent(certName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full sm:w-auto ${certName.trim() ? "" : "pointer-events-none opacity-50"}`}
                          aria-disabled={!certName.trim()}
                        >
                          <Button variant="secondary" className="gap-2 w-full sm:w-auto min-h-[44px]" disabled={!certName.trim()}>
                            <Download className="w-4 h-4" />
                            Download (Dark)
                          </Button>
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-sm md:text-lg mb-4">
                        Complete all {metadata.totalLessons} modules across Beginner, Intermediate, and Advanced to earn your certificate.
                      </p>
                      <div className="flex justify-center md:justify-start">
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
                            <span>
                              {getCompletedCount(activeCourseId)} / {metadata.totalLessons}
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{ width: `${progressPercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <div className="h-20 w-full animate-pulse bg-muted rounded-md mt-4" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom progress strip */}
        {isLoaded && !courseComplete && (
          <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-background/95 backdrop-blur-sm px-4 py-3 safe-area-pb">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="truncate pr-2">{metadata.title}</span>
              <span className="shrink-0">
                {getCompletedCount(activeCourseId)} / {metadata.totalLessons}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      <div className="space-y-6 md:space-y-8 py-6 md:py-8">
        {/* Category Filters */}
        {allCategories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {allCategories.map((category, idx) => (
              <Badge
                key={`${category}-${idx}`}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`filter-badge cursor-pointer capitalize px-4 py-2 text-sm transition-all shrink-0 min-h-[40px] flex items-center ${
                  selectedCategory === category ? "shadow-md" : "hover:bg-muted"
                }`}
                onClick={() => setCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredCourses.map((courseGroup, courseIndex) => {
            const meta = getCourseMetadata(courseGroup)
            const completedCount = isLoaded ? getCompletedCount(courseGroup.course) : 0
            const progressPct = meta.totalLessons > 0 ? (completedCount / meta.totalLessons) * 100 : 0

            return (
              <div
                key={`course-${courseGroup.course}-${courseIndex}`}
                onClick={() => openCourse(courseGroup.course)}
                onKeyDown={(e) => e.key === "Enter" && openCourse(courseGroup.course)}
                role="button"
                tabIndex={0}
                className="course-card group cursor-pointer rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-primary/50 flex flex-col h-full active:scale-[0.99]"
              >
                <div className="h-40 sm:h-48 w-full relative overflow-hidden bg-muted">
                  <Image
                    src={meta.illustration}
                    alt={meta.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-none shadow-sm uppercase text-[10px] tracking-wider">
                      {meta.category}
                    </Badge>
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md uppercase text-[10px] tracking-wider">
                      3 Levels
                    </Badge>
                  </div>
                </div>

                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-lg md:text-xl tracking-tight mb-2 group-hover:text-primary transition-colors">{meta.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{meta.description}</p>

                  {isLoaded && completedCount > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>
                          {completedCount}/{meta.totalLessons}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <Layers className="h-4 w-4 shrink-0" />
                      <span>{meta.totalLessons} Modules</span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-primary shrink-0">
                      Mulai <ChevronRight className="h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="empty-state text-center py-16 md:py-20 border-2 border-dashed rounded-2xl bg-muted/30">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No Courses Found</h3>
            <p className="text-muted-foreground text-sm">Try selecting a different category filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
