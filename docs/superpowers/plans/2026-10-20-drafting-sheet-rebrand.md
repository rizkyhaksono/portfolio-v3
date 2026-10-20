Superseded 2026-10-20: reverted to the one-ink style in 1.7.0 (owner wanted only the logo changed).

# Drafting sheet rebrand: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Lautan Pasir identity with the Drafting sheet identity across the whole site, without changing the page structure (the home hero portrait is the one exception).

**Architecture:** Tokens stay HSL triples in `globals.css` under the same names, so most of the 1,000+ class uses re-skin themselves. New `mark` tokens carry the orange. Fonts move to IBM Plex through `next/font`. One geometry source in `scripts/logo/make.mjs` generates every logo asset. Ornaments that belong to the old print metaphor are deleted, not restyled.

**Tech stack:** Next.js 16 (App Router, `next build --webpack`), React 19, Tailwind 3, bun 1.2, Jest + RTL, Playwright, sharp (already a devDependency), satori via `next/og`.

**Spec:** `docs/superpowers/specs/2026-10-19-drafting-sheet-rebrand-design.md`. Read it first. Every value below comes from it.

## Global constraints

- **Palette.** Light and dark hex values are in spec §2.1, with the HSL triples. Token names `paper`, `ink`, `ink-soft`, `rule`, `rule-strong`, `tint`, `mark`, `mark-text`, `on-mark`. Orange appears only where spec §2.3 lists it.
- **Type.** IBM Plex Sans (normal style only, variable) is the voice. IBM Plex Mono (weights 400/500, `preload: false`) is for code, data, figures and title-block values.
- **Italic.** None. `<em>`/`<i>` render upright at weight 500, `<strong>` at 600.
- **Ornaments.** No grain, speckle, engraving, duotone, fleuron or misregistration.
- **Logo geometry.** One drawing, the a1 small geometry on the 64-unit viewBox:
  `M4 8h8v48H4z M28 8h8v48h-8z M52 8h8v48h-8z M4 8h32v8H4z M4 28h56v8H4z M8 32h2l22 22v2h-6L8 38z`
  - The glyph box is (4,8)–(60,56).
  - The `mark` variant adds four orange L-ticks on the trim lines, in a viewBox of `-4 0 72 64`:
    `M-3 8h4 M4 1v4 M63 8h4 M60 1v4 M-3 56h4 M4 59v4 M63 56h4 M60 59v4`
    with stroke 1.5, `stroke="hsl(var(--mark))"` and fill none.
- **Favicon.** `src/app/favicon.ico` must exist at that exact path at every commit. The Swarm healthchecks and the API's Swagger page fetch `/favicon.ico`.
- **Commits.** Every commit leaves `bunx tsc --noEmit` and `bun run test` green: CI runs both before deploying. Delete a module in the same commit as its importers and tests.
- **Branch.** Commit to `redesign/phase-1`. Push to `main` only in Task 10, because `main` deploys.
- **Gates.** CLAUDE.md gates 1 and 2 still apply to touched paths until Task 9 rewrites them.

## Review focus

1. **Dark mode at every touched surface.** Any inline colour that does not go through a token stays light in dark mode. Watch for the Swatch, the crop marks, satori and `global-error.tsx`. Task 1's contrast test and the Task 10 dark screenshots pin it.
2. **The hero at 375px and on short viewports (1280×600, 844×390).** The portrait must not overflow, must not push the pinned stage past the viewport, and must not cause horizontal scroll. Pinned by the e2e no-overflow test plus the Task 5 screenshots.
3. **`/favicon.ico`, `/icon.svg`, `/apple-icon.png` and `/api/og` in the standalone build.** These work in `next dev` but can 404 or 500 in Docker when tracing or paths are wrong. Pinned by the Task 10 smoke script against `bun server.js`.
4. **Old OG cards.** Shared links keep the cobalt card unless the URL changes. Pinned by the Task 8 test that the OG URL builders emit `v=2`.
5. **Content italics.** A blog post's `<em>` must still look emphasised (upright, weight 500), not vanish into body text. Pinned by Task 2's prose CSS check in the article screenshot.

---

### Task 1: Tokens, surfaces and the contrast guard

**Files:**
- Modify:
  - `src/app/globals.css`: `:root` / `.dark` / print token blocks (L4–8, L409–412), grain (L53–64), `::selection` (L70–73), `.plate` (L125–135), `ws-ink` keyframes (L149–158), `.speckle` (L183–188), the reading hairline colour (L364–393)
  - `tailwind.config.ts`: colours
  - `src/lib/print-hex.ts`
  - the 4 `bg-paper-grain` callers: `_components/skills/index.tsx:39`, `layout/admin/admin-spine.tsx:162`, `layout/admin/admin-top-header.tsx:20`, `layout/running-head.tsx:16`
  - the 2 `.speckle` users: `_components/site-stats/index.tsx:65`, `ui/not-found-view.tsx:19`
  - every `--ease-print` use (8 files), renamed to `--ease-ui`
  - `src/app/layout.tsx`: remove the PlateFilters import and its mount
- Delete:
  - `src/components/ui/plate-filters.tsx` and its test `src/components/ui/plate-filters.test.ts`
  - `src/assets/paper/grain-light.webp`, `src/assets/paper/grain-dark.webp`
- Test: `src/__tests__/unit/lib/contrast.test.ts`

**Interfaces:**
- Produces:
  - CSS vars `--mark`, `--mark-text`, `--on-mark` (light and dark)
  - Tailwind colours `mark`, `mark-text`, `on-mark` (with `<alpha-value>`)
  - `PRINT_HEX` with keys `paper`, `ink`, `inkSoft`, `rule`, `mark`, `night`, `nightInk`, `nightMark`. `nightTint` and `nightInkSoft` are removed; grep for both and fix the users.

- [ ] **Step 1: Write the failing test** `contrast.test.ts`.
  - It reads `src/app/globals.css` and parses the `:root{…}` and `.dark{…}` triples with a regex `--name:H S% L%`.
  - It converts HSL to sRGB and computes WCAG contrast.
  - It asserts these floors in each theme:
    - ink/paper ≥ 15
    - ink-soft/paper ≥ 4.5
    - ink-soft/tint ≥ 4.5
    - rule-strong/paper ≥ 3
    - mark/paper ≥ 3
    - mark-text/paper ≥ 4.5
    - on-mark/mark ≥ 4.5
  - It also asserts that `PRINT_HEX.paper` equals the light paper triple converted to hex (±1 per channel).
- [ ] **Step 2:** Run `bun run test -- contrast`. Expected: FAIL, because the cobalt values fail ink/paper ≥ 15 and `--mark` is missing.
- [ ] **Step 3:** Write the spec §2.1 triples into `:root`, `.dark` and the print block. The print block pins the light values plus light `--mark` and `--mark-text`.
  - Remove `--plate-alpha`.
  - Set `--ring: var(--mark)`.
  - Make `::selection` `hsl(var(--mark))` on `hsl(var(--on-mark))`.
  - Colour the reading hairline `--mark`.
  - Set the active nav underline in `layout/nav-links.tsx` to `decoration-mark`.
  - Add the last-point marker in `ui/ink-chart.tsx` as a 2px `fill-mark` square.
  - Set the dark `--ws-ghost` to `hsl(var(--ink) / .38)`.
  - Body background becomes a flat `hsl(var(--background))`. Delete the grain rules and both webp files. Rename `bg-paper-grain` to `bg-paper` at the 4 callers.
  - `.plate img { filter: grayscale(1) }` in both themes. Delete the `#plate-paper` / `#plate-night` filters, `plate-filters.tsx`, its test and the mount in `layout.tsx`.
  - Delete `.speckle` and its 2 class uses.
  - Drop the `translate` from `ws-ink`.
  - Rename `--ease-print` to `--ease-ui` everywhere.
  - Update `PRINT_HEX` and its header comment.
  - Add the Tailwind colours.
- [ ] **Step 4:** Run `bun run test -- contrast` (PASS), then `bunx tsc --noEmit` and `bun run test` (all PASS).
- [ ] **Step 5:** Commit with `git commit -m "feat: drafting sheet tokens, flat surfaces, contrast guard"`.

### Task 2: IBM Plex and no italic

**Files:**
- Modify:
  - `src/app/layout.tsx` (L3, L18–32, L86)
  - `tailwind.config.ts` (fontFamily L9–22; `display` fontSize L84–85)
  - `src/app/globals.css`:
    - `.font-display` (L80–83)
    - `em, i, cite` (L85–95)
    - `.prose` h2/h3, blockquote, figcaption (L205–210, L238–245, L297–303)
  - `src/app/_components/about/index.tsx` (drop cap, L7–8 and L20)
  - `src/app/page.tsx` (h1 `pb-[0.14em]` and the `19svh` cap, L31–32)
  - `src/app/global-error.tsx` (L9, L14: system sans stack, no italic)
  - every file with the `italic` / `not-italic` class, listed by `grep -rlnE "\b(not-)?italic\b" src content` (29 files; the inventory is in `/private/tmp/claude-501/-Users-rizky-workspace-personal-portfolio-v3/761f5af5-b649-4823-a0e0-ccb0b22e1309/scratchpad/inventory-critic.md` §Typography)

**Interfaces:**
- Produces: CSS vars `--font-sans` and `--font-mono`. Tailwind `sans`, `display` (alias of sans) and `mono` families. Nothing references `font-serif` any more.

- [ ] **Step 1:** Run `grep -rnIE "\bitalic\b|font-style: ?italic|Literata|--font-serif|first-letter:" src content | grep -vE "content/changelog/(2025-|2026-0|2026-10-19)|rich-text-editor.tsx"`. Expected: many lines (the failing state).
- [ ] **Step 2:** Replace Literata with `IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap", adjustFontFallback: true })` and `IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-mono", display: "swap", preload: false })`.
  - Tailwind: `sans` and `display` become `var(--font-sans)` plus `fontFamily.sans`; `mono` becomes `var(--font-mono)` plus the current system stack; delete `serif`.
  - The `display` fontSize keeps its clamp, with line-height `0.95` and fontWeight `600`.
  - `.font-display`: weight 600, no font-style.
  - `em, i, cite`: `font-style: normal; font-weight: 500`. `strong, b`: 600. Delete the Literata reset.
  - Remove italic from the prose rules, the drop cap, every `italic` / `not-italic` class and every `first-letter:*`.
  - Set the h1 bottom padding to `pb-0`. Keep the `19svh` cap.
- [ ] **Step 3:** Run the Step 1 grep again. Expected: no output.
- [ ] **Step 4:** Run `bunx tsc --noEmit` and `bun run test` (PASS). Run `bun run build --webpack` (exit 0).
- [ ] **Step 5:** Commit with `git commit -m "feat: set the site in IBM Plex, remove italic"`.

### Task 3: RH logo, generator and icons

**Files:**
- Rewrite: `scripts/logo/make.mjs` as the geometry source and writer, with no font input.
- Delete:
  - `scripts/logo/ttf.mjs`
  - `public/brand/*` (all 10 files)
  - `.logo-mask*` CSS in `globals.css` (L421–430)
- Regenerate:
  - `src/components/ui/logo-art.ts`
  - `src/app/icon.svg`
  - `src/app/apple-icon.png`
  - `src/app/favicon.ico`
  - `public/brand/{mark,tile,lockup}-{light,dark}.svg`
  - `public/brand/og-mark.svg`
- Modify:
  - `src/components/ui/logo.tsx`
  - `<Logo>` call sites:
    - `layout/running-head.tsx:23` (`mini`)
    - `layout/admin/admin-spine.tsx:150` (`mini`)
    - `layout/auth-shell.tsx:36,48` (`mark`)
    - `(user)/ai/_components/ai-chat-locked.tsx:5,10` (`mark`)
    - `layout/footer.tsx:77` (`mark`)
    - `ui/not-found-view.tsx:18` (`mark`)
    - `(admin)/admin/dashboard/settings/page.tsx:107,112` (`mini`, with explicit colours, see Step 3)
  - `src/app/global-error.tsx`: point it at `/brand/mark-light.svg` with alt "Rizky Haksono"
  - `src/app/manifest.ts`: add `{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }`
- Test: `src/__tests__/components/ui/logo.test.tsx`

**Interfaces:**
- Produces:
  - `Logo({ variant?: "mini" | "mark" | "tile"; className?: string; label?: string })`. The default is `"mini"`. `"seal"` is removed, so tsc catches stale callers.
  - `LOGO_ART: { glyph: string; marks: string }`, which are path `d` strings.
  - `public/brand/og-mark.svg`: the glyph in #141414 plus the marks in #FF4F00, viewBox `-4 0 72 64`.

- [ ] **Step 1: Write the failing test** `logo.test.tsx`:
  - `mini` renders an `svg` with viewBox `0 0 64 64`, one path whose `d` equals `LOGO_ART.glyph`, and `aria-hidden` when no label is given.
  - `mark` with `label="Rizky Haksono"` has role `img`, the name "Rizky Haksono", viewBox `-4 0 72 64`, and a second path with `stroke="hsl(var(--mark))"`.
  - `tile` renders a `rect` with class `fill-ink` and a glyph path with class `fill-paper`.
- [ ] **Step 2:** Run `bun run test -- logo`. Expected: FAIL (variant or shape mismatch).
- [ ] **Step 3:** Implement `make.mjs`:
  - Export `GLYPH` and `MARKS` (the constants in Global constraints).
  - Write `logo-art.ts`.
  - Write the SVG files. Light uses #141414 on #F7F7F5; dark uses #F2F2EE on #141414 with marks #FF6326.
  - Render `apple-icon.png` at 180px: tile, glyph inset to 70% of the tile.
  - Render `favicon.ico` as a PNG-in-ICO with 16 and 32 entries: a 6-byte ICONDIR, then 16-byte ICONDIRENTRY records, then the PNG blobs from sharp. Assert in the script that the file starts with `00 00 01 00 02 00`.
  - `icon.svg` is the tile.
  - Rewrite `logo.tsx` to inline SVG for all three variants, with a new doc comment describing the RH a1 construction.
  - The settings Swatch passes `className` colours fixed to the light or dark pair through the `PRINT_HEX` values as inline `style={{ color }}`, because the tokens flip with the theme.
  - Delete the mask SVGs, the `.logo-mask*` CSS and `ttf.mjs`.
- [ ] **Step 4:** Run `node scripts/logo/make.mjs`. Expected: it lists every written file and exits 0, and `file src/app/favicon.ico` reports an MS Windows icon resource with 2 icons.
- [ ] **Step 5:** Run `bun run test -- logo` and `bunx tsc --noEmit` (PASS).
- [ ] **Step 6 (visual check):** Render `mini` at 16, 32 and 96px, light and dark, with a small sharp script in the scratchpad. Compare it with `/private/tmp/claude-501/-Users-rizky-workspace-personal-portfolio-v3/761f5af5-b649-4823-a0e0-ccb0b22e1309/scratchpad/logo/contact-sheet.png` row a1. It passes when the 16px render shows the bowl, the stair leg and the H counter.
- [ ] **Step 7 (optical pass):** If the lower-left still reads as "N" at 32 and 96px, render one alternative leg that starts at the bowl's inner corner, `M12 36h2l18 18v2h-6L12 42z`. Keep whichever shows the stair more clearly at 16px, and update `GLYPH` in `make.mjs` (and the Global constraints path in this plan) if it changes.
- [ ] **Step 8:** Commit with `git commit -m "feat: RH monogram logo and icons"`.

### Task 4: Plates, frames and rules

**Files:**
- Modify:
  - `src/components/ui/plate-figure.tsx`
  - `src/components/ui/youtube-facade.tsx` (L17, L24–25, L41, L61)
  - `src/app/globals.css`: `.prose img` (L291–296); `.prose hr, .tail-piece` (L322–331, L346)
  - `src/components/ui/article-shell.tsx` (L23, L34, L75: tail-piece users)
  - `PlateFigure` callers that keep colour: `blog/page.tsx:110` (only when `isSiteImage(src)`), `blog/onsite/[slug]/page.tsx:84` (same condition), `tools/_components/pokemon-tab.tsx:147`, `(user)/ai/_components/ocr-demo.tsx`
- Test: `src/__tests__/components/ui/plate-figure.test.tsx`

**Interfaces:**
- Produces: `PlateFigure({ children, caption?, className?, tone?: "photo" | "color" })`. The default is `"photo"`. `.plate` (grayscale) is applied only when `tone === "photo"`.

- [ ] **Step 1: Write the failing test:**
  - The default render has an element with class `plate` and four crop-mark spans (`[data-crop]`, length 4).
  - `tone="color"` has no `.plate`.
  - The caption has no `italic` class.
- [ ] **Step 2:** Run `bun run test -- plate-figure`. Expected: FAIL.
- [ ] **Step 3:** Change the frame to a 1px ink border with no inner rule.
  - Crop marks are four `aria-hidden` spans, absolutely positioned inside the outer frame's padding box. Each is a 10px L made of two 1.5px `bg-mark` bars at a corner, inset 4px, so nothing overflows at 375px.
  - `youtube-facade` gets the same frame and marks.
  - `.prose img`: a 1px rule border, no padding.
  - `hr` and `.tail-piece`: a plain 1px `rule` line. Delete the fleuron mask.
  - Set `tone="color"` at the four colour callers. The blog pages use `isSiteImage` to choose.
- [ ] **Step 4:** Run `bun run test` and `bunx tsc --noEmit` (PASS).
- [ ] **Step 5:** Commit with `git commit -m "feat: grayscale plates with crop marks, plain rules"`.

### Task 5: Hero portrait and text-only About

**Files:**
- Modify:
  - `public/rizky.jpg`: from `git show a5062ca:public/rizky.jpg`, re-encoded with sharp to 1200×1200 JPEG (mozjpeg, quality ≤ 80, ≤ 200 KB)
  - `src/app/page.tsx`: Masthead (L24–59); `Home` (portrait after the stage below lg)
  - `src/app/_components/about/index.tsx`
- Test: `__tests__/e2e/navigation.spec.ts` (existing no-overflow test, L58–63); add a home portrait assertion there.

**Interfaces:**
- Consumes: `PlateFigure` (Task 4).
- Produces: `HeroPortrait({ className }: { className?: string })`, local to `page.tsx`. It renders `PlateFigure` with `Image src="/rizky.jpg" alt="Rizky Haksono" width={1200} height={1200} priority sizes="(min-width: 1024px) 26rem, 20rem"`.

- [ ] **Step 1: Add the e2e assertion.** At 1280×800 the image named "Rizky Haksono" is visible inside the `.ws__stage` element. At 375×812 it is visible after the stage and `document.documentElement.scrollWidth <= 375`.
- [ ] **Step 2:** Run `bun run build --webpack && bun run start` and, in another shell, `bun run test:e2e --project=chromium -g "portrait"`. Expected: FAIL.
- [ ] **Step 3:** Remove `<Engraving crop="masthead">` from the Masthead.
  - Wrap the stage children in `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:gap-12`. The text column holds h1, lead, sentence and links; the second column holds `<HeroPortrait className="hidden lg:block lg:max-w-[min(26rem,60svh)] lg:self-start" />`.
  - In `Home`, after the bleed, render `<HeroPortrait className="lg:hidden mx-auto w-full max-w-[20rem]" />`. Place it in the `BaseLayout` children, before `AboutSection`.
  - Update the Masthead doc comment: the portrait is the desktop LCP candidate.
  - About becomes a single `.prose` column. Remove the grid, PlateFigure, the Image import and the drop cap.
- [ ] **Step 4:** Restore and re-encode the photo, rebuild, rerun the e2e test (PASS), and run the full e2e suite (PASS).
- [ ] **Step 5:** Screenshot at 1280×800, 1280×600, 844×390 and 375×812 in light and dark. Check that the stage fits, the portrait is square and grayscale with crop marks, and there is no overflow.
- [ ] **Step 6:** Commit with `git commit -m "feat: portrait in the home hero, text-only About"`.

### Task 6: Colophon title block, empty states, engraving removal

**Files:**
- Modify:
  - `src/components/layout/footer.tsx` (L2, L51–58 compact, L77, L112–115 credit, L122 band)
  - `src/components/ui/not-found-view.tsx` (L1, L13, L18–21, L32)
  - `src/components/layout/auth-shell.tsx` (L3, L8, L11, L32–43)
  - `src/app/(visitor)/blog/not-found.tsx:11` (copy)
- Create: `src/components/layout/title-block.tsx`
- Delete:
  - `src/components/ui/engraving.tsx`
  - the `.engraving` CSS (`globals.css` L137–142)
  - `src/assets/plates/hollar-band-1600.webp`
  - `scripts/engrave.mjs`
- Test: `src/__tests__/components/layout/title-block.test.tsx`

**Interfaces:**
- Consumes: `getAllChangelogs()` from `src/lib/mdx.ts` (newest first, `meta.version` and `meta.date`). `Logo variant="mark"` (Task 3). `JOB_TITLE` and `EMAIL` from their current constants.
- Produces: `TitleBlock()`, a server component with no props. It renders a `dl`:
  - Logo cell: `Logo variant="mark"`
  - "Drawn by": Rizky Haksono
  - "Role": `${JOB_TITLE}, Sarana AI`
  - "Location": Malang, East Java
  - "Revision": `${version}, ${date}`
  - "Set in": IBM Plex Sans and IBM Plex Mono
  - "Contact": a mailto link to `EMAIL`, keeping `data-track="email-click" data-track-area="colophon"`
  - Values use `font-mono`; labels use `text-caption text-ink-soft`.

- [ ] **Step 1: Write the failing test.** `TitleBlock` renders each label as a `dt`. The "Revision" `dd` equals `getAllChangelogs()[0].meta.version + ", " + getAllChangelogs()[0].meta.date`. The email link has `href="mailto:…"`.
- [ ] **Step 2:** Run `bun run test -- title-block`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `TitleBlock`.
  - The full footer replaces the seal block and the engraving band with `<TitleBlock />` above the nav columns.
  - New credit line: "Set in IBM Plex Sans and IBM Plex Mono. Drawn in Malang, East Java."
  - The compact footer is unchanged apart from the copy.
  - `NotFoundView` and `auth-shell` swap the riders engraving for `<Logo variant="mark" className="w-40 sm:w-56" />` and drop the Hollar caption and the small seal.
  - blog/not-found copy: "There is no article at this address."
  - Delete the engraving component, its CSS, the webp and `engrave.mjs`.
- [ ] **Step 4:** Run `grep -rnI "Engraving\|engraving\|engrave" src scripts`. Expected: no output. Then run `bun run test` and `bunx tsc --noEmit` (PASS).
- [ ] **Step 5:** Commit with `git commit -m "feat: title block colophon, logo on empty states, remove engraving"`.

### Task 7: Theme labels and print-metaphor copy

**Files:**
- Modify:
  - `src/components/layout/theme-toggle.tsx` (L10, L27, L29)
  - `src/components/layout/contents-sheet.tsx` (L14–15)
  - `src/components/ui/command-palette.tsx` (L163, L166)
  - `src/app/(admin)/admin/dashboard/settings/page.tsx` (L63–66 labels)
  - `__tests__/e2e/theme-toggle.spec.ts` (L6–36)
  - `src/__tests__/components/ui/hover-tip.test.tsx` (L12, L20)
  - the print-metaphor comments listed in `/private/tmp/claude-501/-Users-rizky-workspace-personal-portfolio-v3/761f5af5-b649-4823-a0e0-ccb0b22e1309/scratchpad/inventory-critic.md` §B5
  - optional copy: `blog/[slug]/page.tsx:102` becomes "First published on DEV Community"; `_components/blog/blog-letters.tsx:55` becomes "new letters appear here within the hour"

**Interfaces:** labels only. The theme values `light`, `dark` and `system` are unchanged.

- [ ] **Step 1: Update the e2e and unit tests first.**
  - The toggle's aria-label becomes "Dark theme" and its tip "Switch to dark" / "Switch to light".
  - The radio labels become "Light", "Dark" and "System".
- [ ] **Step 2:** Run `bun run test -- hover-tip`. Expected: FAIL, because the old label is still in the component.
- [ ] **Step 3:** Rename the labels in the four components. Reword the comments and the two copy lines.
- [ ] **Step 4:** Run `bun run test` (PASS) and the e2e theme spec against the local start (PASS). Run `grep -rnIiE "night (print|theme)|paper print|\bprinted\b" src`. Expected: no output.
- [ ] **Step 5:** Commit with `git commit -m "feat: light and dark theme labels, plain copy"`.

### Task 8: OG and certificate images

**Files:**
- Add, after the owner says yes to the download (name, source and size stated):
  - `src/assets/fonts/IBMPlexSans-Regular.ttf`
  - `src/assets/fonts/IBMPlexSans-SemiBold.ttf`
  - `src/assets/fonts/OFL.txt` (IBM's)
  - Source: `https://github.com/google/fonts/raw/main/ofl/ibmplexsans/` (static TTFs; if only the variable file is there, use `https://github.com/IBM/plex` release static TTFs)
- Delete: `src/assets/fonts/literata-italic.ttf`.
- Modify:
  - `src/app/api/og/print-assets.ts`
  - `src/app/api/og/route.tsx`
  - `src/app/api/certificate/route.tsx`
  - `next.config.ts` (`outputFileTracingIncludes`, L24–28)
  - the OG URL builders: `(visitor)/roadmap/[slug]/page.tsx:90`, `(visitor)/blog/[slug]/page.tsx:51`, `(visitor)/blog/onsite/[slug]/page.tsx:30`, `(visitor)/project/[id]/layout.tsx:25`
  - the certificate link at `(visitor)/roadmap/roadmap-client.tsx:40`
- Test: `src/app/api/og/print-assets.test.ts` (rewrite); `src/__tests__/unit/lib/og-url.test.ts`

**Interfaces:**
- Produces:
  - `loadPrintAssets(): Promise<{ fonts: { name: "IBM Plex Sans"; data: Buffer; weight: 400 | 600; style: "normal" }[]; mark: string }>`, where `mark` is a data URI of `public/brand/og-mark.svg`. `withoutVariations` is removed.
  - `ogImageUrl(params: Record<string,string>): string` in `src/lib/site-url.ts`. It always sets `v=2`. All 4 builders and the certificate link use it.

- [ ] **Step 1: Write the failing tests.**
  - `loadPrintAssets()` resolves to 2 fonts with weights 400 and 600, each Buffer starting with the TTF magic `00 01 00 00`, and a `mark` that starts with `data:image/svg+xml;base64,`.
  - `ogImageUrl({ type: "blog", title: "x" })` returns a URL whose `searchParams.get("v") === "2"`.
- [ ] **Step 2:** Run `bun run test -- print-assets og-url`. Expected: FAIL.
- [ ] **Step 3:** Ask the owner for the download. When they say yes, download both TTFs and `OFL.txt` into `src/assets/fonts/` and verify the magic bytes.
  - Rewrite `print-assets.ts`.
  - In both routes: Plex 400 for body and 600 for titles, no `fontStyle: "italic"`, ink on paper from `PRINT_HEX`, the mark image, and crop marks as the only orange.
  - Point the tracing includes at the two TTFs.
  - Add `ogImageUrl` and use it at the 5 call sites.
- [ ] **Step 4:** Run `bun run test` and `bunx tsc --noEmit` (PASS). Then `bun run build --webpack && bun run start`, and `curl -s -o /tmp/og.png -w "%{http_code} %{content_type}\n" "http://localhost:3001/api/og?type=blog&title=Drafting&v=2"`. Expected: `200 image/png`. Read the PNG and check it is ink on paper with an orange crop mark only. Do the same for one `/api/certificate?...` URL taken from `roadmap-client.tsx`.
- [ ] **Step 5:** Commit with `git commit -m "feat: OG and certificate images in IBM Plex, cache-busted"`.

### Task 9: Docs, gates, changelog

**Files:**
- Modify:
  - `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.geminirules`, `.cursorrules`
  - `.github/copilot-instructions.md`
  - `.cursor/rules/ui-layout-consistency.mdc`, `.cursor/rules/nextjs-development.mdc`
  - `docs/ui/README.md`, `docs/ui/design-system.md`, `docs/ui/page-shell.md`, `docs/ui/components.md`, `docs/ui/surfaces.md`, `docs/ui/platforms.md`
  - `README.md` (L27–29, 94, 144, 147, 399, 407–429)
  - `prd/feature.md`: mark §9 superseded, add §10 Drafting sheet
  - `prd/progress.md`
  - `content/changelog/2026-10-19.mdx`: append a forward note in the `2026-07-06.mdx:20` style
  - `package.json`: version `1.6.0`
- Create: `content/changelog/2026-10-20.mdx` (version `1.6.0`, title "Drafting sheet")
- Memory, outside the repo: mark `portfolio-redesign-scope.md` as superseded by `portfolio-rebrand-drafting-sheet.md`

- [ ] **Step 1:** Rewrite the brand, token, type, ornament and gate sections from spec §2–§3 and §6.
  - Gate 2 gains `-I` and loses `\bfont-mono\b`.
  - Gate 3 is added verbatim from spec §6.
  - The UI rules bullets name the paper/ink greys, `mark`, Plex, no italic, plates with crop marks, and the title block.
- [ ] **Step 2:** Write the changelog entry. Keep it short: what changed for readers (the new mark, the type, the portrait, the dark mode), in the style of `2026-10-19.mdx`. Gate 3 scans this file, so do not name the removed things (no "Literata", "italic", "engraving", "Hollar"). Describe only what is new.
- [ ] **Step 3:** Run all three gates over `src` and `content`. Expected: no output. Run `bun run test` (the changelog title-block test now reads 1.6.0, PASS).
- [ ] **Step 4:** Commit with `git commit -m "docs: drafting sheet rules, gates and 1.6.0 changelog"`.

### Task 10: Verify, ship, check live

**Files:** none. Verification and push only.

- [ ] **Step 1:** Run `bunx tsc --noEmit`, `bun run test`, the three gates and `bun run build --webpack`. All pass and print no gate output.
- [ ] **Step 2: Standalone smoke.** Run `cd .next/standalone && PORT=3002 bun server.js` (after copying `public` and `.next/static` the way the Dockerfile does). Every one of these returns 200 with the right content type:
  - `/`, `/blog`, `/stats`, `/tools`, `/chat`, `/admin/auth/login`, `/nope` (404 status)
  - `/favicon.ico`, `/icon.svg`, `/apple-icon.png`
  - `/api/og?type=blog&title=x&v=2`
- [ ] **Step 3:** Run `bun run test:e2e --project=chromium` against `bun run start`. All pass.
- [ ] **Step 4: Screenshots** in the browser pane at 375, 768 and 1280, light and dark:
  - home hero, About, `/blog`, an onsite article (check `<em>` renders upright at weight 500), `/stats`, `/tools`, 404, `/auth`, the admin dashboard
  - Fix anything that contradicts spec §2–§4 in a commit named `fix: <what>`.
- [ ] **Step 5:** Run `git push origin HEAD` and `git push origin HEAD:main`. Poll `curl -s https://natee.my.id/ | grep -c "font-sans\|IBM"` until the new build is live, and `curl -sI https://natee.my.id/favicon.ico` for a 200. Then run a browser pass on the live home page in light and dark.
