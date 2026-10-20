# Design system: tokens, type, shape, motion

## Ink and paper

Tokens are HSL triples in `src/app/globals.css` so every shadcn part re-inks from two values. `:root` is the paper print; `<html class="dark">` is Night print.

| Token | Tailwind class | Paper hex (light) | Night hex (dark) | Role |
|---|---|---|---|---|
| `--paper` | `paper` | F3ECDC | 0D1433 | Page, card, text on solid ink |
| `--ink` | `ink` | 1E3C9E | EFE6D2 | Text, icons, strong rules, solid button, focus, charts, engraving |
| `--ink-soft` | `ink-soft` | 445BAA | A9B5E3 | Secondary text, on paper or tint only |
| `--rule` | `rule` | BFC6DE | 2C3870 | Decorative hairlines only |
| `--rule-strong` | `rule-strong` | 6476B2 | 7383C4 | Control boundaries (3:1 or better) |
| `--tint` | `tint` | E2E4EB | 162868 | Hover row, code ground, inset |

The six Tailwind colours are defined as `hsl(var(--x) / <alpha-value>)`. Hex values above are rounded from the HSL triples; the few copies code needs live in `src/lib/print-hex.ts`.

shadcn names map onto the same ink, so existing components keep working:

| shadcn token | Maps to |
|---|---|
| `background`, `card`, `popover`, `primary-foreground`, `destructive-foreground` | paper |
| `foreground`, `card-foreground`, `popover-foreground`, `primary`, `destructive`, `ring` | ink |
| `secondary`, `muted`, `accent` | tint |
| `muted-foreground` | ink-soft |
| `border` | rule |
| `input` | rule-strong |
| `--radius` | `0rem` |

Other variables: `--plate-alpha` (engraving ink strength, 1 on paper, .85 at night), `--ws-ghost` (unprinted wordscroll colour), `--head-h` (running head height, 3.25rem, 3rem under 768px), `--dur-press` 120ms, `--dur-ui` 180ms, `--dur-sheet` 240ms, `--ease-print` `cubic-bezier(.2,0,0,1)`.

### Contrast

Measured from the triples (WCAG ratio):

| Pair | Paper | Night |
|---|---|---|
| ink on paper | 8.13 | 14.51 |
| ink on tint | 7.54 | 11.01 |
| ink-soft on paper | 5.36 | 8.96 |
| ink-soft on tint | 4.97 | 6.80 |
| rule-strong on paper | 3.74 | 4.96 |

Rules that keep it that way:

- Never put `ink-soft` text on a fill of 12% ink or more.
- Night print never uses full cobalt as a ground behind text.
- Text never takes an opacity modifier (a slash opacity on a text colour fails the gate). Use `text-ink-soft`.
- Status is shape plus word, never colour. There is no red, green or amber anywhere.
- The wordscroll ghost word stays at 3:1 or better at 24px and up (`--ws-ghost`: ink at .6 on paper, 3.17:1; ink-soft at .7 at night, 4.98:1, a colour so night print stays blue, not grey). The hero sentence keeps a 24px floor on phones so the unscrolled ghost still counts as large text.

**Guard test.** `src/__tests__/unit/lib/contrast.test.ts` parses the triples out of `globals.css` and fails the build below these floors, in Paper and in Night: ink on paper 7:1, ink-soft on paper 4.5:1, ink-soft on tint 4.5:1, rule-strong on paper 3:1, the wordscroll ghost over paper 3:1. It also checks that every hex in `src/lib/print-hex.ts` matches its token (within one per channel) and that the `@media print` block pins the Paper triples. Change a token and the test tells you which copy to update.

## Type: Literata

One family, Literata (variable, OFL), roman and italic, loaded with `next/font/google` in `src/app/layout.tsx` (`subsets: ['latin']`, `display: 'swap'`, `adjustFontFallback`). No committed font binaries. Machine text uses the system mono stack `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`, which costs 0 bytes.

| Variable | Tailwind | Use |
|---|---|---|
| `--font-serif` | `font-sans`, `font-serif` | Literata for body, prose, UI |
| `--font-display` | `font-display` | Literata for headings, display, numerals |
| system mono | `font-mono` (code-block and kbd only) | Code, slugs, keys such as TRK-12, raw JSON, WPM passage, kbd |

Italic is rationed. Italic: h1 to h4, the masthead, an article's standfirst (page heads carry none), captions, datelines, pull quotes, numerals. Roman: body, prose, nav, buttons (15px / 600), labels (13px / 600), table heads (12px / 600, ink-soft), tags (12px), form values.

### Scale

Compact and fluid between 375px and 1280px, defined as `fontSize` keys in `tailwind.config.ts`. Use the keys; never an ad-hoc size.

| Key | Size / leading | Notes |
|---|---|---|
| `caption`, `xs` | 12 / 1.4 | Italic for captions; `xs` is the same 12px |
| `small` | 13 / 1.45 | |
| `body` | 15 to 16 / 1.6 | |
| `prose` | 16 to 17 / 1.65 | 66ch measure |
| `lead` | 17 to 19 / 1.45 | Italic standfirst, articles only |
| `h4` | 16 / 1.35 | |
| `h3` | 18 to 20 / 1.3 | |
| `h2` | 22 to 30 / 1.15 | |
| `h1` | 30 to 44 / 1.08 | |
| `display` | 44 to 104 / 0.92 | Italic, weight 360, `text-wrap: balance` |
| `numeral` | 32 to 48 / 1 | Italic, `tabular-nums` |

Spacing uses a 4px base. Section rhythm is 64px from `sm` up and 48px on phones (`SECTION_SPACING.section = 'mt-12 sm:mt-16'`, `sectionGap = 'mt-3'`). The home hero is sized in `svh` so the pinned stage still fits 375x667 and 1280x600.

### Type rules

- `font-synthesis: none`. Never fake a weight or an italic.
- No upper-case text transform, no letter-spacing utilities, no small caps labels.
- Headings are literal and sentence case ("Career", not "Where I've been").
- Eyebrows only when they carry information, and then as an italic caption `<p>`, never all-caps.
- No middle-dot meta strings. Datelines are sentences: "Published 3 March 2026, six minute read."
- Numbers only for real sequences: changelog versions, roadmap stages, legal sections. No "01 / 02 / 03" section markers.
- Links: underline 1px at offset .18em, 2px on hover. No "→" or arrow glyph after link text.
- External links carry a screen-reader note "(opens in a new tab)".
- `tabular-nums` in ledgers, tables and figures.
- Glyphs such as check, cross, external and half-circle are inline SVG, not emoji or icon fonts.

## Shape and lines

- Radius 0 everywhere. `borderRadius` keys all resolve to 0; `full` exists only for radio dots.
- Line vocabulary:

| Line | How | Where |
|---|---|---|
| Hairline | 1px `rule` (`border-border`) | Frames, row separators, decorative rules |
| Strong | 1px `ink` | Controls, outline buttons, floating layers |
| Active | 2px `ink` underline | Current nav item, active tab, link hover |
| Head rule | single 1px ink | Page heads and above the colophon; never stacked with another rule |
| Plate frame | 1px ink, 3px paper, 1px rule around a figure | `PlateFigure` |
| Dotted leader | dotted `rule` | Definition lists, profile card, ledgers |
| Dashed | dashed `rule-strong` | Draft and archived states |

## Texture

1. **Grain.** A 128px WebP tile (4 KB or less) per theme on `body`. Opaque sticky surfaces add `.bg-paper-grain` so the grain does not stop at their edge.
2. **Ink speckle.** A small mask, only on numerals 48px and up below the fold, inverted blocks, and the 404 line.
3. **Hatching.** 45 degree hatching (`repeating-linear-gradient(135deg, ...)`) for chart areas and `HatchBar`. This is the only permitted use of a gradient function, and it lives in CSS, not in class names.

Photos use the `.plate` duotone through `PlateFigure` (`tone="photo"`, the default). `tone="color"` skips it for pictures that must keep their own colour: anime and Pokémon pictures, the OCR upload, site-generated `/api/og` covers. The frame is a double rule (1px ink, 3px paper, 1px rule). The photo clips its own focus outline, so the frame draws the 2px ring outline when a control inside it is focused. The engraving is a CSS mask painted with `hsl(var(--ink) / var(--plate-alpha))`, so one file prints cobalt on paper and cream at night. Engravings never go through `next/image`.

## Motion: the press moves once

| Tier | What | Rules |
|---|---|---|
| 0 (no JS) | Native scroll, `data-scroll-behavior="smooth"` on `<html>`, `scroll-behavior: smooth` under no-preference, `[id] { scroll-margin-top: calc(var(--head-h) + 1rem) }` (not `scroll-padding-top` on `html`, which scrolls the page whenever focus lands in the sticky head), sticky layouts (skills deck, ledger years, article rail, project figure column, stats chart, tools index, chat composer) | `overflow-x: clip` on `html` and `main` only. Never on `body`, never `overflow: hidden` or `auto` on a sticky ancestor, never `content-visibility` on or around sticky. |
| 1 (CSS scroll-driven) | Home wordscroll (`.ws`), reading hairline on articles and home (`scroll(root)`) | Inside `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. Nothing else is scroll-linked. Firefox, older Safari and short viewports get the static, fully inked version. No JS fallback. |
| Response | Underline 1px to 2px, button `translateY(1px)`, tab underline slide, accordion, dialog and sheet fade plus 4px, toasts, tracker drag lift | Use `--dur-press`, `--dur-ui`, `--dur-sheet`, `--ease-print`. |

**Banned:** parallax, marquees and infinite scrollers, typing effects, smooth cursors, page transitions, pulsing dots and pulse skeletons, fade-up or reveal-on-scroll on sections, hover lifts (`hover:-translate-y`), Lenis, GSAP, `motion` / framer-motion, any scroll animation library on any route.

**Reduced motion:** durations drop to .01ms and the wordscroll prints fully inked. Sticky stays, because it is layout.

**Media:** nothing autoplays. YouTube is a click-to-load facade.

## Night print (dark mode)

- Token flip on `<html class="dark">`, driven by next-themes. The default is Paper (`ThemeProvider defaultTheme="light" enableSystem`), so the first visit is light; the menu sheet offers Paper, Night and System, and the running head has a Night toggle from 1024px.
- Do not write dark-variant classes. Every colour already flips through the tokens; existing ones are deleted as files are touched.
- Engravings flip through `--plate-alpha`; photos keep the `.plate` duotone; the grain tile swaps.
- `color-scheme` follows the theme. Viewport `themeColor` is paper by day and night paper at night, and the manifest uses paper; both read their hex from `src/lib/print-hex.ts`.
- OG and certificate images are always printed on paper.

## Print

The print stylesheet forces paper tokens, hides the running head, menu sheet and engraving band, stops the wordscroll, and prints link URLs.

## Shared class tokens

```ts
import { SURFACE, SURFACE_PADDING, SECTION_SPACING } from "@/lib/design-system"
```

| Export | Keys | Use |
|---|---|---|
| `SURFACE` | `solid` (frame), `inset`; `glass` and `glassNoBlur` are retired aliases of `solid` | Surface classes, see [surfaces.md](./surfaces.md) |
| `SURFACE_PADDING` | `default`, `compact`, `cozy` | Inner padding |
| `SECTION_SPACING` | `section` (`mt-12 sm:mt-16`), `sectionGap` (`mt-3`) | Section rhythm |
