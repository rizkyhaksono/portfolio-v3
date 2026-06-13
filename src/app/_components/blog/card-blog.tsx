import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowBigRightDash, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const DOT_PATTERN: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
}

export default function CardBlog({
  title,
  description,
  image,
  href,
}: Readonly<{
  title: string
  description: string
  image?: string
  href: string
}>) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl border border-muted/40 hover:border-primary/40 bg-background/50 hover:bg-muted/10 shadow-sm hover:shadow-xl transition-all duration-500 ease-out h-full">
      <Link href={href} className="block overflow-hidden flex-1">
        {image ? (
          <div className="relative h-44 w-full overflow-hidden bg-muted">
            <Image src={image} alt={title} fill className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105" draggable={false} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-50" style={DOT_PATTERN} />
            {/* Watermark initial */}
            <span className="pointer-events-none absolute -bottom-6 -right-1 select-none text-[7rem] font-black leading-none text-primary/10">
              {title.charAt(0).toUpperCase()}
            </span>
            {/* Glass icon badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/50 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                <BookOpen className="h-7 w-7 text-primary/70" />
              </div>
            </div>
          </div>
        )}
        <CardHeader className="p-4 pb-2">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary line-clamp-2">{title}</CardTitle>
            <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert line-clamp-3 leading-snug" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </CardHeader>
      </Link>
      <CardFooter className="p-4 pt-4 mt-auto border-t border-border/10">
        <Link href={href} className="w-full">
          <Button size="sm" variant="ghost" className="w-full gap-2 justify-between hover:bg-primary/5 hover:text-primary transition-colors group/btn">
            <span className="font-medium">Read more</span>
            <ArrowBigRightDash className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
