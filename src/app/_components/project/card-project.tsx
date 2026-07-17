import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, GitBranch, FolderGit2 } from "lucide-react"

const DOT_PATTERN: CSSProperties = {
  backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
}

interface CardProjectProps {
  id: string
  title: string
  description: string
  source?: string
  image?: string
  href?: string
}

/**
 * Strips HTML tags for safe card preview text (avoids dangerouslySetInnerHTML).
 */
function toPlainText(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim()
}

/** Project cover photo. */
function ProjectCoverImage({ src, alt }: Readonly<{ src: string; alt: string }>) {
  return (
    <div className="relative h-44 w-full overflow-hidden bg-muted">
      <Image src={src} alt={alt} fill className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  )
}

/** Icon badge used on the placeholder cover. */
function ProjectPlaceholderBadge() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/60 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
      <FolderGit2 className="h-7 w-7 text-primary/70" />
    </div>
  )
}

/** Placeholder cover when a project has no image. */
function ProjectCoverPlaceholder({ title }: Readonly<{ title: string }>) {
  return (
    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background">
      <div className="absolute inset-0 opacity-50" style={DOT_PATTERN} />
      <span className="pointer-events-none absolute -bottom-6 -right-1 select-none text-[7rem] font-black leading-none text-primary/10">
        {title.charAt(0).toUpperCase()}
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        <ProjectPlaceholderBadge />
      </div>
    </div>
  )
}

/** Title + description block for a project card. */
function ProjectCardHeader({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <CardHeader className="space-y-1.5 p-4 pb-2">
      <CardTitle className="line-clamp-2 font-display text-base font-bold tracking-tight transition-colors group-hover:text-primary sm:text-lg">{title}</CardTitle>
      <p className="line-clamp-2 text-pretty font-sans text-xs leading-snug text-muted-foreground sm:text-sm">{toPlainText(description)}</p>
    </CardHeader>
  )
}

/** Website action button. */
function WebsiteAction({ href }: Readonly<{ href: string }>) {
  return (
    <Link href={href} target="_blank">
      <Button size="sm" variant="secondary" className="h-8 gap-1.5 rounded-md transition-colors hover:bg-primary hover:text-primary-foreground">
        <Globe className="size-3.5" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider">Website</span>
      </Button>
    </Link>
  )
}

/** Source action button. */
function SourceAction({ source }: Readonly<{ source: string }>) {
  return (
    <Link href={source} target="_blank">
      <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-md transition-colors hover:bg-primary/10">
        <GitBranch className="size-3.5" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider">Source</span>
      </Button>
    </Link>
  )
}

/** Footer action row for website / source links. */
function ProjectCardFooter({ href, source }: Readonly<{ href?: string; source?: string }>) {
  return (
    <CardFooter className="mt-auto border-t border-border p-4 pt-4">
      <div className="flex flex-row flex-wrap items-center gap-2">
        {href && href.length > 0 ? <WebsiteAction href={href} /> : null}
        {source && source.length > 0 ? <SourceAction source={source} /> : null}
      </div>
    </CardFooter>
  )
}

/**
 * Solid media card for project list items.
 */
export default function CardProject({ id, title, description, source, image, href }: Readonly<CardProjectProps>) {
  const hasImage = Boolean(image) && image !== "/no-image.jpg"
  const cover: ReactNode = hasImage && image ? <ProjectCoverImage src={image} alt={title} /> : <ProjectCoverPlaceholder title={title} />

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-colors hover:border-foreground/20">
      <Link href={`/project/${id}`} className="block overflow-hidden">
        {cover}
        <ProjectCardHeader title={title} description={description} />
      </Link>
      <ProjectCardFooter href={href} source={source} />
    </Card>
  )
}
