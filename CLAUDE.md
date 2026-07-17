# Claude Instructions for Portfolio v3

> Canonical cross-agent instructions: [`AGENTS.md`](./AGENTS.md)  
> UI design system: [`docs/ui/README.md`](./docs/ui/README.md)

You are an expert full-stack TypeScript engineer working on this Next.js project. You must produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 15+** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest + React Testing Library + MSW
- **Package Manager**: npm

## Architectural Guidelines

1. **AI Instruction Context (Multiple Agents):** This project uses multiple AI assistants. Prefer [`AGENTS.md`](./AGENTS.md) as the shared source of truth. Platform files:
   - **All agents**: `AGENTS.md`
   - **Claude**: `CLAUDE.md` and `.claude/` directory
   - **Cursor**: `.cursorrules` and `.cursor/rules/*.mdc`
   - **Gemini**: `.geminirules` / `GEMINI.md`
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
6. **Code Quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. Do not write superfluous comments. Let variable and function names document themselves.

## UI Layout Consistency (mandatory)

Design language: monochrome, square (radius 0), hairline borders.

- Full agent rule: `.cursor/rules/ui-layout-consistency.mdc`
- Docs: [`docs/ui/README.md`](./docs/ui/README.md)
- Tokens: `src/lib/design-system.ts`

**Three surface dialects only:**

1. **solid** — `Card`, `FeatureCard`, `Surface variant="solid"` for content boxes
2. **glass** — `MacWindow` / `Surface variant="glass"` for window chrome only
3. **inset** — `Surface variant="inset"` for nested rows and sidebar blocks

**Page recipe:** `BaseLayout` → `PageBody` → `SectionHeading` → content (`MacWindow` for tools/lists, solid cards for content).

**Do not:**

- Invent glass content cards (`border-white/10`, `bg-white/5`, `backdrop-blur-md`, `hover:-translate-y`)
- Stack extra `px-4` / `lg:px-0` inside BaseLayout
- Use `neutral-*`, raw hex, or `max-w-8xl` (undefined)
- Copy-paste Mac chrome — use `MacWindow` (`backdrop={false}` when DnD needs it)

**Prefer:** `PageSection`, `PageBody`, `SectionHeading`, `Eyebrow`, `Chip`, `StatStrip`.

Shells by platform: [`docs/ui/platforms.md`](./docs/ui/platforms.md).

## Development Workflow

- Read `prd/feature.md` and `prd/progress.md` before feature work; update progress after tasks.
- Before modifying code, always look at existing patterns (especially UI primitives).
- Validate input at boundaries; fail fast; robust error handling.
- Make UI accessible via keyboard nav and accurate ARIA attributes.
- Run `npx tsc --noEmit` before claiming completion.
