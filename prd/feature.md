# PRD — UI Layout Consistency

> **2026-10-17:** the monochrome / grayscale language described in §1–3, §5.2 and §8 is superseded by §9 (one-ink redesign).
> **2026-10-20:** release 1.6.0 (the Drafting sheet look) replaced §9 for a day and was reverted to this one-ink system in 1.7.0 at the owner's request; see §10. [`docs/ui/`](../docs/ui/README.md) is the source of truth for UI.

## 1. Overview
Unify Portfolio v3 UI so all boxes, sections, and page shells share one design language (since 2026-10-17: one cobalt ink on cream paper, see §9). Encode the system in shared primitives and AI agent rules so future changes stay consistent.

## 2. System Goals
- Three surfaces: frame (content), inset (nested rows), lift (floating layers only); glass is retired
- Shared page recipe: BaseLayout → PageSection → SectionHeading → content (one width: every page fills BaseLayout's wrapper; only running text caps at about 66ch)
- Eliminate ad-hoc glass cards, double padding, and undefined max-widths
- Document rules for Cursor, Claude, Gemini, and Copilot

## 3. Features

### 3.1 Design tokens
- `src/lib/design-system.ts` exports `SURFACE`, `SECTION_SPACING` (`PAGE_WIDTH` was removed: pages no longer narrow)

### 3.2 Primitives
- `Surface` — solid / glass / glass-static / inset
- `PageSection` — mt-10 + optional SectionHeading
- `PageBody` and `MacWindow` — removed in the one-ink redesign; pages take BaseLayout's width (see `docs/ui/page-shell.md`)

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

### 8.2 Dark palette (superseded by §9.2 Night print)
- The grayscale dark hierarchy is retired; dark mode is the same sheet reversed (cream ink on night paper)

### 8.3 Stats and system status
- Place system health directly below overview metrics
- Use responsive service rows and explicit loading, degraded, and down states
- Prevent duplicate API rows and stale refresh responses

### 8.4 Square controls and toast
- Make scroll-to-top, toast surfaces/actions, AI controls, and clap controls square
- Circular exceptions are superseded by §9 (only the radio dot stays round)
- Standardize notifications on Sonner and remove unused Radix toast state

---

## 9. Track — One-ink redesign, "Lautan Pasir" (2026-10-17)

Redesign every page as one printed publication: one cobalt ink on cream paper, riso grain, Literata italic headings, radius 0, hairline rules, and a Wenceslaus Hollar engraving band (*Landscape with a Rider*, 1650, Rijksmuseum, public domain). Delivered in three phases: P1 shell, home, tokens, Umami foundation and production fixes; P2 visitor pages; P3 `/ai`, profile, auth and admin. Full spec: [`docs/ui/`](../docs/ui/README.md).

### 9.1 Tokens and type
- Six tokens as HSL triples in `src/app/globals.css`, exposed as Tailwind colours: `paper` #F3ECDC, `ink` #1E3C9E, `ink-soft`, `rule`, `rule-strong`, `tint`. shadcn names map onto them; `--radius: 0rem`.
- Literata (roman and italic) via `next/font/google`; Instrument Serif, Bricolage Grotesque, Inter and JetBrains Mono removed. System mono for machine text only.

### 9.2 Night print
- Same tokens flipped on `<html class="dark">`: cream ink on night paper #0D1433. No `dark:` classes. The default theme is Paper (light) since 1.7.0 (§10); System stays an option.

### 9.3 Surfaces and patterns
- Three surfaces: frame, inset, lift (lift = 1px ink and a `3px 3px 0` ink shadow on floating layers only). No gradients, glass, blur or soft shadows.
- Page patterns: Ledger, Article, Plates, Cabinet, Correspondence, Board, Figures, Admin, Auth, Profile card, Not found.
- `BaseLayout` becomes running head + menu sheet + colophon; sidebars and `MacWindow` panels retire.

### 9.4 Motion
- Tier 0 native scroll and sticky layouts; tier 1 CSS scroll-driven home wordscroll and article reading hairline only. Parallax, marquees, typing effects, page transitions, fade-up sections, Lenis, GSAP and `motion` are banned.

### 9.5 Analytics
- Umami `data-umami-event` only on buttons and external `target="_blank"` links; internal links use `data-track`. Kebab-case events, no PII.

### 9.6 Governance
- Agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, Copilot, `.cursor/rules/*.mdc`) and `docs/ui/` rewritten so agents stop reverting to monochrome. `docs/ui/` is the source of truth.
- Grep gate (two commands in `docs/ui/README.md`) must print nothing on each phase's paths; the final run over `src` and `content` must be 0.

### 9.7 Status (2026-10-19)
- Phases 1–3 shipped on `redesign/phase-1`; every route uses a page pattern from `docs/ui/page-shell.md`.
- Logo: replaced by the RH monogram in 1.7.0 (§10; `docs/ui/README.md` → Brand).
- Removed: Spotify and weather widgets, `/signal`, recharts, motion, gsap, ogl, react-icons, date-fns.

---

## 10. Track — Back to one ink, "One ink, new mark" (2026-10-20, release 1.7.0)

Release 1.6.0 (the Drafting sheet: IBM Plex, black and white with one orange mark, grayscale plates, a title-block colophon) restyled the whole site. The owner wanted only the logo changed, so 1.7.0 reverts the visual system to the one-ink print of §9 (cobalt on cream, night print, Literata roman and italic, riso grain, duotone double-rule plates, the Hollar engraving band in the colophon, the 404 and auth views) and keeps the owner-approved changes below. The 1.6.0 spec and plan stay in `docs/superpowers/` marked superseded; the 1.6.0 changelog entry carries a forward note.

### 10.1 Kept from 1.6.0
- RH monogram: `<Logo variant="mini" | "mark" | "tile">`, inline SVG in one ink (`mark` adds registration ticks at 60% ink opacity), generated by `node scripts/logo/make.mjs` (Node 22.18+) into `logo-art.ts`, `src/app/icon.svg`, `apple-icon.png`, `favicon.ico` (same path, the healthcheck needs it), `public/brand/{mark,tile,lockup}-{light,dark}.svg` and `og-mark.svg`. Every earlier logo is gone.
- Portrait (moved out of the hero at the owner's request): the duotone portrait sits in About, an 18rem left column beside the prose from `md` and under the heading at up to 20rem on phones, lazy-loaded; the italic drop cap stays. The hero holds the name, job line, wordscroll sentence and links, centred in the pinned stage, with the h1 as the LCP element; no photo in the hero (from `lg` an "In this issue" column of live links sits beside the text; the press engraving was removed at the owner's request); the hero sentence keeps a 24px floor.
- Compact type scale (body 15 to 16px, h1 30 to 44px, display 44 to 104px, small 13px, caption 12px) and section rhythm `mt-12 sm:mt-16`.
- Default theme Paper (light), `enableSystem` kept; labels Paper, Night, System.
- Anime generator in `/tools` (cringe, blush, dance and quotes; waifu and neko stay hidden), `anime-generate` and `anime-quote` events.
- `PlateFigure tone?: "photo" | "color"` (`color` skips the duotone for anime, Pokémon, OCR and site OG covers); the frame draws the focus outline when an interactive child is focused.
- `ogImageUrl(params, path?)` always sets `v=3` so cached cards refresh.
- Hover tips through `data-tip` (`ui/hover-tip.tsx`).
- Contrast guard test `src/__tests__/unit/lib/contrast.test.ts`, with the one-ink floors.

### 10.2 Reverted
- Fonts back to Literata (roman and italic); palette back to `paper`, `ink`, `ink-soft`, `rule`, `rule-strong`, `tint`; plates back to the duotone double rule; the engraving band, grain and speckle are back; the colophon is the one-ink colophon again.
- Agent files and `docs/ui/` restored to the one-ink rules, edited for the kept changes. Both grep gates in `docs/ui/README.md` are byte-identical to the two in `CLAUDE.md`; the third (regression) gate of 1.6.0 is gone.

### 10.3 Status (2026-10-20)
- Changelog 1.7.0 "One ink, new mark" (`content/changelog/2026-10-20-one-ink.mdx`); `package.json` is 1.7.0. `getAllChangelogs` breaks same-date ties by version, newest first.
