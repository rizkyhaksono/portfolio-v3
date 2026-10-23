/**
 * Shared design-system class tokens for Portfolio v3 (one ink on paper).
 *
 * Surfaces are ruled frames on the paper itself, never filled cards:
 * - solid:  hairline frame, transparent ground (Card / FeatureCard)
 * - glass:  retired, same as solid (no blur, no translucency)
 * - inset:  tint ground for nested rows and code
 */

const SOLID = "rounded-none border border-border bg-transparent"

export const SURFACE = {
  solid: SOLID,
  solidHover: "hover:border-foreground/20",
  glass: SOLID,
  glassNoBlur: SOLID,
  inset: "bg-muted",
} as const

/** Default content padding for solid cards and feature boxes. */
export const SURFACE_PADDING = {
  default: "p-5",
  compact: "p-3",
  cozy: "p-4",
} as const

/** The one page width every route shares (running head, pages, colophon, error page). */
export const SHELL_WIDTH = "mx-auto w-full max-w-[76rem] px-[clamp(20px,4vw,48px)]"

/** Section spacing used by PageSection / home blocks. */
export const SECTION_SPACING = {
  section: "mt-12 sm:mt-16",
  sectionGap: "mt-3",
} as const

export type SurfaceVariant = keyof typeof SURFACE
