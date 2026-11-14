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

[`docs/ui/`](./docs/ui/README.md) is the source of truth for UI; [`AGENTS.md`](./AGENTS.md) carries the full summary (token table, type scale, page patterns, motion list, event rules). The design is **Langit Malang**: calm, elegant, Apple-like, equally good in light and dark. Do not bring back anything from the previous design; the UI gate fails if you do.

- **Layout.** The public site is centred: one 640px column, centred name, page headers and footer, left-aligned prose and rows. `/tools` and `/chat` use the 960px wide column. The admin is full width with a sidebar.
- **Tokens.** shadcn names only: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `input`, `popover`, `destructive`, plus the accents `sky` and `sky-wash`. No hex, no `white` / `black`, no palette colours, no `dark:` classes. Hex copies live only in `src/lib/theme-hex.ts`.
- **The accent.** Blue appears in exactly two places: the sky band and the `Marker` (`bg-sky-wash`). Never on links, buttons, focus, charts or hover.
- **Type.** One family, Onest, via `--font-sans`. Sizes from the `fontSize` keys (caption 12, small 13, body 15, prose 17, lead 19, h4 15, h3 19, h2 24, h1 40, display 56, numeral 32), which carry the tracking. Weights 400, 500 and 600 only. No `uppercase`, `tracking-[…]` or `text-[Npx]`. System mono only for code.
- **Shape.** Fields and buttons `rounded-lg`, chips `rounded-md`, floating layers `rounded-xl`, tiles `rounded-2xl`, dots `rounded-full`. No `rounded-[…]`.
- **Shadow and blur.** `shadow-float` on floating layers only. The translucent sticky header is the only blur. Gradients only in `globals.css` and the sky.
- **Motion.** Route crossfade, project morph, theme crossfade (`switchTheme()`), link underline, card hover, the sky's slow clouds with a pause control. CSS or platform native; no framer-motion, `motion`, GSAP or Lenis. Reduced motion stops all of it, view transitions included.
- **Copy.** Sentence case, plain verbs, honest empty, loading and error states. No em dash in UI strings, no generic CTAs ("Learn more", "Click here"), no buzzwords.
- **Umami.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track="nav-click" data-track-item="..."`. Kebab-case names, enum values, never PII.
- **The UI gate.** The jest test `src/__tests__/unit/lib/ui-gate.test.ts` replaces the old grep commands and runs in CI through `bun run test`. Rules: R1 old token classes, R1b old variables and identifiers (`PRINT_HEX`, `--paper`, `#1E3C9E`), R1c old identity classes (`speckle`, `engraving`, `masthead`, `plate`, `bg-hatch`), R2 `dark:`, R3 raw colour, R4 arbitrary values and `uppercase`, R5 motion libraries, R6 gradients and blur (allowed in `globals.css`, `sky.tsx`, `running-head.tsx`), R7 copy. Some rules carry shrinking allowlists while the redesign lands; never add to them, fix the file. Run it alone with `bunx jest src/__tests__/unit/lib/ui-gate.test.ts`.

## Development workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Before modifying code, always look at existing patterns (especially UI primitives) and `docs/ui/`. Build toward the docs, not toward old-look code that has not been migrated yet.
- Validate input at boundaries; fail fast; robust error handling.
- Make UI accessible: visible focus, keyboard nav, accurate ARIA attributes, 44px targets on phones.
- Run `bunx tsc --noEmit` and `bun run test` (UI gate and contrast guard included) before claiming completion.
