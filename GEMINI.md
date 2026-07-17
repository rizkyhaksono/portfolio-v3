# Gemini Instructions for Portfolio v3

This file mirrors [`.geminirules`](./.geminirules) for tools that look for `GEMINI.md`.

> Canonical cross-agent instructions: [`AGENTS.md`](./AGENTS.md)  
> UI design system: [`docs/ui/README.md`](./docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. You must produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- Next.js 15+ (App Router) + React 19
- TypeScript (strict mode)
- Styling: Tailwind CSS + shadcn/ui
- Testing: Vitest + React Testing Library + MSW
- Package Manager: npm

## Architectural Guidelines

1. **AI Instruction Context:** Prefer [`AGENTS.md`](./AGENTS.md) as the shared source of truth. Related files:
   - **All agents**: `AGENTS.md`
   - **Gemini**: `.geminirules` / `GEMINI.md`
   - **Claude**: `CLAUDE.md` and `.claude/`
   - **Cursor**: `.cursorrules` and `.cursor/rules/`
   - **Copilot**: `.github/copilot-instructions.md`
   - **UI docs**: `docs/ui/`
2. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files requiring state, hooks, interactivity, or browser APIs.
3. **Component Organization:**
   - Routes belong in `app/`.
   - Reusable UI elements belong in `components/ui/`.
   - Feature-specific code belongs in `components/[feature]/` or `app/_components/`.
4. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
5. **Styling:**
   - Use Tailwind utility classes.
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Maintain mobile-first responsive design.
6. **Code Quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. Do not write superfluous comments. Let variables and function names document themselves.

## UI Layout Consistency (mandatory)

Monochrome, square, hairline borders.

- Docs: [`docs/ui/README.md`](./docs/ui/README.md)
- Rule: `.cursor/rules/ui-layout-consistency.mdc`
- Tokens: `src/lib/design-system.ts`

Surfaces (only three):

- solid → `Card` / `FeatureCard` / `Surface`
- glass → `MacWindow` (chrome only)
- inset → `Surface variant="inset"`

Page shell: `BaseLayout` → `PageBody` → `SectionHeading` → content.

Never invent glass content cards or extra padding inside BaseLayout. Prefer `PageSection` for `mt-10` blocks.

Platform shells: [`docs/ui/platforms.md`](./docs/ui/platforms.md).

## Development Workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Analyze existing architecture and patterns before writing code.
- Always implement robust error handling (early returns, fail fast).
- Prioritize security (validate input at boundaries) and accessibility (keyboard nav, ARIA labels).
- Run `npx tsc --noEmit` before claiming completion.
