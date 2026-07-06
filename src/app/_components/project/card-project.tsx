import Image from "next/image"
import Link from "next/link"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, GitBranch, FolderGit2 } from "lucide-react"

const DOT_PATTERN: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
}

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
  const hasImage = !!image && image !== "/no-image.jpg"

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl border border-border hover:border-primary/40 bg-card shadow-sm hover:shadow-md transition-all duration-500 ease-out h-full">
      <Link href={`/project/${id}`} className="block overflow-hidden">
        {hasImage ? (
          <div className="relative h-44 w-full overflow-hidden bg-muted">
            <Image src={image!} alt={title} fill className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background">
            <div className="absolute inset-0 opacity-50" style={DOT_PATTERN} />
            <span className="pointer-events-none absolute -bottom-6 -right-1 select-none text-[7rem] font-black leading-none text-primary/10">
              {title.charAt(0).toUpperCase()}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/60 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                <FolderGit2 className="h-7 w-7 text-primary/70" />
              </div>
            </div>
          </div>
        )}
        <CardHeader className="p-4 pb-2">
          <div className="space-y-1.5">
            <CardTitle className="font-display text-base sm:text-lg font-bold tracking-tight transition-colors group-hover:text-primary line-clamp-2">{title}</CardTitle>
            <div className="prose max-w-full text-pretty font-sans text-xs sm:text-sm text-muted-foreground dark:prose-invert line-clamp-2 leading-snug" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </CardHeader>
      </Link>
      <CardFooter className="p-4 pt-4 mt-auto border-t border-border">
        <div className="flex flex-row flex-wrap items-center gap-2">
          {href && href.length > 0 && (
            <Link href={href} target="_blank">
              <Button size="sm" variant="secondary" className="h-8 gap-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
                <Globe className="size-3.5" />
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider">Website</span>
              </Button>
            </Link>
          )}
          {source && source.length > 0 && (
            <Link href={source} target="_blank">
              <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-md hover:bg-primary/10 transition-colors">
                <GitBranch className="size-3.5" />
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider">Source</span>
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
