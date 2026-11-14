import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { canOptimizeImage } from "@/lib/image-hosts"
import { BREAKOUT } from "@/lib/design-system"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  href: string
  /** Screenshot or cover; without one the tile shows the title on the grey ground. */
  image?: string | null
  title: ReactNode
  /** One or two plain lines under the title. */
  description?: ReactNode
  /** Right-hand detail: a year, a date. */
  meta?: ReactNode
  /** Above the fold on phones: load eagerly (the LCP image). */
  priority?: boolean
  external?: boolean
  className?: string
}

/**
 * Work shown as its own screenshot: a large grey tile with soft corners, the title and one line underneath.
 * The whole card is one link; the image lifts a touch on hover where a pointer can hover and motion is allowed.
 */
export function MediaCard({ href, image, title, description, meta, priority, external, className }: Readonly<MediaCardProps>) {
  const content = (
    <>
      <div className={cn("relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted", BREAKOUT)}>
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            unoptimized={!canOptimizeImage(image)}
            sizes="(min-width: 1024px) 48rem, (min-width: 640px) 40rem, 100vw"
            className="object-cover object-top transition-transform duration-500 ease-out [@media(hover:hover)]:motion-safe:group-hover:scale-[1.015]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center p-6 text-center text-body text-muted-foreground">{title}</span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="text-body text-foreground underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-foreground/40">
          {title}
        </h3>
        {meta != null && <span className="shrink-0 text-small tabular-nums text-muted-foreground">{meta}</span>}
      </div>
      {description && <p className="mt-1 line-clamp-2 text-body text-muted-foreground">{description}</p>}
    </>
  )

  const linkClass = "group block rounded-2xl focus-visible:outline-offset-4"
  return (
    <article className={className}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {content}
        </a>
      ) : (
        <Link href={href} className={linkClass}>
          {content}
        </Link>
      )}
    </article>
  )
}

export default MediaCard
