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

/** Section spacing used by PageSection / home blocks. */
export const SECTION_SPACING = {
  section: "mt-16 sm:mt-24",
  sectionGap: "mt-4",
} as const

/**
 * Content width presets for page wrappers.
 * Prefer `default` inside BaseLayout (trust the container).
 */
export const PAGE_WIDTH = {
  default: "w-full",
  prose: "mx-auto w-full max-w-3xl",
  article: "mx-auto w-full max-w-5xl",
  wide: "mx-auto w-full max-w-7xl",
  ledger: "mx-auto w-full max-w-[60rem]",
} as const

export type SurfaceVariant = keyof typeof SURFACE
export type PageWidth = keyof typeof PAGE_WIDTH
