import BlurFade from "@/components/magicui/blur-fade"
import { getOnsiteBlogBySlug } from "@/services/visitor/onsite-blog"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, PenLine } from "lucide-react"
import ReadingProgress from "@/app/_components/blog/reading-progress"

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

function estimateReadingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function formatDate(value?: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default async function OnsiteBlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getOnsiteBlogBySlug(slug)
  if (!post) notFound()

  const content = post.content ?? ""
  const publishedDate = formatDate(post.publishedAt ?? post.created_at)
  const readingMinutes = estimateReadingTime(content)

  return (
    <>
      <ReadingProgress />
      <BlurFade delay={0.2} inView>
        <article className="mx-auto max-w-3xl px-4 py-8 md:py-12">
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to blog
          </Link>

          <header className="mb-8">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <PenLine className="h-3.5 w-3.5" />
              Written here
            </div>
            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {post.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {publishedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {publishedDate}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readingMinutes} min read
              </span>
            </div>
          </header>

          {post.coverImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border/50 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div
            className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-muted"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <footer className="mt-12 flex items-center justify-between border-t border-border/60 pt-6">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              All posts
            </Link>
            <span className="text-xs text-muted-foreground">Thanks for reading ✦</span>
          </footer>
        </article>
      </BlurFade>
    </>
  )
}
