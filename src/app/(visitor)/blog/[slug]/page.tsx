import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArticleShell } from "@/components/ui/article-shell"
import { Chip } from "@/components/ui/chip"
import CodeBlock, { Pre } from "@/components/ui/code-block"
import { InkLink } from "@/components/ui/ink-link"
import { PlateFigure } from "@/components/ui/plate-figure"
import { ReaderCount } from "@/components/ui/reader-count"
import { Table } from "@/components/ui/roadmap-mdx-component"
import { ArticleJsonLd } from "@/app/_components/blog/article-json-ld"
import BlogLetters from "@/app/_components/blog/blog-letters"
import { dateline } from "@/app/_components/blog/format"
import { getSiteUrl, ogImageUrl } from "@/lib/site-url"
import { getBlogData, getBlogDetail, getComments } from "@/services/visitor/blog"
import { getPathReads } from "@/services/visitor/umami"

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const MARKDOWN: Components = {
  // The page owns the h1.
  h1: "h2",
  pre: Pre,
  code: CodeBlock,
  table: Table,
  // eslint-disable-next-line @next/next/no-img-element -- DEV body images come from many hosts; `.prose img` frames them
  img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" />,
}

// DEV's v1 editor keeps the front matter inside body_markdown.
const withoutFrontMatter = (markdown: string) => markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")

// DEV fills an empty description with the body's opening, cut off with "..."; the body then repeats it.
const isClipped = (description?: string) => /(\.\.\.|…)$/.test(description?.trim() ?? "")

// Render each article on its first request instead of at build: DEV.to rate-limits (429) bursts from CI.
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogDetail(slug)
  if (!post) return { title: "Article not found" }

  const url = `${getSiteUrl()}/blog/${post.slug}`
  const image = post.cover_image || ogImageUrl({ type: "blog", title: post.title, subtitle: post.description ?? "" })

  return {
    title: `${post.title} | Writing`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, type: "article", url, publishedTime: post.published_at, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, reads] = await Promise.all([getBlogDetail(slug), getPathReads()])
  if (!post) notFound()

  const comments = await getComments(post.id)
  const path = `/blog/${post.slug}`
  const tags = [...new Set(post.tags ?? [])]
  const letters = post.comments_count ?? 0

  return (
    <>
      <ArticleJsonLd title={post.title} description={post.description} path={path} image={post.cover_image} published={post.published_at} modified={post.edited_at} />
      <ArticleShell
        title={post.title}
        standfirst={isClipped(post.description) ? undefined : post.description}
        dateline={dateline(post.published_at, post.reading_time_minutes)}
        railLabel="About this article"
        rail={
          <>
            <ReaderCount path={path} reads={reads} />
            {tags.length > 0 && (
              <div>
                <p className="font-display text-caption">Filed under</p>
                <ul role="list" className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag}>
                      <Chip>{tag}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p>
              <InkLink href="#letters">
                {letters.toLocaleString("en")} {letters === 1 ? "letter" : "letters"}
              </InkLink>{" "}
              from readers.
            </p>
            <p>
              First printed on{" "}
              <InkLink href={post.url} external>
                DEV Community
              </InkLink>
              .
            </p>
          </>
        }
        footer={<BlogLetters comments={comments} url={post.url} />}
      >
        {post.cover_image && (
          // `.prose img` frames body images; the plate brings its own frame.
          <PlateFigure className="[&_img]:border-0 [&_img]:p-0">
            <Image src={post.cover_image} alt="" width={1000} height={420} priority sizes="(min-width: 1024px) 66ch, 100vw" className="aspect-[1000/420] w-full object-cover" />
          </PlateFigure>
        )}
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN}>
          {withoutFrontMatter(post.body_markdown ?? "")}
        </ReactMarkdown>
      </ArticleShell>
    </>
  )
}
