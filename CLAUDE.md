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

[`docs/ui/`](./docs/ui/README.md) is the source of truth for UI; [`AGENTS.md`](./AGENTS.md) carries the full summary (token table, type scale, page patterns, motion list, event rules). The design is a **Notion workspace**, equally good in light and dark, monochrome except for the Langit Malang sky on the home cover. Do not bring back anything from the previous designs; the UI gate fails if you do.

- **Layout.** Every visitor page uses `BaseLayout`: from `lg`, a sticky grey sidebar (`bg-muted`, 15rem) with the owner's row, the main pages with 16px lucide icons from `SECTION_ICONS`, a "More" group, contact rows, a Light, Dark and System segmented control and the legal links; below `lg`, a "Menu" button in the top bar opens the same tree in a left sheet. A 44px sticky, opaque top bar with the breadcrumb (home, then the section) and the theme toggle. Then the 708px page column (`PROSE_WIDTH`), every line left-aligned; `/tools` and `/chat` use the full-width page (`width="wide"`). The page ends on one quiet line (year, Malang time, email). The admin keeps its own shell until its rebuild.
- **Colour use.** Page text, titles and links in `text-foreground`; secondary text (sidebar rows, descriptions, properties, meta) in `text-muted-foreground`. Hover is `bg-tint`; tags and selected items `bg-tint-strong`. Links go through `InkLink` (ink with a grey underline that turns full ink on hover).
- **Page patterns.** `PageHeader` (an icon above a 40px bold title via `text-title sm:text-display`, a muted description) on every page, `Properties` for facts, `Callout` at most once per page, `LedgerList` / `LedgerRow` for list views, `MediaCard` in `Gallery` for gallery views, `Table` for table views, `ArticleShell` for articles (cover picture, icon, title, properties, hairline, prose, previous and next). `StatusLine` for empty and failed states, `Skeleton` for loading.
- **Components.** Monochrome Notion: ink primary buttons (no blue), 6px controls, 10px cards, images and floating layers, 4px grey tags, view tabs with an ink underline bar, the toggle with a rotating triangle, hairline tables, an inverted tooltip and toast, 36px fields with a 3:1 `border-input` (firmer than Notion on purpose, WCAG 1.4.11).
- **Tokens.** shadcn names only: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `input`, `popover`, `destructive`, plus the tints `tint` and `tint-strong` and the accents `sky` and `sky-wash`. Notion neutrals: light #FFFFFF page, #F7F7F5 sidebar, #37352F text, #6E6D69 muted; dark #191919 and #202020, #D4D4D4 text, #9B9B9B muted. No hex, no `white` / `black`, no palette colours, no `dark:` classes. Hex copies live only in `src/lib/theme-hex.ts`.
- **The home cover.** `SkyCover` (`src/components/ui/sky.tsx`, CSS in the `.sky` block of `globals.css`) is Notion's page cover on the home page only: the painted sky follows Malang's hour (dawn, day, dusk, evening; night with stars in dark mode), with clouds, Arjuno and Semeru in haze, grass hills, and the sun or moon. Blue appears only here and in the text selection; the grass greens are an illustration-only exception, never UI colour. Phones (below 640px) and reduced motion get a still scene. The pause control (`SkyToggle`) is `sr-only` and shows on keyboard focus (WCAG 2.2.2). There is no footer sky.
- **Auth.** `/auth` and `/admin/auth/login` (`AuthShell`) follow notion.so/login: the owner's name top left, one 320px centred column, a two-line title (ink line, grey line), Email and Password, a full-width ink button, an "or continue with" divider, Google, then "New here? Create an account" switching the form (`?tab=signup`), small print under it.
- **Type.** One sans, Onest, via `--font-sans`. No serif, no handwritten face, no second family. Sizes from the `fontSize` keys: caption 12/16, small 14/20 (UI), body 16/24, prose 16/26, h4 16 at 600, h3 20/28 at 600, h2 24/32 at 600, h1 30 at 600, title 32/40 at 700, display 40/48 at 700, numeral 32 at 600. Weights 400 to 700 (500 for UI emphasis). No `uppercase`, `tracking-[…]` or `text-[Npx]`. System mono only for code.
- **Shape.** `rounded` (4px) tags, `rounded-md` (6px) controls and rows, `rounded-lg` (10px) cards, images and floating layers, `rounded-full` dots. No `rounded-[…]`, `rounded-xl` or `rounded-2xl`. No boxes around sections.
- **Shadow and blur.** No shadows anywhere. Floating layers (dialog, sheet, menu, select) are set apart by a hairline; the tooltip and toast are inverted. No blur anywhere. Gradients only in `globals.css` and `sky.tsx`.
- **Motion.** Hover tints, link underline, toggle triangle, tab bar, theme crossfade (`switchTheme()`), Radix fades, a `motion-safe` skeleton pulse, and the cover's slow clouds and grass. CSS or platform native; no framer-motion, `motion`, GSAP or Lenis. Reduced motion stops all of it, view transitions included.
- **Copy.** Sentence case, plain verbs, honest empty, loading and error states. No em dash in UI strings, no generic CTAs ("Learn more", "Click here"), no buzzwords.
- **Umami.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track="nav-click" data-track-item="..."`. Kebab-case names, enum values, never PII.
- **The UI gate.** The jest test `src/__tests__/unit/lib/ui-gate.test.ts` runs in CI through `bun run test`. Rules: R1 print-era token classes and `font-display` (`tint` is allowed again: it is Notion's fill), R1b old variables and identifiers (`PRINT_HEX`, `var(--paper)`, `Plus_Jakarta`, `#1E3C9E`), R1c old identity classes (`speckle`, `engraving`, `masthead`, `ws__w`, `plate-paper`, `tail-piece`, `article-rail`, `reading-hairline`), R2 `dark:`, R3 raw colour, R4 arbitrary values and `uppercase` (only the admin files still on the list), R5 motion libraries, R6 gradients and blur (allowed only in `globals.css` and `sky.tsx`), R7 em dash in UI strings, R8 shadows (`shadow-*` classes except `shadow-none`, and `box-shadow` outside `globals.css`). Some rules carry shrinking allowlists; never add to them, fix the file. Run it alone with `bunx jest src/__tests__/unit/lib/ui-gate.test.ts`.

## Development workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Before modifying code, always look at existing patterns (especially UI primitives) and `docs/ui/`. Build toward the docs, not toward old-look code that has not been migrated yet.
- Validate input at boundaries; fail fast; robust error handling.
- Make UI accessible: visible focus, keyboard nav, accurate ARIA attributes, 44px targets on phones.
- Run `bunx tsc --noEmit` and `bun run test` (UI gate and contrast guard included) before claiming completion.
