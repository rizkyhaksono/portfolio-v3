# Claude instructions for Portfolio v3

> Canonical cross-agent instructions: [`AGENTS.md`](./AGENTS.md)  
> UI design system (source of truth): [`docs/ui/README.md`](./docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. You must produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech stack

- **Next.js 16** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS 3 (not v4) + shadcn/ui primitives restyled as monochrome Notion components
- **Testing**: Jest + React Testing Library (unit), Playwright (e2e)
- **Package manager**: bun

## Architectural guidelines

1. **AI instruction context (multiple agents):** This project uses multiple AI assistants. Prefer [`AGENTS.md`](./AGENTS.md) as the shared source of truth, and [`docs/ui/`](./docs/ui/README.md) for anything visual. Platform files:
   - **All agents**: `AGENTS.md`
   - **Claude**: `CLAUDE.md` and `.claude/` directory
   - **Cursor**: `.cursorrules` and `.cursor/rules/*.mdc`
   - **Gemini**: `.geminirules` / `GEMINI.md`
   - **Copilot**: `.github/copilot-instructions.md`
   - **UI docs**: `docs/ui/`
2. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files requiring state, hooks, interactivity, or browser APIs.
3. **Component organization:**
   - Routes belong in `app/`.
   - Reusable UI elements belong in `components/ui/`.
   - Feature-specific code belongs in `components/[feature]/` or `app/_components/`.
4. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
5. **Styling:**
   - Use Tailwind utility classes and the design tokens in [`docs/ui/design-system.md`](./docs/ui/design-system.md).
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Maintain mobile-first responsive design.
6. **Code quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. Comment only the why the code cannot show. Let variable and function names document themselves.

## UI rules (mandatory)

[`docs/ui/`](./docs/ui/README.md) is the source of truth for UI; [`AGENTS.md`](./AGENTS.md) carries the full summary (token table, type scale, page patterns, motion list, event rules). The design is a **Notion workspace**, equally good in light and dark, monochrome with blue only in the text selection. Do not bring back anything from the previous designs; the UI gate fails if you do.

- **Layout.** Every visitor page uses `BaseLayout`: from `lg`, a sticky grey sidebar (`bg-muted`, 15rem) with the owner's row (portrait and name, a link home), the main pages with 16px lucide icons from `SECTION_ICONS`, a "More" group, the contact rows, then the legal links (Privacy, Terms) beside three theme icon radios (Sun, Moon, Monitor). Rows are 28px from `lg` and 36px on phones (denser than 44px by the owner's request; full-width rows keep WCAG 2.5.8 spacing). `CollapseToggle` (the « button in `sidebar-nav.tsx`, shown on hover or focus of the head, always in the rail) folds the sidebar to an icon rail (`.app-sidebar`, `.sidebar-label`, `.sidebar-expanded-only`, `.sidebar-head` in `globals.css`); the state is `<html data-sidebar="collapsed">`, set before paint by an inline nonce script in `src/app/layout.tsx` and kept in localStorage `sidebar`. Below `lg`, a "Menu" button in the top bar opens the same tree in a left sheet (5/6 of the screen, at most 20rem, the page dimmed). A 44px sticky, opaque top bar with the breadcrumb (home, then the section) and the theme toggle. Then the 708px page column (`PROSE_WIDTH`), every line left-aligned; `/tools` and `/chat` use the full-width page (`width="wide"`). The page ends on one quiet line (year, Malang time via `MalangClock`, email). The admin uses the same Notion shell (`components/layout/admin/*`): a grey sidebar with groups, a 44px top bar with the breadcrumb, the bell (opens on click) and the theme toggle, full-width content, and full-width Notion tables for collections, edited in a dialog (`Collection`).
- **Colour use.** Page text, titles and links in `text-foreground`; secondary text (sidebar rows, descriptions, properties, meta) in `text-muted-foreground`. Hover is `bg-tint`; tags and selected items `bg-tint-strong`. Links go through `InkLink` (ink with a grey underline that turns full ink on hover).
- **Page patterns.** `PageHeader` (a 40px bold title via `text-title sm:text-display`, a muted description; no page icon, by the owner's request) on every page, `Properties` for facts, `Callout` at most once per page, `LedgerList` / `LedgerRow` for list views, `MediaCard` in `Gallery` for gallery views, `Table` for table views, `ArticleShell` for articles (cover picture, title, properties, hairline, prose, previous and next). `StatusLine` for empty and failed states. Every route's `loading.tsx` mirrors its page through `PageLoading` (the real title, skeletons in the page's shapes).
- **Components.** Monochrome Notion: ink primary buttons (no blue), 6px controls, 10px cards, images and floating layers, 4px grey tags, view tabs with an ink underline bar, the toggle with a rotating triangle, hairline tables, a dark Notion tooltip (`bg-tip`, hairline in dark) and an inverted toast, 36px fields with a 3:1 `border-input` (firmer than Notion on purpose, WCAG 1.4.11).
- **Tokens.** shadcn names only: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `input`, `popover`, `destructive`, plus the tints `tint` and `tint-strong` and the accent `sky-wash` (the selection fill; `sky` stays in the tokens but no component uses it). Notion neutrals: light #FFFFFF page, #F7F7F5 sidebar, #37352F text, #6E6D69 muted; dark #191919 and #202020, #D4D4D4 text, #9B9B9B muted. No hex, no `white` / `black`, no palette colours, no `dark:` classes. Hex copies live only in `src/lib/theme-hex.ts`.
- **The home.** `PageCover` (`src/components/ui/page-cover.tsx`) is Notion's page cover on the home page only: the photo `src/assets/cover/home.webp`, 30vh, through `next/image` with a blur placeholder. Nothing in it moves. The bio's names are Notion mentions with a hover preview card (`src/app/_components/home/mention.tsx`); Work experience and Education are two separate tables; the contact form shows directly as a bordered Notion form.
- **Auth.** `/auth` and `/admin/auth/login` (`AuthShell`) follow notion.so/login: the owner's name top left, one 320px centred column, a two-line title (ink line, grey line), Email and Password, a full-width ink button, an "or continue with" divider, Google, then "New here? Create an account" switching the form (`?tab=signup`), small print under it.
- **Type.** One sans, Onest, via `--font-sans`. No serif, no handwritten face, no second family. Sizes from the `fontSize` keys: caption 12/16, small 14/20 (UI), body 16/24, prose 16/26, h4 16 at 600, h3 20/28 at 600, h2 24/32 at 600, h1 30 at 600, title 28/36 at 700 (page titles on phones; section titles also step down one size below `sm`, and `body`, `prose` and `.prose` run at 15/24 on phones via `globals.css`), display 40/48 at 700, numeral 32 at 600. Weights 400 to 700 (500 for UI emphasis). No `uppercase`, `tracking-[…]` or `text-[Npx]`. System mono only for code.
- **Shape.** `rounded` (4px) tags, `rounded-md` (6px) controls and rows, `rounded-lg` (10px) cards, images and floating layers, `rounded-full` dots. No `rounded-[…]`, `rounded-xl` or `rounded-2xl`. No boxes around sections.
- **Shadow and blur.** No shadows anywhere. Floating layers (dialog, sheet, menu, select) are set apart by a hairline; the tooltip and toast are inverted. No blur and no gradients anywhere.
- **Motion.** Notion-like and quick: row hovers at `duration-75`, link underline, toggle triangle, tab bar, theme crossfade (`switchTheme()`), menus and selects fading with a small zoom (0.97), dialogs fading and zooming, sheets sliding fully, the sidebar width easing over 280ms, a `motion-safe` skeleton pulse, and content fading in over 300ms when it replaces a skeleton (`FADE_IN` in `src/components/ui/page-loading.tsx`). CSS or platform native; no framer-motion, `motion`, GSAP or Lenis. Reduced motion stops all of it, view transitions included.
- **Copy.** Sentence case, plain verbs, honest empty, loading and error states. No em dash in UI strings, no generic CTAs ("Learn more", "Click here"), no buzzwords.
- **Umami.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track="nav-click" data-track-item="..."`. Kebab-case names, enum values, never PII. Names live in `EventName` in `src/lib/analytics.ts` (`sidebar-toggle` and `mention-click` included).
- **The UI gate.** The jest test `src/__tests__/unit/lib/ui-gate.test.ts` runs in CI through `bun run test`. Rules: R1 print-era token classes and `font-display` (`tint` is allowed again: it is Notion's fill), R1b old variables and identifiers (`PRINT_HEX`, `var(--paper)`, `Plus_Jakarta`, `#1E3C9E`), R1c old identity classes (`speckle`, `engraving`, `masthead`, `ws__w`, `plate-paper`, `tail-piece`, `article-rail`, `reading-hairline`), R2 `dark:`, R3 raw colour, R4 arbitrary values and `uppercase` (allowlist empty), R5 motion libraries, R6 gradients and blur (its allowlist still names `globals.css` and the deleted `sky.tsx`; neither holds one), R7 em dash in UI strings, R8 shadows (`shadow-*` classes except `shadow-none`, and `box-shadow` outside `globals.css`). Some rules carry shrinking allowlists; never add to them, fix the file. Run it alone with `bunx jest src/__tests__/unit/lib/ui-gate.test.ts`.

## Development workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Before modifying code, always look at existing patterns (especially UI primitives) and `docs/ui/`. Build toward the docs, not toward old-look code that has not been migrated yet.
- Validate input at boundaries; fail fast; robust error handling.
- Make UI accessible: visible focus, keyboard nav, accurate ARIA attributes, 44px targets on phones (sidebar and menu sheet rows are 36px by owner request).
- Run `bunx tsc --noEmit` and `bun run test` (UI gate and contrast guard included) before claiming completion.
