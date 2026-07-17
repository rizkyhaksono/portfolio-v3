import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowBigRightDash } from "lucide-react"
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

/** Cover block for Medium posts that include an embedded image. */
function MediumCover({ src, alt }: Readonly<{ src: string; alt: string }>) {
  return (
    <div className="relative h-48 w-full overflow-hidden bg-secondary">
      <Image src={src} alt={alt} fill className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105" draggable={false} loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  )
}

/** Title + preview text for a Medium card. */
function MediumCardHeader({ title, preview }: Readonly<{ title: string; preview: string }>) {
  return (
    <CardHeader className="space-y-1.5 p-4 pb-2">
      <CardTitle className="line-clamp-2 font-display text-base font-bold tracking-tight transition-colors group-hover:text-primary sm:text-lg">{title}</CardTitle>
      <div className="prose max-w-full text-pretty font-sans text-xs leading-snug text-muted-foreground sm:text-sm dark:prose-invert line-clamp-3">{preview}</div>
    </CardHeader>
  )
}

/** Footer CTA for a Medium card. */
function MediumCardFooter({ href }: Readonly<{ href: string }>) {
  return (
    <CardFooter className="mt-auto border-t border-border p-4 pt-4">
      <Link href={href} target="_blank" className="w-full">
        <Button size="sm" variant="ghost" className="w-full justify-between gap-2 transition-colors hover:bg-primary/5 hover:text-primary group/btn">
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider">Read more</span>
          <ArrowBigRightDash className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Button>
      </Link>
    </CardFooter>
  )
}

/**
 * Solid media card for Medium blog posts.
 */
export default function CardBlogMedium({ title, description, href }: Readonly<CardBlogMediumProps>) {
  const { imageUrl, cleanDescription } = extractImageFromDescription(description)
  const descriptionPreview = cleanDescription.slice(0, 100) + (cleanDescription.length > 200 ? "..." : "")
  const cover: ReactNode = imageUrl ? <MediumCover src={imageUrl} alt={title} /> : null

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-colors hover:border-foreground/20">
      <Link href={href} className="block flex-1 overflow-hidden" target="_blank">
        {cover}
        <MediumCardHeader title={title} preview={descriptionPreview} />
      </Link>
      <MediumCardFooter href={href} />
    </Card>
  )
}
