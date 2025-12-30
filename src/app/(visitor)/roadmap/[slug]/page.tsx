import { notFound } from "next/navigation"
import { getRoadmapLessonBySlug, getAllRoadmapLessons } from "@/lib/mdx"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, BookOpen, ArrowLeft, GraduationCap, Layers } from "lucide-react"
import Image from "next/image"
import { getMDXComponents } from "@/components/ui/roadmap-mdx-component"
import { MDXRemote } from "next-mdx-remote/rsc"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const difficultyColors = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
}

export default async function RoadmapLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = getRoadmapLessonBySlug(slug)

  if (!lesson) {
    notFound()
  }

  const { meta, content } = lesson
  const components = getMDXComponents()
  const difficultyClass = meta.difficulty ? difficultyColors[meta.difficulty as keyof typeof difficultyColors] : ""

  return (
    <div className="min-h-screen">
      {/* Back Button - Sticky */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container max-w-4xl py-3">
          <Link href="/roadmap">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted">
              <ArrowLeft className="size-4" />
              Back to Roadmap
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-4xl py-8">
        {/* Header Section */}
        <header className="mb-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {meta.difficulty && (
              <Badge variant="outline" className={`capitalize ${difficultyClass}`}>
                <GraduationCap className="size-3 mr-1" />
                {meta.difficulty}
              </Badge>
            )}
            {meta.category && (
              <Badge variant="secondary" className="capitalize">
                <Layers className="size-3 mr-1" />
                {meta.category}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{meta.title}</h1>

          {/* Description */}
          {meta.description && <p className="text-lg text-muted-foreground leading-relaxed mb-6">{meta.description}</p>}

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground p-4 rounded-lg bg-muted/50 border">
            {meta.course && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="capitalize font-medium">{meta.course.replace(/-/g, " ")}</span>
              </div>
            )}
            {meta.course && meta.duration && <Separator orientation="vertical" className="h-4" />}
            {meta.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{meta.duration} read</span>
              </div>
            )}
          </div>
        </header>

        {/* Video Embed */}
        {meta.video && (
          <Card className="mb-8 overflow-hidden border-2">
            <CardContent className="p-0">
              <div className="relative aspect-video w-full">
                <iframe src={meta.video} title={meta.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Illustration */}
        {meta.illustration && !meta.video && (
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video w-full">
                <Image src={meta.illustration} alt={meta.title} fill className="object-cover" priority />
              </div>
            </CardContent>
          </Card>
        )}

        {/* MDX Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:border-b prose-h2:pb-2 prose-h2:mt-10 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-pre:bg-zinc-950 prose-pre:border prose-code:before:content-none prose-code:after:content-none">
          <MDXRemote source={content} components={components} />
        </article>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const lessons = getAllRoadmapLessons()
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = getRoadmapLessonBySlug(slug)

  if (!lesson) {
    return {
      title: "Lesson Not Found",
    }
  }

  const { meta } = lesson

  return {
    title: `${meta.title} | Roadmap`,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      images: meta.illustration ? [{ url: meta.illustration }] : [],
    },
  }
}
