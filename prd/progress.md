# Portfolio v3 - Progress Tracker

*Last Updated: 2026-08-18 (GitHub contribution calendar horizontal scroll)*

---

## Project Overview
**Goal:** Keep the public portfolio accurate (Senior AI Engineer positioning) and visually consistent (solid / glass / inset surfaces, square chips) so recruiters and agents see one coherent system on desktop and mobile.
**Success Criteria:** About/Intro/SEO say Senior AI Engineer from `JOB_TITLE`; leftover pill controls on visitor tools are square; downloader and intro wrap cleanly on small screens.

---

## Progress Summary

### Overall Status: 100% Complete (current tracks)
- **About Me refresh**: ✅ COMPLETED — Senior AI Engineer @ Sarana AI copy on About + Intro + SEO
- **UI layout consistency**: ✅ COMPLETED — shared surfaces, migrations, agent/UI docs
- **DeepSource JavaScript**: ✅ COMPLETED — nesting / imports / HTML preview issues fixed
- **Senior AI + square/mobile pass**: ✅ COMPLETED — `JOB_TITLE` constant, square tool chips, mobile wrap
- **GitHub contribution calendar overflow**: ✅ COMPLETED — heatmap scrolls horizontally; newest weeks visible

---

## Feature Implementation Status

### COMPLETED

#### About Me (HR-ready Senior AI Engineer)
- ✅ **About section description** - COMPLETED (2026-08-13)
  - Lead-in uses `JOB_TITLE` (“Senior AI Engineer at Sarana AI…”)
  - Production LLM/RAG/MCP/AWS, Next.js/Go/Python, UMM Informatics Cum Laude 3.91/4.00
  - File: `src/app/_components/about/index.tsx`
- ✅ **Intro hero bio + roles** - COMPLETED (2026-08-13)
  - Roles / eyebrow / Focus stat / bio lead-in all read `JOB_TITLE`
  - File: `src/app/_components/intro/index.tsx`
- ✅ **Centralized title constant** - COMPLETED (2026-08-13)
  - `JOB_TITLE` in `src/commons/constants/author.ts`; `authors.*.position` points at it
  - `MetadataConstants.jobTitle`, `pageTitle`, `ogTitle`, `ogPersonTitle`
  - JSON-LD `jobTitle`, root layout titles, OG image route, manifest, terminal `whoami`
  - Visitor/user/auth layout Open Graph titles use `MetadataConstants.ogPersonTitle`

#### Square chips + mobile (visitor tools)
- ✅ **Downloader** - COMPLETED (2026-08-13)
  - Platform selector: square `Button` `size="sm"` (`default` vs `outline`), `flex-wrap` + `min-w-0`
  - URL + Download stack on small screens (`flex-col sm:flex-row`); Download `w-full sm:w-auto`
  - Error icon wrap: `Surface variant="inset"` (square); spinner stays `rounded-full`
  - File: `src/app/(visitor)/tools/_components/downloader-tab.tsx`
- ✅ **Tools pill tags** - COMPLETED (2026-08-13)
  - Pokémon type tags: square (`rounded-none`); progress bars stay circular
  - Star Wars `#id` overlay: square; rocket avatar circle unchanged
  - Ask-resume sample prompts: square outline `Button`; mobile FAB stays circular
- ✅ **Mobile wrap** - COMPLETED (2026-08-13)
  - Intro typing row + socials: `min-w-0` / `flex-wrap`
  - StatStrip: `min-w-0` + `break-words` so “Senior AI Engineer” wraps
  - Tools aside: `min-w-0`; 2-col nav kept; MacWindow already avoids `overflow-hidden`

#### GitHub contribution calendar overflow
- ✅ **Horizontal scroll + newest week** - COMPLETED (2026-08-18)
  - Replaced `overflow-hidden` on month labels and week grid with one `overflow-x-auto` scroller (`w-max` inner, week columns `shrink-0`)
  - `useLayoutEffect` pins `scrollLeft` to the right so the current streak is visible on mobile
  - `BaseLayout` main + flex row get `min-w-0` so the heatmap can shrink instead of being clipped
  - Files: `src/app/_components/contribution/github-calender.tsx`, `src/components/layout/base-layout.tsx`

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

### Out of scope (unchanged)
- Supabase career/education rows (DB-backed titles)
- Owner-profile API `about` field
- Admin dashboard copy
- `/signal` marketing experiment
- Terminal overlay visual chrome (copy only)

---

## Key Code Locations
- **Job title constant:** `src/commons/constants/author.ts` (`JOB_TITLE`)
- **Metadata:** `src/commons/constants/metadata.ts`
- **About section:** `src/app/_components/about/index.tsx`
- **Intro section:** `src/app/_components/intro/index.tsx`
- **Downloader:** `src/app/(visitor)/tools/_components/downloader-tab.tsx`
- **GitHub calendar:** `src/app/_components/contribution/github-calender.tsx`
- **Tokens:** `src/lib/design-system.ts`
- **Primitives:** `src/components/ui/surface.tsx`, `page-section.tsx`, `page-body.tsx`, `mac-window.tsx`
- **Rule:** `.cursor/rules/ui-layout-consistency.mdc`
- **Agents:** `AGENTS.md`
- **UI docs:** `docs/ui/`

### Source of truth for copy
- Public LinkedIn: https://www.linkedin.com/in/rizkyhaksono
