# PRD — UI Layout Consistency

## 1. Overview
Unify Portfolio v3 UI so all boxes, sections, and page shells share one monochrome square design language. Encode the system in shared primitives and AI agent rules so future changes stay consistent.

## 2. System Goals
- One surface scale: solid (content), glass (window chrome), inset (nested rows)
- Shared page recipe: BaseLayout → PageBody → SectionHeading → content
- Eliminate ad-hoc glass cards, double padding, and undefined max-widths
- Document rules for Cursor, Claude, Gemini, and Copilot

## 3. Features

### 3.1 Design tokens
- `src/lib/design-system.ts` exports `SURFACE`, `PAGE_WIDTH`, `SECTION_SPACING`

### 3.2 Primitives
- `Surface` — solid / glass / glass-static / inset
- `PageSection` — mt-10 + optional SectionHeading
- `PageBody` — width presets (default / prose / article / wide)
- `MacWindow.backdrop` — disable blur for DnD pages

### 3.3 Migrations
- Glass content cards (stats, duolingo, monkeytype, spotify) → solid
- Raw bordered divs → Surface / Card
- Media card hover unified to `hover:border-foreground/20`
- BaseLayout padding fix (container only)

### 3.4 Agent rules
- `.cursor/rules/ui-layout-consistency.mdc` (always apply)
- Sync `.cursorrules`, `CLAUDE.md`, `.geminirules`, `.github/copilot-instructions.md`

## 4. Out of Scope
- Full Signal page restyle (documented outlier)
- Admin shell redesign (keep separate; reuse solid surfaces)
