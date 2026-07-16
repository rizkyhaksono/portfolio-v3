# Portfolio v3 — UI Layout Consistency

*Last Updated: 2026-07-16 — AGENTS.md + full UI docs for all platforms*

---

## Project Overview
**Goal:** Make every visitor/user/admin content box use the same layout language (solid / glass / inset), and lock the pattern into Cursor/Claude/Gemini/Copilot/AGENTS rules so future work stays consistent.
**Success Criteria:** No glass content cards; shared primitives used; all AI platforms + `docs/ui/` document the system.

---

## Progress Summary

### Overall Status: 100% Complete (docs + rules)
- **Audit**: COMPLETED — mapped surface dialects and page-shell drift
- **Primitives**: COMPLETED — `SURFACE` tokens, `Surface`, `PageSection`, `PageBody`, `MacWindow.backdrop`
- **Migrations**: COMPLETED — glass stats/contrib cards → solid; education/visitor-panel/status/feedback → Surface; media card hover unified
- **Rules**: COMPLETED — `.cursor/rules/ui-layout-consistency.mdc` + synced AI instruction files
- **Docs**: COMPLETED — `AGENTS.md`, `GEMINI.md`, `docs/ui/*` (design-system, surfaces, page-shell, components, platforms)
- **Remaining (optional code)**: move stats/roadmap BaseLayout into `layout.tsx`; restyle legal/changelog onto BaseLayout; Signal stays outlier

---

## Feature Implementation Status

### COMPLETED
- Design tokens module: `src/lib/design-system.ts`
- Primitives: `surface.tsx`, `page-section.tsx`, `page-body.tsx`
- BaseLayout: removed double horizontal padding
- MacWindow: `backdrop` prop; tracker uses it instead of duplicated chrome
- Migrated glass → solid: site-stats, duolingo, monkeytype, spotify
- Migrated ad-hoc boxes → Surface: education, visitor-panel, status rows, leetcode section, admin feedback, stats PlatformCard
- Media cards: blog / blog-medium / project hover → `hover:border-foreground/20`
- Agent docs: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.geminirules`, `GEMINI.md`, Copilot, `.cursor/rules/agents-index.mdc`
- UI docs: `docs/ui/README.md` + design-system / surfaces / page-shell / components / platforms

### TODO (non-blocking)
- Route hygiene: stats/roadmap BaseLayout placement
- Legal + changelog join BaseLayout or documented StandaloneLayout
- Home sections gradually adopt `PageSection`

---

## Key Code Locations
- Tokens: `src/lib/design-system.ts`
- Primitives: `src/components/ui/surface.tsx`, `page-section.tsx`, `page-body.tsx`, `mac-window.tsx`
- Rule: `.cursor/rules/ui-layout-consistency.mdc`
- Agents: `AGENTS.md`
- UI docs: `docs/ui/`
