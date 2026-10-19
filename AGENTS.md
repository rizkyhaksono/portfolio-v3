# AGENTS.md — Portfolio v3

Canonical instructions for **any** coding agent working in this repository (Cursor, Claude, Codex, Gemini, Copilot, and others). Platform files add tooling notes only. For UI, [`docs/ui/`](docs/ui/README.md) is the source of truth and wins over every summary, this one included.

You are an expert full-stack TypeScript engineer. Produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 16** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS 3 (not v4) + shadcn/ui primitives restyled to the ink and paper tokens
- **Testing**: Jest + React Testing Library (unit), Playwright (e2e)
- **Package Manager**: bun

## AI Instruction Map

| Platform | Entry file | Extra |
|---|---|---|
| **All agents** | `AGENTS.md` (this file) | — |
| **Claude** | `CLAUDE.md` | `.claude/` |
| **Cursor** | `.cursorrules` | `.cursor/rules/*.mdc` |
| **Gemini** | `.geminirules` / `GEMINI.md` | — |
| **Copilot** | `.github/copilot-instructions.md` | — |
| **UI system (source of truth)** | `docs/ui/README.md` | `src/app/globals.css`, `tailwind.config.ts`, `src/lib/design-system.ts` |

Always read `prd/feature.md` and `prd/progress.md` before starting feature work; update `prd/progress.md` after completing tasks.

## Architectural Guidelines

1. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files requiring state, hooks, interactivity, or browser APIs. Keep client islands small.
2. **Component Organization:**
   - Routes belong in `app/`.
   - Reusable UI elements belong in `components/ui/`.
   - Feature-specific code belongs in `components/[feature]/` or `app/_components/`.
3. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid `any`.
4. **Styling:**
   - Use Tailwind utility classes and the tokens in `docs/ui/design-system.md`. Shared CSS (`.prose`, `.plate`, `.ws`, `.bg-hatch`, the reading hairline) lives in `src/app/globals.css`.
   - Use `cn()` from `@/lib/utils` for conditional class merging.
   - Mobile-first responsive design; no horizontal scroll at 375px.
5. **Code Quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. No superfluous comments — names should be self-documenting.
6. **Package manager:** Use **bun** (`bun install`, `bun run`, `bunx`). Never npm, pnpm or yarn.

## UI rules (mandatory)

Design brief: the whole site is a drafting sheet. Near-black ink on off-white paper, IBM Plex, radius 0, hairline rules, and one orange mark colour that appears only on marks (the focus ring, the current page, the reading line, crop marks). Dark mode is the same sheet reversed. The earlier Lautan Pasir system (cobalt ink on cream paper, Literata italic, riso grain, an engraving band, the caldera logo) and the older monochrome / grayscale rules, Instrument Serif, Bricolage Grotesque, Inter, JetBrains Mono and `MacWindow` panels are retired. Do not bring any of it back.

- Docs: [`docs/ui/README.md`](docs/ui/README.md) (source of truth)
- Agent rule: `.cursor/rules/ui-layout-consistency.mdc`

### Ink and paper

| Tailwind colour | Light | Dark | Role |
|---|---|---|---|
| `paper` | #F7F7F5 | #141414 | Page, card, text on solid ink |
| `ink` | #141414 | #F2F2EE | Text, icons, strong rules, solid button, charts |
| `ink-soft` | #5C5C57 | #A3A39C | Secondary text (on paper or tint only) |
| `rule` | #DCDCD7 | #33332F | Decorative hairlines |
| `rule-strong` | #8A8A84 | #75756F | Control boundaries |
| `tint` | #EDEDE9 | #1F1F1D | Hover row, code ground, inset |
| `mark` | #FF4F00 | #FF6326 | Marks only (see Orange) |
| `mark-text` | #C03A00 | #FF7A45 | Orange text, where unavoidable |
| `on-mark` | #141414 | #141414 | Text on a `mark` fill, in both themes |

shadcn names (`background`, `foreground`, `muted`, `border`, `input`, `primary`, ...) map onto these; `ring` maps to `mark`. No other hue, no hex, no `white` / `black`, no `dark:` classes (tokens flip on `<html class="dark">`). Status is shape plus word, never colour. `src/__tests__/unit/lib/contrast.test.ts` guards the contrast floors; change a token and it must still pass.

### Orange

`mark` is not a theme colour. It appears only on:

- the focus ring (`--ring`)
- the active nav underline (`aria-[current=page]:decoration-mark`)
- the article reading hairline
- the crop marks on plates and the logo `mark` variant
- the last point of a chart line
- text selection (`mark` fill, `on-mark` text)

Primary buttons stay ink, links stay ink with an ink underline, and nothing else is orange. If orange must carry text, use `mark-text`; `mark` itself fails contrast as small text on light paper. Raw `orange-*` classes stay banned (gate 1).

### Type

IBM Plex, via `next/font/google` in `src/app/layout.tsx`. Plex Sans (variable, normal style) is the whole voice: `font-sans` is `--font-sans`, and `font-display` is only an alias of it. Plex Mono (400 and 500, `preload: false`, `font-mono` is `--font-mono`) is for code, kbd, slugs, keys, raw JSON and the title-block values. It is never for decorative small labels. Figures (stat numerals, ledgers, tables) stay in Plex Sans with `tabular-nums`.

- Headings carry weight 600 on the `text-h1` to `text-h4` and `text-display` size tokens; `display` and `h1` also set letter-spacing -0.02em. Body and captions are 400.
- No italic anywhere. `<em>`, `<i>` and `<cite>` render upright at weight 500, `<strong>` at 600. The TipTap italic mark still exists so authored content keeps its meaning.
- Sentence case. No `uppercase`, no `tracking-[...]`.

### Three surfaces

1. **Frame** — 1px `rule` hairline on paper, transparent ground: `Card`, `Surface variant="solid"`.
2. **Inset** — `tint` ground for nested rows, code and hover rows: `Surface variant="inset"`.
3. **Lift** — `bg-paper border border-ink shadow-[3px_3px_0_hsl(var(--ink))]`, floating layers only (dialog, sheet, popover, menu, tooltip, select, command, toast). Already applied inside the shared primitives.

Radius 0 (the radio dot is the only circle). No gradients, glass, blur, glows or soft shadows.

### Plates, logo and title block

- **Plates.** Photos go through `PlateFigure` (`tone?: "photo" | "color"`): a `relative border border-ink p-2` frame with four orange L-shaped crop marks in the gutter, and the photo in grayscale. `tone="color"` keeps colour for site OG covers, the OCR upload and Pokémon sprites. Avatars use `.plate` for the grayscale and never get crop marks. The YouTube facade renders through `PlateFigure`.
- **Logo.** `<Logo variant="mini" | "mark" | "tile" label?>` from `src/components/ui/logo.tsx`: the RH monogram (shared stem, one crossbar, a 45° leg) as inline SVG. `mini` is `currentColor`, `mark` adds the orange crop marks and is for display sizes (title block, 404 and error, auth), `tile` is the glyph reversed out of an ink square. Never paste the SVG or recolour it. Generated by `node scripts/logo/make.mjs`, never hand-edited.
- **Ornaments.** Plain 1px rules only: `hr` and `.tail-piece`. No fleuron, grain, speckle, engraving or duotone. The double rule on page heads stays.
- **Title block.** The colophon is `TitleBlock` (`src/components/layout/title-block.tsx`): a ruled `dl` grid of Drawn by, Role, Location, Revision (latest changelog version and date), Set in and Contact, values in Plex Mono, with the `mark` logo beside it. `/ai` and `/chat` use the compact footer with no title block.

### Page patterns

| Pattern | Component | Routes |
|---|---|---|
| Ledger | `ui/ledger.tsx` | `/blog`, `/certificates`, `/changelog`, `/project` index, home Career and Credentials, admin lists |
| Article | `ui/article-shell.tsx` | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` |
| Plates | `ui/plate-figure.tsx` | Covers, project shots, portrait, OCR specimen |
| Cabinet | `tools/_components/tool-shell.tsx` + `ui/pager.tsx` | `/tools`, `/ai` |
| Correspondence | Letters column, replies behind a left rule | `/chat`, `/ai` chat, home Contact, admin Feedback |
| Board | Ruled columns of index cards | `/tracker` |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar` | `/stats`, home Readers, admin dashboard and analytics |
| Admin | Ruled spine, `--admin-rail` | `/admin/dashboard/*` |
| Auth | `layout/auth-shell.tsx` | `/auth/*`, `/admin/auth/login` |
| Profile card | Double-rule sheet, definition list | `/profile`, `/profile/edit`, admin settings |
| Not found | `ui/not-found-view.tsx` | 404s, `error.tsx`, empty states |

Shell: `BaseLayout` (`bleed?`, `footer?: 'full' | 'compact' | 'none'`) with running head, menu sheet and colophon. No sidebars. Home hero: the portrait (`HeroPortrait` in `src/app/page.tsx`) is part of the masthead stage, the right column from 1024px and directly after the lead line below it. Details: [`docs/ui/page-shell.md`](docs/ui/page-shell.md), [`docs/ui/platforms.md`](docs/ui/platforms.md).

### Motion

- Tier 0 (no JS): native scroll, smooth anchor scroll, sticky layouts. `overflow-x: clip` on `html` and `main` only, never on `body`, never `overflow: hidden` / `auto` on a sticky ancestor.
- Tier 1 (CSS scroll-driven, inside `@supports (animation-timeline: view())` and no-preference): the home wordscroll and the article reading hairline. Nothing else.
- Response motion only: underline, button press, tab underline, accordion, dialog and sheet fade, toasts, tracker drag.
- **Banned:** parallax, marquees, typing effects, smooth cursor, page transitions, pulsing dots, fade-up or reveal on sections, hover lifts, Lenis, GSAP, `motion` / framer-motion.

### Copy

Sentence case. No `uppercase`, no `tracking-[...]`, no all-caps eyebrows, no middle-dot meta strings, no mono small labels, no "→" on links, numbered markers only for real sequences (versions, stages, legal sections). Plain wording, not print metaphors: the themes are Light, Dark and System.

### Umami events

- `data-umami-event` only on `<button>` and external `target="_blank"` links. On an internal `<a>` the tracker forces a full page reload.
- Internal links use `data-track="nav-click"` plus `data-track-*` (for example `data-track-item="blog"`); a delegated listener forwards them. In code, call `track()` from `src/lib/analytics.ts`.
- Kebab-case names, 50 characters or fewer, enum values only, one event per element. Never PII (emails, names, prompts, chat text, queries, ids, full URLs). Event table: [`docs/ui/components.md`](docs/ui/components.md).

### Grep gates

All three must print nothing: gate 1 bans classes, gate 2 bans literals, gate 3 keeps the retired Lautan Pasir system out. Gates 1 and 2 take `$PHASE_PATHS`: the files you touched, or `src` for a full run. Gate 3 always runs over `src content`. Hex copies of the tokens live only in `src/lib/print-hex.ts` and the generated `src/app/icon.svg`, which gate 2 skips.

```bash
grep -rnIE "uppercase|tracking-[[]|(text|bg|border|from|to|via|ring|fill|stroke|divide|outline)-(green|red|yellow|orange|emerald|teal|violet|purple|blue|sky|indigo|amber|pink|rose|lime|cyan|neutral|zinc|slate|gray)-[0-9]{2,3}|shadow-(sm|md|lg|xl|2xl)|backdrop-blur|rounded-(sm|md|lg|xl|2xl|3xl|full)|dark:|BlurFade|from .motion|recharts" $PHASE_PATHS | grep -v "radio-group.tsx"
grep -rnIE "bg-gradient|gradient-to|(text|bg|border|fill|stroke|ring|from|to|via)-(white|black)\b|[\"' ]rounded[\"' ]|rounded-\[|rounded-(t|b|l|r|tl|tr|bl|br)-|#[0-9a-fA-F]{6}\b|text-(foreground|primary|muted-foreground)/[0-9]" $PHASE_PATHS content | grep -vE "code-block|kbd|api/(og|certificate)|lib/print-hex|app/icon\.svg"
grep -rnIE "\bitalic\b|font-style: ?italic|engrav|grain|speckle|Literata|plate-filters|logo-mask|#1E3C9E|#F3ECDC|#0D1433|#EFE6D2|Hollar|Tengger|caldera" src content \
  | grep -vE "content/changelog/(2025-|2026-0|2026-10-19)|rich-text-editor.tsx"
```

Gate 3 is the regression gate: it keeps the Lautan Pasir system out. Its exclusions cover changelog history and TipTap's `italic` mark name. Never add a new hit; when you touch a file, make it pass.

## Development Workflow

1. Read `prd/feature.md` → `prd/progress.md` → `docs/ui/` → existing patterns in code.
2. Prefer shared primitives over ad-hoc bordered `div`s.
3. Validate input at boundaries; fail fast; map errors cleanly.
4. Keep UI accessible (`aria-current`, labels, keyboard navigation, 44px targets on mobile, chart text alternatives).
5. Update `prd/progress.md` when a task is done.
6. Before claiming completion: `bunx tsc --noEmit`, `bun run test`, the three grep gates, and `bun run build --webpack` for anything that touches routes or config.

## Acceptance checklist (UI)

- [ ] Route uses one page pattern from the table above
- [ ] Colours from the ink / paper tokens only; orange only where the Orange list allows; no hex, palette colours, `white` / `black` or `dark:`
- [ ] Only frame, inset or lift; no glass, gradients, blur or soft shadows
- [ ] Plex Sans for text, Plex Mono only for machine text; no italic
- [ ] No banned motion; reduced motion shows everything fully
- [ ] Umami attributes follow the button / external-link rule
- [ ] All three grep gates print nothing
