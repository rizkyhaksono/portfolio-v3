# Portfolio v3 - Progress Tracker

*Last Updated: 2026-10-20 (Drafting sheet rebrand, release 1.6.0)*

---

## Project Overview
**Goal:** Keep the public portfolio accurate (Senior AI Engineer positioning) and visually consistent (the Drafting sheet: near-black ink on off-white paper with one orange mark, IBM Plex, frame / inset / lift surfaces, per `docs/ui/`) so recruiters and agents see one coherent system on desktop and mobile.
**Success Criteria:** About/Intro/SEO say Senior AI Engineer from `JOB_TITLE`; leftover pill controls on visitor tools are square; downloader and intro wrap cleanly on small screens.

---

## Progress Summary

### Overall Status: 100% Complete (current tracks)
- **About Me refresh**: ✅ COMPLETED — Senior AI Engineer @ Sarana AI copy on About + Intro + SEO
- **UI layout consistency**: ✅ COMPLETED — shared surfaces, migrations, agent/UI docs
- **DeepSource JavaScript**: ✅ COMPLETED — nesting / imports / HTML preview issues fixed
- **Senior AI + square/mobile pass**: ✅ COMPLETED — `JOB_TITLE` constant, square tool chips, mobile wrap
- **GitHub contribution calendar overflow**: ✅ COMPLETED — heatmap scrolls horizontally; newest weeks visible
- **Editorial simplicity pass**: ✅ COMPLETED — calmer long-form reading, no animated backgrounds or visitor panel, compact navigation, visible theme control, and OS chrome removed
- **PR #25 quality remediation**: ✅ COMPLETED — Copilot review comments and introduced DeepSource issues addressed
- **SEO canonical domain**: ✅ COMPLETED (code) — `getSiteUrl()` + all crawler signals default to `https://natee.my.id`; **deploy:** rotate `DOMAIN` secret in GitHub/Azure and submit GSC sitemap (manual)
- **Runtime cleanup and dark UI refinement**: ✅ COMPLETED — compiler removed, dark palette refined, system status promoted, square controls/toasts enforced
- **Redesign P1 D+E (AI fix web, security/privacy)**: ✅ COMPLETED (deployed 2026-10-17) — AI proxies guarded (502/413/timeouts), OCR client downscale + HEIC, inline AI errors + `ai-error` event, server code blocks; Umami tracker gated + `umamiBeforeSend` token scrub, recorder gated/sampled, `chat_user` writes removed, logout revokes the API session, forgot/reset hidden, image hosts allow-listed
- **One-ink redesign P1 (foundation, shell, home)**: ✅ COMPLETED (deployed 2026-10-19) — ink/paper tokens, Literata, running head + Contents + colophon with the Hollar engraving band, pinned wordscroll masthead, sticky skills deck, Umami readers + live visitors, ISR home
- **Printer's mark logo**: ✅ COMPLETED, replaced on 2026-10-20 by the RH monogram (see the Drafting sheet rebrand below)
- **One-ink redesign P2 (visitor pages)**: ✅ COMPLETED — blog (ledger + ArticleShell, slug lookup, letters), project, roadmap, certificates, changelog, stats (InkChart, most read), tools (cabinet, anime removed; restored 2026-10-20), tracker, chat, legal, feeds/sitemap/search index, OG/certificate images, content MDX
- **One-ink redesign P3 (/ai, profile, auth, admin)**: ✅ COMPLETED — Etan AI cabinet + correspondence, AuthShell, profile cards, admin spine/dashboard/analytics (InkChart, events ledger)/CRUD ledgers; recharts, react-icons, date-fns, motion removed; grep gate clean over `src/` and `content/`
- **Spotify + weather widgets**: removed (routes, services, scripts, docs, env)
- **Redesign P1 review fixes**: ✅ COMPLETED (2026-10-17, not deployed) — masthead fits 1280x600 (svh caps, plate strip takes the remaining height), 404 inside BaseLayout + `not-found` event, error.tsx on NotFoundView, quartile heatmap levels, token durations on Button/Tabs, site-theme Turnstile, `[id]` scroll-margin instead of html scroll-padding, Contents sheet lazy-loaded, wordscroll sr-only sentence, legacy `min-height` media query, 44px inputs/links, terminal on Radix Dialog, Umami failures never cached, spotify/weather removed, blog covers moved to `art-src/`, speckle mask, hex tokens only in `src/lib/print-hex.ts`
- **Redesign P1 H (governance docs)**: ✅ COMPLETED (2026-10-17) — agent files and `docs/ui/` rewritten for the one-ink system; monochrome / grayscale / old-font / `MacWindow` mandates removed; `docs/ui/` declared source of truth; grep gate documented
- **Owner requests after the rebrand (2026-10-20)**: ✅ COMPLETED — anime generator restored in Tools (images by category and quotes, `PlateFigure tone="color"`, inline errors, `anime-generate` / `anime-quote`); default theme is Light (`defaultTheme="light"`, System still offered); changelog 1.6.0 wording corrected
- **Drafting sheet rebrand (release 1.6.0)**: ✅ COMPLETED (2026-10-20, on `redesign/phase-1`, deploy pending) — RH monogram, IBM Plex, black and white with one orange mark, grayscale plates with crop marks, portrait in the home hero, title-block colophon, light / dark themes, OG and certificate images in Plex; Lautan Pasir retired; agent files and `docs/ui/` rewritten with three grep gates

---

## Feature Implementation Status

### COMPLETED

#### Redesign P1 H — governance docs (2026-10-17)
- ✅ `docs/ui/{README,design-system,surfaces,components,page-shell,platforms}.md` rewritten: ink / paper tokens with Paper and Night values and measured contrast, Literata roles and scale, three surfaces (frame, inset, lift), page patterns table, motion tiers and banned list, Umami event rules and table, grep gate
- ✅ `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.github/copilot-instructions.md`, `.cursor/rules/ui-layout-consistency.mdc`, `.cursor/rules/nextjs-development.mdc` point at `docs/ui/` as source of truth and carry the same summary; package manager is bun everywhere, tests are Jest + Playwright
- ✅ README styling passage and `prd/feature.md` (§9, superseded notes on §1–3, §5.2, §8) updated
- ✅ `.cursorrules` was brought up to date in the Drafting sheet rebrand; `.cursor/rules/agents-index.mdc` only indexes the files

#### Drafting sheet rebrand (2026-10-20, release 1.6.0)
- ✅ Tokens: `paper`, `ink`, `ink-soft`, `rule`, `rule-strong`, `tint` re-valued (light #F7F7F5 / #141414, dark #141414 / #F2F2EE), plus `mark`, `mark-text`, `on-mark`; `--ring` is `mark`; `contrast.test.ts` guards the floors
- ✅ Type: IBM Plex Sans (variable) and Plex Mono via `next/font`, no italic, headings at weight 600; Literata removed
- ✅ Logo: RH monogram `<Logo variant="mini" | "mark" | "tile">`; `scripts/logo/make.mjs` regenerates icons, `public/brand/*` and `og-mark.svg`; `src/app/favicon.ico` keeps its path for the Swarm healthchecks
- ✅ Plates: `PlateFigure` with an ink frame, orange crop marks and grayscale photos (`tone="color"` for site cards, OCR upload and sprites); grain, speckle, engraving, duotone filters and the fleuron removed
- ✅ Home hero carries the portrait (right column from 1024px, after the lead line below); About is text only; the colophon is a title block with the latest changelog revision; 404, error and auth show the large `mark` logo
- ✅ Theme labels are Light / Dark / System; OG and certificate images use IBM Plex Sans and `v=2` cache busting
- ✅ Governance: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.cursorrules`, Copilot, `.cursor/rules/*.mdc`, `docs/ui/*`, `README.md` and `prd/feature.md` (§10) rewritten; gate 2 gains `-I` and drops the `font-mono` ban; gate 3 (regression) added; all three print nothing over `src` and `content`
- ✅ Changelog 1.6.0 "Drafting sheet"; `package.json` 1.6.0
- ⏳ Release checks and deploy (a push to `main`): build, local smoke, e2e, screenshots at 375, 768 and 1280

#### Runtime cleanup and dark UI refinement
- ✅ Removed compiler UI, frontend integration code, backend execution route, and Piston/Paiza environment configuration
- ✅ Invalid or obsolete tool tabs now fall back to Pokémon instead of rendering an empty panel
- ✅ Adopted the up2dul.dev dark grayscale hierarchy through semantic theme tokens (`#161616` background, `#1b1b1b` surfaces)
- ✅ Moved System Status below overview metrics and improved loading, failure, duplicate-service, refresh, and responsive states
- ✅ Reworked scroll-to-top as a square 44px control with reduced-motion support and safe overlay stacking
- ✅ Standardized toast rendering on Sonner, made toast chrome square, and removed the unused Radix toast implementation
- ✅ Removed remaining pill treatment from shared clap and AI action controls; preserved semantic circular indicators and avatars

#### PR #25 quality remediation
- ✅ Restored valid list semantics in the sidebar and stable React keys for blog tags
- ✅ Preserved editorial MDX classes when markdown nodes provide custom classes
- ✅ Split deeply nested login, roadmap, stats, and sidebar JSX into focused components
- ✅ Reconciled `MacWindow`/glass/backdrop documentation and removed the obsolete tracker option
- ✅ Added documentation for exported blog-card components

#### Editorial simplicity and reading experience
- ✅ Blog index uses quiet single-column editorial rows for DEV, Medium, and on-site posts
- ✅ Blog articles use a focused reading measure, larger type, calmer metadata, square media, and improved markdown rhythm
- ✅ Legacy `MacWindow` renders as a square editorial panel without traffic-light controls or glass blur across Projects, Tools, Stats, Status, Tracker, AI, Blog, and Roadmap
- ✅ Animated grid/gradient backgrounds removed from the shared shell, Roadmap, and admin login
- ✅ Visitor/IP/weather panel removed from desktop and mobile layouts
- ✅ Left navigation compacted; theme switch is now a clearly labeled Appearance control above the fold
- ✅ Roadmap animation and rounded decorative card treatment removed; Changelog now shares the main editorial shell
- ✅ Shared page, card, panel, section, and admin spacing tightened; Roadmap course art compressed to a small label strip
- ✅ Admin shell/login flattened to the same monochrome, square language
- ✅ Twitter removed from public social links
- ✅ Chat now scrolls only its message pane instead of moving the document, and uses a focused no-footer viewport

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

#### SEO canonical domain (`natee.my.id`)
- ✅ **Site URL helper** - COMPLETED (2026-10-02)
  - `src/lib/site-url.ts`: `CANONICAL_SITE_ORIGIN`, `getSiteUrl()`, `getMetadataBaseUrl()`; warns if `DOMAIN` still contains `nateee.com`
  - `robots.ts`, `sitemap.ts`, `feed.xml`, `changelog.xml` use helper (apex default, not `www`)
  - `MetadataConstants`, all route `metadataBase`, root layout, JSON-LD (`sameAs` social only)
  - Project/blog page `alternates.canonical` + `openGraph.url` per path
  - `.env.example` + README `DOMAIN=https://natee.my.id`
- ⏳ **Production secrets** - MANUAL after merge
  - GitHub Actions secret `DOMAIN` and Azure app setting → `https://natee.my.id`
  - Redeploy; verify `curl` robots/sitemap/HTML; Google Search Console sitemap + URL inspection

#### UI Layout Consistency
- ✅ Design tokens: `src/lib/design-system.ts`
- ✅ Primitives: `surface.tsx`, `page-section.tsx`, `page-body.tsx`
- ✅ BaseLayout: removed double horizontal padding
- ✅ MacWindow: solid editorial panel; deprecated `backdrop` prop retained only for call-site compatibility
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

### Performance + compact editorial pass (2026-09-10)

- ✅ Removed continuous page animations, scroll progress, dock magnification, and deferred non-critical global utilities.
- ✅ Homepage now streams remote sections independently and fetches contribution sources in parallel.
- ✅ Removed the rotating “I’m a …” line and replaced the 153-item skill expansion with four focused production groups.
- ✅ Fixed logged-in profile truncation, Duolingo XP overlap, mobile career/education spacing, and initial mobile GitHub calendar position.
- ✅ Rebuilt the admin dashboard as a monochrome editorial data view; Supabase is first and tables paginate at 10 rows.
- ✅ Simplified appearance controls to an icon, label, and switch without a surrounding card.
- ✅ Reworked changelog layout and all release-note copy; removed decorative remote images and promotional filler.
- ✅ Unified DEV.to, Medium, and portfolio articles into one chronological feed with visible source labels.
- ✅ Added a curated featured-work section for Info Pangan Jakarta, Adaro Water Solution, and eCRF Biofarma above the remaining project archive.

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
- **Canonical site URL:** `src/lib/site-url.ts` (`getSiteUrl`, `getMetadataBaseUrl`)
- **About section:** `src/app/_components/about/index.tsx`
- **Intro section:** `src/app/_components/intro/index.tsx`
- **Downloader:** `src/app/(visitor)/tools/_components/downloader-tab.tsx`
- **GitHub calendar:** `src/app/_components/contribution/github-calender.tsx`
- **Tokens:** `src/lib/design-system.ts`
- **Primitives:** `src/components/ui/surface.tsx`, `page-section.tsx`, `plate-figure.tsx`, `logo.tsx`; `src/components/layout/title-block.tsx`
- **Rule:** `.cursor/rules/ui-layout-consistency.mdc`
- **Tokens (CSS):** `src/app/globals.css`, `tailwind.config.ts`, `src/lib/print-hex.ts`
- **Agents:** `AGENTS.md`
- **UI docs (source of truth):** `docs/ui/`

### Source of truth for copy
- Public LinkedIn: https://www.linkedin.com/in/rizkyhaksono
