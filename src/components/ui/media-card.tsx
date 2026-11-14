import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { canOptimizeImage } from "@/lib/image-hosts"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  href: string
  /** Screenshot or cover; without one the card shows the title on the grey ground. */
  image?: string | null
  title: ReactNode
  /** One or two plain lines under the title. */
  description?: ReactNode
  /** A small property line: a year, a date, a tag. */
  meta?: ReactNode
  /** Above the fold on phones: load eagerly (the LCP image). */
  priority?: boolean
  external?: boolean
  /** `next/image` sizes for the grid the card sits in. */
  sizes?: string
  className?: string
}

/**
 * Notion's gallery card: the cover image on top, the title and a property or two under it, a hairline round the
 * whole card and a faint tint on hover. The whole card is one link.
 */
export function MediaCard({ href, image, title, description, meta, priority, external, sizes, className }: Readonly<MediaCardProps>) {
  const content = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            unoptimized={!canOptimizeImage(image)}
            sizes={sizes ?? "(min-width: 1024px) 15rem, (min-width: 640px) 50vw, 100vw"}
            className="object-cover object-top"
          />
        ) : (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center p-4 text-center text-small text-muted-foreground">
            {title}
          </span>
        )}
      </div>
      <div className="px-2.5 pb-2.5 pt-2">
        <h3 className="line-clamp-2 text-small font-medium text-foreground">{title}</h3>
        {description && <p className="mt-0.5 line-clamp-2 text-small text-muted-foreground">{description}</p>}
        {meta != null && <div className="mt-1.5 flex flex-wrap items-center gap-1 text-caption tabular-nums text-muted-foreground">{meta}</div>}
      </div>
    </>
  )

  const linkClass = "block h-full overflow-hidden rounded-lg border border-border bg-background transition-colors duration-ui ease-out hover:bg-tint"
  return (
    <article className={cn("h-full", className)}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {content}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link href={href} className={linkClass}>
          {content}
        </Link>
      )}
    </article>
  )
}

/** Notion's gallery view: two columns of cards on phones and tablets, three beside the sidebar. */
export function Gallery({ children, className }: Readonly<{ children: ReactNode; className?: string }>) {
  return <ul role="list" className={cn("grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 [&>li]:min-w-0", className)}>{children}</ul>
}

export default MediaCard
