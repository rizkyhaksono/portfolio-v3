// Hex copies of the ink / paper / mark tokens for the few places CSS variables cannot reach: meta theme-color,
// the web manifest, global-error.tsx (which renders without globals.css), the OG and certificate images
// and the settings Swatch. Keep in step with globals.css (contrast.test.ts checks it); night* are the .dark values.
// The only file the grep gate's hex rule skips.
export const PRINT_HEX = {
  paper: "#F7F7F5",
  ink: "#141414",
  inkSoft: "#5C5C57",
  rule: "#DCDCD7",
  mark: "#FF4F00",
  night: "#141414",
  nightInk: "#F2F2EE",
  nightMark: "#FF6326",
} as const
