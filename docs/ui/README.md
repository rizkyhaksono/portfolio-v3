# UI design system: Drafting sheet

**This folder is the source of truth for every UI decision in Portfolio v3.** The agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`) only summarise it. When a summary and these docs disagree, these docs win. Code tokens live in `src/app/globals.css`, `tailwind.config.ts` and `src/lib/design-system.ts`.

The site is an engineering drafting sheet: near-black ink on off-white paper, IBM Plex Sans and Mono, square corners, hairline rules, and one orange mark colour that appears only on marks (the focus ring, the current page, the reading line, crop marks on photos). Dark mode is the same sheet reversed: off-white ink on near-black paper. Hierarchy comes from size, weight and rules. Never from extra colour, capitals, italics or mono labels.

Two earlier languages are retired. Do not reintroduce any of either:

- **Lautan Pasir** (release 1.5.0): cobalt ink on cream paper, Literata italic headings, riso grain and speckle, a duotone engraving band, the Tengger caldera logo, "Night print".
- **The monochrome / grayscale language** before it: Instrument Serif, Bricolage Grotesque, Inter, JetBrains Mono, `MacWindow` panels, glass surfaces.

## Index

| Doc | Covers |
|---|---|
| [design-system.md](./design-system.md) | Tokens, the orange list, contrast, IBM Plex roles, type scale, lines, ornaments, motion tiers, banned list, dark mode, print |
| [surfaces.md](./surfaces.md) | The three surfaces: frame, inset, lift |
| [page-shell.md](./page-shell.md) | BaseLayout, running head, menu sheet, colophon title block, page patterns, home hero, widths |
| [components.md](./components.md) | Primitive rules, links, fields, plates, data viz, Umami event rules |
| [platforms.md](./platforms.md) | Visitor, user, admin and auth shells, plus the agent file map |

## The rules in one screen

1. **Ink, paper and one mark.** Colour classes are `ink`, `ink-soft`, `paper`, `tint`, `rule`, `rule-strong`, or the shadcn names that map onto them (`background`, `foreground`, `muted`, `border`, `primary`, ...). The orange is `mark` (with `mark-text` and `on-mark`) and only where [design-system.md](./design-system.md#where-orange-may-appear) lists it. No other hue, no hex, no `white` / `black`, no dark-variant classes.
2. **One family.** IBM Plex Sans for everything. IBM Plex Mono only for code, kbd, slugs, keys, raw JSON and title-block values. No italic anywhere.
3. **Radius 0.** The radio dot is the only circle.
4. **Three surfaces.** Frame, inset, lift. Nothing else.
5. **No decoration from the screen.** No gradients, glass, blur, glows or soft shadows. The only shadow is the ink lift on floating layers. Ornaments are plain 1px rules: no fleuron, grain, speckle, engraving or duotone.
6. **Motion is rationed.** Native scroll and sticky layouts; two CSS scroll-driven effects; response motion on input. No scroll animation library.
7. **State by shape and word.** Errors, destructive actions and status never rely on colour.
8. **Plain copy.** Sentence case, no upper-case transform, no letter-spacing, no middle-dot meta strings, no "→" on links, numbers only for real sequences, no print metaphors in wording.
9. **Umami events.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track`.
10. **Three grep gates at 0** on every path you touch.

## Migration

Every route is on the drafting sheet and all three grep gates are clean over `src/` and `content/`. Keep it that way: any file you touch must still pass the gates, and never add a banned class or a retired-system term.

## Brand

The mark is the RH monogram "a1": three square stems (R, the stem R and H share, H right), a square R bowl closed by the shared stem, one crossbar that runs from the R stem through the H, and a 45° leg from the crossbar to the foot of the shared stem. Square terminals, every edge on a whole unit of a 64-unit grid. It reads as RH at 16px and uses one drawing at every size. Always place it through `<Logo>` (`src/components/ui/logo.tsx`); never paste the SVG or recolour it.

| Variant | Where | How it renders |
|---|---|---|
| `mini` | Running head (32px before the wordmark), admin spine, the narrow auth shell | Inline SVG from `logo-art.ts`, `currentColor`, viewBox `0 0 64 64` |
| `mark` | Colophon title block, 404 and error views (`NotFoundView`), the split auth shell (from 768px), locked Etan AI view | The glyph plus four orange crop marks on the trim lines, viewBox `-4 0 72 64`. Display sizes only: the marks are sub-pixel at 32px |
| `tile` | Favicon and app icons | The glyph reversed out of an ink square. The same drawing is `src/app/icon.svg` |

- `label` gives the logo `role="img"` and a name; leave it out when the name is written beside it (the running head).
- Size it with a width class only (`w-24`, `size-8`).
- Generated, never hand-edited: `src/components/ui/logo-art.ts`, `src/app/icon.svg`, `src/app/apple-icon.png`, `src/app/favicon.ico` (16 and 32 PNG-in-ICO, at that exact path because the Swarm healthchecks and the API's Swagger page fetch `/favicon.ico`), `public/brand/{mark,tile,lockup}-{light,dark}.svg` and `public/brand/og-mark.svg` (the OG and certificate images read it). Regenerate with `node scripts/logo/make.mjs` after changing the geometry; it needs no font.
- `global-error.tsx` has no CSS, so it uses `/brand/mark-light.svg`.

## Grep gates

All three must print nothing: gate 1 bans classes, gate 2 bans literals, gate 3 keeps the retired Lautan Pasir system out. `$PHASE_PATHS` is the list of files your change touched, or `src` for a full run. Gate 3 always runs over `src content`. Hex copies of the tokens live only in `src/lib/print-hex.ts` (theme-color, manifest, OG and certificate images, global-error, the settings swatch) and the generated `src/app/icon.svg`, which gate 2 skips.

```bash
grep -rnIE "uppercase|tracking-[[]|(text|bg|border|from|to|via|ring|fill|stroke|divide|outline)-(green|red|yellow|orange|emerald|teal|violet|purple|blue|sky|indigo|amber|pink|rose|lime|cyan|neutral|zinc|slate|gray)-[0-9]{2,3}|shadow-(sm|md|lg|xl|2xl)|backdrop-blur|rounded-(sm|md|lg|xl|2xl|3xl|full)|dark:|BlurFade|from .motion|recharts" $PHASE_PATHS | grep -v "radio-group.tsx"
grep -rnIE "bg-gradient|gradient-to|(text|bg|border|fill|stroke|ring|from|to|via)-(white|black)\b|[\"' ]rounded[\"' ]|rounded-\[|rounded-(t|b|l|r|tl|tr|bl|br)-|#[0-9a-fA-F]{6}\b|text-(foreground|primary|muted-foreground)/[0-9]" $PHASE_PATHS content | grep -vE "code-block|kbd|api/(og|certificate)|lib/print-hex|app/icon\.svg"
grep -rnIE "\bitalic\b|font-style: ?italic|engrav|grain|speckle|Literata|plate-filters|logo-mask|#1E3C9E|#F3ECDC|#0D1433|#EFE6D2|Hollar|Tengger|caldera" src content \
  | grep -vE "content/changelog/(2025-|2026-0|2026-10-19)|rich-text-editor.tsx"
```

The exclusions are deliberate. Gate 1: `radio-group.tsx` owns the one circle. Gate 2: code blocks and `kbd` own mono, the OG and certificate image routes paint fixed paper colours, and `print-hex.ts` and `icon.svg` hold the only hex copies. Gate 3: changelog entries before 1.6.0 describe the old systems (`content/changelog/2025-*`, `2026-0*` and `2026-10-19`), and `rich-text-editor.tsx` names TipTap's own `italic` mark.

## Source of truth in code

- Tokens: `src/app/globals.css` (`:root`, `.dark`, print), `tailwind.config.ts` (colours, `fontSize`, radius), `src/lib/design-system.ts` (`SURFACE`, `PAGE_WIDTH`, `SECTION_SPACING`)
- Contrast guard: `src/__tests__/unit/lib/contrast.test.ts` (floors for every token pair, and that `print-hex.ts` matches the CSS)
- Fonts: `src/app/layout.tsx` (IBM Plex Sans and Mono via `next/font/google`); the OG and certificate images read `src/assets/fonts/ibm-plex-sans-latin-{400,600}-normal.woff`
- Shell: `src/components/layout/base-layout.tsx`
- Primitives: `src/components/ui/`
- Logo: `src/components/ui/logo.tsx`, art from `scripts/logo/make.mjs`
- Navigation: `src/commons/constants/navigation-menu.ts` (single source for head, menu, colophon, command palette, terminal)
