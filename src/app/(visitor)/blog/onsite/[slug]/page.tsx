import BlurFade from "@/components/magicui/blur-fade"
import { getOnsiteBlogBySlug } from "@/services/visitor/onsite-blog"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export default async function OnsiteBlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getOnsiteBlogBySlug(slug)
  if (!post) notFound()

  return (
    <BlurFade delay={0.25} inView>
      <article className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-muted-foreground mb-8">{post.description}</p>
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt="" className="rounded-lg mb-8 w-full" />
        )}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </BlurFade>
  )
}
