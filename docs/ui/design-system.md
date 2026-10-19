# Design system: tokens, type, shape, motion

## Ink, paper and mark

Tokens are HSL triples in `src/app/globals.css` so every shadcn part re-inks from a few values. `:root` is the light sheet; `<html class="dark">` is the dark sheet.

| Token | Tailwind class | Light hex | Dark hex | Role |
|---|---|---|---|---|
| `--paper` | `paper` | F7F7F5 | 141414 | Page, card, text on solid ink |
| `--ink` | `ink` | 141414 | F2F2EE | Text, icons, strong rules, solid button, charts |
| `--ink-soft` | `ink-soft` | 5C5C57 | A3A39C | Secondary text, on paper or tint only |
| `--rule` | `rule` | DCDCD7 | 33332F | Decorative hairlines only |
| `--rule-strong` | `rule-strong` | 8A8A84 | 75756F | Control boundaries (3:1 or better) |
| `--tint` | `tint` | EDEDE9 | 1F1F1D | Hover row, code ground, inset |
| `--mark` | `mark` | FF4F00 | FF6326 | Marks only, see [below](#where-orange-may-appear) |
| `--mark-text` | `mark-text` | C03A00 | FF7A45 | Orange text, where it is unavoidable |
| `--on-mark` | `on-mark` | 141414 | 141414 | Text on a `mark` fill, in both themes |

The nine Tailwind colours are defined as `hsl(var(--x) / <alpha-value>)`. Hex values above are rounded from the HSL triples; the few copies code needs live in `src/lib/print-hex.ts` (`paper`, `ink`, `inkSoft`, `rule`, `mark`, plus the dark `night`, `nightInk`, `nightMark`).

shadcn names map onto the same tokens, so existing components keep working:

| shadcn token | Maps to |
|---|---|
| `background`, `card`, `popover`, `primary-foreground`, `destructive-foreground` | paper |
| `foreground`, `card-foreground`, `popover-foreground`, `primary`, `destructive` | ink |
| `ring` | mark |
| `secondary`, `muted`, `accent` | tint |
| `muted-foreground` | ink-soft |
| `border` | rule |
| `input` | rule-strong |
| `--radius` | `0rem` |

`accent` stays tint on purpose, so a future `shadcn add` component cannot paint orange hover fills by accident. The orange has its own names.

Other variables: `--ws-ghost` (the unfilled wordscroll colour: ink at .6 in light, .38 in dark), `--head-h` (running head height, 3.25rem, 3rem under 768px), `--scrim` (the modal scrim: ink at .35 in light, paper at .7 in dark), `--dur-press` 120ms, `--dur-ui` 180ms, `--dur-sheet` 240ms, `--ease-ui` `cubic-bezier(.2,0,0,1)`.

### Where orange may appear

`mark` is a mark, not a theme colour. It appears only on:

| Where | How |
|---|---|
| Focus ring | `--ring` is `mark`; the global `:focus-visible` outline is 2px, which passes 3:1 as a non-text indicator |
| Active nav underline | `aria-[current=page]:decoration-mark` in the running head |
| Article reading hairline | `.reading-hairline` in `globals.css` |
| Crop marks | The four L-ticks on `PlateFigure` and the logo `mark` variant |
| Last chart point | The small square at the end of the `InkChart` line |
| Text selection | `::selection` is a `mark` fill with `on-mark` text |

Primary buttons stay ink. Links stay ink with an ink underline. Everything else is ink on paper. If orange ever has to carry text, it is `mark-text`, never `mark`. Raw `orange-*` classes stay banned by gate 1, because orange goes through the token.

### Contrast

Measured from the final tokens (WCAG ratio), and enforced by `src/__tests__/unit/lib/contrast.test.ts`, which also checks that `print-hex.ts` matches the CSS and that the print block pins the light values:

| Pair | Light | Dark | Floor in the test |
|---|---|---|---|
| ink on paper | 17.17 | 16.41 | 15 |
| ink on tint | 15.70 | 14.71 | |
| ink-soft on paper | 6.27 | 7.26 | 4.5 |
| ink-soft on tint | 5.73 | 6.51 | 4.5 |
| rule-strong on paper | 3.24 | 3.97 | 3 |
| mark on paper | 3.07 | 6.20 | 3 (non-text only) |
| mark-text on paper | 5.09 | 7.12 | 4.5 |
| on-mark on mark | 5.59 | 6.20 | 4.5 |

Rules that keep it that way:

- Never put `ink-soft` text on a fill of 12% ink or more.
- `mark` fails 4.5:1 as small text on light paper. It is for marks and the focus ring, never for words.
- Text never takes an opacity modifier (a slash opacity on a text colour fails gate 2). Use `text-ink-soft`.
- Status is shape plus word, never colour. There is no red, green or amber anywhere.
- The wordscroll ghost word stays at 3:1 or better at 24px and up (`--ws-ghost`).

## Type: IBM Plex

Two families, both OFL, loaded with `next/font/google` in `src/app/layout.tsx`. No committed font binaries for the site itself.

| Variable | Tailwind | Use |
|---|---|---|
| `--font-sans` | `font-sans` | IBM Plex Sans (variable wght, normal style only, `subsets: ['latin']`, `display: 'swap'`, `adjustFontFallback`) for body, prose, UI and headings |
| `--font-sans` | `font-display` | Only an alias of `font-sans`, kept as a role name for headings, captions and numerals. It carries no weight of its own |
| `--font-mono` | `font-mono` | IBM Plex Mono at 400 and 500, `preload: false`, for code, kbd, slugs, keys such as TRK-12, raw JSON, kbd and the title-block values. Never for small decorative labels |

Figures (stat numerals, ledgers, tables) stay in Plex Sans with `tabular-nums`.

The OG and certificate images are drawn by satori, which reads static fonts only, so they load the two committed files `src/assets/fonts/ibm-plex-sans-latin-{400,600}-normal.woff` (latin subset, `OFL.txt` alongside). `next.config.ts` lists them in `outputFileTracingIncludes` so the standalone Docker image can read them.

### Weight and emphasis

- Headings are weight 600. The weight rides on the `text-h1` to `text-h4` and `text-display` size tokens in `tailwind.config.ts`, so a caption that uses `font-display` stays 400. `display` and `h1` also set letter-spacing -0.02em.
- Body, prose and captions are 400. Labels are 14px / 600, table heads 13px / 600 in ink-soft, tags 13px.
- **There is no italic.** `<em>`, `<i>` and `<cite>` render upright at weight 500, and `<strong>` and `<b>` at 600 (set once in `globals.css`). Emphasis is weight, not slant. The TipTap italic mark stays in the rich-text editor so authored content keeps its meaning.

### Scale

Fluid between 375px and 1280px, defined as `fontSize` keys in `tailwind.config.ts`.

| Key | Size / leading | Notes |
|---|---|---|
| `caption`, `xs` | 13 / 1.35 | Captions, eyebrows, datelines; `xs` is 13px |
| `small` | 14 / 1.45 | |
| `body` | 16 to 17 / 1.6 | |
| `prose` | 17 to 19 / 1.65 | 66ch measure |
| `lead` | 20 to 22 / 1.4 | One standfirst per page |
| `h4` | 18 / 1.3 | Weight 600 |
| `h3` | 22 to 24 / 1.25 | Weight 600 |
| `h2` | 28 to 40 / 1.1 | Weight 600 |
| `h1` | 40 to 64 / 1.02 | Weight 600, -0.02em |
| `display` | 56 to 152 / 0.95 | Weight 600, -0.02em; the home masthead |
| `numeral` | 44 to 72 / 1 | Stat numerals; add `tabular-nums` on the element |

Text balancing (`text-balance`, `text-pretty`) lives on the elements, not in the scale. Spacing uses a 4px base. Section rhythm is 96px desktop, 64px mobile (`SECTION_SPACING.section = 'mt-16 sm:mt-24'`).

### Type rules

- `font-synthesis: none`. Never fake a weight.
- No upper-case text transform, no letter-spacing utilities, no small caps labels.
- Headings are literal and sentence case ("Career", not "Where I've been").
- Eyebrows only when they carry information, and then as a caption `<p>` (`Eyebrow`), never all-caps.
- No middle-dot meta strings. Datelines are sentences: "Published 3 March 2026, six minute read."
- Numbers only for real sequences: changelog versions, roadmap stages, legal sections. No "01 / 02 / 03" section markers.
- Links: underline 1px at offset .18em, 2px on hover. No "→" or arrow glyph after link text.
- External links carry a screen-reader note "(opens in a new tab)".
- `tabular-nums` in ledgers, tables and figures.
- Glyphs such as check, cross, external and half-circle are inline SVG, not emoji or icon fonts.
- Plain wording over print metaphors: "There is no article at this address", themes "Light" and "Dark".

## Shape and lines

- Radius 0 everywhere. `borderRadius` keys all resolve to 0; `full` exists only for radio dots.
- Line vocabulary:

| Line | How | Where |
|---|---|---|
| Hairline | 1px `rule` (`border-border`) | Frames, row separators, `hr` and `.tail-piece` |
| Strong | 1px `ink` | Controls, outline buttons, floating layers, plate frames, the title block outline |
| Active | 2px underline | Current nav item (`mark`), active tab and menu item (ink), link hover (ink) |
| Double rule | 1px ink, 3px gap, 1px rule | Page heads and above the colophon only. It reads as a drawing-sheet border |
| Dotted leader | dotted `rule` | Definition lists, profile card, ledgers |
| Dashed | dashed `rule-strong` | Draft and archived states |

## Ornaments

There are very few, and all are plain.

1. **Rules.** `hr` and `.tail-piece` are a 1px `rule` line. No fleuron, no glyph, no mask.
2. **Hatching.** `.bg-hatch` is 45 degree hatching in ink (`repeating-linear-gradient(135deg, ...)`) for chart areas and `HatchBar`. This is the only permitted use of a gradient function, and it lives in CSS, not in class names.
3. **Plates.** Photos render in grayscale through `.plate` (`filter: grayscale(1)` on the `img`, in both themes) inside a `PlateFigure` frame with four orange crop marks. Exceptions keep their colour with `tone="color"`: site-served OG covers (`isSiteImage`), the user's own OCR upload and Pokémon sprites. Avatars use `.plate` without the frame or marks. See [components.md](./components.md#plates).
4. **Logo.** The RH monogram, see [README.md](./README.md#brand).

Not allowed: grain, speckle, engraving or illustration bands, duotone, fleuron, misregistration shifts, textured paper. `.bg-paper` is a flat opaque fill and is what opaque sticky surfaces use.

## Motion: rationed

| Tier | What | Rules |
|---|---|---|
| 0 (no JS) | Native scroll, `data-scroll-behavior="smooth"` on `<html>`, `scroll-behavior: smooth` under no-preference, `[id] { scroll-margin-top: calc(var(--head-h) + 1rem) }` (not `scroll-padding-top` on `html`, which scrolls the page whenever focus lands in the sticky head), sticky layouts (skills deck, ledger years, article rail, project figure column, stats chart, tools index, chat composer) | `overflow-x: clip` on `html` and `main` only. Never on `body`, never `overflow: hidden` or `auto` on a sticky ancestor, never `content-visibility` on or around sticky. |
| 1 (CSS scroll-driven) | Home wordscroll (`.ws`), article reading hairline (`scroll(root)`) | Inside `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. Nothing else is scroll-linked. Firefox, older Safari and short viewports get the static, fully inked version. No JS fallback. |
| Response | Underline 1px to 2px, button `translateY(1px)`, tab underline slide, accordion, dialog and sheet fade plus 4px, toasts, tracker drag lift | Use `--dur-press`, `--dur-ui`, `--dur-sheet`, `--ease-ui`. |

**Banned:** parallax, marquees and infinite scrollers, typing effects, smooth cursors, page transitions, pulsing dots and pulse skeletons, fade-up or reveal-on-scroll on sections, hover lifts (`hover:-translate-y`), Lenis, GSAP, `motion` / framer-motion, any scroll animation library on any route.

**Reduced motion:** durations drop to .01ms and the wordscroll shows fully inked. Sticky stays, because it is layout.

**Media:** nothing autoplays. YouTube is a click-to-load facade, framed as a plate.

## Dark mode

- Token flip on `<html class="dark">`, driven by next-themes. The default theme is Light, even where the system prefers dark; System is still offered and follows the OS. The menu sheet offers Light, Dark and System; the running head toggle (from 1024px) flips Light and Dark (aria-label "Dark theme", pressed state set after mount); the command palette has "Light theme", "Dark theme" and "System theme".
- Do not write dark-variant classes. Every colour already flips through the tokens, and gate 1 bans `dark:`.
- Photos stay grayscale in both themes. The mark pair has its own dark value (#FF6326) so the orange keeps its contrast on near-black.
- `color-scheme` follows the theme. Viewport `themeColor` is paper by day and near-black at night, and the manifest uses paper; both read their hex from `src/lib/print-hex.ts`.
- OG and certificate images are always drawn on the light paper colours, with ink text and orange only on the crop marks.

## Print

The print stylesheet pins the light tokens (including the light `mark` pair), hides the running head, menu sheet and dialogs, stops the wordscroll, and prints link URLs.

## Shared class tokens

```ts
import { SURFACE, SURFACE_PADDING, SECTION_SPACING, PAGE_WIDTH } from "@/lib/design-system"
```

| Export | Keys | Use |
|---|---|---|
| `SURFACE` | `solid` (frame), `inset`; `glass` and `glassNoBlur` are retired aliases of `solid` | Surface classes, see [surfaces.md](./surfaces.md) |
| `SURFACE_PADDING` | `default`, `compact`, `cozy` | Inner padding |
| `SECTION_SPACING` | `section` (`mt-16 sm:mt-24`), `sectionGap` | Section rhythm |
| `PAGE_WIDTH` | `default`, `prose`, `article`, `wide`, `ledger` (`max-w-[60rem]`) | Width presets for page wrappers |
