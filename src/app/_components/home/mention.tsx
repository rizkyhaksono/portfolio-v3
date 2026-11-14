import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { canOptimizeImage } from "@/lib/image-hosts"

interface MentionProps {
  href: string
  /** The preview's picture (a project screenshot); without one the preview shows `icon` on the grey ground. */
  image?: string | null
  icon?: ReactNode
  /** The preview's title and one or two lines under it. */
  title: string
  description: string
  children: ReactNode
}

/**
 * Notion's link mention in running text: the name in ink with a small picture or icon before it, and on hover or
 * keyboard focus a preview card with the screenshot. The card is decoration (the link text names the place), so it is
 * hidden from assistive tech, and devices without hover simply follow the link.
 */
export function Mention({ href, image, icon, title, description, children }: Readonly<MentionProps>) {
  return (
    <span className="group/mention relative inline-block">
      <Link
        href={href}
        data-track="mention-click"
        data-track-item={title.toLowerCase().replaceAll(" ", "-")}
        className="rounded-sm font-medium text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[0.2em] transition-colors duration-75 hover:bg-tint hover:decoration-foreground"
      >
        <span aria-hidden className="mr-1 inline-flex size-4 items-center justify-center overflow-hidden rounded-sm bg-tint-strong align-[-0.15em] text-muted-foreground [&>svg]:size-3">
          {image ? <Image src={image} alt="" width={32} height={32} unoptimized={!canOptimizeImage(image)} className="size-4 object-cover" /> : icon}
        </span>
        {children}
      </Link>
      <span
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-full z-40 mt-2 block w-72 translate-y-1 overflow-hidden rounded-lg border border-border bg-popover text-left opacity-0 transition-[opacity,transform,visibility] duration-150 ease-out group-focus-within/mention:visible group-focus-within/mention:translate-y-0 group-focus-within/mention:opacity-100 group-hover/mention:visible group-hover/mention:translate-y-0 group-hover/mention:opacity-100 group-hover/mention:delay-150 [@media(hover:none)]:hidden"
      >
        <span className="relative flex aspect-[16/9] items-center justify-center border-b border-border bg-muted text-muted-foreground [&>svg]:size-8 [&>svg]:stroke-[1.25]">
          {image ? <Image src={image} alt="" fill sizes="18rem" unoptimized={!canOptimizeImage(image)} className="object-cover object-top" /> : icon}
        </span>
        <span className="block px-3 pb-3 pt-2">
          <span className="block text-small font-medium text-foreground">{title}</span>
          <span className="mt-0.5 line-clamp-3 block text-caption text-muted-foreground">{description}</span>
        </span>
      </span>
    </span>
  )
}
