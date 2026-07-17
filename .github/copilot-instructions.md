# GitHub Copilot Instructions

> Canonical cross-agent instructions: [`AGENTS.md`](../AGENTS.md)  
> UI design system: [`docs/ui/README.md`](../docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. Produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 15+** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest + React Testing Library + MSW
- **Package Manager**: npm

## Architectural Guidelines

1. Prefer [`AGENTS.md`](../AGENTS.md) as the shared source of truth across AI platforms.
2. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files that require state, hooks, interactivity, or browser APIs.
3. **Component Organization:**
   - Pages and layouts go in `app/`.
   - Reusable UI elements go in `components/ui/`.
   - Feature-specific code goes in `components/[feature]/` or `app/_components/`.
4. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
5. **Styling (Tailwind & shadcn/ui):**
   - Rely solely on Tailwind utility classes.
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Ensure a mobile-first responsive design.
6. **Code Quality:** Keep functions small. Abstract complex logic into hooks or utility functions in `lib/`. Avoid superfluous comments. Let the variable and function names self-document the code.

## UI Layout Consistency (mandatory)

Monochrome, square, hairline borders.

- Docs: [`docs/ui/README.md`](../docs/ui/README.md)
- Tokens: `src/lib/design-system.ts`
- Rule: `.cursor/rules/ui-layout-consistency.mdc`

Use only:

- **solid** — `Card`, `FeatureCard`, `Surface` for content
- **glass** — `MacWindow` for window chrome only
- **inset** — `Surface variant="inset"` for nested rows

Page recipe: `BaseLayout` → `PageBody` → `SectionHeading` → content.

Do not create glass content cards (`bg-white/5`, `backdrop-blur-md`, lift shadows) or add extra `px-*` inside BaseLayout. Prefer `PageSection` for section spacing.

Platform shells (visitor / user / admin / auth): [`docs/ui/platforms.md`](../docs/ui/platforms.md).

## Behavior

- Always consider the existing project architecture before suggesting big changes.
- Read/update `prd/feature.md` and `prd/progress.md` for tracked work.
- Prioritize making code accessible (ARIA roles, keyboard navigation).
- Ensure error handling is robust (use early returns to fail fast).
- Run `npx tsc --noEmit` before claiming completion.
