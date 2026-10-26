// Hex copies of the ink / paper tokens for the few places CSS variables cannot reach: meta theme-color,
// the web manifest, global-error.tsx (which renders without globals.css) and the plate filter tables.
// Keep in step with globals.css; night* are the .dark values (Night prints cream on the hero's cobalt).
// The only file the grep gate's hex rule skips.
export const PRINT_HEX = {
  paper: "#F3ECDC",
  ink: "#1E3C9E",
  inkSoft: "#445BAA",
  rule: "#BFC6DE",
  night: "#1E3C9E",
  nightTint: "#142C7B",
  nightInkSoft: "#E6D9BC",
  nightInk: "#F3ECDC",
} as const
