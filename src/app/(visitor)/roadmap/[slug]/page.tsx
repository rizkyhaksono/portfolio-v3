import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllRoadmapLessons, getRoadmapIndex, getRoadmapLessonBySlug } from "@/lib/mdx"
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
  const { content: body } = await compileMDX({
    source: content,
    components: getMDXComponents(),
    options: { mdxOptions: { remarkPlugins: [remarkGfm, headingIds(headings)] } },
  })

  const dateline = [
    course && position > 0 && `Lesson ${position} of ${course.lessons.length} in ${courseTitle(meta.course)}.`,
    meta.level && `${LEVEL[meta.level]}${minutes > 0 ? `, ${minutes} minutes to read` : ""}.`,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <ArticleShell
      title={meta.title}
      standfirst={meta.description}
      dateline={dateline}
      railLabel="On this page"
      rail={
        <>
          {headings.length > 0 && (
            <ol role="list" className="flex flex-col gap-2">
              {headings.map((heading) => (
                <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
                  <InkLink href={`#${heading.id}`} className="inline-flex min-h-11 items-center md:min-h-0 no-underline hover:underline">
                    {heading.text}
                  </InkLink>
                </li>
              ))}
            </ol>
          )}
          <InkLink href={`/roadmap#${meta.course}`} className="inline-flex min-h-11 items-center md:min-h-0 no-underline hover:underline">
            All lessons in {courseTitle(meta.course)}
          </InkLink>
        </>
      }
      footer={<LessonCompleteButton courseId={meta.course || "unknown"} slug={slug} />}
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
  const ogImage = meta.illustration ?? `/api/og?type=roadmap&title=${encodeURIComponent(meta.title)}&subtitle=${encodeURIComponent(meta.description ?? "")}`

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
