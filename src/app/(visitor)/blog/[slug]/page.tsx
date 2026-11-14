import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArticleShell } from "@/components/ui/article-shell"
import CodeBlock, { Pre } from "@/components/ui/code-block"
import { InkLink } from "@/components/ui/ink-link"
import { PlateFigure } from "@/components/ui/plate-figure"
import { Table } from "@/components/ui/roadmap-mdx-component"
import { ArticleJsonLd } from "@/app/_components/blog/article-json-ld"
import { articleProperties } from "@/app/_components/blog/article-properties"
import BlogLetters from "@/app/_components/blog/blog-letters"
import { getSiteUrl, ogImageUrl } from "@/lib/site-url"
import { canOptimizeImage } from "@/lib/image-hosts"
import { getBlogDetail, getComments } from "@/services/visitor/blog"
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

/** DEV's v1 editor keeps the front matter inside body_markdown. */
const withoutFrontMatter = (markdown: string) => markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")

/** DEV fills an empty description with the body's opening, cut off with "..."; the body then repeats it. */
const isClipped = (description?: string) => /(\.\.\.|…)$/u.test(description?.trim() ?? "")

// No generateStaticParams: the root layout reads headers() for the CSP nonce, so an on-demand ISR render of an
// unbuilt slug threw DYNAMIC_SERVER_USAGE (500). Rendering per request, with the fetches cached by `next.revalidate`,
// also keeps DEV.to (which rate-limits CI bursts) out of the build.

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
        properties={articleProperties({
          published: post.published_at,
          minutes: post.reading_time_minutes,
          source: (
            <InkLink href={post.url} external>
              DEV Community
            </InkLink>
          ),
          comments: (
            <InkLink href="#letters">
              {letters.toLocaleString("en")} {letters === 1 ? "comment" : "comments"}
            </InkLink>
          ),
          path,
          reads,
          tags,
        })}
        cover={
          post.cover_image && (
            <PlateFigure>
              <Image
                src={post.cover_image}
                alt=""
                width={1000}
                height={420}
                priority
                unoptimized={!canOptimizeImage(post.cover_image)}
                sizes="(min-width: 640px) 36rem, 100vw"
                className="aspect-[1000/420] w-full object-cover"
              />
            </PlateFigure>
          )
        }
        footer={<BlogLetters comments={comments} url={post.url} expected={letters} />}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN}>
          {withoutFrontMatter(post.body_markdown ?? "")}
        </ReactMarkdown>
      </ArticleShell>
    </>
  )
}
