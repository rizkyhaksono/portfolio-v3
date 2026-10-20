# UI design system: one ink

**This folder is the source of truth for every UI decision in Portfolio v3.** The agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`) only summarise it. When a summary and these docs disagree, these docs win. Code tokens live in `src/app/globals.css`, `tailwind.config.ts` and `src/lib/design-system.ts`.

The site is one printed publication: one cobalt ink on cream paper with riso grain, Literata italic headings, square corners, hairline rules, duotone plates, and an engraving band (Wenceslaus Hollar, *Landscape with a Rider*, 1650) at the foot of every page that has the full colophon (the compact footer on `/ai` and `/chat` has none), and a printing-press engraving (after Jan van der Straet, *Impressio librorum*, c. 1600) beside the home hero from `lg`. The site opens in Paper (light). Dark mode, "Night print", is the same sheet reversed: cream ink on night paper; the menu sheet offers Paper, Night and System. Hierarchy comes from size, italic against roman, and rules. Never from extra colour, capitals or mono labels.

The earlier monochrome / grayscale language (Instrument Serif, Bricolage Grotesque, Inter, JetBrains Mono, `MacWindow` panels, glass surfaces) is retired. Do not reintroduce any of it.

## Index

| Doc | Covers |
|---|---|
| [design-system.md](./design-system.md) | Ink and paper tokens, contrast and its guard test, Literata roles, compact type scale, lines, texture, motion tiers, banned list, dark mode, print |
| [surfaces.md](./surfaces.md) | The three surfaces: frame, inset, lift |
| [page-shell.md](./page-shell.md) | BaseLayout, running head, menu sheet, colophon, page patterns, widths |
| [components.md](./components.md) | Primitive rules, links, fields, plates, hover tips, data viz, Umami event rules |
| [platforms.md](./platforms.md) | Visitor, user, admin and auth shells, plus the agent file map |

## The rules in one screen

1. **One ink.** Colour classes are `ink`, `ink-soft`, `paper`, `tint`, `rule`, `rule-strong`, or the shadcn names that map onto them (`background`, `foreground`, `muted`, `border`, `primary`, ...). No other hue, no hex, no `white` / `black`, no dark-variant classes.
2. **One family.** Literata roman and italic. System mono only inside code, kbd and raw data.
3. **Radius 0.** The radio dot is the only circle.
4. **Three surfaces.** Frame, inset, lift. Nothing else.
5. **No decoration from the screen.** No gradients, glass, blur, glows or soft shadows. The only shadow is the ink lift on floating layers.
6. **The press moves once.** Native scroll and sticky layouts; two CSS scroll-driven effects; response motion on input. No scroll animation library.
7. **State by shape and word.** Errors, destructive actions and status never rely on colour.
8. **Plain copy.** Sentence case, no upper-case transform, no letter-spacing, no middle-dot meta strings, no "→" on links, numbers only for real sequences.
9. **Umami events.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track`.
10. **Grep gate at 0** on every path you touch.

## Migration

Every route is on the one-ink system and both grep gates are clean over `src/` and `content/`. Keep it that way: any file you touch must still pass the gate, and never add a banned class.

## Brand

The mark is an RH monogram in one ink, so Night print reverses it for free. On a 64-unit square it is three stems (R, the shared R-bowl and H-left stem, H right), a square R bowl, one crossbar running from the R stem through the H, and a 45 degree leg to the foot of the shared stem. Always place it through `<Logo>` (`src/components/ui/logo.tsx`); never paste the SVG or recolour it.

| Variant | Where | How it renders |
|---|---|---|
| `mini` | Running head (`size-8`, before the wordmark), admin spine, auth shell wordmark | Inline SVG glyph from `logo-art.ts`, `currentColor`, viewBox `0 0 64 64` |
| `mark` | Colophon (`w-20 sm:w-28`), 404 and error views (`NotFoundView`, `w-20 sm:w-24`), auth shell (`w-28`), locked Etan AI view | The glyph plus four registration ticks on its trim lines, ink at 60% opacity (`stroke-ink opacity-60`), viewBox `-4 0 72 64` |
| `tile` | Favicon and app icon art, standalone files | The glyph in paper reversed out of an ink square |

- `label` gives the mark `role="img"` and a name (`"Rizky Haksono"`); leave it out when the name is printed beside it.
- Size it with a width or `size-*` class only; the viewBox keeps the proportions.
- Standalone art on paper or night paper: `public/brand/{mark,tile,lockup}-{light,dark}.svg`. `og-mark.svg` is the glyph and ticks with no background, read by `src/app/api/og/print-assets.ts` for the OG and certificate images. `global-error.tsx` (no CSS there) uses `mark-light.svg`.
- Generated, never hand-edited: `public/brand/*.svg`, `src/app/icon.svg`, `src/app/apple-icon.png` (glyph at 70% of the tile, 180px), `src/app/favicon.ico` (16 and 32px) and `src/components/ui/logo-art.ts`. `favicon.ico` must stay at that path: the container healthcheck fetches `/favicon.ico`.
- Regenerate with `node scripts/logo/make.mjs` (Node 22.18 or newer: it imports `src/lib/print-hex.ts` directly). The one geometry source is the `GLYPH` and `MARKS` constants at the top of the script. Colours are written as `rgb()` from `PRINT_HEX` because the grep gate bans hex literals in `src/`. The lockup's name is live `<text>` in Literata italic that falls back to Georgia italic where Literata is not installed.

## Grep gate

Both commands must print nothing. `$PHASE_PATHS` is the list of paths your change touched; the final run uses `src content` and every route already passes. Hex copies of the tokens live only in `src/lib/print-hex.ts` (theme-color, manifest, global-error, the plate filter tables), which the second command skips.

```bash
grep -rnIE "uppercase|tracking-[[]|(text|bg|border|from|to|via|ring|fill|stroke|divide|outline)-(green|red|yellow|orange|emerald|teal|violet|purple|blue|sky|indigo|amber|pink|rose|lime|cyan|neutral|zinc|slate|gray)-[0-9]{2,3}|shadow-(sm|md|lg|xl|2xl)|backdrop-blur|rounded-(sm|md|lg|xl|2xl|3xl|full)|dark:|BlurFade|from .motion|recharts" $PHASE_PATHS | grep -v "radio-group.tsx"
grep -rnIE "\bfont-mono\b|bg-gradient|gradient-to|(text|bg|border|fill|stroke|ring|from|to|via)-(white|black)\b|[\"' ]rounded[\"' ]|rounded-\[|rounded-(t|b|l|r|tl|tr|bl|br)-|#[0-9a-fA-F]{6}\b|text-(foreground|primary|muted-foreground)/[0-9]" $PHASE_PATHS content | grep -vE "code-block|kbd|api/(og|certificate)|lib/print-hex"
```

The exclusions are deliberate: `radio-group.tsx` owns the one circle, code blocks and `kbd` own mono, and the OG / certificate image routes paint fixed paper colours.

## Source of truth in code

- Tokens: `src/app/globals.css` (`:root`, `.dark`, print), `tailwind.config.ts` (colours, `fontSize`, radius), `src/lib/design-system.ts` (`SURFACE`, `SECTION_SPACING`)
- Fonts: `src/app/layout.tsx` (Literata via `next/font/google`)
- Shell: `src/components/layout/base-layout.tsx`
- Primitives: `src/components/ui/`
- Logo: `src/components/ui/logo.tsx`, art from `scripts/logo/make.mjs`
- Contrast guard: `src/__tests__/unit/lib/contrast.test.ts`
- Hover tips: `src/components/ui/hover-tip.tsx`
- Generated card URLs: `ogImageUrl` in `src/lib/site-url.ts`
- Navigation: `src/commons/constants/navigation-menu.ts` (single source for head, menu, colophon, command palette, terminal)
