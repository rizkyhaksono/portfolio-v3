/**
 * Shared design-system class tokens for Portfolio v3.
 *
 * Three surface dialects only — do not invent ad-hoc glass/solid blends:
 * - solid:  default content boxes (Card / FeatureCard)
 * - glass:  window chrome only (MacWindow, right-sidebar shell)
 * - inset:  nested rows, sidebar blocks, status cells
 */

export const SURFACE = {
  solid:
    "rounded-none border border-border bg-card text-card-foreground shadow-sm transition-colors",
  solidHover: "hover:border-foreground/20",
  glass:
    "rounded-none border border-border/60 bg-background/40 shadow-sm backdrop-blur-sm",
  glassNoBlur: "rounded-none border border-border/60 bg-background/40 shadow-sm",
  inset: "rounded-none border border-border/40 bg-secondary/20",
} as const

/** Default content padding for solid cards and feature boxes. */
export const SURFACE_PADDING = {
  default: "p-6",
  compact: "p-4",
  cozy: "p-5",
} as const

/** Section spacing used by PageSection / home blocks. */
export const SECTION_SPACING = {
  section: "mt-10",
  sectionGap: "mt-6",
} as const

/**
 * Content width presets for PageBody.
 * Prefer `default` inside BaseLayout (trust the container).
 */
export const PAGE_WIDTH = {
  default: "w-full",
  prose: "mx-auto w-full max-w-3xl",
  article: "mx-auto w-full max-w-5xl",
  wide: "mx-auto w-full max-w-7xl",
} as const

export type SurfaceVariant = keyof typeof SURFACE
export type PageWidth = keyof typeof PAGE_WIDTH
