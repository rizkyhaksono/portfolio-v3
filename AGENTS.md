# AGENTS.md — Portfolio v3

Canonical instructions for **any** coding agent working in this repository (Cursor, Claude, Codex, Gemini, Copilot, and others). Platform-specific files may add tooling notes; when they conflict, prefer this file plus `.cursor/rules/*.mdc`.

You are an expert full-stack TypeScript engineer. Produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 15+** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest + React Testing Library + MSW
- **Package Manager**: npm

## AI Instruction Map

| Platform | Entry file | Extra |
|---|---|---|
| **All agents** | `AGENTS.md` (this file) | — |
| **Claude** | `CLAUDE.md` | `.claude/` |
| **Cursor** | `.cursorrules` | `.cursor/rules/*.mdc` |
| **Gemini** | `.geminirules` | — |
| **Copilot** | `.github/copilot-instructions.md` | — |
| **UI system** | `docs/ui/README.md` | `src/lib/design-system.ts` |

Always read `prd/feature.md` and `prd/progress.md` before starting feature work; update `prd/progress.md` after completing tasks.

## Architectural Guidelines

1. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files requiring state, hooks, interactivity, or browser APIs.
2. **Component Organization:**
   - Routes belong in `app/`.
   - Reusable UI elements belong in `components/ui/`.
   - Feature-specific code belongs in `components/[feature]/` or `app/_components/`.
3. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid `any`.
4. **Styling:**
   - Use Tailwind utility classes only (no inline styles unless unavoidable).
   - Use `cn()` from `@/lib/utils` for conditional class merging.
   - Mobile-first responsive design.
5. **Code Quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. No superfluous comments — names should be self-documenting.
6. **Package manager:** Use **npm** (not pnpm/bun/yarn) unless the user explicitly overrides.

## UI Layout Consistency (mandatory)

Design language: **monochrome, square (radius 0), hairline borders**.

- Full agent rule: `.cursor/rules/ui-layout-consistency.mdc`
- Human docs: [`docs/ui/README.md`](docs/ui/README.md)
- Tokens: [`src/lib/design-system.ts`](src/lib/design-system.ts)

### Three surface dialects only

1. **solid** — `Card`, `FeatureCard`, `Surface variant="solid"` for content boxes
2. **glass** — `MacWindow` / `Surface variant="glass"` for window chrome only
3. **inset** — `Surface variant="inset"` for nested rows and sidebar blocks

### Page recipe

```
BaseLayout(sidebar?, rightSidebar?)
  └─ PageBody width="default" | "prose" | "article" | "wide"
       └─ SectionHeading (as="h1" on page routes)
       └─ MacWindow? (tools / lists) OR Card / FeatureCard / Surface rows
```

### Do not

- Invent glass content cards (`border-white/10`, `bg-white/5`, `backdrop-blur-md`, `hover:-translate-y`)
- Stack extra `px-4` / `lg:px-0` inside BaseLayout
- Use `neutral-*`, raw hex, or `max-w-8xl` (undefined)
- Copy-paste Mac chrome — use `MacWindow` (`backdrop={false}` when DnD needs it)

### Prefer

`PageSection`, `PageBody`, `SectionHeading`, `Eyebrow`, `Chip`, `StatStrip`, `Surface`, `Card`, `FeatureCard`, `MacWindow`

## Shells by route group

| Group | Shell | Surfaces |
|---|---|---|
| Visitor / home | `BaseLayout` | solid + MacWindow chrome |
| User (profile, AI) | `BaseLayout` | solid |
| Admin | Admin sidebar + top header | solid Card / Surface |
| Auth | Centered form / split | solid Card |
| Outliers | `/signal`, terminal overlay | do not copy |

Details: [`docs/ui/platforms.md`](docs/ui/platforms.md)

## Development Workflow

1. Read `prd/feature.md` → `prd/progress.md` → existing patterns in code.
2. Prefer primitives over ad-hoc bordered `div`s.
3. Validate input at boundaries; fail fast; map errors cleanly.
4. Keep UI accessible (labels, roles, keyboard navigation).
5. Update `prd/progress.md` when a task is done.
6. Run typecheck before claiming completion (`npx tsc --noEmit`).

## Acceptance checklist (UI)

- [ ] Used `Card` / `FeatureCard` / `Surface` / `MacWindow` — no ad-hoc bordered box
- [ ] No glass classes on content cards
- [ ] No extra horizontal padding inside BaseLayout
- [ ] Width via `PageBody` when a max-width is needed
- [ ] Section titles via `SectionHeading`
- [ ] Colors from semantic tokens only
