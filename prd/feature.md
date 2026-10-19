# PRD — UI Layout Consistency

> **2026-10-17:** the monochrome / grayscale language described in §1–3, §5.2 and §8 is superseded by §9 (one-ink redesign).
> **2026-10-20:** §9's visual identity (Lautan Pasir) is in turn superseded by §10 (Drafting sheet). [`docs/ui/`](../docs/ui/README.md) is the source of truth for UI.

## 1. Overview
Unify Portfolio v3 UI so all boxes, sections, and page shells share one design language (since 2026-10-20: the Drafting sheet, near-black ink on off-white paper with one orange mark, see §10). Encode the system in shared primitives and AI agent rules so future changes stay consistent.

## 2. System Goals
- Three surfaces: frame (content), inset (nested rows), lift (floating layers only); glass is retired
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
- `MacWindow` — legacy-compatible solid editorial panel; `backdrop` is deprecated/no-op

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
- Keep circular: superseded by §9 (radius 0 everywhere; the radio dot is the only circle)

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

---

## 6. Track — GitHub contribution calendar overflow

The home heatmap was clipped on the right (newest weeks) because the grid used `overflow-hidden` and `main` in a flex row lacked `min-w-0`.

- Single `overflow-x-auto` scroller wrapping month labels + week columns (`w-max`, week columns `shrink-0`)
- Default scroll position: newest week (right edge)
- `main`/`flex` row: `min-w-0` so the scroller can actually shrink and scroll

---

## 7. Track — SEO canonical domain (`natee.my.id`)

Portfolio live at `https://natee.my.id`; legacy `nateee.com` is no longer owned. All crawler-facing signals must use the apex origin.

- `src/lib/site-url.ts`: `CANONICAL_SITE_ORIGIN`, `getSiteUrl()`, `getMetadataBaseUrl()`
- Wire robots, sitemap, RSS feeds, `MetadataConstants`, root/route `metadataBase`, JSON-LD
- Page canonicals for project detail and DEV blog articles
- `.env.example` / README: `DOMAIN=https://natee.my.id`
- **Deploy (manual):** GitHub secret + Azure app setting `DOMAIN=https://natee.my.id`, redeploy, GSC sitemap

Out of scope: `api.nateee.com` WebSocket/API host until backend migrates.

---

## 8. Track — Runtime cleanup and dark UI refinement

### 8.1 Compiler removal
- Remove compiler UI, client service, constants, and types
- Remove backend execution endpoint and Piston/Paiza configuration
- Fall back to the default tool when an obsolete compiler URL is opened

### 8.2 Dark palette (superseded by §10.2 Dark theme)
- The grayscale dark hierarchy is retired; dark mode is the same sheet reversed (off-white ink on near-black paper)

### 8.3 Stats and system status
- Place system health directly below overview metrics
- Use responsive service rows and explicit loading, degraded, and down states
- Prevent duplicate API rows and stale refresh responses

### 8.4 Square controls and toast
- Make scroll-to-top, toast surfaces/actions, AI controls, and clap controls square
- Circular exceptions are superseded by §9 (only the radio dot stays round)
- Standardize notifications on Sonner and remove unused Radix toast state

---

## 9. Track — One-ink redesign, "Lautan Pasir" (2026-10-17) — superseded by §10

> **Superseded by §10 (2026-10-20).** The cobalt ink, cream paper, Literata, riso grain, Hollar engraving band, "Night print" and caldera logo described here are retired and gated out by grep gate 3. What still holds from §9: radius 0, the three surfaces (§9.3), the page patterns, the motion tiers (§9.4), the Umami rules (§9.5) and the governance structure (§9.6). Its token values and type rules are history.

Redesign every page as one printed publication: one cobalt ink on cream paper, riso grain, Literata italic headings, radius 0, hairline rules, and a Wenceslaus Hollar engraving band (*Landscape with a Rider*, 1650, Rijksmuseum, public domain). Delivered in three phases: P1 shell, home, tokens, Umami foundation and production fixes; P2 visitor pages; P3 `/ai`, profile, auth and admin. Full spec: [`docs/ui/`](../docs/ui/README.md).

### 9.1 Tokens and type
- Six tokens as HSL triples in `src/app/globals.css`, exposed as Tailwind colours: `paper` #F3ECDC, `ink` #1E3C9E, `ink-soft`, `rule`, `rule-strong`, `tint`. shadcn names map onto them; `--radius: 0rem`.
- Literata (roman and italic) via `next/font/google`; Instrument Serif, Bricolage Grotesque, Inter and JetBrains Mono removed. System mono for machine text only.

### 9.2 Night print
- Same tokens flipped on `<html class="dark">`: cream ink on night paper #0D1433. No `dark:` classes. The default theme was the system until 2026-10-20; it is now Light (§10.2).

### 9.3 Surfaces and patterns
- Three surfaces: frame, inset, lift (lift = 1px ink and a `3px 3px 0` ink shadow on floating layers only). No gradients, glass, blur or soft shadows.
- Page patterns: Ledger, Article, Plates, Cabinet, Correspondence, Board, Figures, Admin, Auth, Profile card, Not found.
- `BaseLayout` becomes running head + Contents sheet + colophon; sidebars and `MacWindow` panels retire.

### 9.4 Motion
- Tier 0 native scroll and sticky layouts; tier 1 CSS scroll-driven home wordscroll and article reading hairline only. Parallax, marquees, typing effects, page transitions, fade-up sections, Lenis, GSAP and `motion` are banned.

### 9.5 Analytics
- Umami `data-umami-event` only on buttons and external `target="_blank"` links; internal links use `data-track`. Kebab-case events, no PII.

### 9.6 Governance
- Agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, Copilot, `.cursor/rules/*.mdc`) and `docs/ui/` rewritten so agents stop reverting to monochrome. `docs/ui/` is the source of truth.
- Grep gate (two commands in `docs/ui/README.md`) must print nothing on each phase's paths; the final run over `src` and `content` must be 0.

### 9.7 Status (2026-10-19)
- Phases 1–3 shipped on `redesign/phase-1`; every route uses a page pattern from `docs/ui/page-shell.md`.
- Logo: printer's mark of the Tengger caldera (`docs/ui/README.md` → Brand).
- Removed: Spotify and weather widgets, the anime tool (restored 2026-10-20, §10.10), `/signal`, recharts, motion, gsap, ogl, react-icons, date-fns.

---

## 10. Track — Drafting sheet rebrand (2026-10-20, release 1.6.0)

Total identity change after the owner rejected Lautan Pasir: the caldera logo was busy and the wrong concept for an AI engineer, the italic "Rh" monogram was weak, a horse engraving sat under the masthead, and the portrait was small and pushed to the far right. Direction: engineering drafting sheet. Black and white plus one accent. Scope: a reskin, so page structure and page patterns stay, except that the home hero gains the portrait. Spec: [`docs/superpowers/specs/2026-10-19-drafting-sheet-rebrand-design.md`](../docs/superpowers/specs/2026-10-19-drafting-sheet-rebrand-design.md). UI rules: [`docs/ui/`](../docs/ui/README.md).

### 10.1 Tokens and type
- Nine tokens as HSL triples in `src/app/globals.css`, exposed as Tailwind colours: `paper` #F7F7F5 / #141414, `ink` #141414 / #F2F2EE, `ink-soft`, `rule`, `rule-strong`, `tint`, plus `mark` #FF4F00 / #FF6326, `mark-text` and `on-mark`. shadcn names map onto them (`ring` is `mark`); `--radius: 0rem`. `src/__tests__/unit/lib/contrast.test.ts` guards the contrast floors.
- IBM Plex Sans (variable, normal style) and IBM Plex Mono (400 and 500) via `next/font/google`; Literata removed. No italic anywhere: `<em>`, `<i>` and `<cite>` are upright at weight 500, `<strong>` at 600. Headings are weight 600 on the size tokens.

### 10.2 Dark theme
- The same tokens flipped on `<html class="dark">`. Themes are named Light, Dark and System; the print-metaphor labels are gone. The default is Light (owner request, 2026-10-20): `ThemeProvider defaultTheme="light"` with `enableSystem` kept, so System is a choice and no longer the first-visit behaviour.

### 10.3 One orange
- `mark` appears only on the focus ring, the active nav underline, the reading hairline, the crop marks on plates and the logo `mark` variant, the last chart point, and text selection. Primary buttons and links stay ink.

### 10.4 Logo
- The RH monogram "a1" (shared stem, continuous crossbar, 45° leg). `<Logo variant="mini" | "mark" | "tile">` as inline SVG; `scripts/logo/make.mjs` generates `logo-art.ts`, `icon.svg`, `apple-icon.png`, `favicon.ico` (same path, needed by the Swarm healthchecks), `public/brand/*` and `og-mark.svg`.

### 10.5 Plates and ornaments
- `PlateFigure` frames photos in a 1px ink border with four orange crop marks and renders them in grayscale; `tone="color"` keeps colour for site OG covers, the OCR upload and sprites.
- Ornaments are plain 1px rules. Grain, speckle, the engraving band, duotone filters and the fleuron are removed.

### 10.6 Home, About and colophon
- The portrait is in the home hero: the right column from 1024px, and inside the stage after the lead line below that. About is one text column with no drop cap.
- The colophon is a title block (Drawn by, Role, Location, Revision, Set in, Contact) beside the `mark` logo. `NotFoundView` and the auth shell show the large `mark` logo.

### 10.7 OG and certificate images
- IBM Plex Sans 400 and 600 (`src/assets/fonts`) and `og-mark.svg`, on a light paper ground. Card URLs carry `v=2` through `ogImageUrl` so shared and cached copies refresh.

### 10.8 Governance
- All agent files and `docs/ui/` rewritten so agents stop steering back to Lautan Pasir. Three grep gates in `docs/ui/README.md`: gate 1 (banned classes), gate 2 (literals, now with `-I` and without the `font-mono` ban) and the new regression gate 3 that keeps the retired system out of `src` and `content`. All print nothing.
- Changelog 1.6.0 "Drafting sheet" (`content/changelog/2026-10-20.mdx`); `package.json` is 1.6.0.

### 10.9 Status (2026-10-20)
- Code and docs complete on `redesign/phase-1`. Deploy is a push to `main`, after the build, local smoke and e2e checks.

### 10.10 Owner requests (2026-10-20)
- The anime generator is back in `/tools` (`?tab=anime-generator`, group Play): three image categories (cringe, blush, dance; waifu and neko stay hidden as the owner left them) and a quote tab, images in a colour `PlateFigure`, errors inline, `anime-generate` and `anime-quote` events. Source: `src/services/visitor/anime.ts` and `tools/_components/anime-generator-tab.tsx`.
- The site opens in Light on every first visit (see §10.2).
