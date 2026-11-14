# Claude instructions for Portfolio v3

> Canonical cross-agent instructions: [`AGENTS.md`](./AGENTS.md)  
> UI design system (source of truth): [`docs/ui/README.md`](./docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. You must produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech stack

- **Next.js 16** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS 3 (not v4) + shadcn/ui primitives restyled to the Langit Malang tokens
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

[`docs/ui/`](./docs/ui/README.md) is the source of truth for UI; [`AGENTS.md`](./AGENTS.md) carries the full summary (token table, type scale, page patterns, motion list, event rules). The design is **Langit Malang**: a calm reading page after joshpuckett.me, equally good in light and dark, ending in a painted sky. Do not bring back anything from the previous designs; the UI gate fails if you do.

- **Layout.** Every visitor page uses `BaseLayout`: the handle "@rizkyhaksono" (h1 size, links home) with a short 40px rule under it, quiet text nav on the right from `md` and "Menu" below `lg`, then one 36rem column (`PROSE_WIDTH`), centred on the page with all text left-aligned. `/tools` and `/chat` use `width="wide"`. No sky at the top, no sticky or translucent header. The admin is full width with a sidebar.
- **Colour use.** Prose and descriptions in `text-muted-foreground`; names, titles and links in `text-foreground`. Links go through `InkLink` (a faint underline that strengthens on hover).
- **Lists.** `LedgerList` / `LedgerRow`: a title in `text-foreground` (not bold) with one muted line under it, an optional small muted group label. No boxes, no hover backgrounds, no rules. `PageHeader` for page titles, `SectionHeading` / `PageSection` for section labels, `MediaCard` only where screenshots matter (`/project` featured, the `/blog` lead), `StatusLine` for empty and failed states, `Skeleton` for loading.
- **Tokens.** shadcn names only: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `input`, `popover`, `destructive`, plus the accents `sky` and `sky-wash`. No hex, no `white` / `black`, no palette colours, no `dark:` classes. Hex copies live only in `src/lib/theme-hex.ts`.
- **The footer sky.** The painted Langit Malang scene (`src/components/ui/sky.tsx`, CSS in the `.sky` block of `globals.css`) sits behind the footer: the sky follows Malang's hour (dawn, day, dusk, evening; night with stars in dark mode), with slow clouds, Arjuno and Semeru in haze and grass hills. Blue appears only here and in the text selection. The grass greens are an illustration-only exception to the colour cap, never UI colour. The clouds drift and the grass sways at once. Phones (below 640px) and reduced motion get a still scene. There is no visible pause button: `SkyToggle` stays in the DOM as `sr-only` and appears on keyboard focus, so keyboard and screen-reader users can stop the motion (WCAG 2.2.2). The `/auth` pages end on the same landscape as a band, with no footer text and the same hidden toggle.
- **Type.** One sans, Onest, via `--font-sans`. No serif, no handwritten face, no second family. Sizes from the `fontSize` keys: caption 12/18, small 13/20, body 15/24, prose 16/28 (articles), lead 16/26, h4, h3 and h2 15/24 at weight 500 (section labels), h1 and display 24/32 at weight 500 with -0.015em (page titles), numeral 28/32 at weight 500. Weights 400 and 500 only; no `font-semibold` or `font-bold` on headings. No `uppercase`, `tracking-[…]` or `text-[Npx]`. System mono only for code.
- **Shape.** Radii only on real tiles and images (`rounded-2xl`) and on controls (fields and buttons `rounded-lg`, chips `rounded-md`, floating layers `rounded-xl`, dots `rounded-full`). No `rounded-[…]`. No boxes around sections, no stat cards, no tiles for plain text, no dividers except the rule under the handle and the hairline inside the footer.
- **Shadow and blur.** No shadows anywhere. Floating layers (dialog, sheet, menu, select, toast, hover tip) are set apart by a hairline border only. No blur anywhere. Gradients only in `globals.css` and `sky.tsx`.
- **Motion.** Route crossfade, project morph, theme crossfade (`switchTheme()`), link underline, card hover, and the footer's slow clouds and grass (the pause toggle is hidden until keyboard focus). CSS or platform native; no framer-motion, `motion`, GSAP or Lenis. Reduced motion stops all of it, view transitions included.
- **Copy.** Sentence case, plain verbs, honest empty, loading and error states. No em dash in UI strings, no generic CTAs ("Learn more", "Click here"), no buzzwords.
- **Umami.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track="nav-click" data-track-item="..."`. Kebab-case names, enum values, never PII.
- **The UI gate.** The jest test `src/__tests__/unit/lib/ui-gate.test.ts` replaces the old grep commands and runs in CI through `bun run test`. Rules: R1 old token classes, R1b old variables and identifiers (`PRINT_HEX`, `--paper`, `#1E3C9E`), R1c old identity classes (`speckle`, `engraving`, `masthead`, `ws__w`, `plate-*`, `tail-piece`, `article-rail`, `reading-hairline`), R2 `dark:`, R3 raw colour, R4 arbitrary values and `uppercase` (only the admin files still on the list), R5 motion libraries, R6 gradients and blur (allowed only in `globals.css` and `sky.tsx`), R7 copy, R8 shadows (`shadow-*` classes except `shadow-none`, and `box-shadow` outside `globals.css`). Some rules carry shrinking allowlists while the redesign lands; never add to them, fix the file. Run it alone with `bunx jest src/__tests__/unit/lib/ui-gate.test.ts`.

## Development workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Before modifying code, always look at existing patterns (especially UI primitives) and `docs/ui/`. Build toward the docs, not toward old-look code that has not been migrated yet.
- Validate input at boundaries; fail fast; robust error handling.
- Make UI accessible: visible focus, keyboard nav, accurate ARIA attributes, 44px targets on phones.
- Run `bunx tsc --noEmit` and `bun run test` (UI gate and contrast guard included) before claiming completion.
