import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArticleShell } from "@/components/ui/article-shell"
import ClapButton from "@/components/ui/clap-button"
import { PlateFigure } from "@/components/ui/plate-figure"
import { ReaderCount } from "@/components/ui/reader-count"
import { safeHtml } from "@/app/(visitor)/project/safe-html"
import { ArticleJsonLd } from "@/app/_components/blog/article-json-ld"
import { dateline, minutesToRead } from "@/app/_components/blog/format"
import { getSiteUrl, ogImageUrl } from "@/lib/site-url"
import { canOptimizeImage } from "@/lib/image-hosts"
import { getOnsiteBlogBySlug, getOnsiteBlogPosts } from "@/services/visitor/onsite-blog"
import { getPathReads } from "@/services/visitor/umami"

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getOnsiteBlogPosts()).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getOnsiteBlogBySlug(slug)
  if (!post) return { title: "Article not found" }

  const url = `${getSiteUrl()}/blog/onsite/${post.slug}`
  const image = post.coverImage || ogImageUrl({ type: "blog", title: post.title, subtitle: post.description ?? "" })

  return {
    title: `${post.title} | Writing`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.publishedAt ?? post.created_at,
      modifiedTime: post.updated_at,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
  }
}

export default async function OnsiteArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, reads] = await Promise.all([getOnsiteBlogBySlug(slug), getPathReads()])
  if (!post) notFound()

  const path = `/blog/onsite/${post.slug}`
  const content = safeHtml(post.content ?? "")
  const published = post.publishedAt ?? post.created_at

  return (
    <>
      <ArticleJsonLd title={post.title} description={post.description} path={path} image={post.coverImage} published={published} modified={post.updated_at} />
      <ArticleShell
        back={{ href: "/blog", title: "All writing" }}
        title={post.title}
        standfirst={post.description || undefined}
        dateline={dateline(published, minutesToRead(content))}
        meta={
          <>
            <ReaderCount path={path} reads={reads} className="text-small" />
            <p>Written for this site.</p>
          </>
        }
        cover={
          post.coverImage && (
            <PlateFigure>
              <Image
                src={post.coverImage}
                alt=""
                width={1200}
                height={675}
                priority
                unoptimized={!canOptimizeImage(post.coverImage)}
                sizes="(min-width: 1024px) 48rem, (min-width: 640px) 40rem, 100vw"
                className="aspect-video w-full object-cover"
              />
            </PlateFigure>
          )
        }
        footer={
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ClapButton targetType="blog" targetId={post.slug} />
            <p className="text-small text-muted-foreground">If this was useful, a clap tells me so.</p>
          </div>
        }
      >
        {/* Nested `.prose` so the stored HTML gets the same block spacing as direct children. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      </ArticleShell>
    </>
  )
}
