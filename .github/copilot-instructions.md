# GitHub Copilot instructions

> Canonical cross-agent instructions: [`AGENTS.md`](../AGENTS.md)  
> UI design system (source of truth): [`docs/ui/README.md`](../docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. Produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech stack

- **Next.js 16** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS 3 (not v4) + shadcn/ui primitives restyled to the Langit Malang tokens
- **Testing**: Jest + React Testing Library (unit), Playwright (e2e)
- **Package manager**: bun

## Architectural guidelines

1. Prefer [`AGENTS.md`](../AGENTS.md) as the shared source of truth across AI platforms, and [`docs/ui/`](../docs/ui/README.md) for anything visual.
2. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files that require state, hooks, interactivity, or browser APIs.
3. **Component organization:**
   - Pages and layouts go in `app/`.
   - Reusable UI elements go in `components/ui/`.
   - Feature-specific code goes in `components/[feature]/` or `app/_components/`.
4. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
5. **Styling (Tailwind and shadcn/ui):**
   - Rely on Tailwind utility classes and the design tokens in `docs/ui/design-system.md`.
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Ensure a mobile-first responsive design.
6. **Code quality:** Keep functions small. Abstract complex logic into hooks or utility functions in `lib/`. Comment only the why the code cannot show.

## UI rules (mandatory)

Read the UI rules in [`AGENTS.md`](../AGENTS.md#ui-rules-mandatory) and [`docs/ui/`](../docs/ui/README.md) before any UI work; they win over this file. The design is **Langit Malang**: a calm reading page after joshpuckett.me, in light and dark, set in one clean sans (Onest), with a painted sky in the footer. The jest test `src/__tests__/unit/lib/ui-gate.test.ts` enforces it in CI through `bun run test`. The essentials:

- Every visitor page uses `BaseLayout`: the handle "@rizkyhaksono" with a short rule under it at the top, one 36rem column (`width="wide"` on `/tools` and `/chat`), and the Langit Malang footer at the bottom. No sky at the top, no sticky or translucent header.
- Prose in `text-muted-foreground`; names, titles and links in `text-foreground` (links through `InkLink`). Lists are plain rows (`LedgerList`, `LedgerRow`): a title with one muted line under it, no boxes, rules or hover backgrounds.
- Colours only from the token classes; no hex, palette colours or `dark:` classes. Blue (`sky`, `sky-wash`) only in the footer sky and the text selection. The footer's grass greens are an illustration-only exception that lives in the `.sky` block of `globals.css`.
- Sizes only from the `fontSize` keys (body 15/24, article prose 16/28, section labels 15/24 and page titles 24/32 at weight 500); weights 400 and 500 only; no `uppercase`, `tracking-[…]` or `text-[Npx]`. No serif, no handwritten face.
- Radii only on real tiles and images (`rounded-2xl`) and on controls; no `rounded-[…]`. No dividers except the rule under the handle and the hairline inside the footer.
- No shadows anywhere: floating layers (dialog, sheet, menu, select, toast, hover tip) are set apart by a hairline border only. No blur anywhere; no gradients outside `globals.css` and `sky.tsx`.
- No motion libraries (framer-motion, `motion`, GSAP, Lenis). The footer sky plays at once; its pause toggle stays visually hidden until keyboard focus, phones get a still scene, and every animation stops under reduced motion.
- Copy in sentence case with plain verbs; no em dash in UI strings, no generic CTAs, no buzzwords.
- Umami: `data-umami-event` only on `<button>` and external `target="_blank"` links; internal links use `data-track`.

## Behavior

- Always consider the existing project architecture before suggesting big changes.
- Read/update `prd/feature.md` and `prd/progress.md` for tracked work.
- Prioritize making code accessible (visible focus, ARIA roles, keyboard navigation).
- Ensure error handling is robust (use early returns to fail fast).
- Run `bunx tsc --noEmit` and `bun run test` (includes the UI gate) before claiming completion.
