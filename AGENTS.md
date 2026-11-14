# AGENTS.md: Portfolio v3

Canonical instructions for **any** coding agent in this repository (Claude, Cursor, Codex, Gemini, Copilot and others). Platform files point here and add tooling notes only. For UI, [`docs/ui/`](docs/ui/README.md) is the source of truth and wins over every summary, this one included.

You are an expert full-stack TypeScript engineer. Produce production-ready code that follows modern Next.js App Router patterns.

## Tech stack

- **Next.js 16** (App Router) and React 19
- **TypeScript**, strict mode
- **Styling:** Tailwind CSS 3 (not v4) and shadcn/ui primitives restyled to the Langit Malang tokens
- **Testing:** Jest and React Testing Library (unit), Playwright (e2e)
- **Package manager:** bun

## AI instruction map

| Platform | Entry file | Extra |
|---|---|---|
| **All agents** | `AGENTS.md` (this file) | |
| **Claude** | `CLAUDE.md` | `.claude/` |
| **Cursor** | `.cursorrules` | `.cursor/rules/*.mdc` |
| **Gemini** | `.geminirules`, `GEMINI.md` | |
| **Copilot** | `.github/copilot-instructions.md` | |
| **UI system (source of truth)** | `docs/ui/README.md` | `src/app/globals.css`, `tailwind.config.ts`, `src/lib/design-system.ts`, `src/lib/theme-hex.ts` |

Read `prd/feature.md` and `prd/progress.md` before feature work; update `prd/progress.md` when a task is done.

## Architectural guidelines

1. **React Server Components:** default to Server Components. Add `'use client'` only to files that need state, hooks, interactivity or browser APIs. Keep client islands small.
2. **Component organisation:**
   - Routes belong in `app/`.
   - Reusable UI belongs in `components/ui/`.
   - Feature code belongs in `components/[feature]/` or `app/_components/`.
3. **TypeScript:** explicit `interface` or `type` for all props and state. No `any`.
4. **Styling:**
   - Tailwind utilities and the tokens in `docs/ui/design-system.md`. Shared CSS (`.prose`, the `.sky` block, view transitions) lives in `src/app/globals.css`.
   - `cn()` from `@/lib/utils` for conditional classes.
   - Mobile first; no horizontal scroll at 320 or 375px.
5. **Code quality:** small functions; repeated logic goes into hooks or `lib/`. Comment only the why the code cannot show.
6. **Package manager:** **bun** (`bun install`, `bun run`, `bunx`). Never npm, pnpm or yarn.

## UI rules (mandatory)

Full detail: [`docs/ui/README.md`](docs/ui/README.md) (source of truth), [`design-system.md`](docs/ui/design-system.md), [`surfaces.md`](docs/ui/surfaces.md), [`page-shell.md`](docs/ui/page-shell.md), [`components.md`](docs/ui/components.md), [`platforms.md`](docs/ui/platforms.md).

### Identity: Langit Malang

A calm reading page after joshpuckett.me, equally good in light and dark: one clean sans at a quiet size, muted prose with the names in full ink, plain lists of a title and one sentence, lots of whitespace. The one bold element is **the sky**, a painted Langit Malang scene behind the footer whose colour follows the time of day in Malang (WIB), and the night sky in dark mode. Everything else is quiet.

- **Public site:** every page uses `BaseLayout`. At the top, the handle "@rizkyhaksono" at the `h1` size, linking home, with a 40px rule under it; quiet text nav on the right from `md`, the theme toggle, and "Menu" below `lg`. Then one 36rem column (`PROSE_WIDTH`), centred on the page, with all text left-aligned. `/tools` and `/chat` use the wide column (`width="wide"`). No sky at the top, no sticky or translucent header.
- **Colour use:** prose and descriptions in `text-muted-foreground`; names, titles and links in `text-foreground`. Links go through `InkLink`, a faint underline that strengthens on hover.
- **Admin:** full width. A sidebar, a top bar, and content that fills the rest. No sky.
- **Themes:** `defaultTheme="system"`; labels Light, Dark and System; every change goes through `switchTheme()`.
- **Name and icon:** the handle and the name as text. The favicon is a plain "R" tile. There is no logo mark and no handwritten face.

### Tokens

HSL triples in `src/app/globals.css` (`:root` light, `.dark` dark), exposed in `tailwind.config.ts` under the shadcn names. Hex copies live only in `src/lib/theme-hex.ts` (`THEME_HEX.light`, `THEME_HEX.dark`) for theme-color, the manifest, `global-error.tsx` and the OG and certificate cards.

| Token | Class | Light | Dark | Role |
|---|---|---|---|---|
| `--background` | `bg-background` | #F8F8F6 | #1A1A19 | The page |
| `--foreground` | `text-foreground` | #1F201D | #ECECE8 | Text, icons, primary button, focus ring |
| `--muted-foreground` | `text-muted-foreground` | #62635E | #A3A49E | Secondary text, meta, nav |
| `--border` | `border-border` | #E2E2DE | #30312D | Hairlines, decoration only |
| `--muted` | `bg-muted` | #EFEFEB | #242522 | Tiles, hover rows, code, segmented tracks |
| `--input` | `border-input` | #85867F | #71726C | Borders of controls (3:1) |
| `--popover` | `bg-popover` | #FFFFFF | #232322 | Floating layers |
| `--destructive` | `text-destructive` | #B42318 | #F97066 | Destructive actions and errors, admin only, always with a word |
| `--sky` | `text-sky` | #2D5B8C | #8DB6E6 | Accent: the footer sky |
| `--sky-wash` | `bg-sky-wash` | #D9E6F4 | #203247 | Accent: the text selection fill |

Derived: `--card` is background; `--primary` and `--ring` are foreground; `--secondary` and `--accent` are muted; `--radius` is `.75rem`. Motion variables: `--dur-press` 120ms, `--dur-ui` 200ms, `--dur-sheet` 280ms, `--ease-out` `cubic-bezier(.25,.1,.25,1)` (class `ease-out`). `--scrim` fills the backdrop behind modals.

- **Blue lives in the footer sky** (and the `::selection` fill). Never links, buttons, focus, charts, icons or hover. The footer's grass greens and mountain haze are an illustration-only exception to the colour cap: they live only in the `.sky` block of `globals.css` and are never UI colour.
- No hex, no `white` / `black`, no palette colours (`gray-500`, `blue-600`), no `dark:` classes: every token flips on `<html class="dark">`.
- Text never takes an opacity modifier; use `text-muted-foreground`. Controls use `border-input`, not `border-border`.
- State is an icon plus a word (`StatusLine`), never colour alone.
- **Contrast guard:** `src/__tests__/unit/lib/contrast.test.ts` reads the triples and fails below the floors in both themes (foreground 7:1, muted-foreground 4.5:1, including over every footer sky stop, dawn, day, dusk and evening in light and night in dark; input 3:1; text on sky-wash 4.5:1) and checks `THEME_HEX` against the tokens. Change a token, change `theme-hex.ts` in the same commit.

### Type

One sans, **Onest** (variable, OFL), loaded once with `next/font/google` in `src/app/layout.tsx` as `--font-sans`. Site and admin use it. System mono (`font-mono`) only for code. There is no second face, no serif, no handwritten face and no `font-display`.

| Key | Size / line height | Weight | Use |
|---|---|---|---|
| `caption` | 12 / 18 | 400 | Footer year, captions, small meta |
| `small` | 13 / 20 | 400 | Nav, group labels, row meta |
| `body` | 15 / 24 | 400 | Rows, UI text |
| `prose` | 16 / 28 | 400 | Article prose (`.prose`) |
| `lead` | 16 / 26 | 400 | A lead line or a quote |
| `h2`, `h3`, `h4` | 15 / 24 | 500, foreground | Section labels ("Projects", "Writing") |
| `h1`, `display` | 24 / 32, -0.015em | 500 | Page titles and the handle |
| `numeral` | 28 / 32 | 500 | Figures on `/stats` and the admin |

- Weights 400 and 500 only: 400 for text, 500 for headings, titles and figures (the keys carry it). No `font-semibold` or `font-bold` on headings. Hierarchy comes from colour (foreground against muted) before size.
- Sizes only from the keys: never `text-[Npx]`. Tracking only from the keys: never `tracking-[…]`. No `uppercase`.
- `xs` in `tailwind.config.ts` stays for older call sites; new code uses the keys above.
- Inputs use 16px on phones. `tabular-nums` in rows, tables and figures.

### Shape, shadow, blur

- **Radii only where there is a real object:** tiles and images `rounded-2xl`; controls keep theirs (fields and buttons `rounded-lg`, chips and badges `rounded-md`, floating layers `rounded-xl`, dots, switches, radios and avatars `rounded-full`). Never `rounded-[…]`.
- **Keep calm:** no boxes around sections, no stat cards, no tiles for plain text. No dividers except the short rule under the handle and the hairline inside the footer.
- **Surfaces** ([surfaces.md](docs/ui/surfaces.md)): page (no box), tile (`bg-muted`, no border, no shadow, for screenshots and code), frame (hairline `border-border`, for forms and admin panels), float (`bg-popover`, hairline `border-border`, no shadow). One surface per level.
- **No shadows anywhere.** `boxShadow` is gone from `tailwind.config.ts`, so no shadow utility exists. Floating layers (dialog, sheet, menu, popover, select content, hover tip, toasts, terminal overlay) are set apart by a hairline `border-border` only, applied inside the shared primitives.
- **No blur.** The header is plain and scrolls away with the page. Scrims are a fixed fill, never blurred.
- **Gradients** only in `globals.css` and the sky (`sky.tsx`).

### The footer sky

`Sky` (`src/components/ui/sky.tsx`) is the painted Langit Malang scene behind the full footer of every visitor page, built from CSS and inline SVG only (no image file). Back to front: a vertical sky gradient, the sun or the moon, two or three soft clouds drifting slowly, Arjuno and Semeru in haze, the name set large between the hills, and rolling grass hills with blades that sway. It is `aria-hidden` and `pointer-events-none`. The phase (`skyPhase()` in `src/lib/malang-time.ts`: dawn, day, dusk, evening in WIB) sets `data-sky` on mount; the server renders the day stop. Dark mode is always the night sky with a few static stars. The footer text (handle, email, one line of links, the year and the hour in Malang) sits in the upper sky. Clouds are pre-softened shapes (never `filter: blur`). The clouds drift and the grass sways as soon as the page loads. Phones (below 640px) and `prefers-reduced-motion: reduce` get a still scene (the clouds are hidden on phones). There is no visible pause button: `SkyToggle` stays in the footer link line as `sr-only`, appears on keyboard focus, and lets keyboard and screen-reader users stop the motion (WCAG 2.2.2; the choice is saved in localStorage). The `/auth` pages end on the same landscape as a band at the bottom, with no footer text and the same hidden toggle. Stop colours and the grass greens live only in the `.sky` block of `globals.css`.

### Motion

All CSS or platform native. The complete list:

1. **Route crossfade:** React `ViewTransition` around the `BaseLayout` content, opacity only (out 140ms, in 200ms). The header and footer stay still.
2. **Project morph:** the `MediaCard` image and the project hero share `project-<id>` (320ms).
3. **Theme crossfade:** `switchTheme()` wraps the change in a view transition.
4. **Link underline:** the faint underline strengthens to full foreground, 200ms.
5. **Card hover:** the media image scales to 1.015 over 400ms, only under `(hover: hover)` and `motion-safe`.
6. **The footer sky:** slow clouds and swaying grass, playing at once, with a pause toggle that stays visually hidden until keyboard focus.

Floating layers keep their Radix fade (150 to 280ms). Anything else that responds to input uses `--dur-*` and `ease-out`.

**Reduced motion:** the global kill switch stays; every `::view-transition-*` gets `animation: none`; `switchTheme()` skips the view transition; the sky is static; card images do not scale. With `reducedMotion: 'reduce'`, `document.getAnimations().length` must be 0.

**Banned:** scroll reveal and fade-up on sections, parallax, scroll-jacking or anything tied to scroll position, marquees, typing effects, custom cursors, pulsing and bouncing (`animate-ping`, `animate-bounce`, pulse skeletons), hover lifts, autoplaying media, framer-motion, `motion`, GSAP, Lenis or any other animation library.

### Banned outright

- `dark:` classes
- Raw hex, `white` / `black` and Tailwind palette colours in components
- Gradients outside `globals.css` and `sky.tsx`; blur anywhere
- `uppercase`, `tracking-[…]`, `text-[Npx]`, `rounded-[…]`
- framer-motion, `motion`, GSAP, Lenis
- Em dashes in UI copy, generic CTAs, buzzwords
- Glass cards, boxed sections, stat cards, shadows of any kind, hover lifts, hover backgrounds on rows, window chrome
- A sky band at the top, a sticky or translucent header, a handwritten face, bold headings
- Any class, variable or asset from the old design (see gate rules R1, R1b and R1c)

### Page patterns

| Pattern | Component | Routes |
|---|---|---|
| Ledger | `ui/ledger.tsx`: plain rows, a title in foreground with one muted line under it, an optional small muted group label; no boxes, rules or hover backgrounds | Home lists, `/blog` rows, `/certificates`, `/changelog`, `/roadmap`, `/project` rows |
| Article | `ui/article-shell.tsx`: header, prose, contents in a `<details>` | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` |
| Media | `MediaCard`, `ui/plate-figure.tsx`: a picture on a `bg-muted` tile, `rounded-2xl`, in its own colours | Only where screenshots matter: `/project` featured, the `/blog` lead post, project pages |
| Cabinet | `tools/_components/tool-shell.tsx`, `ui/pager.tsx`, `width="wide"` | `/tools`, `/ai` |
| Correspondence | The chat column, the contact form | `/chat`, `/ai` chat, home contact, admin Feedback |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar`: solid fills, text alternatives, no cards | `/stats`, admin Home and Analytics |
| Admin | `components/layout/admin/*`: full width, sidebar, peek sheet | `/admin/dashboard/*` |
| Auth | `layout/auth-shell.tsx`: one centred column, ending on the sky band | `/auth/*`, `/admin/auth/login` |
| Profile card | A definition list in a frame | `/profile`, `/profile/edit`, admin Settings |
| Not found | `ui/not-found-view.tsx` | 404s, `error.tsx`, empty states |

Shell: `BaseLayout` (`width?: 'prose' | 'wide'`, `fit?`, `footer?: 'full' | 'compact' | 'none'`) with the handle header, the menu sheet and the painted footer. No sidebars on visitor pages. One `PageHeader` per page (24px at weight 500); section labels through `SectionHeading` or `PageSection`; `StatusLine` for empty and failed states; `Skeleton` for loading. The home is a sr-only h1, the bio, then Projects, Writing, Work experience (every career and education entry, newest first), Recommendations (only with real data) and Contact, all as text lists. Details: [`page-shell.md`](docs/ui/page-shell.md), [`platforms.md`](docs/ui/platforms.md).

Shared details agents trip on:

- Hover tips: `data-tip="..."` on any element (`ui/hover-tip.tsx`). Never the native `title` attribute.
- Generated cards: build URLs with `ogImageUrl(params, path?)` from `src/lib/site-url.ts`. It always sets `v=5`; raise it when a card's design changes.
- `favicon.ico` must stay at `src/app/favicon.ico`: the container healthcheck fetches `/favicon.ico`.
- Nav comes only from `src/commons/constants/navigation-menu.ts`.

### Copy

- Sentence case everywhere. Plain verbs that say what happens ("Save changes", "Send message"); toasts echo the button ("Changes saved.").
- No generic CTAs ("Learn more", "Click here", "Read more", "Get started", "Submit"). Name the destination ("All 27 projects").
- No buzzwords ("seamless", "cutting-edge", "leverage", "unlock", "elevate", "supercharge").
- No em dash in UI strings: use a comma, colon, full stop or "to". Comments may use one.
- Honest states: empty says what is missing and what to do; loading is a static skeleton or a short line; errors say what happened and the next step, never "Oops". Home sections with no data hide; never show zeros, `NaN` or `-Infinity`.
- No all-caps eyebrows, no middle-dot meta strings, no "→" after links. Numbers only for real sequences.

### Umami events

- `data-umami-event` only on `<button>` and external `target="_blank"` links. On an internal `<a>` the tracker forces a full page reload.
- Internal links use `data-track="nav-click"` plus `data-track-*` (for example `data-track-item="blog"`); a delegated listener forwards them. In code, call `track()` from `src/lib/analytics.ts`.
- Kebab-case names, 50 characters or fewer, enum values only, one event per element. Never PII (emails, names, prompts, chat text, queries, ids, full URLs). Event table: [`docs/ui/components.md`](docs/ui/components.md#umami-events).

### The UI gate

The gate is the jest test `src/__tests__/unit/lib/ui-gate.test.ts`, run by `bun run test` in CI before every deploy. It scans `src/`, `content/` and `tailwind.config.ts`.

| Rule | Bans | Allowed in |
|---|---|---|
| R1 | Old token classes (`text-ink`, `bg-paper`, `bg-tint`, `border-rule` and the rest) and `font-display` | nowhere |
| R1b | Old variables and identifiers: `PRINT_HEX`, `--paper`, `#1E3C9E` and so on | nowhere |
| R1c | Old identity classes: `speckle`, `engraving`, `masthead`, `ws__w`, `plate-*`, `tail-piece`, `article-rail`, `reading-hairline` and so on | nowhere |
| R2 | `dark:` | nowhere |
| R3 | Raw colour: hex and palette colours | `src/lib/theme-hex.ts`, `globals.css`, the OG and certificate routes |
| R4 | Arbitrary values: `rounded-[…]`, `text-[Npx]`, `tracking-[…]`, plus `uppercase` | nowhere (four admin files stay listed until the admin rebuild) |
| R5 | Motion libraries: `framer-motion`, `motion`, `gsap`, `lenis`, `animate-bounce`, `animate-ping` | nowhere |
| R6 | Gradients and blur | `globals.css`, `sky.tsx` |
| R7 | Copy: em dash in UI strings, generic CTAs, buzzwords | nowhere |
| R8 | Shadows: `shadow-*` utility classes (except `shadow-none`) and `box-shadow` | `box-shadow` in `globals.css` only |

Some rules carry a shrinking allowlist of files that still break them while the redesign lands. Each PR removes the files it fixes; only the admin files are left on R4. Never add a file to an allowlist or loosen a pattern: fix the file.

## Development workflow

1. Read `prd/feature.md`, then `prd/progress.md`, then `docs/ui/`, then the existing patterns in code.
2. Prefer shared primitives over ad-hoc bordered `div`s. When you touch an old-look file, move it to the new rules; never copy an old pattern into new code.
3. Validate input at boundaries; fail fast; map errors to honest messages.
4. Keep UI accessible: visible focus, `aria-current`, labels, keyboard navigation, Esc closes and focus returns, 44px targets below `md` on coarse pointers (`min-h-11`), chart text alternatives.
5. Update `prd/progress.md` when a task is done.
6. Before claiming completion: `bunx tsc --noEmit`, `bun run test` (includes the UI gate and the contrast guard), and `bun run build --webpack` for anything that touches routes or config.

## Acceptance checklist (UI)

- [ ] The route uses one page pattern from the table above
- [ ] Colours from the tokens only; muted prose with names in foreground; blue only in the footer sky
- [ ] Onest sizes from the `fontSize` keys; weights 400 and 500 only; mono only for code
- [ ] Radii only on tiles, images and controls; no boxed sections or extra dividers; no shadows (floating layers get a hairline border); no blur
- [ ] Only the listed motion; reduced motion stops all of it
- [ ] Copy in sentence case, plain verbs, no em dash, no generic CTAs or buzzwords
- [ ] Umami attributes follow the button / external-link rule
- [ ] Visible focus and 44px targets on phones; no horizontal scroll at 320 or 375px
- [ ] `bun run test` passes, including the UI gate
