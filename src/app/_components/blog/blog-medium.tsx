import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CardBlogMediumProps {
  title: string
  description: string
  href: string
}

/**
 * Pulls the first Medium figure image out of the HTML description.
 */
function extractImageFromDescription(html: string): { imageUrl: string | null; cleanDescription: string } {
  const imgRegex = /<figure><img.*?src="(.*?)".*?><\/figure>/
  const match = imgRegex.exec(html)
  let imageUrl = null
  let cleanDescription = html
  if (match?.[1]) {
    imageUrl = match[1]
    cleanDescription = html.replace(/<figure><img.*?><\/figure>/, "")
  }
  const textOnly = cleanDescription.replace(/<\/?[^>]+(>|$)/g, " ").trim()
  return { imageUrl, cleanDescription: textOnly }
}

export default function CardBlogMedium({ title, description, href }: Readonly<CardBlogMediumProps>) {
  const { imageUrl, cleanDescription } = extractImageFromDescription(description)
  const descriptionPreview = cleanDescription.slice(0, 100) + (cleanDescription.length > 200 ? "..." : "")

  return (
    <article className="group border-t border-border last:border-b">
      <Link href={href} target="_blank" className="grid grid-cols-[1fr_auto] items-center gap-5 py-6 sm:py-8">
        <div className="min-w-0">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Medium</p>
          <h2 className="text-balance font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{title}</h2>
          <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{descriptionPreview}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium">Read on Medium <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
        {imageUrl && (
          <div className="relative hidden aspect-[4/3] w-36 overflow-hidden border border-border bg-muted sm:block lg:w-44">
            <Image src={imageUrl} alt="" fill className="object-cover grayscale transition-[filter] group-hover:grayscale-0" draggable={false} loading="lazy" />
          </div>
        )}
      </Link>
    </article>
  )
}
