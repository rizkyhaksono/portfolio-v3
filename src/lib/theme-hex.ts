// Hex copies of the globals.css tokens for places CSS variables cannot reach (meta theme-color, the manifest,
// global-error.tsx, the OG and certificate cards, the icon script). The only file allowed raw hex besides
// globals.css and the OG/certificate routes; contrast.test.ts keeps it within ±1 of the tokens.
export const THEME_HEX = {
  light: {
    background: "#F8F8F6",
    foreground: "#1F201D",
    mutedForeground: "#62635E",
    border: "#E2E2DE",
    muted: "#EFEFEB",
    sky: "#2D5B8C",
  },
  dark: {
    background: "#1A1A19",
    foreground: "#ECECE8",
    mutedForeground: "#A3A49E",
    border: "#30312D",
    muted: "#242522",
    sky: "#8DB6E6",
  },
} as const
