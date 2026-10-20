Superseded 2026-10-20: reverted to the one-ink style in 1.7.0 (owner wanted only the logo changed).

# Drafting sheet rebrand: design

Date: 2026-10-19 · Status: awaiting owner review · Supersedes: the Lautan Pasir system (release 1.5.0)

## 1. Intent

The owner rejected the Lautan Pasir identity. Their reasons:

- The logo is too busy. The Tengger caldera scene is unreadable at small sizes.
- The concept is wrong for an AI engineer: it is a volcano landscape.
- The italic "Rh" monogram is weak.
- They also asked why a horse engraving sits under the home masthead.
- Their portrait is too small and pushed to the far right.

They asked for a total identity change: logo, colour and type.

The owner chose:

| Question | Answer |
|---|---|
| Direction | Engineer precision, as "Drafting sheet" (A); Signal (B) and Graph (C) were rejected |
| Monogram | RH, concept a1: shared stem with a continuous crossbar |
| Colour | Black and white plus one accent |
| Scope | Reskin. Page structure and page patterns stay, except the home hero, which gains the portrait |
| Portrait | In the home hero |

Success means:

- No visible trace of Lautan Pasir remains: no cobalt, cream, Literata, italic display type, grain, engraving, duotone or caldera mark.
- The new mark reads as RH at 16px.
- The portrait is large and placed deliberately.
- Every gate passes: tsc, jest, the grep gates, the build, contrast, and screenshots at 375, 768 and 1280 in light and dark.
- `/favicon.ico` keeps returning 200, because the Swarm healthchecks depend on it.

## 2. Brand core

### 2.1 Palette

Tokens stay HSL triples on `:root` and `.dark`. The names `paper`, `ink`, `ink-soft`, `rule`, `rule-strong` and `tint` are kept so that 1,000+ class uses need no edit. The accent gets new names, `mark` and `mark-text`, instead of shadcn's `accent`. That way a future `shadcn add` component cannot paint orange hover fills by accident.

| Token | Light | Dark | Role | Contrast (measured) |
|---|---|---|---|---|
| paper | #F7F7F5 | #141414 | ground | |
| ink | #141414 | #F2F2EE | text, strong rules, primary button | 17.17 / 16.41 on paper |
| ink-soft | #5C5C57 | #A3A39C | secondary text | 6.27 / 7.26 on paper; 5.73 / 6.51 on tint |
| rule | #DCDCD7 | #33332F | decorative hairlines | |
| rule-strong | #8A8A84 | #75756F | control boundaries (`--input`) | 3.24 / 3.97 on paper |
| tint | #EDEDE9 | #1F1F1D | hover row, code ground, inset | |
| mark | #FF4F00 | #FF6326 | marks only (see 2.3) | 3.07 / 6.20 on paper; not for small text in light |
| mark-text | #C03A00 | #FF7A45 | orange text where it is unavoidable | 5.09 / 7.12 on paper |
| on-mark | #141414 | #141414 | text on a mark fill, in both themes | 5.59 / 6.20 |

- HSL triples:
  - paper and ink: #F7F7F5 `60 11.1% 96.5%`, #141414 `0 0% 7.8%`, #F2F2EE `60 13.3% 94.1%`
  - mark: #FF4F00 `18.6 100% 50%`, #FF6326 `16.9 100% 57.5%`
  - mark-text: #C03A00 `18.1 100% 37.6%`, #FF7A45 `17.1 100% 63.5%`
  - light greys: #5C5C57 `60 2.8% 35.1%`, #DCDCD7 `60 6.7% 85.3%`, #8A8A84 `60 2.5% 52.9%`, #EDEDE9 `60 10% 92.2%`
  - dark greys: #A3A39C `60 3.7% 62.5%`, #33332F `60 4.1% 19.2%`, #75756F `60 2.6% 44.7%`, #1F1F1D `60 3.3% 11.8%`
- `src/lib/print-hex.ts` holds the same values for places that cannot read CSS variables: `viewport.themeColor`, `manifest.ts`, the OG and certificate routes, and the settings Swatch. It also gains `mark`. The keys `nightTint` and `nightInkSoft` are deleted.
- The print stylesheet pins the light triples and the light mark triples.

### 2.2 Type

- **IBM Plex Sans** is the whole voice. It loads through `next/font/google` (`IBM_Plex_Sans`), normal style only, as a variable wght font, into `--font-sans`.
- **IBM Plex Mono** loads through `next/font/google` (`IBM_Plex_Mono`) at weight 400 and 500 with `preload: false`, into `--font-mono`.
- Literata and both instances are removed.
- Tailwind:
  - `sans` is `var(--font-sans)` plus sans fallbacks.
  - `display` aliases `sans`. The `font-display` class is kept as a role: display weight 600, tight tracking via the type scale, no italic.
  - `serif` is deleted.
  - `mono` is `var(--font-mono)` plus the system mono stack.
- Rules:
  - No italic anywhere. The `.font-display` italic, prose h2/h3/blockquote/figcaption italic, the About drop cap, and the `italic` / `not-italic` classes are all removed.
  - Semantic `<em>` and `<i>` in prose and rich-text content render upright at weight 500, and `<strong>` at 600. The TipTap Italic mark stays so authored content keeps its meaning.
- Mono is used for code, kbd, slugs, keys, raw JSON, figures (stat numerals, chart axes, tabular data) and title-block values. It is not used for decorative small labels.
- The type scale is retuned for Plex, because its metrics differ from Literata:
  - display line-height
  - the h1 `pb-[0.14em]` descender pad
  - the `19svh` h1 cap
  - the 38 `ch` widths, checked visually rather than rewritten blindly
- Satori, for the OG and certificate images, cannot read woff2 and draws only the default instance of a variable font. So static `IBMPlexSans-Regular.ttf` and `IBMPlexSans-SemiBold.ttf` (OFL, from github.com/google/fonts `ofl/ibmplexsans`) replace `src/assets/fonts/literata-italic.ttf`. IBM's `OFL.txt` comes with them. `withoutVariations` and its test are deleted. Downloading these files needs the owner's explicit yes, with name, source and size.

### 2.3 Where orange may appear

Orange is used only here:

- the focus ring (`--ring`, 2px, which passes 3:1 as a non-text indicator)
- the active nav underline
- the article reading hairline
- the crop marks on plates and the logo display variant
- the last point of a chart line
- text selection: mark fill with `on-mark` text

Primary buttons stay ink. Links stay ink with an ink underline. Everything else is ink on paper. If orange ever carries text, it uses `mark-text`.

### 2.4 Logo: RH a1

- **Construction.** One drawing on a 16-unit grid. Three stems: the R stem, the shared R-bowl/H-left stem and the H right stem. A square R bowl closed by the shared stem. One crossbar that runs from the R stem through to the H right stem. A 45° leg from the stem/crossbar junction to the foot of the shared stem. Square terminals, and every edge on a whole unit. The same proportions serve 16, 32 and 96px (judge note: the explored display version was lighter and must be unified).
- **Optical work during implementation.** Reduce the "N" reading of the lower-left: try leg start and end points and stem/bar weight balance. Check at 16/32/96 against the a1 contact sheet in the scratchpad. The owner accepted that the trait comes from their own seed sketch.
- **Variants**, all inline SVG, so the colours follow tokens:
  - `mini`: the glyph in `currentColor`, used in the running head and the admin spine.
  - `mark`: the glyph plus four orange crop marks in `hsl(var(--mark))`, at display sizes (colophon title block, 404/error, auth).
  - `tile`: an ink square with a paper glyph, used for favicon and app icons.
- **Generator.** `scripts/logo/make.mjs` is rewritten as the single geometry source, with no font needed. It writes:
  - `src/components/ui/logo-art.ts` (path data)
  - `src/app/icon.svg`
  - `src/app/apple-icon.png` (180, with 2–3 px padding)
  - `src/app/favicon.ico` (16 and 32 PNG-in-ICO, same path)
  - `public/brand/{mark,tile,lockup}-{light,dark}.svg`
  - `public/brand/og-mark.svg` for satori
- **Deletions:** `scripts/logo/ttf.mjs`, the mask SVGs, the `.logo-mask*` CSS and the `seal` variant.
- **`<Logo>` API:** `variant: "mini" | "mark" | "tile"` and `label?`. Call sites: running-head, admin-spine, auth-shell, ai-chat-locked, footer, not-found-view, settings Swatch. The Swatch passes explicit light colours, because the tokens flip in dark mode. `global-error.tsx` uses `/brand/mark-light.svg`.
- `manifest.ts` adds `/icon.svg`.

## 3. Ornaments

- **Deleted:**
  - grain (CSS, `src/assets/paper/*`, the `.dark` swap)
  - `.speckle` and its 2 users
  - `.engraving`, `ui/engraving.tsx`, `src/assets/plates/hollar-band-1600.webp`, `scripts/engrave.mjs`
  - `ui/plate-filters.tsx`, its test, and its mount in `layout.tsx`
  - the fleuron `hr` / `.tail-piece` mask
  - the `ws-ink` misregistration translate
- **`.bg-paper-grain`** becomes an opaque `bg-paper` fill. Its 4 sticky callers are renamed to `bg-paper`.
- **Photos (`.plate`)** use `filter: grayscale(1)` in both themes. Exceptions keep their colour:
  - site-served OG covers (`isSiteImage`), because they are brand cards
  - the user's own OCR upload
  - Pokémon sprites
- **Crop marks** are four orange L-ticks drawn on the outer frame of `PlateFigure` and the YouTube facade. They are never on `.plate` itself, which clips, and never on avatars. They are drawn inside the frame's box so nothing overflows at 375px.
- **Kept, recoloured through tokens:** the double rule (it reads as a drawing-sheet border), `bg-hatch` in ink (section hatching), and the lift shadow.
- **Print-metaphor copy and comments become plain wording.** This includes "No article is printed at this address", "Paper / Night" theme labels (they become Light / Dark / System, along with the theme-toggle aria label, the command palette, the menu radio and the e2e/unit tests), the colophon credit line, and code comments. `--ease-print` is renamed to `--ease-ui`.

## 4. Home, About, colophon, empty states

### 4.1 Hero

The engraving strip is removed. The masthead stage keeps the wordscroll (CSS scroll-driven, static fallback) and is laid out by width:

| Width | Layout |
|---|---|
| ≥1024px | Two columns `[minmax(0,1fr) | minmax(18rem,26rem)]`. Left: h1, lead, sentence, links. Right: the portrait in a `PlateFigure` with crop marks, square, top-aligned with the h1, capped at `min(26rem, 60svh)` so the stage fits the viewport |
| <1024px | The portrait sits inside the stage, directly after the lead line, left-aligned and square, at `size-[min(24svh,20rem)]` (`sm:size-[min(30svh,20rem)]` from 640px). The svh caps keep the pinned stage within the viewport, and the sentence and links follow it |

The portrait:

- **Source:** restore the 1732px original from git (`a5062ca:public/rizky.jpg`) and re-encode it to 1200² JPEG at quality 80 or below 200 KB.
- **Loading:** `priority`, with `sizes="(min-width:1024px) 26rem, 20rem"`. On desktop the portrait may become the LCP element, which is expected.
- **Alt text:** "Rizky Haksono".

### 4.2 About

Text only, in a single column on the reading measure. The drop cap and the 10rem portrait column are removed.

### 4.3 Colophon title block

The engraving band and the seal are replaced by an engineering title block: a ruled grid of cells, labels in Plex Sans small, values in Plex Mono.

| Cell | Value |
|---|---|
| Logo | `mark` variant |
| Drawn by | Rizky Haksono |
| Role | `JOB_TITLE`, Sarana AI |
| Location | Malang, East Java |
| Revision | latest changelog version and date |
| Set in | IBM Plex Sans and IBM Plex Mono |
| Contact | email |

- The revision is read at build time from `content/changelog`. Every value is real data.
- The compact footer (/ai, /chat) keeps its single line, with no title block.
- New credit line: "Set in IBM Plex Sans and IBM Plex Mono. Drawn in Malang, East Java."

### 4.4 404, error, auth

`NotFoundView` (6 callers), `auth-shell` and the admin login replace the riders engraving with the large `mark` logo. The Hollar caption is removed.

## 5. OG and certificate images

- Plex Sans 400 and 600 from the static TTFs, and `og-mark.svg`.
- No italic. Paper ground with ink. The crop marks are the only orange.
- `next.config.ts` `outputFileTracingIncludes` points at the new TTFs, so standalone Docker can read them.
- **Cache bust:** next/og serves `immutable, max-age=31536000`. A `v=2` query parameter is added at the 4 OG URL builders (roadmap, blog DEV, blog onsite, project layout) and at the certificate link in `roadmap-client.tsx`.

## 6. Docs, gates, changelog

- Rewrite the brand, token, type, ornament and gate sections in:
  - `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.geminirules`, `.cursorrules`
  - `.github/copilot-instructions.md`, `.cursor/rules/{ui-layout-consistency,nextjs-development}.mdc`
  - `docs/ui/{README,design-system,page-shell,components,surfaces,platforms}.md`
  - `README.md`
  - `prd/feature.md` (mark §9 superseded, add §10) and `prd/progress.md`
- **Gate 1:** keep the colour-literal ban. Raw `orange-*` stays banned, because orange goes through the `mark` token.
- **Gate 2:** add `-I` so binary fonts are skipped. `font-mono` is no longer banned.
- **New gate 3 (regression):**
  ```bash
  grep -rnIE "\bitalic\b|font-style: ?italic|engrav|grain|speckle|Literata|plate-filters|logo-mask|#1E3C9E|#F3ECDC|#0D1433|#EFE6D2|Hollar|Tengger|caldera" src content \
    | grep -vE "content/changelog/(2025-|2026-0|2026-10-19)|rich-text-editor.tsx"
  ```
  The exclusions cover changelog history and TipTap's `italic` mark name. The gate must print nothing.
- **Changelog:**
  - Append a forward note to `2026-10-19.mdx`, following the convention in `2026-07-06.mdx:20`.
  - Add a new entry dated on release, version 1.6.0, "Drafting sheet".
  - Bump `package.json` to 1.6.0.

## 7. Error handling and risks

| Risk | Mitigation |
|---|---|
| Healthcheck: removing or moving `src/app/favicon.ico` restart-loops the web service. The Swagger favicon in the API repo also points at it | The generator overwrites the file in place. Verify `curl -I /favicon.ico` returns 200 in the local standalone build before pushing |
| Satori: a woff2 or variable font breaks the parser | Static TTFs only. A test renders one OG and one certificate image in the build check (`GET /api/og?title=x`, which must return 200 `image/png`) |
| Standalone tracing: a missing TTF include returns 500 only in Docker | Covered by the include update and the smoke check in the local `bun server.js` run |
| CLS, because Plex metrics differ | `next/font` `adjustFontFallback`. Recheck the hero and ledger wraps in screenshots |
| CI: half-removed modules fail `tsc`/jest and block the deploy | All deletions land in the same change as their importers and tests |
| E2E selectors | Theme labels change, so `theme-toggle.spec.ts` and `hover-tip.test.tsx` are updated. `/sign in to write to etan/i` and the 375px no-overflow test must still pass |

## 8. Testing

- `bunx tsc --noEmit` and `bun run test` pass, with updated tests for theme labels, the Logo variants and print-assets.
- All three grep gates print nothing over `src` and `content`.
- `bun run build --webpack` succeeds. A local `bun run start` smoke test covers `/`, `/blog`, `/stats`, `/tools`, `/chat`, `/admin/auth/login`, a 404, `/favicon.ico`, `/icon.svg`, `/apple-icon.png`, `/api/og?type=blog&title=x&v=2` and `/api/certificate?...`.
- A contrast script re-checks every pair in 2.1 from the final CSS.
- Logo renders at 16/32/96 in light and dark are compared against the a1 contact sheet.
- Screenshots in the browser pane at 375, 768 and 1280, in light and dark, of home (hero with portrait), About, a ledger page, an article, /stats, /tools, 404, auth and the admin dashboard. Each is checked against sections 2–4.
- The e2e run (`bun run test:e2e --project=chromium`) passes against the local production server.
- Deploy is a push to `main`. Afterwards, check the live site with curl and a browser pass.

## 9. Out of scope

- Page structure and patterns, apart from the hero portrait.
- The API repo, apart from its Swagger favicon URL, which keeps working unchanged.
- Umami, data, and copy beyond the print-metaphor wording.
- A logo animation.
- Purging old OG images from third-party caches (the version parameter handles new shares).
