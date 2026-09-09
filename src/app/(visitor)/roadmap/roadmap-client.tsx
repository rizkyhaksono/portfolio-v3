"use client"

import { useMemo, useCallback, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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

interface CourseGroup {
  course: string
  lessons: RoadmapContent[]
}

interface RoadmapClientProps {
  courses: CourseGroup[]
}

interface CourseMetadata {
  title: string
  illustration: string
  description: string
  category: string
  totalLessons: number
  estimatedDuration: string
  levelCounts: Record<RoadmapLevel, number>
}

interface LevelGroup {
  level: RoadmapLevel
  lessons: RoadmapContent[]
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

/** Displays one compact course metadata item. */
function CourseFact({ icon: Icon, children }: Readonly<{
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}>) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary md:h-5 md:w-5" />
      <span>{children}</span>
    </div>
  )
}

/** Displays reusable course completion text and its progress bar. */
function ProgressMeter({ current, total, percent, compact = false }: Readonly<{
  current: number
  total: number
  percent: number
  compact?: boolean
}>) {
  return (
    <div className={compact ? "w-full" : "mt-2 max-w-md"}>
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>{compact ? "Progress" : "Overall progress"}</span>
        <span>{current} / {total}</span>
      </div>
      <div className={compact ? "h-2.5 w-full overflow-hidden rounded-full bg-muted" : "h-2 w-full overflow-hidden rounded-full bg-muted"}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

/** Presents the active course summary and overall progress. */
function CourseHeader({ metadata, completedCount, progressPercent, isLoaded }: Readonly<{
  metadata: CourseMetadata
  completedCount: number
  progressPercent: number
  isLoaded: boolean
}>) {
  const levelSummary = LEVELS.filter((level) => metadata.levelCounts[level] > 0)
    .map((level) => `${metadata.levelCounts[level]} ${levelConfig[level].label}`)
    .join(" · ")

  return (
    <section className="course-header relative overflow-hidden border-y border-border bg-card">
      <span className="pointer-events-none absolute -right-4 -top-8 select-none font-display text-[10rem] font-black leading-none text-muted-foreground/10">
        {metadata.title.charAt(0).toUpperCase()}
      </span>
      <div className="relative z-10 flex flex-col gap-3 p-6 md:gap-4 md:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow className="text-primary">{metadata.category}</Eyebrow>
          <Chip>{metadata.totalLessons} Modules</Chip>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-5xl">{metadata.title}</h1>
        <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm md:text-base">{metadata.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:gap-6">
          <CourseFact icon={Layers}>{levelSummary}</CourseFact>
          <CourseFact icon={Clock}>{metadata.estimatedDuration} Total</CourseFact>
        </div>
        {isLoaded ? (
          <ProgressMeter current={completedCount} total={metadata.totalLessons} percent={progressPercent} />
        ) : null}
      </div>
    </section>
  )
}

/** Summarizes a curriculum level inside its accordion trigger. */
function LevelTrigger({ config, lessons, completed, complete }: Readonly<{
  config: (typeof levelConfig)[RoadmapLevel]
  lessons: RoadmapContent[]
  completed: number
  complete: boolean
}>) {
  return (
    <div className="flex flex-1 items-center gap-3 pr-2 text-left">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dotClass}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold md:text-lg">{config.label}</span>
          <Chip>{lessons.length} {lessons.length === 1 ? "module" : "modules"}</Chip>
          {complete ? (
            <Badge variant="default" className="gap-1 bg-primary text-xs">
              <CheckCircle className="h-3 w-3" /> Selesai
            </Badge>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{completed} / {lessons.length} completed</p>
      </div>
    </div>
  )
}

/** Links to one lesson and communicates its completion state. */
function LessonRow({ lesson, index, completed }: Readonly<{
  lesson: RoadmapContent
  index: number
  completed: boolean
}>) {
  return (
    <li>
      <Link
        href={`/roadmap/${lesson.slug}`}
        className={`flex min-h-[64px] items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/40 active:bg-muted/60 md:gap-4 md:px-6 ${completed ? "bg-primary/5" : ""}`}
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium ${completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {completed ? <CheckCircle className="h-4 w-4" /> : index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 block text-sm font-medium leading-snug md:text-base">{lesson.meta.title}</span>
          <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">{lesson.meta.description}</span>
          <LessonMeta lesson={lesson} />
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  )
}

/** Displays optional duration and video metadata for a lesson. */
function LessonMeta({ lesson }: Readonly<{ lesson: RoadmapContent }>) {
  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      {lesson.meta.duration ? <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lesson.meta.duration}</span> : null}
      {lesson.meta.video ? <span className="flex items-center gap-1 text-primary/80"><BookOpen className="h-3 w-3" />Video</span> : null}
    </span>
  )
}

/** Renders the lessons and completion summary for one course level. */
function CurriculumLevel({
  courseId,
  group,
  startIndex,
  isLoaded,
  isModuleComplete,
}: Readonly<{
  courseId: string
  group: LevelGroup
  startIndex: number
  isLoaded: boolean
  isModuleComplete: (courseId: string, slug: string) => boolean
}>) {
  const completedCount = isLoaded
    ? group.lessons.filter((lesson) => isModuleComplete(courseId, lesson.slug)).length
    : 0
  const complete = completedCount === group.lessons.length && group.lessons.length > 0

  return (
    <AccordionItem value={group.level} className="level-section overflow-hidden border bg-card">
      <AccordionTrigger className="min-h-[56px] px-4 py-4 hover:bg-muted/30 hover:no-underline data-[state=open]:bg-muted/20 md:px-6">
        <LevelTrigger config={levelConfig[group.level]} lessons={group.lessons} completed={completedCount} complete={complete} />
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-0">
        <ul className="divide-y border-t">
          {group.lessons.map((lesson, index) => (
            <LessonRow
              key={lesson.slug}
              lesson={lesson}
              index={startIndex + index + 1}
              completed={isLoaded && isModuleComplete(courseId, lesson.slug)}
            />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  )
}

/** Builds the ordered accordion for all populated course levels. */
function CourseCurriculum({ courseId, groups, isLoaded, isModuleComplete }: Readonly<{
  courseId: string
  groups: LevelGroup[]
  isLoaded: boolean
  isModuleComplete: (courseId: string, slug: string) => boolean
}>) {
  let lessonOffset = 0
  const levels = groups.map((group) => {
    const startIndex = lessonOffset
    lessonOffset += group.lessons.length
    return (
      <CurriculumLevel
        key={group.level}
        courseId={courseId}
        group={group}
        startIndex={startIndex}
        isLoaded={isLoaded}
        isModuleComplete={isModuleComplete}
      />
    )
  })

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight md:text-2xl">
        <GraduationCap className="h-5 w-5 text-primary" /> Course Curriculum
      </h2>
      <Accordion type="multiple" defaultValue={groups.map((group) => group.level)} className="space-y-3">
        {levels}
      </Accordion>
    </section>
  )
}

/** Links to a themed certificate when a recipient name is available. */
function CertificateDownload({ courseId, certName, theme }: Readonly<{
  courseId: string
  certName: string
  theme: "light" | "dark"
}>) {
  const disabled = !certName.trim()
  return (
    <Button asChild variant={theme === "light" ? "default" : "secondary"} className="min-h-[44px] w-full gap-2 sm:w-auto" disabled={disabled}>
      <a
        href={`/api/certificate?course=${courseId}&theme=${theme}&name=${encodeURIComponent(certName)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled}
        className={disabled ? "pointer-events-none opacity-50" : undefined}
      >
        <Download className="h-4 w-4" /> Download ({theme === "light" ? "Light" : "Dark"})
      </a>
    </Button>
  )
}

/** Displays certificate controls after every course lesson is complete. */
function CompletedCertificate({ courseId, certName, onNameChange }: Readonly<{
  courseId: string
  certName: string
  onNameChange: (value: string) => void
}>) {
  return (
    <>
      <p className="mb-4 flex items-center justify-center gap-2 text-base font-medium text-primary md:justify-start md:text-lg">
        <CheckCircle className="h-5 w-5 shrink-0" /> Congratulations! You completed all levels.
      </p>
      <div className="mx-auto mb-4 flex w-full max-w-sm flex-col gap-2 md:mx-0">
        <label htmlFor="cert-name" className="text-left text-sm font-medium">Name on certificate</label>
        <Input id="cert-name" value={certName} onChange={(event) => onNameChange(event.target.value)} placeholder="Enter your full name" maxLength={60} />
      </div>
      <div className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row md:justify-start">
        <CertificateDownload courseId={courseId} certName={certName} theme="light" />
        <CertificateDownload courseId={courseId} certName={certName} theme="dark" />
      </div>
    </>
  )
}

/** Explains the remaining certificate requirement and current progress. */
function IncompleteCertificate({ current, total, percent }: Readonly<{
  current: number
  total: number
  percent: number
}>) {
  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground md:text-lg">
        Complete all {total} modules across Beginner, Intermediate, and Advanced to earn your certificate.
      </p>
      <div className="mx-auto w-full max-w-xs md:mx-0">
        <ProgressMeter current={current} total={total} percent={percent} compact />
      </div>
    </>
  )
}

/** Selects the loading, locked, or completed certificate presentation. */
function CertificatePanel({
  courseId,
  certName,
  completedCount,
  metadata,
  progressPercent,
  isLoaded,
  courseComplete,
  onNameChange,
}: Readonly<{
  courseId: string
  certName: string
  completedCount: number
  metadata: CourseMetadata
  progressPercent: number
  isLoaded: boolean
  courseComplete: boolean
  onNameChange: (value: string) => void
}>) {
  let certificateBody: React.ReactNode = <div className="mt-4 h-20 w-full animate-pulse bg-muted" />
  if (isLoaded && courseComplete) {
    certificateBody = <CompletedCertificate courseId={courseId} certName={certName} onNameChange={onNameChange} />
  } else if (isLoaded) {
    certificateBody = <IncompleteCertificate current={completedCount} total={metadata.totalLessons} percent={progressPercent} />
  }

  return (
    <section className="cert-card relative overflow-hidden border-y border-border bg-card p-6 md:p-12">
      <Medal className="pointer-events-none absolute -right-8 -top-8 h-64 w-64 text-primary opacity-[0.03] dark:opacity-10" />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-8 md:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-border bg-muted md:h-24 md:w-24">
          {courseComplete ? <Award className="h-10 w-10 text-primary md:h-12 md:w-12" /> : <Lock className="h-10 w-10 text-muted-foreground md:h-12 md:w-12" />}
        </div>
        <div className="w-full flex-1">
          <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground md:text-3xl">Certificate of Completion</h2>
          {certificateBody}
        </div>
      </div>
    </section>
  )
}

/** Keeps active course progress visible on small screens. */
function MobileCourseProgress({ title, current, total, percent }: Readonly<{
  title: string
  current: number
  total: number
  percent: number
}>) {
  return (
    <div className="safe-area-pb fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
        <span className="truncate pr-2">{title}</span>
        <span className="shrink-0">{current} / {total}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

/** Composes the focused view for a selected roadmap course. */
function ActiveCourseView({
  courseId,
  course,
  metadata,
  groups,
  certName,
  completedCount,
  progressPercent,
  isLoaded,
  courseComplete,
  onClose,
  onNameChange,
  isModuleComplete,
}: Readonly<{
  courseId: string
  course: CourseGroup
  metadata: CourseMetadata
  groups: LevelGroup[]
  certName: string
  completedCount: number
  progressPercent: number
  isLoaded: boolean
  courseComplete: boolean
  onClose: () => void
  onNameChange: (value: string) => void
  isModuleComplete: (courseId: string, slug: string) => boolean
}>) {
  return (
    <div className="pb-24 md:pb-8">
      <div className="sticky top-0 z-30 -mx-6 mb-4 border-b bg-background/95 px-6 py-3 backdrop-blur-sm md:static md:mx-0 md:mb-0 md:border-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <button onClick={onClose} className="back-btn flex min-h-[44px] items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4 shrink-0" /> Back to all courses
        </button>
      </div>
      <div className="space-y-6 md:space-y-8">
        <CourseHeader metadata={metadata} completedCount={completedCount} progressPercent={progressPercent} isLoaded={isLoaded} />
        <CourseCurriculum courseId={course.course} groups={groups} isLoaded={isLoaded} isModuleComplete={isModuleComplete} />
        <CertificatePanel courseId={courseId} certName={certName} completedCount={completedCount} metadata={metadata} progressPercent={progressPercent} isLoaded={isLoaded} courseComplete={courseComplete} onNameChange={onNameChange} />
      </div>
      {isLoaded && !courseComplete ? (
        <MobileCourseProgress title={metadata.title} current={completedCount} total={metadata.totalLessons} percent={progressPercent} />
      ) : null}
    </div>
  )
}

export function RoadmapClient({ courses }: RoadmapClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
      description: `Master ${formatCourseName(courseGroup.course)} from beginner to advanced with hands-on, structured lessons.`,
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

  if (activeCourseId && activeCourseData && metadata && lessonsByLevel) {
    const completedCount = getCompletedCount(activeCourseId)
    const progressPercent =
      metadata.totalLessons > 0 ? (completedCount / metadata.totalLessons) * 100 : 0
    const courseComplete =
      isLoaded && isCourseComplete(activeCourseId, metadata.totalLessons)

    return (
      <ActiveCourseView
        courseId={activeCourseId}
        course={activeCourseData}
        metadata={metadata}
        groups={lessonsByLevel}
        certName={certName}
        completedCount={completedCount}
        progressPercent={progressPercent}
        isLoaded={isLoaded}
        courseComplete={courseComplete}
        onClose={closeCourse}
        onNameChange={handleCertNameChange}
        isModuleComplete={isModuleComplete}
      />
    )
  }

  return (
    <div>
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
                className="course-card group flex h-full cursor-pointer flex-col overflow-hidden border bg-card text-card-foreground transition-colors hover:border-foreground/40"
              >
                <div className="relative h-24 w-full overflow-hidden border-b border-border bg-secondary">
                  {/* Monochrome monogram placeholder — reliable, no external image */}
                  <span className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-4xl font-black text-muted-foreground/15">
                    {meta.title.charAt(0).toUpperCase()}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-none shadow-sm uppercase text-[10px] tracking-wider">
                      {meta.category}
                    </Badge>
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md uppercase text-[10px] tracking-wider">
                      3 Levels
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
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
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold">No Courses Found</h3>
            <p className="text-muted-foreground text-sm">Try selecting a different category filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
