// Hex copies of the ink / paper tokens for the few places CSS variables cannot reach: meta theme-color,
// the web manifest, global-error.tsx (which renders without globals.css) and the plate filter tables.
// Keep in step with globals.css; night* are the .dark values.
// The only file the grep gate's hex rule skips.
export const PRINT_HEX = {
  paper: "#F3ECDC",
  ink: "#1E3C9E",
  inkSoft: "#445BAA",
  rule: "#BFC6DE",
  night: "#0D1433",
  nightTint: "#162868",
  nightInkSoft: "#A9B5E3",
  nightInk: "#EFE6D2",
} as const
