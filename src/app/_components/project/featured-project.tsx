import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Globe, Star } from "lucide-react"

interface FeaturedProjectProps {
  id: string
  index: number
  title: string
  description: string
  image?: string | null
  href?: string
}

/** Converts stored project HTML into compact editorial preview copy. */
function toPlainText(value: string): string {
  return value.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim()
}

/** Renders one intentionally selected project as an editorial feature row. */
export function FeaturedProject({ id, index, title, description, image, href }: Readonly<FeaturedProjectProps>) {
  return (
    <article className="group grid gap-5 border-t border-border py-6 last:border-b sm:grid-cols-[5rem_minmax(0,1fr)_13rem] sm:items-center lg:grid-cols-[6rem_minmax(0,1fr)_18rem] lg:py-8">
      <div className="flex items-center gap-3 sm:block">
        <span className="font-display text-3xl font-semibold tabular-nums text-muted-foreground/50">0{index}</span>
        <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <Star className="h-3 w-3" /> Featured
        </p>
      </div>
      <div className="min-w-0">
        <Link href={`/project/${id}`} className="inline-flex items-center gap-2">
          <h2 className="text-balance font-display text-2xl font-semibold leading-tight tracking-tight lg:text-3xl">{title}</h2>
          <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-muted-foreground">{toPlainText(description)}</p>
        {href ? (
          <Link href={href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-medium">
            <Globe className="h-3.5 w-3.5" /> Visit project
          </Link>
        ) : null}
      </div>
      <Link href={`/project/${id}`} className="relative order-first aspect-[16/9] overflow-hidden border border-border bg-muted sm:order-none">
        {image && image !== "/no-image.jpg" ? (
          <Image src={image} alt="" fill className="object-cover object-top grayscale transition-[filter,transform] duration-300 group-hover:scale-[1.02] group-hover:grayscale-0" sizes="(min-width: 1024px) 288px, (min-width: 640px) 208px, 100vw" />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-6xl font-semibold text-muted-foreground/20">{title.charAt(0)}</span>
        )}
      </Link>
    </article>
  )
}
