// Hex copies of the globals.css tokens for places CSS variables cannot reach (meta theme-color, the manifest,
// global-error.tsx, the OG and certificate cards, the icon script). The only file allowed raw hex besides
// globals.css and the OG/certificate routes; contrast.test.ts keeps it within ±1 of the tokens.
export const THEME_HEX = {
  light: {
    background: "#FFFFFF",
    foreground: "#37352F",
    mutedForeground: "#6E6D69",
    border: "#E9E9E7",
    muted: "#F7F7F5",
    sky: "#2D5B8C",
  },
  dark: {
    background: "#191919",
    foreground: "#D4D4D4",
    mutedForeground: "#9B9B9B",
    border: "#2F2F2F",
    muted: "#202020",
    sky: "#8DB6E6",
  },
} as const
