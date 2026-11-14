# Gemini instructions for Portfolio v3

This file mirrors [`.geminirules`](./.geminirules) for tools that look for `GEMINI.md`.

> Canonical cross-agent instructions: [`AGENTS.md`](./AGENTS.md)  
> UI design system (source of truth): [`docs/ui/README.md`](./docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. You must produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict mode)
- Styling: Tailwind CSS 3 (not v4) + shadcn/ui primitives restyled as monochrome Notion components
- Testing: Jest + React Testing Library (unit), Playwright (e2e)
- Package manager: bun

## Architectural guidelines

1. **AI instruction context:** Prefer [`AGENTS.md`](./AGENTS.md) as the shared source of truth, and [`docs/ui/`](./docs/ui/README.md) for anything visual. Related files:
   - **All agents**: `AGENTS.md`
   - **Gemini**: `.geminirules` / `GEMINI.md`
   - **Claude**: `CLAUDE.md` and `.claude/`
   - **Cursor**: `.cursorrules` and `.cursor/rules/`
   - **Copilot**: `.github/copilot-instructions.md`
   - **UI docs**: `docs/ui/`
2. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files requiring state, hooks, interactivity, or browser APIs.
3. **Component organization:**
   - Routes belong in `app/`.
   - Reusable UI elements belong in `components/ui/`.
   - Feature-specific code belongs in `components/[feature]/` or `app/_components/`.
4. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
5. **Styling:**
   - Use Tailwind utility classes and the design tokens in `docs/ui/design-system.md`.
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Maintain mobile-first responsive design.
6. **Code quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. Comment only the why the code cannot show.

## UI rules (mandatory)

Read the UI rules in [`AGENTS.md`](./AGENTS.md#ui-rules-mandatory) and [`docs/ui/`](./docs/ui/README.md) before any UI work; they win over this file. The design is a **Notion workspace**: a grey sidebar, a thin top bar and Notion's 708px page column, monochrome in light and dark, set in one sans (Onest), with the painted Langit Malang sky as the home page's cover. The jest test `src/__tests__/unit/lib/ui-gate.test.ts` enforces it in CI through `bun run test`. The essentials:

- Every visitor page uses `BaseLayout`, a Notion workspace: a grey sidebar (`bg-muted`, 15rem, `lg` and up) with the owner's row, the pages with 16px lucide icons (`SECTION_ICONS`), a "More" group, contact rows, a Light, Dark and System control and the legal links; below `lg`, a "Menu" button in the top bar opens the same tree in a left sheet. A 44px top bar with the breadcrumb and the theme toggle. The 708px page column (`width="wide"` on `/tools` and `/chat`), ending on one quiet line (year, Malang time, email).
- Every page opens with `PageHeader` (icon, 40px bold title via `text-title sm:text-display`, muted description). Content as Notion views and blocks: `Properties`, `LedgerList` / `LedgerRow` (list view), `MediaCard` in `Gallery` (gallery view), `Table` (table view), `ArticleShell` (article), `Callout` at most once per page.
- Monochrome: page text and links in ink (`text-foreground`, links through `InkLink`), secondary text in `text-muted-foreground`, hover `bg-tint`, tags and selected items `bg-tint-strong`, ink primary buttons. Colours only from the token classes; no hex, palette colours or `dark:` classes. Blue (`sky`, `sky-wash`) only in the home cover and the text selection; the cover's grass greens are an illustration-only exception in the `.sky` block of `globals.css`.
- Sizes only from the `fontSize` keys (small 14/20 for UI, body 16/24, prose 16/26, h2 24/32 at 600, page titles 40/48 at 700); weights 400 to 700; no `uppercase`, `tracking-[…]` or `text-[Npx]`. One sans, Onest; no serif, no handwritten face.
- Notion radii: 4px tags (`rounded`), 6px controls and rows (`rounded-md`), 10px cards, images and floating layers (`rounded-lg`); no `rounded-[…]`. Fields are 36px with a 3:1 `border-input`. No boxes around sections.
- No shadows anywhere: floating layers (dialog, sheet, menu, select) get a hairline border; the tooltip and toast are inverted. No blur anywhere; no gradients outside `globals.css` and `sky.tsx`.
- The Langit Malang sky is the home page's cover only (`SkyCover`); there is no footer sky. Its pause toggle stays visually hidden until keyboard focus, phones get a still scene, and every animation stops under reduced motion. No motion libraries (framer-motion, `motion`, GSAP, Lenis).
- Auth (`/auth`, `/admin/auth/login`) follows notion.so/login: one 320px centred column, a two-line title, a full-width ink button, "or continue with" Google, then "New here? Create an account". The admin keeps its own shell until its rebuild.
- Copy in sentence case with plain verbs; no em dash in UI strings, no generic CTAs, no buzzwords.
- Umami: `data-umami-event` only on `<button>` and external `target="_blank"` links; internal links use `data-track`.

## Development workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Analyze existing architecture, patterns and `docs/ui/` before writing code.
- Always implement robust error handling (early returns, fail fast).
- Prioritize security (validate input at boundaries) and accessibility (visible focus, keyboard nav, ARIA labels).
- Run `bunx tsc --noEmit` and `bun run test` (includes the UI gate) before claiming completion.
