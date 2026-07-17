# Portfolio v3 - Progress Tracker

*Last Updated: 2026-07-17 (UI layout consistency + DeepSource fixes; About Me refresh retained from main)*

---

## Project Overview
**Goal:** Keep the public portfolio accurate (AI Engineer positioning) and visually consistent (solid / glass / inset surfaces) so recruiters and agents see one coherent system.
**Success Criteria:** About/Intro reflect Sarana AI role; all content boxes use shared layout primitives; AI platform docs + DeepSource stay green.

---

## Progress Summary

### Overall Status: 100% Complete (current tracks)
- **About Me refresh**: ✅ COMPLETED — AI Engineer @ Sarana AI copy on About + Intro
- **UI layout consistency**: ✅ COMPLETED — shared surfaces, migrations, agent/UI docs
- **DeepSource JavaScript**: ✅ COMPLETED — nesting / imports / HTML preview issues fixed

---

## Feature Implementation Status

### COMPLETED

#### About Me (HR-ready AI Engineer)
- ✅ **About section description** - COMPLETED (2026-07-16)
  - Removed undergraduate and web/mobile-only framing
  - New copy: AI Engineer at Sarana AI, production LLM/RAG/MCP/AWS, Next.js/Go/Python, UMM Informatics Cum Laude 3.91/4.00
  - File: `src/app/_components/about/index.tsx`
- ✅ **Intro hero bio + roles** - COMPLETED (2026-07-16)
  - Bio leads with LLMs, RAG, MCP, Sarana AI, Python/AWS/Next.js/Go
  - Roles: `AI Engineer`, `Cloud Enthusiast`, `Full-Stack Builder`
  - File: `src/app/_components/intro/index.tsx`

#### UI Layout Consistency
- ✅ Design tokens: `src/lib/design-system.ts`
- ✅ Primitives: `surface.tsx`, `page-section.tsx`, `page-body.tsx`
- ✅ BaseLayout: removed double horizontal padding
- ✅ MacWindow: `backdrop` prop; tracker uses it instead of duplicated chrome
- ✅ Migrated glass → solid: site-stats, duolingo, monkeytype, spotify
- ✅ Migrated ad-hoc boxes → Surface: education, visitor-panel, status rows, leetcode section, admin feedback, stats PlatformCard
- ✅ Media cards: blog / blog-medium / project hover → `hover:border-foreground/20`
- ✅ Agent docs: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.geminirules`, `GEMINI.md`, Copilot, `.cursor/rules/agents-index.mdc`
- ✅ UI docs: `docs/ui/README.md` + design-system / surfaces / page-shell / components / platforms
- ✅ DeepSource: JS-0415 / JS-C1003 / JS-0339 / JS-0440 resolved; check passing

### TODO (non-blocking)
- Route hygiene: stats/roadmap BaseLayout placement
- Legal + changelog join BaseLayout or documented StandaloneLayout
- Home sections gradually adopt `PageSection`

### Out of scope (unchanged from About Me track)
- Supabase career/education rows (DB-backed)
- Owner-profile API `about` field
- Footer / terminal / metadata (already AI Engineer)

---

## Key Code Locations
- **About section:** `src/app/_components/about/index.tsx`
- **Intro section:** `src/app/_components/intro/index.tsx`
- **Tokens:** `src/lib/design-system.ts`
- **Primitives:** `src/components/ui/surface.tsx`, `page-section.tsx`, `page-body.tsx`, `mac-window.tsx`
- **Rule:** `.cursor/rules/ui-layout-consistency.mdc`
- **Agents:** `AGENTS.md`
- **UI docs:** `docs/ui/`

### Source of truth for copy
- Public LinkedIn: https://www.linkedin.com/in/rizkyhaksono
