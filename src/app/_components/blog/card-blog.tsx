import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CardBlogProps {
  title: string
  description: string
  image?: string
  href: string
}

/**
 * Strips HTML tags for safe card preview text (avoids dangerouslySetInnerHTML).
 */
function toPlainText(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim()
}

/** Renders a compact on-site article preview in the editorial blog list. */
export default function CardBlog({ title, description, image, href }: Readonly<CardBlogProps>) {
  return (
    <article className="group border-t border-border last:border-b">
      <Link href={href} className="grid grid-cols-[1fr_auto] items-center gap-5 py-6 sm:py-8">
        <div className="min-w-0">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Article</p>
          <h2 className="text-balance font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{title}</h2>
          <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{toPlainText(description)}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium">Read article <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
        {image && (
          <div className="relative hidden aspect-[4/3] w-36 overflow-hidden border border-border bg-muted sm:block lg:w-44">
            <Image src={image} alt="" fill className="object-cover grayscale transition-[filter] group-hover:grayscale-0" draggable={false} loading="lazy" />
          </div>
        )}
      </Link>
    </article>
  )
}
