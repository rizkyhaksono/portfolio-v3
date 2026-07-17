import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowBigRightDash, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const DOT_PATTERN: CSSProperties = {
  backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
}

interface CardBlogProps {
  title: string
  description: string
  image?: string
  href: string
}

/** Cover image for a blog list card. */
function BlogCoverImage({ src, alt }: Readonly<{ src: string; alt: string }>) {
  return (
    <div className="relative h-44 w-full overflow-hidden bg-secondary">
      <Image src={src} alt={alt} fill className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105" draggable={false} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  )
}

/** Placeholder cover when a blog post has no image. */
function BlogCoverPlaceholder({ title }: Readonly<{ title: string }>) {
  return (
    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background">
      <div className="absolute inset-0 opacity-50" style={DOT_PATTERN} />
      <span className="pointer-events-none absolute -bottom-6 -right-1 select-none text-[7rem] font-black leading-none text-primary/10">
        {title.charAt(0).toUpperCase()}
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/50 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
          <BookOpen className="h-7 w-7 text-primary/70" />
        </div>
      </div>
    </div>
  )
}

/**
 * Solid media card for onsite blog posts.
 */
export default function CardBlog({ title, description, image, href }: Readonly<CardBlogProps>) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-colors hover:border-foreground/20">
      <Link href={href} className="block flex-1 overflow-hidden">
        {image ? <BlogCoverImage src={image} alt={title} /> : <BlogCoverPlaceholder title={title} />}
        <CardHeader className="p-4 pb-2">
          <div className="space-y-1.5">
            <CardTitle className="line-clamp-2 font-display text-base font-bold tracking-tight transition-colors group-hover:text-primary sm:text-lg">{title}</CardTitle>
            <div className="prose max-w-full text-pretty font-sans text-xs sm:text-sm text-muted-foreground dark:prose-invert line-clamp-3 leading-snug" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </CardHeader>
      </Link>
      <CardFooter className="mt-auto border-t border-border p-4 pt-4">
        <Link href={href} className="w-full">
          <Button size="sm" variant="ghost" className="w-full justify-between gap-2 transition-colors hover:bg-primary/5 hover:text-primary group/btn">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider">Read more</span>
            <ArrowBigRightDash className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
