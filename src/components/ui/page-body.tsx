import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"
import { PAGE_WIDTH, type PageWidth } from "@/lib/design-system"

interface PageBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Content width preset.
   * - default: trust BaseLayout container (no nested max-w / extra px)
   * - prose: max-w-3xl (articles / long-form)
   * - article: max-w-5xl (project detail, changelog)
   * - wide: max-w-7xl (roadmap grids)
   */
  width?: PageWidth
}

/**
 * Width wrapper for page content inside BaseLayout.
 * Do not add extra `px-4` / `lg:px-0` — BaseLayout already pads the container.
 */
export function PageBody({ width = "default", className, children, ...props }: Readonly<PageBodyProps>) {
  return (
    <div className={cn(PAGE_WIDTH[width], "flex flex-col gap-6", className)} {...props}>
      {children}
    </div>
  )
}

export default PageBody
