import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowBigRightDash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CardBlogMedium({
  title,
  description,
  href,
}: Readonly<{
  title: string
  description: string
  href: string
}>) {
  const extractImageFromDescription = (html: string): { imageUrl: string | null; cleanDescription: string } => {
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

  const { imageUrl, cleanDescription } = extractImageFromDescription(description)
  const descriptionPreview = cleanDescription.slice(0, 100) + (cleanDescription.length > 200 ? "..." : "")

  return (
    <Card className="group flex flex-col overflow-hidden border border-muted/40 hover:border-primary/30 bg-background/50 hover:bg-muted/10 shadow-sm hover:shadow-xl transition-all duration-500 ease-out h-full">
      <Link href={href} className="block overflow-hidden flex-1" target="_blank">
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <Image src={imageUrl} alt={title} fill className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105" draggable={false} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        )}
        <CardHeader className="p-4 pb-2">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary line-clamp-2">{title}</CardTitle>
            <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert line-clamp-3 leading-snug">{descriptionPreview}</div>
          </div>
        </CardHeader>
      </Link>
      <CardFooter className="p-4 pt-4 mt-auto border-t border-border/10">
        <Link href={href} target="_blank" className="w-full">
          <Button size="sm" variant="ghost" className="w-full gap-2 justify-between hover:bg-primary/5 hover:text-primary transition-colors group/btn">
            <span className="font-medium">Read more</span>
            <ArrowBigRightDash className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
