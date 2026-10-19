import type { HTMLAttributes, ReactNode } from "react"

interface CopyHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children?: ReactNode
}

/**
 * Lesson heading. Its id comes from the `headingIds` remark plugin (so headings with inline code keep one);
 * h2 and h3 carry a ¶ permalink to copy from the address bar. Server only, no script.
 */
export function CopyHeader({ level, id, children, ...props }: Readonly<CopyHeaderProps>) {
  const Tag = `h${level}` as const
  return (
    <Tag id={id} {...props}>
      {children}
      {id && level <= 3 && (
        <>
          {" "}
          {/* `!`: `.prose a` would otherwise underline and full-ink the pilcrow. */}
          <a href={`#${id}`} aria-label="Permalink" className="not-italic !text-ink-soft !no-underline hover:!text-ink">
            &para;
          </a>
        </>
      )}
    </Tag>
  )
}
