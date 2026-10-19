import Link from "next/link"

import { cn } from "@/lib/utils"

type EventData = Record<string, string | number | boolean>

interface InkLinkProps {
  href: string
  /** Opens in a new tab; tracked by Umami as `event` (default `outbound-click`) with the target host. */
  external?: boolean
  /** Kebab-case event name. Internal links only get one when this is set. */
  event?: string
  /** Enum-like values only, never PII. */
  eventData?: EventData
  className?: string
  children: React.ReactNode
}

const prefixed = (prefix: string, data?: EventData) =>
  Object.fromEntries(Object.entries(data ?? {}).map(([key, value]) => [`${prefix}${key}`, String(value)]))

function hostOf(href: string) {
  try {
    return new URL(href).hostname || undefined
  } catch {
    return undefined
  }
}

export function InkLink({ href, external, event, eventData, className, children }: Readonly<InkLinkProps>) {
  const classes = cn("text-ink underline decoration-1 underline-offset-[0.18em] hover:decoration-2", className)

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        data-umami-event={event ?? "outbound-click"}
        data-umami-event-host={hostOf(href)}
        {...prefixed("data-umami-event-", eventData)}
      >
        {children}
        {/* Not `sr-only`: an absolute box in an inline-flex link sits on the first letter (flex static position).
            In flow it stays after the text; clip-path hides it whatever the positioning. */}
        <span className="-mr-px inline-block size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]"> (opens in a new tab)</span>
      </a>
    )
  }

  // Umami's own click handler turns same-tab links into full reloads, so internal links use the data-track listener.
  return (
    <Link href={href} className={classes} data-track={event} {...(event ? prefixed("data-track-", eventData) : {})}>
      {children}
    </Link>
  )
}

export default InkLink
