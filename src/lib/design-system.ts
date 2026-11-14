/**
 * Shared layout and surface tokens for Portfolio v3 (Langit Malang).
 *
 * Page-level surfaces never cast a shadow:
 * - solid:  hairline frame on the card ground
 * - inset:  muted ground, no border, for tiles and nested rows
 */

const SOLID = "rounded-2xl border border-border bg-card"

export const SURFACE = {
  solid: SOLID,
  solidHover: "hover:border-foreground/20",
  glass: SOLID,
  glassNoBlur: SOLID,
  inset: "rounded-2xl bg-muted",
} as const

/** Default content padding for solid cards and feature boxes. */
export const SURFACE_PADDING = {
  default: "p-5",
  compact: "p-3",
  cozy: "p-4",
} as const

/** The reading column every visitor page shares: 36rem, centred on the page, text left-aligned inside it. */
export const PROSE_WIDTH = "mx-auto w-full max-w-[calc(36rem+2.5rem)] px-5 sm:max-w-[calc(36rem+3rem)] sm:px-6"

/** The wider column for app-like pages (/tools, /chat). */
export const WIDE_WIDTH = "mx-auto w-full max-w-[calc(60rem+2.5rem)] px-5 sm:max-w-[calc(60rem+3rem)] sm:px-6"

/** Images stay exactly as wide as the reading column on every page, so their edges line up with the text. */
export const BREAKOUT = ""

/** @deprecated Use PROSE_WIDTH; kept so older call sites keep the reading column. */
export const SHELL_WIDTH = PROSE_WIDTH

/** Section rhythm on visitor pages. */
export const SECTION_SPACING = {
  section: "mt-14",
  sectionGap: "mt-4",
} as const

export type SurfaceVariant = keyof typeof SURFACE
