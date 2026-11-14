/**
 * Shared layout and surface tokens for Portfolio v3 (Notion-style pages in the Langit Malang site).
 *
 * Page-level surfaces never cast a shadow:
 * - solid:  hairline frame on the card ground
 * - inset:  muted ground, no border, for tiles and nested rows
 */

const SOLID = "rounded-lg border border-border bg-card"

export const SURFACE = {
  solid: SOLID,
  solidHover: "hover:border-foreground/20",
  glass: SOLID,
  glassNoBlur: SOLID,
  inset: "rounded-lg bg-muted",
} as const

/** Default content padding for solid cards and feature boxes. */
export const SURFACE_PADDING = {
  default: "p-5",
  compact: "p-3",
  cozy: "p-4",
} as const

/** Notion's page column: 708px of content, centred in the space right of the sidebar, text left-aligned inside it. */
export const PROSE_WIDTH = "mx-auto w-full max-w-[calc(44.25rem+3rem)] px-6 sm:max-w-[calc(44.25rem+6rem)] sm:px-12"

/** Notion's "full width" page, for app-like pages (/tools, /chat). */
export const WIDE_WIDTH = "mx-auto w-full max-w-[90rem] px-6 sm:px-12 lg:px-24"

/** Images stay exactly as wide as the reading column on every page, so their edges line up with the text. */
export const BREAKOUT = ""

/** @deprecated Use PROSE_WIDTH; kept so older call sites keep the reading column. */
export const SHELL_WIDTH = PROSE_WIDTH

/** Section rhythm on visitor pages: a Notion heading block sits well clear of the block above it. */
export const SECTION_SPACING = {
  section: "mt-12",
  sectionGap: "mt-3",
} as const

export type SurfaceVariant = keyof typeof SURFACE
