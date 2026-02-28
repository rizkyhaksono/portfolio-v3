import Image from "next/image"
import Link from "next/link"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, GitBranch } from "lucide-react"

export default function CardProject({
  id,
  title,
  description,
  source,
  image,
  href,
}: Readonly<{
  id: string
  title: string
  description: string
  source?: string
  image?: string
  href?: string
}>) {
  return (
    <Card className="group flex flex-col overflow-hidden border border-muted/40 hover:border-primary/30 bg-background/50 hover:bg-muted/10 shadow-sm hover:shadow-xl transition-all duration-500 ease-out h-full">
      <Link href={`/project/${id}`} className="block overflow-hidden">
        {image && (
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <Image src={image} alt={title} fill className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105" />
            {/* Subtle gradient overlay for better text contrast if ever overlaid, and premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        )}
        <CardHeader className="p-4 pb-2">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">{title}</CardTitle>
            <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert line-clamp-2 leading-snug" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </CardHeader>
      </Link>
      <CardFooter className="p-4 pt-4 mt-auto border-t border-border/10">
        <div className="flex flex-row flex-wrap items-center gap-2">
          {href && href.length > 0 && (
            <Link href={href} target="_blank">
              <Button size="sm" variant="secondary" className="h-8 gap-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
                <Globe className="size-3.5" />
                <span className="text-xs font-medium">Website</span>
              </Button>
            </Link>
          )}
          {source && source.length > 0 && (
            <Link href={source} target="_blank">
              <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-md hover:bg-primary/10 transition-colors">
                <GitBranch className="size-3.5" />
                <span className="text-xs font-medium">Source</span>
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
