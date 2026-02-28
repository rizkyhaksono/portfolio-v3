# GitHub Copilot Instructions

You are an expert full-stack TypeScript engineer working on this Next.js project. Produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 15+** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Package Manager**: npm

## Architectural Guidelines

1. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files that require state, hooks, interactivity, or browser APIs.
2. **Component Organization:**
   - Pages and layouts go in `app/`.
   - Reusable UI elements go in `components/ui/`.
   - Feature-specific code goes in `components/[feature]/`.
3. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
4. **Styling (Tailwind & shadcn/ui):**
   - Rely solely on Tailwind utility classes.
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Ensure a mobile-first responsive design.
5. **Code Quality:** Keep functions small. Abstract complex logic into hooks or utility functions in `lib/`. Avoid superfluous comments. Let the variable and function names self-document the code.

## Behavior

- Always consider the existing project architecture before suggesting big changes.
- Prioritize making code accessible (ARIA roles, keyboard navigation).
- Ensure error handling is robust (use early returns to fail fast).
