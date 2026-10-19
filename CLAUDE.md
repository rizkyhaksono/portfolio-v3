# Claude Instructions for Portfolio v3

> Canonical cross-agent instructions: [`AGENTS.md`](./AGENTS.md)  
> UI design system (source of truth): [`docs/ui/README.md`](./docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. You must produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 16** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS 3 (not v4) + shadcn/ui primitives restyled to the ink and paper tokens
- **Testing**: Jest + React Testing Library (unit), Playwright (e2e)
- **Package Manager**: bun

## Architectural Guidelines

1. **AI Instruction Context (Multiple Agents):** This project uses multiple AI assistants. Prefer [`AGENTS.md`](./AGENTS.md) as the shared source of truth, and [`docs/ui/`](./docs/ui/README.md) for anything visual. Platform files:
   - **All agents**: `AGENTS.md`
   - **Claude**: `CLAUDE.md` and `.claude/` directory
   - **Cursor**: `.cursorrules` and `.cursor/rules/*.mdc`
   - **Gemini**: `.geminirules` / `GEMINI.md`
   - **Copilot**: `.github/copilot-instructions.md`
   - **UI docs**: `docs/ui/`
2. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files requiring state, hooks, interactivity, or browser APIs.
3. **Component Organization:**
   - Routes belong in `app/`.
   - Reusable UI elements belong in `components/ui/`.
   - Feature-specific code belongs in `components/[feature]/` or `app/_components/`.
4. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
5. **Styling:**
   - Use Tailwind utility classes and the ink / paper tokens.
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Maintain mobile-first responsive design.
6. **Code Quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. Do not write superfluous comments. Let variable and function names document themselves.

## UI rules (mandatory)

[`docs/ui/`](./docs/ui/README.md) is the source of truth for UI; [`AGENTS.md`](./AGENTS.md) carries the full summary (token table, page patterns table, event rules). Design brief: a drafting sheet, near-black ink on off-white paper in IBM Plex, with one orange mark colour. The earlier Lautan Pasir system (cobalt ink on cream paper, Literata italic, riso grain, an engraving band, the caldera logo) and the older monochrome / grayscale rules, Instrument Serif, Bricolage Grotesque, Inter, JetBrains Mono and `MacWindow` panels are retired. Do not bring any of it back.

- **Ink and paper.** Near-black ink on off-white paper (`paper` #F7F7F5, `ink` #141414), plus `ink-soft`, `rule`, `rule-strong` and `tint`. Dark mode flips the same tokens (paper #141414, ink #F2F2EE) through `<html class="dark">`. shadcn names (`background`, `foreground`, `muted`, `border`, ...) map onto these. No other hue, no hex, no `white` / `black`, no `dark:` classes. Status is shape plus word, never colour.
- **One orange.** `mark` (#FF4F00 light, #FF6326 dark) appears only on the focus ring, the active nav underline, the reading hairline, the crop marks on plates and the logo `mark` variant, the last chart point, and text selection. Never on buttons, links, headings or fills. Orange text, if unavoidable, is `mark-text`; text on a `mark` fill is `on-mark`. Raw `orange-*` classes stay banned.
- **IBM Plex.** Plex Sans is the whole voice (`font-sans`; `font-display` is an alias, and weight 600 rides on the h1 to h4 and display sizes). Plex Mono (`font-mono`) only for code, kbd, slugs, keys, raw JSON and title-block values, never for small decorative labels. No italic anywhere: `<em>`, `<i>` and `<cite>` render upright at weight 500, `<strong>` at 600.
- **Three surfaces.** Frame: 1px `rule` hairline on paper (`Card`, `Surface variant="solid"`). Inset: `tint` ground for nested rows and code (`Surface variant="inset"`). Lift: paper, 1px ink, `shadow-[3px_3px_0_hsl(var(--ink))]`, floating layers only. Radius 0. No gradients, glass, blur, glows or soft shadows.
- **Plates and logo.** Photos go through `PlateFigure`: 1px ink frame, four orange crop marks, grayscale (`tone="color"` for site cards, the OCR upload and sprites); avatars use `.plate` with no marks. The logo is `<Logo variant="mini" | "mark" | "tile">`, the RH monogram; never paste or recolour it. No grain, speckle, engraving, duotone or fleuron: ornaments are plain 1px rules.
- **Page patterns.** Every route uses one: Ledger, Article, Plates, Cabinet, Correspondence, Board, Figures, Admin, Auth, Profile card, Not found ([`docs/ui/page-shell.md`](./docs/ui/page-shell.md)). The shell is `BaseLayout` with running head, menu sheet and colophon (a `TitleBlock`); no sidebars, no extra `px-*` inside it.
- **Motion.** Tier 0: native scroll and sticky layouts. Tier 1: CSS scroll-driven home wordscroll and article reading hairline, nothing else. Otherwise response motion on input only. Banned: parallax, marquees, typing effects, smooth cursor, page transitions, pulsing dots, fade-up on sections, hover lifts, Lenis, GSAP, `motion`.
- **Copy.** Sentence case. No `uppercase`, letter-spacing, all-caps eyebrows, middle-dot meta strings, mono small labels or "→" on links. Numbers only for real sequences. Plain wording, not print metaphors: the themes are Light, Dark and System.
- **Umami.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track="nav-click" data-track-item="..."`. Kebab-case names, enum values, never PII.
- **Grep gates.** All three must print nothing: gate 1 bans classes, gate 2 bans literals, gate 3 keeps the retired Lautan Pasir system out. Gates 1 and 2 take `$PHASE_PATHS` (the files you touched, or `src` for a full run); gate 3 runs over `src content`. Hex copies of the tokens live only in `src/lib/print-hex.ts` and the generated `src/app/icon.svg`.

```bash
grep -rnIE "uppercase|tracking-[[]|(text|bg|border|from|to|via|ring|fill|stroke|divide|outline)-(green|red|yellow|orange|emerald|teal|violet|purple|blue|sky|indigo|amber|pink|rose|lime|cyan|neutral|zinc|slate|gray)-[0-9]{2,3}|shadow-(sm|md|lg|xl|2xl)|backdrop-blur|rounded-(sm|md|lg|xl|2xl|3xl|full)|dark:|BlurFade|from .motion|recharts" $PHASE_PATHS | grep -v "radio-group.tsx"
grep -rnIE "bg-gradient|gradient-to|(text|bg|border|fill|stroke|ring|from|to|via)-(white|black)\b|[\"' ]rounded[\"' ]|rounded-\[|rounded-(t|b|l|r|tl|tr|bl|br)-|#[0-9a-fA-F]{6}\b|text-(foreground|primary|muted-foreground)/[0-9]" $PHASE_PATHS content | grep -vE "code-block|kbd|api/(og|certificate)|lib/print-hex|app/icon\.svg"
grep -rnIE "\bitalic\b|font-style: ?italic|engrav|grain|speckle|Literata|plate-filters|logo-mask|#1E3C9E|#F3ECDC|#0D1433|#EFE6D2|Hollar|Tengger|caldera" src content \
  | grep -vE "content/changelog/(2025-|2026-0|2026-10-19)|rich-text-editor.tsx"
```

## Development Workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Before modifying code, always look at existing patterns (especially UI primitives) and `docs/ui/`.
- Validate input at boundaries; fail fast; robust error handling.
- Make UI accessible via keyboard nav and accurate ARIA attributes.
- Run `bunx tsc --noEmit` and the three grep gates before claiming completion.
