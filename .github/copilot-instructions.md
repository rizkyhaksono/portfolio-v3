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

Read the UI rules in [`AGENTS.md`](../AGENTS.md#ui-rules-mandatory) and [`docs/ui/`](../docs/ui/README.md) before any UI work; they win over this file. The design is **Langit Malang**: calm, Apple-like, light and dark, one font family (Onest). The jest test `src/__tests__/unit/lib/ui-gate.test.ts` enforces it in CI through `bun run test`. The essentials:

- Colours only from the token classes; no hex, palette colours or `dark:` classes. Blue (`sky`, `sky-wash`) only for the sky band and the `Marker`.
- Sizes only from the `fontSize` keys; weights 400, 500, 600; no `uppercase`, `tracking-[…]` or `text-[Npx]`.
- Radii from the scale (fields and buttons `lg`, chips `md`, floating layers `xl`, tiles `2xl`, dots `full`); no `rounded-[…]`.
- `shadow-float` on floating layers only; the sticky header is the only blur; no gradients outside `globals.css` and the sky.
- No motion libraries (framer-motion, `motion`, GSAP, Lenis); every animation stops under reduced motion.
- Copy in sentence case with plain verbs; no em dash in UI strings, no generic CTAs, no buzzwords.
- Umami: `data-umami-event` only on `<button>` and external `target="_blank"` links; internal links use `data-track`.

## Behavior

- Always consider the existing project architecture before suggesting big changes.
- Read/update `prd/feature.md` and `prd/progress.md` for tracked work.
- Prioritize making code accessible (visible focus, ARIA roles, keyboard navigation).
- Ensure error handling is robust (use early returns to fail fast).
- Run `bunx tsc --noEmit` and `bun run test` (includes the UI gate) before claiming completion.
