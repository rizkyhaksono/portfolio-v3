# Claude Instructions for Portfolio v3

You are an expert full-stack TypeScript engineer working on this Next.js project. You must produce production-ready code that follows modern Next.js App Router patterns and best practices.

## Tech Stack

- **Next.js 15+** (App Router) + React 19
- **TypeScript** (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest + React Testing Library + MSW
- **Package Manager**: npm

## Architectural Guidelines

1. **AI Instruction Context (Multiple Agents):** Note that this project uses multiple AI assistants. For detailed rules and specific use-cases, refer to:
   - **Claude**: `CLAUDE.md` and `.claude/` directory
   - **Cursor**: `.cursorrules` and `.cursor/rules/*.mdc`
   - **Gemini**: `.geminirules`
   - **Copilot**: `.github/copilot-instructions.md`
2. **React Server Components (RSC):** Default to Server Components. Add `'use client'` only at the top of files requiring state, hooks, interactivity, or browser APIs.
3. **Component Organization:**
   - Routes belong in `app/`.
   - Reusable UI elements belong in `components/ui/`.
   - Feature-specific code belongs in `components/[feature]/`.
4. **TypeScript:** Use explicit `interface` or `type` for all props and state. Avoid using `any` completely.
5. **Styling:**
   - Use Tailwind utility classes.
   - Use the `cn()` utility from `@/lib/utils` for conditional class merging.
   - Maintain mobile-first responsive design.
6. **Code Quality:** Keep functions small. Abstract complex or repetitive logic into hooks or `lib/`. Do not write superfluous comments. Let variable and function names document themselves.

## Development Workflow

- **When analyzing requirements:** Before modifying code, always look at existing patterns in the project (especially existing UI components or custom hooks).
- **Security & Error Handling:** Validate input at boundaries, and fail fast. Implement robust error handling strategies.
- **Accessibility:** Make all UI enhancements accessible via keyboard nav and accurate ARIA attributes.
