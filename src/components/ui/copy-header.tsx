import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CopyHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children?: ReactNode
}

/**
 * Lesson heading. Its id comes from the `headingIds` remark plugin (so headings with inline code keep one);
 * h2 and h3 carry a ¶ permalink that shows on hover or focus, as Notion's block link does. Server only, no script.
 */
export function CopyHeader({ level, id, children, className, ...props }: Readonly<CopyHeaderProps>) {
  const Tag = `h${level}` as const
  return (
    <Tag id={id} className={cn("group/heading", className)} {...props}>
      {children}
      {id && level <= 3 && (
        <>
          {" "}
          {/* `!`: `.prose a` would otherwise underline the pilcrow and colour it as a link. */}
          <a href={`#${id}`} aria-label="Permalink" className="relative !text-muted-foreground !no-underline opacity-0 transition-opacity duration-ui ease-out after:absolute after:-inset-3 hover:!text-foreground focus-visible:opacity-100 group-hover/heading:opacity-100 [@media(hover:none)]:opacity-100">
            &para;
          </a>
        </>
      )}
    </Tag>
  )
}
