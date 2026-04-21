import BlurFade from "@/components/magicui/blur-fade"
import { getBlogDetail, getBlogViews, getComments } from "@/services/visitor/blog"
import BlogReaderView from "@/app/_components/blog/blog-reader-view"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

type Params = Promise<{ content: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(
  props: Readonly<{ params: Params; searchParams: SearchParams }>
): Promise<Metadata> {
  const params = await props.params
  const searchParams = await props.searchParams
  const blog = await getBlogDetail({ params, searchParams })

  if (!blog?.title) {
    return { title: "Blog" }
  }

  const ogImage = blog.cover_image ?? `/api/og?type=blog&title=${encodeURIComponent(blog.title)}&subtitle=${encodeURIComponent(blog.description ?? "")}`

  return {
    title: `${blog.title} | Blog`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [ogImage],
    },
  }
}

export default async function BlogDetail(
  props: Readonly<{
    params: Params
    searchParams: SearchParams
  }>,
) {
  const params = await props.params
  const searchParams = await props.searchParams

  const blog = await getBlogDetail({ params, searchParams })
  const pageViewCount = await getBlogViews(searchParams.id as string)
  const comments = await getComments(searchParams.id as string)

  if (pageViewCount === undefined) return notFound()

  return (
    <BlurFade delay={0.25} inView>
      <BlogReaderView content={blog} pageViewCount={pageViewCount} comments={comments} />
    </BlurFade>
  )
}
