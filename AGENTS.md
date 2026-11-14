# AGENTS.md: Portfolio v3

Canonical instructions for **any** coding agent in this repository (Claude, Cursor, Codex, Gemini, Copilot and others). Platform files point here and add tooling notes only. For UI, [`docs/ui/`](docs/ui/README.md) is the source of truth and wins over every summary, this one included.

You are an expert full-stack TypeScript engineer. Produce production-ready code that follows modern Next.js App Router patterns.

## Tech stack

- **Next.js 16** (App Router) and React 19
- **TypeScript**, strict mode
- **Styling:** Tailwind CSS 3 (not v4) and shadcn/ui primitives restyled as monochrome Notion components
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

### Identity: a Notion workspace

The site is laid out like a Notion workspace, equally good in light and dark: a grey sidebar with the page tree, a thin top bar with the page's path, then each page in Notion's 708px column as an icon, a 40px bold title, properties and Notion blocks and views. Everything is monochrome (ink, grey and translucent tints) in one sans, Onest. The one coloured element is **the home cover**: the Langit Malang sky, a painted Malang sky whose colour follows the time of day in Malang (WIB), and the night sky in dark mode.

- **Public site:** every page uses `BaseLayout`. From `lg`, a sticky grey sidebar (`bg-muted`, 15rem) holds the owner's row (portrait and "Rizky Haksono", linking home), Home and the main pages with their 16px lucide icons from `SECTION_ICONS`, a "More" group (Certificates, Changelog, Account, RSS feed), the contact rows (Send feedback, Email, GitHub, LinkedIn), a Light, Dark and System segmented control and the legal links. Below `lg`, a "Menu" button in the top bar opens the same tree in a left sheet. The top bar is 44px, sticky and opaque: the breadcrumb (home, then the section) and the theme toggle. Then the page column (`PROSE_WIDTH`, 708px), centred right of the sidebar, every line left-aligned. `/tools` and `/chat` use the full-width page (`width="wide"`). The page ends on one quiet line: the year, the hour in Malang and the email.
- **Colour use:** page text, titles and links in `text-foreground`; secondary text (sidebar rows, descriptions, property names, meta, table heads) in `text-muted-foreground`. Hover is `bg-tint`, never colour. Links go through `InkLink`: ink with a grey underline that turns full ink on hover.
- **Admin:** keeps its own shell for now; its rebuild (full width, Notion sidebar) comes later. No sky.
- **Auth:** laid out like notion.so/login, see below.
- **Themes:** `defaultTheme="system"`; labels Light, Dark and System; every change goes through `switchTheme()`.
- **Name and icon:** the owner's portrait and name as text. The favicon is a plain "R" tile. There is no logo mark and no handwritten face.

### Tokens

HSL triples in `src/app/globals.css` (`:root` light, `.dark` dark), exposed in `tailwind.config.ts` under the shadcn names. Hex copies live only in `src/lib/theme-hex.ts` (`THEME_HEX.light`, `THEME_HEX.dark`) for theme-color, the manifest, `global-error.tsx` and the OG and certificate cards.

| Token | Class | Light | Dark | Role |
|---|---|---|---|---|
| `--background` | `bg-background` | #FFFFFF | #191919 | The page, cards, fields |
| `--foreground` | `text-foreground` | #37352F | #D4D4D4 | Page text, icons, ink button, focus ring |
| `--muted-foreground` | `text-muted-foreground` | #6E6D69 | #9B9B9B | Secondary text, sidebar rows, meta |
| `--border` | `border-border` | #E9E9E7 | #2F2F2F | Hairlines |
| `--muted` | `bg-muted` | #F7F7F5 | #202020 | The sidebar and menu sheet, image grounds, code |
| `--input` | `border-input` | #8F8E8A | #6E6E6E | Field borders (3:1) |
| `--popover` | `bg-popover` | #FFFFFF | #252525 | Floating layers |
| `--destructive` | `text-destructive` | #C4321F | #F27166 | Destructive actions and errors, always with a word |
| `--sky` | `text-sky` | #2D5B8C | #8DB6E6 | Accent: the home cover |
| `--sky-wash` | `bg-sky-wash` | #D9E6F4 | #203247 | Accent: the text selection fill |

Tints (in `tailwind.config.ts`, from the text colour): `bg-tint` (6%) for hover on rows, buttons and menu items, callouts and skeletons; `bg-tint-strong` (10%) for tags and selected items.

Derived: `--card` is background; `--primary` and `--ring` are foreground; `--secondary` and `--accent` are muted; `--radius` is `.625rem` (10px). Motion variables: `--dur-press` 120ms, `--dur-ui` 200ms, `--dur-sheet` 280ms, `--ease-out` `cubic-bezier(.25,.1,.25,1)` (class `ease-out`). `--head-h` is 2.75rem (the top bar). `--scrim` fills the backdrop behind modals.

- **Blue lives in the home cover** (and the `::selection` fill). Never links, buttons, focus, charts, icons, tags or hover. The primary button is ink. The cover's grass greens and mountain haze are an illustration-only exception to the colour cap: they live only in the `.sky` block of `globals.css` and are never UI colour.
- No hex, no `white` / `black`, no palette colours (`gray-500`, `blue-600`), no `dark:` classes: every token flips on `<html class="dark">`.
- Text never takes an opacity modifier; use `text-muted-foreground`. Fields use `border-input`, not `border-border`.
- State is an icon plus a word (`StatusLine`, the `Badge` status square), never colour alone.
- **Contrast guard:** `src/__tests__/unit/lib/contrast.test.ts` reads the triples and fails below the floors in both themes (foreground 7:1 and muted-foreground 4.5:1 on background, muted and popover; input 3:1; destructive and sky 4.5:1; foreground on sky-wash 7:1), checks `THEME_HEX` against the tokens and checks the print block. Change a token, change `theme-hex.ts` in the same commit.

### Type

One sans, **Onest** (variable, OFL), loaded once with `next/font/google` in `src/app/layout.tsx` as `--font-sans`. Site and admin use it. System mono (`font-mono`) only for code. There is no second face, no serif, no handwritten face and no `font-display`.

| Key | Size / line height | Weight | Use |
|---|---|---|---|
| `caption` | 12 / 16 | 400 | The closing line, captions, sidebar group labels, tooltips |
| `small` | 14 / 20 | 400 | UI: sidebar, breadcrumb, buttons, tabs, tables, properties, row meta, tags |
| `body` | 16 / 24 | 400 | Page text, row titles, callouts |
| `prose` | 16 / 26 | 400 | Article text (`.prose`) |
| `h4` | 16 / 24 | 600 | Small headings |
| `h3` | 20 / 28 | 600 | Sheet and dialog titles |
| `h2` | 24 / 32 | 600 | Section headings ("Projects", "Writing"), the auth title |
| `h1` | 30 / 38 | 600 | A heading 1 block |
| `title` | 32 / 40 | 700 | Page titles on phones |
| `display` | 40 / 48 | 700 | Page titles from `sm` (`text-title sm:text-display`) |
| `numeral` | 32 / 40 | 600 | Figures on `/stats` and the admin |

- Weights 400 to 700: 400 text, 500 (`font-medium`) for UI emphasis, 600 headings, 700 page titles only. The keys carry the heading weights.
- Sizes only from the keys: never `text-[Npx]`. Tracking only from the keys: never `tracking-[…]`. No `uppercase`.
- `xs` and `lead` in `tailwind.config.ts` stay for older call sites; new code uses the keys above.
- Fields use 16px on phones. `tabular-nums` in rows, tables, properties and figures.

### Shape, shadow, blur

- **Notion radii:** tags `rounded` (4px); buttons, fields, rows, toggles and callouts `rounded-md` (6px); cards, images, dialogs, menus and toasts `rounded-lg` (10px); dots, switches, radios and the home portrait `rounded-full`. Never `rounded-[…]`, `rounded-xl` or `rounded-2xl`.
- **Keep calm:** no boxes around sections, no tiles for plain text, at most one `Callout` per page. Hairlines where Notion has them: table cells, gallery cards, under an article's header, above the closing line.
- **Surfaces** ([surfaces.md](docs/ui/surfaces.md)): page (no box), sidebar (`bg-muted`), tile (`bg-muted`, for pictures and code), frame (hairline `border-border`, for gallery cards and forms), float (`bg-popover`, hairline), inverted (`bg-foreground text-background`, for the tooltip and toasts). One surface per level.
- **No shadows anywhere.** `boxShadow` is gone from `tailwind.config.ts`. Floating layers (dialog, sheet, menu, popover, select content, terminal overlay) are set apart by a hairline `border-border`; the hover tip and toasts are inverted, with no border. Applied inside the shared primitives.
- **No blur.** The top bar is opaque. Scrims are a fixed fill, never blurred.
- **Gradients** only in `globals.css` and the cover (`sky.tsx`).

### The home cover

`SkyCover` (`src/components/ui/sky.tsx`) is Notion's page cover on the home page only, passed as `BaseLayout`'s `cover`: the painted Langit Malang scene, edge to edge above the column, 30% of the viewport tall, built from CSS and inline SVG (no image file), `aria-hidden`. Back to front: a sky gradient, the sun or the moon, soft clouds drifting slowly, Arjuno and Semeru in haze, rolling grass hills with blades that sway, a fine grain. The phase (`skyPhase()` in `src/lib/malang-time.ts`: dawn, day, dusk, evening in WIB) sets `data-sky` on mount; the server renders the day stop. Dark mode is always the night sky with a few static stars. Phones (below 640px) and `prefers-reduced-motion: reduce` get a still scene. There is no visible pause button: `SkyToggle` sits in the cover as `sr-only`, shows on keyboard focus, and lets keyboard and screen-reader users stop the motion (WCAG 2.2.2; the choice is saved in localStorage). The round portrait overlaps the cover's lower edge like a page icon. There is no footer sky and no sky on any other page. Stop colours and the grass greens live only in the `.sky` block of `globals.css`.

### Motion

All CSS or platform native. The complete list:

1. **Hover tint:** `bg-tint` fades in on rows, buttons and sidebar items (`--dur-ui`, buttons `--dur-press`).
2. **Link underline:** the grey underline turns full ink, 200ms.
3. **Toggle:** the triangle turns 90 degrees; accordion content opens by height.
4. **View tabs:** the 2px ink bar follows the open tab.
5. **Theme crossfade:** `switchTheme()` wraps the change in a view transition.
6. **Skeleton:** a soft pulse on `bg-tint`, only under `motion-safe`.
7. **The home cover:** slow clouds and swaying grass, playing at once, with a pause toggle that stays visually hidden until keyboard focus.

Floating layers keep their Radix fade (150 to 280ms). Anything else that responds to input uses `--dur-*` and `ease-out`.

**Reduced motion:** the global kill switch stays; every `::view-transition-*` gets `animation: none`; `switchTheme()` skips the view transition; the cover is still; skeletons do not pulse. With `reducedMotion: 'reduce'`, `document.getAnimations().length` must be 0.

**Banned:** scroll reveal and fade-up on sections, parallax, scroll-jacking or anything tied to scroll position, marquees, typing effects, custom cursors, `animate-ping`, `animate-bounce`, hover lifts, hover scaling, autoplaying media, framer-motion, `motion`, GSAP, Lenis or any other animation library.

### Banned outright

- `dark:` classes
- Raw hex, `white` / `black` and Tailwind palette colours in components
- Blue anywhere but the home cover and the selection; a blue or coloured primary button
- Gradients outside `globals.css` and `sky.tsx`; blur anywhere
- `uppercase`, `tracking-[…]`, `text-[Npx]`, `rounded-[…]`
- framer-motion, `motion`, GSAP, Lenis
- Em dashes in UI copy, generic CTAs, buzzwords
- Glass cards, boxed sections, shadows of any kind, hover lifts, window chrome
- A footer sky band, the old handle header with its short rule, a translucent or blurred top bar, a handwritten face
- Any class, variable or asset from the old designs (see gate rules R1, R1b and R1c)

### Page patterns

| Pattern | Component | Routes |
|---|---|---|
| Page | `ui/page-header.tsx` (icon above a 40px bold title via `text-title sm:text-display`, muted description), `ui/properties.tsx` | Every visitor page |
| List view | `ui/ledger.tsx` (`LedgerList`, `LedgerRow`): an optional 16px icon, the title in ink at weight 500, one muted line, meta on the right, the whole row a link that tints on hover, a small muted group label | Home Writing, `/blog` rows, `/roadmap` lessons |
| Gallery view | `MediaCard` in `Gallery` (`ui/media-card.tsx`): hairline cards, 10px, the picture on the grey ground, title and a property under it, two columns (three from `lg`) | Home Projects, `/project`, the newest `/blog` posts |
| Table view | `ui/table.tsx`: hairline cells, grey head cells | Home Work experience, `/certificates` |
| Article | `ui/article-shell.tsx`: cover picture, icon, title, properties, a hairline, `.prose`, previous and next | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` |
| Cabinet | `tools/_components/tool-shell.tsx`, `ui/pager.tsx`, `width="wide"`, view tabs | `/tools`, `/ai` |
| Correspondence | The chat column, the contact form | `/chat`, `/ai` chat, home Contact, admin Feedback |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar`: solid fills, text alternatives | `/stats`, admin Home and Analytics |
| Admin | `components/layout/admin/*`: its own shell until the rebuild | `/admin/dashboard/*` |
| Auth | `layout/auth-shell.tsx`: notion.so/login | `/auth/*`, `/admin/auth/login` |
| Profile card | A definition list in a frame | `/profile`, `/profile/edit`, admin Settings |
| Not found | `ui/not-found-view.tsx` | 404s, `error.tsx`, empty states |

Blocks: `Callout` (one per page at most), the Notion toggle (`Accordion` or a `<details>` with the rotating triangle), view tabs (`Tabs`, an ink bar under the open one), quotes with a 3px ink bar, `text-h2` section headings (`SectionHeading`, `PageSection`). `StatusLine` for empty and failed states; `Skeleton` for loading.

Shell: `BaseLayout` (`width?: 'prose' | 'wide'`, `fit?`, `footer?: 'full' | 'compact' | 'none'`, `cover?`) with the sidebar, the top bar, the menu sheet and the closing line. One `PageHeader` per page. The home is the cover, the round portrait, the h1 "Rizky Haksono", properties (Role, Based in, Email, Elsewhere), a short bio in ink, then Projects (gallery), Writing (list), Work experience (a table of every career and education entry, newest first), Recommendations (only with real data) and Contact (one callout and the form in a toggle). Details: [`page-shell.md`](docs/ui/page-shell.md), [`platforms.md`](docs/ui/platforms.md).

**Auth** (`/auth`, `/admin/auth/login`), after notion.so/login: the owner's name top left, one 320px centred column, a two-line title (ink line, grey line), Email and Password, a full-width ink button, an "or continue with" divider, "Continue with Google", then "New here? Create an account" switching the form in place (`?tab=signup`), and the small print under it.

Shared details agents trip on:

- Primary buttons are ink (`bg-foreground text-background`), 6px, 32px tall; fields are 36px, 6px, with a 3:1 `border-input` (firmer than Notion on purpose, WCAG 1.4.11).
- Page icons come only from `SECTION_ICONS` (`src/components/layout/section-icons.tsx`); nav only from `src/commons/constants/navigation-menu.ts`.
- Hover tips: `data-tip="..."` on any element (`ui/hover-tip.tsx`), an inverted slab. Never the native `title` attribute.
- Generated cards: build URLs with `ogImageUrl(params, path?)` from `src/lib/site-url.ts`. It always sets `v=5`; raise it when a card's design changes.
- `favicon.ico` must stay at `src/app/favicon.ico`: the container healthcheck fetches `/favicon.ico`.

### Copy

- Sentence case everywhere. Plain verbs that say what happens ("Save changes", "Send message"); toasts echo the button ("Changes saved.").
- No generic CTAs ("Learn more", "Click here", "Read more", "Get started", "Submit"). Name the destination ("All 27 projects").
- No buzzwords ("seamless", "cutting-edge", "leverage", "unlock", "elevate", "supercharge").
- No em dash in UI strings: use a comma, colon, full stop or "to". Comments may use one.
- Honest states: empty says what is missing and what to do; loading is a skeleton or a short line; errors say what happened and the next step, never "Oops". Home sections with no data hide; never show zeros, `NaN` or `-Infinity`.
- No all-caps eyebrows, no middle-dot meta strings, no "→" after links. Numbers only for real sequences.

### Umami events

- `data-umami-event` only on `<button>` and external `target="_blank"` links. On an internal `<a>` the tracker forces a full page reload.
- Internal links use `data-track="nav-click"` plus `data-track-*` (for example `data-track-item="blog"`; `navTrack(href, area)` builds them); a delegated listener forwards them. In code, call `track()` from `src/lib/analytics.ts`.
- Kebab-case names, 50 characters or fewer, enum values only, one event per element. Never PII (emails, names, prompts, chat text, queries, ids, full URLs). Event table: [`docs/ui/components.md`](docs/ui/components.md#umami-events).

### The UI gate

The gate is the jest test `src/__tests__/unit/lib/ui-gate.test.ts`, run by `bun run test` in CI before every deploy. It scans `src/`, `content/` and `tailwind.config.ts`.

| Rule | Bans | Allowed in |
|---|---|---|
| R1 | Print-era token classes (`text-ink`, `bg-paper`, `border-rule` and the rest) and `font-display`. `tint` is no longer banned: it is Notion's fill | nowhere |
| R1b | Print-era variables and identifiers: `PRINT_HEX`, `var(--paper)`, `var(--tint)`, `Plus_Jakarta`, `#1E3C9E` and so on | the OG font file, old changelog entries |
| R1c | Old identity classes: `speckle`, `engraving`, `masthead`, `ws__w`, `plate-paper`, `tail-piece`, `article-rail`, `reading-hairline` and so on | old changelog entries |
| R2 | `dark:` | nowhere |
| R3 | Raw colour: hex and palette colours | `src/lib/theme-hex.ts` (CSS is not scanned) |
| R4 | Arbitrary values: `rounded-[…]`, `text-[Npx]`, `tracking-[…]`, plus `uppercase` | nowhere (four admin files stay listed until the admin rebuild) |
| R5 | Motion libraries: `framer-motion`, `motion`, `gsap`, `lenis`, `animate-bounce`, `animate-ping` | nowhere |
| R6 | Gradients and blur | `globals.css`, `sky.tsx` |
| R7 | Em dash in UI strings | `src/app/_components/blog/format.ts` |
| R8 | Shadows: `shadow-*` utility classes (except `shadow-none`) and `box-shadow` | `box-shadow` in `globals.css` only |

Some rules carry a shrinking allowlist of files that still break them while the redesign lands. Each PR removes the files it fixes; only the admin files on R4 and the OG font file on R1b are left. Never add a file to an allowlist or loosen a pattern: fix the file.

## Development workflow

1. Read `prd/feature.md`, then `prd/progress.md`, then `docs/ui/`, then the existing patterns in code.
2. Prefer shared primitives over ad-hoc bordered `div`s. When you touch an old-look file, move it to the new rules; never copy an old pattern into new code.
3. Validate input at boundaries; fail fast; map errors to honest messages.
4. Keep UI accessible: visible focus, `aria-current`, labels, keyboard navigation, Esc closes and focus returns, 44px targets on phones and coarse pointers (`min-h-11`), chart text alternatives.
5. Update `prd/progress.md` when a task is done.
6. Before claiming completion: `bunx tsc --noEmit`, `bun run test` (includes the UI gate and the contrast guard), and `bun run build --webpack` for anything that touches routes or config.

## Acceptance checklist (UI)

- [ ] The route sits in `BaseLayout` and uses one page pattern from the table above, with one `PageHeader`
- [ ] Colours from the tokens and tints only; ink text, grey secondary text, `bg-tint` hover; blue only in the home cover
- [ ] Onest sizes from the `fontSize` keys; weights 400 to 700 as the keys set them; mono only for code
- [ ] Notion radii (4, 6, 10px, full); no boxed sections, at most one callout; no shadows (floating layers get a hairline, tooltip and toast are inverted); no blur
- [ ] Only the listed motion; reduced motion stops all of it
- [ ] Copy in sentence case, plain verbs, no em dash, no generic CTAs or buzzwords
- [ ] Umami attributes follow the button / external-link rule
- [ ] Visible focus and 44px targets on phones; no horizontal scroll at 320 or 375px
- [ ] `bun run test` passes, including the UI gate
