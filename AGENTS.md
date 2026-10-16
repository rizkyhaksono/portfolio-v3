# AGENTS.md — Portfolio v3

Canonical instructions for **any** coding agent working in this repository (Cursor, Claude, Codex, Gemini, Copilot, and others). Platform files add tooling notes only. For UI, [`docs/ui/`](docs/ui/README.md) is the source of truth and wins over every summary, this one included.

You are an expert full-stack TypeScript engineer. Produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 16** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS 3 (not v4) + shadcn/ui primitives restyled to the one-ink system
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
   - Use Tailwind utility classes and the tokens in `docs/ui/design-system.md`. Shared CSS (`.prose`, `.plate`, `.engraving`, `.ws`, grain) lives in `src/app/globals.css`.
   - Use `cn()` from `@/lib/utils` for conditional class merging.
   - Mobile-first responsive design; no horizontal scroll at 375px.
5. **Code Quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. No superfluous comments — names should be self-documenting.
6. **Package manager:** Use **bun** (`bun install`, `bun run`, `bunx`). Never npm, pnpm or yarn.

## UI rules (mandatory)

Design brief: the whole site is one cobalt ink printed on cream paper, with riso grain, Literata italic headings, radius 0, hairline rules and a Hollar engraving band. Dark mode ("Night print") is the same sheet reversed: cream ink on night paper. The old monochrome / grayscale rules, Instrument Serif, Bricolage Grotesque, Inter, JetBrains Mono and `MacWindow` panels are retired. Do not bring them back.

- Docs: [`docs/ui/README.md`](docs/ui/README.md) (source of truth)
- Agent rule: `.cursor/rules/ui-layout-consistency.mdc`

### Ink and paper

| Tailwind colour | Paper | Night | Role |
|---|---|---|---|
| `paper` | #F3ECDC | #0D1433 | Page, card, text on solid ink |
| `ink` | #1E3C9E | #EFE6D2 | Text, icons, strong rules, solid button, focus, charts, engraving |
| `ink-soft` | #445BAA | #A9B5E3 | Secondary text (on paper or tint only) |
| `rule` | #BFC6DE | #2C3870 | Decorative hairlines |
| `rule-strong` | #6476B2 | #7383C4 | Control boundaries |
| `tint` | #E2E4EB | #162868 | Hover row, code ground, inset |

shadcn names (`background`, `foreground`, `muted`, `border`, `input`, `primary`, ...) map onto these. No other hue, no hex, no `white` / `black`, no `dark:` classes (tokens flip on `<html class="dark">`). Status is shape plus word, never colour.

### Type

Literata only (`next/font/google`, roman and italic). Italic for h1 to h4, display, one standfirst per page, captions, datelines, pull quotes, numerals. Roman for body, prose, nav, buttons, labels, table heads, tags, form values. System mono only for code, slugs, keys, raw JSON and kbd.

### Three surfaces

1. **Frame** — 1px `rule` hairline on paper, transparent ground: `Card`, `Surface variant="solid"`.
2. **Inset** — `tint` ground for nested rows, code and hover rows: `Surface variant="inset"`.
3. **Lift** — `bg-paper border border-ink shadow-[3px_3px_0_hsl(var(--ink))]`, floating layers only (dialog, sheet, popover, menu, tooltip, select, command, toast). Already applied inside the shared primitives.

Radius 0 (the radio dot is the only circle). No gradients, glass, blur, glows or soft shadows.

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

Shell: `BaseLayout` (`bleed?`, `footer?: 'full' | 'compact' | 'none'`) with running head, Contents sheet and colophon. No sidebars. Details: [`docs/ui/page-shell.md`](docs/ui/page-shell.md), [`docs/ui/platforms.md`](docs/ui/platforms.md).

### Motion

- Tier 0 (no JS): native scroll, smooth anchor scroll, sticky layouts. `overflow-x: clip` on `html` and `main` only, never on `body`, never `overflow: hidden` / `auto` on a sticky ancestor.
- Tier 1 (CSS scroll-driven, inside `@supports (animation-timeline: view())` and no-preference): the home wordscroll and the article reading hairline. Nothing else.
- Response motion only: underline, button press, tab underline, accordion, dialog and sheet fade, toasts, tracker drag.
- **Banned:** parallax, marquees, typing effects, smooth cursor, page transitions, pulsing dots, fade-up or reveal on sections, hover lifts, Lenis, GSAP, `motion` / framer-motion.

### Copy

Sentence case. No `uppercase`, no `tracking-[...]`, no all-caps eyebrows, no middle-dot meta strings, no mono small labels, no "→" on links, numbered markers only for real sequences (versions, stages, legal sections).

### Umami events

- `data-umami-event` only on `<button>` and external `target="_blank"` links. On an internal `<a>` the tracker forces a full page reload.
- Internal links use `data-track="nav-click"` plus `data-track-*` (for example `data-track-item="blog"`); a delegated listener forwards them. In code, call `track()` from `src/lib/analytics.ts`.
- Kebab-case names, 50 characters or fewer, enum values only, one event per element. Never PII (emails, names, prompts, chat text, queries, ids, full URLs). Event table: [`docs/ui/components.md`](docs/ui/components.md).

### Grep gate

Both must print nothing for the files you touched (`$PHASE_PATHS`: files, not folders, until P2/P3 migrate the rest); the final run uses `src content`. Token hex copies live only in `src/lib/print-hex.ts`, which the second command skips.

```bash
grep -rnE "uppercase|tracking-[[]|(text|bg|border|from|to|via|ring|fill|stroke|divide|outline)-(green|red|yellow|orange|emerald|teal|violet|purple|blue|sky|indigo|amber|pink|rose|lime|cyan|neutral|zinc|slate|gray)-[0-9]{2,3}|shadow-(sm|md|lg|xl|2xl)|backdrop-blur|rounded-(sm|md|lg|xl|2xl|3xl|full)|dark:|BlurFade|from .motion|recharts" $PHASE_PATHS | grep -v "radio-group.tsx"
grep -rnE "\bfont-mono\b|bg-gradient|gradient-to|(text|bg|border|fill|stroke|ring|from|to|via)-(white|black)\b|[\"' ]rounded[\"' ]|rounded-\[|rounded-(t|b|l|r|tl|tr|bl|br)-|#[0-9a-fA-F]{6}\b|text-(foreground|primary|muted-foreground)/[0-9]" $PHASE_PATHS content | grep -vE "code-block|kbd|api/(og|certificate)|lib/print-hex"
```

Unmigrated files may still fail the gate until their phase. When you touch one, make it pass; never add a new hit.

## Development Workflow

1. Read `prd/feature.md` → `prd/progress.md` → `docs/ui/` → existing patterns in code.
2. Prefer shared primitives over ad-hoc bordered `div`s.
3. Validate input at boundaries; fail fast; map errors cleanly.
4. Keep UI accessible (skip link, `aria-current`, labels, keyboard navigation, 44px targets on mobile, chart text alternatives).
5. Update `prd/progress.md` when a task is done.
6. Before claiming completion: `bunx tsc --noEmit`, `bun run test`, the grep gate on your paths, and `bun run build --webpack` for anything that touches routes or config.

## Acceptance checklist (UI)

- [ ] Route uses one page pattern from the table above
- [ ] Colours from ink / paper tokens only; no hex, palette colours, `white` / `black` or `dark:`
- [ ] Only frame, inset or lift; no glass, gradients, blur or soft shadows
- [ ] Literata roles respected; mono only for machine text
- [ ] No banned motion; reduced motion prints everything fully
- [ ] Umami attributes follow the button / external-link rule
- [ ] Grep gate prints nothing for the touched paths
