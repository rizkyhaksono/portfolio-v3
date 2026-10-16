// Hex copies of the ink / paper tokens for the few places CSS variables cannot reach: meta theme-color,
// the web manifest and global-error.tsx (which renders without globals.css). Keep in step with globals.css.
// The only file the grep gate's hex rule skips.
export const PRINT_HEX = {
  paper: "#F3ECDC",
  ink: "#1E3C9E",
  inkSoft: "#445CA9",
  night: "#0D1433",
} as const
