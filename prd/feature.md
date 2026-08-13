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

---

## 5. Track — Senior AI Engineer copy + square/mobile UI

### 5.1 Copy
Promote visitor-facing title from “AI Engineer” to **Senior AI Engineer**. Keep Sarana AI, stack, and UMM credentials.

- Centralize `JOB_TITLE = "Senior AI Engineer"` in `src/commons/constants/author.ts`
- Point `authors.*.position` and `MetadataConstants.jobTitle` / page / OG titles at that constant
- Update hero, about, SEO/chrome (layouts, JSON-LD, OG image, manifest, terminal `whoami`)
- Leave Supabase career rows and admin dashboard copy unchanged

### 5.2 Square chips (visitor tools + ask-resume)
- Downloader platform selector: square `Button` (`default` / `outline`, `size="sm"`) — no `rounded-full` pills
- Pokémon type tags and Star Wars `#id` overlay: square, not pills
- Ask-resume sample prompts: square `Button` outline chips
- Keep circular: avatars, status dots, Mac traffic lights, progress bars, switch thumbs, mobile FAB, spinners

### 5.3 Mobile
- Downloader: stack URL + Download (`flex-col sm:flex-row`); Download `w-full sm:w-auto`
- Platform chips: `flex-wrap` + `min-w-0` so labels like “X (Twitter)” wrap instead of overflowing
- Intro typing/socials: `min-w-0` / `flex-wrap`; StatStrip values wrap on small screens
- Tools shell: keep 2-col mobile nav; MacWindow body `p-3` must not clip sticky search

### 5.4 Out of scope (this track)
- `/signal` marketing experiment
- Admin login chrome
- Terminal overlay visual chrome (copy only)
- Career titles stored in Supabase
