# UI design system: Lautan Pasir

**This folder is the source of truth for every UI decision in Portfolio v3.** The agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`) only summarise it. When a summary and these docs disagree, these docs win. Code tokens live in `src/app/globals.css`, `tailwind.config.ts` and `src/lib/design-system.ts`.

The site is one printed publication: one cobalt ink on cream paper with riso grain, Literata italic headings, square corners, hairline rules, and an engraving band (Wenceslaus Hollar, *Landscape with a Rider*, 1650) at the foot of every page. Dark mode, "Night print", is the same sheet reversed: cream ink on night paper. Hierarchy comes from size, italic against roman, and rules. Never from extra colour, capitals or mono labels.

The earlier monochrome / grayscale language (Instrument Serif, Bricolage Grotesque, Inter, JetBrains Mono, `MacWindow` panels, glass surfaces) is retired. Do not reintroduce any of it.

## Index

| Doc | Covers |
|---|---|
| [design-system.md](./design-system.md) | Ink and paper tokens, contrast, Literata roles, type scale, lines, texture, motion tiers, banned list, dark mode, print |
| [surfaces.md](./surfaces.md) | The three surfaces: frame, inset, lift |
| [page-shell.md](./page-shell.md) | BaseLayout, running head, menu sheet, colophon, page patterns, widths |
| [components.md](./components.md) | Primitive rules, links, fields, data viz, Umami event rules |
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

The printer's mark is the Tengger caldera seen from Penanjakan (Bromo's smoking caldera, Batok's ridged dome, Semeru far right) over the dashed sand sea, with an italic Literata "Rh" on the sand. It is one ink like everything else, so Night print reverses it for free. Always place it through `<Logo>` (`src/components/ui/logo.tsx`); never paste the SVG or recolour it.

| Variant | Where | How it renders |
|---|---|---|
| `mini` | Running head (32px before the wordmark), admin spine | Inline SVG from `logo-art.ts`, `currentColor` |
| `mark` | Auth shell, locked Etan AI view | `.logo-mask--mark` over `public/brand/mark-mask.svg` |
| `seal` | Colophon (96 to 112px), 404 and error views (`NotFoundView`) | `.logo-mask--seal` over `public/brand/seal-mask.svg` |

- `label` gives the mark `role="img"` and a name ("Rizky Haksono printer's mark"); leave it out when the name is printed beside it.
- Size it with a width class only (`w-24`); the mask keeps the square.
- `public/brand/{seal,mark,mini,lockup}-{light,dark}.svg` are standalone art on paper or night paper. The OG and certificate images and `global-error.tsx` (no CSS there) use `seal-light.svg`.
- Generated, never hand-edited: `public/brand/*.svg`, `src/app/icon.svg`, `src/app/apple-icon.png`, `src/components/ui/logo-art.ts`. Regenerate with `node scripts/logo/make.mjs <font dir>`, where the folder holds `Literata-Italic[opsz,wght].ttf` (OFL, kept outside the repo, for example `../art-src/fonts`).

## Grep gate

Both commands must print nothing. `$PHASE_PATHS` is the list of files your change touched. List files, not folders: until P2 and P3 migrate them, untouched files in the same folders still carry old literals. The final run uses `src content`. Hex copies of the tokens live only in `src/lib/print-hex.ts` (theme-color, manifest, global-error), which the second command skips.

```bash
grep -rnE "uppercase|tracking-[[]|(text|bg|border|from|to|via|ring|fill|stroke|divide|outline)-(green|red|yellow|orange|emerald|teal|violet|purple|blue|sky|indigo|amber|pink|rose|lime|cyan|neutral|zinc|slate|gray)-[0-9]{2,3}|shadow-(sm|md|lg|xl|2xl)|backdrop-blur|rounded-(sm|md|lg|xl|2xl|3xl|full)|dark:|BlurFade|from .motion|recharts" $PHASE_PATHS | grep -v "radio-group.tsx"
grep -rnE "\bfont-mono\b|bg-gradient|gradient-to|(text|bg|border|fill|stroke|ring|from|to|via)-(white|black)\b|[\"' ]rounded[\"' ]|rounded-\[|rounded-(t|b|l|r|tl|tr|bl|br)-|#[0-9a-fA-F]{6}\b|text-(foreground|primary|muted-foreground)/[0-9]" $PHASE_PATHS content | grep -vE "code-block|kbd|api/(og|certificate)|lib/print-hex"
```

The exclusions are deliberate: `radio-group.tsx` owns the one circle, code blocks and `kbd` own mono, and the OG / certificate image routes paint fixed paper colours.

## Source of truth in code

- Tokens: `src/app/globals.css` (`:root`, `.dark`, print), `tailwind.config.ts` (colours, `fontSize`, radius), `src/lib/design-system.ts` (`SURFACE`, `PAGE_WIDTH`, `SECTION_SPACING`)
- Fonts: `src/app/layout.tsx` (Literata via `next/font/google`)
- Shell: `src/components/layout/base-layout.tsx`
- Primitives: `src/components/ui/`
- Logo: `src/components/ui/logo.tsx`, art from `scripts/logo/make.mjs`
- Navigation: `src/commons/constants/navigation-menu.ts` (single source for head, menu, colophon, command palette, terminal)
