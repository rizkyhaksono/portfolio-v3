"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, ChevronRight, Layers, ArrowLeft, Award, Medal, CheckCircle, Download } from "lucide-react"
import type { RoadmapContent } from "@/lib/mdx"
import { Button } from "@/components/ui/button"

interface CourseGroup {
  course: string
  lessons: RoadmapContent[]
}

interface RoadmapClientProps {
  courses: CourseGroup[]
}

export function RoadmapClient({ courses }: RoadmapClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)

  const allCategories = ["All", ...Array.from(new Set(courses.flatMap(({ lessons }) => lessons.map((l) => l.meta.category))))]

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses
          .map(({ course, lessons }) => ({
            course,
            lessons: lessons.filter((l) => l.meta.category === selectedCategory),
          }))
          .filter(({ lessons }) => lessons.length > 0)

  const formatCourseName = (course: string | undefined) => {
    if (!course) return "Untitled"
    return course
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getCourseMetadata = (courseGroup: CourseGroup) => {
    // Extract metadata from the first lesson to represent the overall course
    const firstLesson = courseGroup.lessons.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))[0]

    // Calculate total duration roughly if available
    const totalMinutes = courseGroup.lessons.reduce((acc, lesson) => {
      if (!lesson.meta.duration) return acc
      const mins = parseInt(lesson.meta.duration.replace(/\D/g, ""))
      return acc + (isNaN(mins) ? 0 : mins)
    }, 0)

    return {
      title: formatCourseName(courseGroup.course),
      illustration: firstLesson?.meta.illustration || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      description: `Master the concepts of ${formatCourseName(courseGroup.course)} from scratch.`,
      category: firstLesson?.meta.category || "General",
      difficulty: firstLesson?.meta.difficulty || "Beginner",
      totalLessons: courseGroup.lessons.length,
      estimatedDuration: totalMinutes > 0 ? `${totalMinutes} min` : "Varied",
    }
  }

  // View 2: Detailed Lesson List for a Specific Course
  if (activeCourseId) {
    const activeCourseData = courses.find((c) => c.course === activeCourseId)
    if (!activeCourseData) return null

    const metadata = getCourseMetadata(activeCourseData)

    return (
      <div className="space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Navigation Back */}
        <button onClick={() => setActiveCourseId(null)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to all courses
        </button>

        {/* Course Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border">
          <div className="absolute inset-0 z-0">
            <img src={metadata.illustration} alt={metadata.title} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col gap-4">
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 uppercase tracking-wider">
                {metadata.category}
              </Badge>
              <Badge variant="outline" className="uppercase tracking-wider text-zinc-300 border-zinc-700">
                {metadata.difficulty}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{metadata.title}</h1>
            <p className="text-zinc-400 max-w-2xl text-lg">{metadata.description}</p>
            <div className="flex items-center gap-6 mt-4 text-zinc-300">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-zinc-500" />
                <span>{metadata.totalLessons} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-zinc-500" />
                <span>{metadata.estimatedDuration} Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Modules Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold tracking-tight">Course Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCourseData.lessons
              .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
              .map((lesson, index) => (
                <Link key={lesson.slug} href={`/roadmap/${lesson.slug}`} className="group">
                  <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="bg-background text-xs font-mono">
                          Module {index + 1}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="line-clamp-2 leading-tight">{lesson.meta.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">{lesson.meta.description}</CardDescription>
                    </CardHeader>
                    <div className="flex-1" />
                    <CardFooter className="pt-4 border-t bg-muted/20">
                      <div className="flex items-center w-full justify-between text-xs font-medium text-muted-foreground">
                        {lesson.meta.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{lesson.meta.duration}</span>
                          </div>
                        )}
                        {lesson.meta.video && (
                          <div className="flex items-center gap-1.5 text-primary/80">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Video Guide</span>
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* Certificate Section */}
        <div className="mt-16 relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 md:p-12">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-[0.03] dark:opacity-10 pointer-events-none">
            <Medal className="w-64 h-64 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-inner">
              <Award className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">Certificate of Completion</h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl bg-background/50 rounded-lg p-2 md:bg-transparent md:p-0">
                Upon finishing all {metadata.totalLessons} modules in the <span className="font-semibold text-foreground">{metadata.title}</span> track, you will earn a verified completion certificate.
              </p>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mt-8">
                <a href={`/api/certificate?course=${activeCourseId}&theme=light`} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="gap-2 shrink-0">
                    <Download className="w-4 h-4" />
                    Download Certificate (Light)
                  </Button>
                </a>
                <a href={`/api/certificate?course=${activeCourseId}&theme=dark`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="gap-2 shrink-0">
                    <Download className="w-4 h-4" />
                    Download Certificate (Dark)
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // View 1: Top Level Course Grid
  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-500">
      {/* Filters */}
      {allCategories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category, idx) => (
            <Badge
              key={`${category}-${idx}`}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer capitalize px-4 py-1.5 text-sm transition-all ${selectedCategory === category ? "shadow-md scale-105" : "hover:bg-muted"}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((courseGroup, courseIndex) => {
          const meta = getCourseMetadata(courseGroup)

          return (
            <div
              key={`course-${courseGroup.course}-${courseIndex}`}
              onClick={() => setActiveCourseId(courseGroup.course)}
              className="group cursor-pointer rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-primary/50 flex flex-col h-full"
            >
              {/* Course Hero Image */}
              <div className="h-48 w-full relative overflow-hidden bg-muted">
                <img src={meta.illustration} alt={meta.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground border-none shadow-sm uppercase text-[10px] tracking-wider">
                    {meta.category}
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md uppercase text-[10px] tracking-wider">
                    {meta.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl tracking-tight mb-2 group-hover:text-primary transition-colors">{meta.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">{meta.description}</p>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      <span>{meta.totalLessons} Lessons</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    Enter Track <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No Courses Found</h3>
          <p className="text-muted-foreground">Try selecting a different category filter.</p>
        </div>
      )}
    </div>
  )
}
