import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllRoadmapLessons, getRoadmapIndex, getRoadmapLessonBySlug } from "@/lib/mdx"
import { ogImageUrl } from "@/lib/site-url"
import { BookOpen, Clock, FileText, ListOrdered, Signal } from "lucide-react"
import { ArticleShell } from "@/components/ui/article-shell"
import { InkLink } from "@/components/ui/ink-link"
import { YouTubeFacade } from "@/components/ui/youtube-facade"
import { getMDXComponents, headingIds } from "@/components/ui/roadmap-mdx-component"
import { LessonCompleteButton } from "../_components/lesson-complete-button"
import { courseTitle, minutesOf } from "../course-title"

export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

const LEVEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as const

/** "https://www.youtube.com/embed/abc" → "abc". */
const videoId = (url?: string) => url?.match(/(?:embed\/|v=|youtu\.be\/)([\w-]+)/)?.[1]

export default async function RoadmapLessonPage({ params }: Readonly<Props>) {
  const { slug } = await params
  const lesson = getRoadmapLessonBySlug(slug)
  if (!lesson) notFound()

  const { meta, content } = lesson
  const course = getRoadmapIndex().find((entry) => entry.course === meta.course)
  const position = course ? course.lessons.findIndex((entry) => entry.slug === slug) + 1 : 0
  const minutes = minutesOf(meta.duration)
  const video = videoId(meta.video)

  const headings: { id: string; text: string; depth: number }[] = []
  // Lessons are authored in this repo. blockJS would strip the literal arrays those
  // components take (objectives, resources), so the page prerender crashes.
  const { content: body } = await compileMDX({
    source: content,
    components: getMDXComponents(),
    options: { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm, headingIds(headings)] } },
  })

  const lessons = course?.lessons ?? []
  const link = (entry?: (typeof lessons)[number]) => entry && { href: `/roadmap/${entry.slug}`, title: entry.meta.title }
  const properties = [
    {
      label: "Course",
      icon: <BookOpen />,
      value: (
        <InkLink href={`/roadmap#${meta.course}`} className="inline-flex min-h-11 items-center md:min-h-0">
          {courseTitle(meta.course)}
        </InkLink>
      ),
    },
    ...(position > 0 ? [{ label: "Lesson", icon: <ListOrdered />, value: `${position} of ${lessons.length}` }] : []),
    ...(meta.level ? [{ label: "Level", icon: <Signal />, value: LEVEL[meta.level] }] : []),
    ...(minutes > 0 ? [{ label: "Reading time", icon: <Clock />, value: `${minutes} minutes` }] : []),
  ]

  return (
    <ArticleShell
      icon={<FileText />}
      title={meta.title}
      standfirst={meta.description}
      properties={properties}
      railLabel="On this page"
      rail={
        headings.length > 0 && (
          <ol role="list" className="flex flex-col">
            {headings.map((heading) => (
              <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
                <InkLink href={`#${heading.id}`} className="inline-flex min-h-11 items-center no-underline hover:underline md:min-h-7">
                  {heading.text}
                </InkLink>
              </li>
            ))}
          </ol>
        )
      }
      footer={<LessonCompleteButton courseId={meta.course || "unknown"} slug={slug} />}
      prev={position > 1 ? link(lessons[position - 2]) : undefined}
      next={position > 0 ? link(lessons[position]) : undefined}
    >
      {video && <YouTubeFacade id={video} title={meta.title} lesson={slug} />}
      {body}
    </ArticleShell>
  )
}

export function generateStaticParams() {
  return getAllRoadmapLessons().map((lesson) => ({ slug: lesson.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lesson = getRoadmapLessonBySlug(slug)

  if (!lesson) return { title: "Lesson not found" }

  const { meta } = lesson
  const ogImage = meta.illustration ?? ogImageUrl({ type: "roadmap", title: meta.title, subtitle: meta.description ?? "" })

  return {
    title: `${meta.title} | Roadmap`,
    description: meta.description,
    alternates: { canonical: `/roadmap/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  }
}
