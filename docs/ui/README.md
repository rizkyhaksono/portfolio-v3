# UI design system: Langit Malang

**This folder is the source of truth for every UI decision in Portfolio v3.** The agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.cursorrules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`) point here or summarise it. When a summary and these docs disagree, these docs win. Code tokens live in `src/app/globals.css`, `tailwind.config.ts`, `src/lib/design-system.ts` and `src/lib/theme-hex.ts`.

Langit Malang ("the Malang sky") is a calm reading page after joshpuckett.me, equally good in light and dark. Every visitor page opens with the handle "@rizkyhaksono" and a short rule, reads in one 36rem column set in one clean sans, Onest, with muted prose and the names in full ink, lists its work as plain rows of a title and one sentence, and ends in a painted sky. The sky is the one bold element: a scene behind the footer whose colour follows the time of day in Malang and turns to the night sky in dark mode, with drifting clouds and grass hills. Everything else is quiet. The admin is full width.

## Index

| Doc | Covers |
|---|---|
| [design-system.md](./design-system.md) | Tokens, colour use, contrast and its guard test, Onest and the type scale, width, radii, shadow, the footer sky, motion and reduced motion, themes |
| [surfaces.md](./surfaces.md) | Page, tile, frame, float |
| [page-shell.md](./page-shell.md) | BaseLayout, the handle header, menu, the painted footer, width and alignment, page patterns, the home |
| [components.md](./components.md) | Primitive rules, links, fields, media, data viz, copy, Umami events, accessibility floor |
| [platforms.md](./platforms.md) | Visitor, user, admin and auth shells, outliers, the agent file map |

## The rules in one screen

1. **Tokens only.** Colours come from the token classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border`, `border-input`, `bg-popover`, `text-destructive`). No hex, no `white` or `black`, no palette colours (`gray-500`, `blue-600`), no `dark:` classes.
2. **Muted prose, names in ink.** Prose and descriptions are `text-muted-foreground`; names, titles and links are `text-foreground`. Blue (`sky`, `sky-wash`) lives only in the footer sky and the text selection; the footer's grass greens are an illustration-only exception. Never blue for links, buttons, focus, charts or hover.
3. **One sans.** Onest everywhere, weights 400 and 500 only (500 for headings, titles and figures, set by the keys). No bold headings, no serif, no handwritten face. System mono only for code.
4. **The scale.** Sizes come from the `fontSize` keys, which carry the tracking. No `text-[Npx]`, no `tracking-[…]`, no `uppercase`.
5. **Radii only on real objects.** Tiles and images `2xl`; controls keep theirs (fields and buttons `lg`, chips `md`, floating layers `xl`, dots `full`). No `rounded-[…]`. No boxes around sections, no stat cards, no dividers except the rule under the handle and the hairline inside the footer.
6. **No shadows, no blur.** No shadows anywhere; floating layers are set apart by a hairline border only. The header is plain and not sticky. No gradients outside `globals.css` and `sky.tsx`.
7. **Smooth, never busy.** Route crossfade, project morph, theme crossfade, link underline, card hover, the footer's slow clouds and grass, which play at once with a pause toggle that stays visually hidden until keyboard focus. CSS or platform native only; no motion library. Phones get a still scene, and reduced motion stops all of it.
8. **One column, left-aligned.** The 36rem column is centred on the page and every line in it is left-aligned; `/tools` and `/chat` use the wide column. Lists are plain rows: a title with one muted line under it. The admin is full width.
9. **Plain copy.** Sentence case, plain verbs, honest empty, loading and error states. No em dash in UI strings, no generic CTAs, no buzzwords.
10. **Umami events.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track`.
11. **The gate stays green.** `bun run test` runs the UI gate; see below.

## The UI gate

The gate is the jest test `src/__tests__/unit/lib/ui-gate.test.ts`. `bun run test` runs it, and CI runs `bun run test` before every deploy, so a broken rule blocks the release. It scans `src/`, `content/` and `tailwind.config.ts`. Run it alone with `bunx jest src/__tests__/unit/lib/ui-gate.test.ts`.

| Rule | Bans | Allowed in |
|---|---|---|
| R1 | Old token classes (`text-ink`, `bg-paper`, `bg-tint`, `border-rule`, `text-ink-soft` and every other prefix) and the `font-display` alias | nowhere |
| R1b | Old variables and identifiers: `PRINT_HEX`, `--paper`, `--ink`, `--tint`, `--rule`, `--plate-alpha`, `--ease-print`, `#1E3C9E` and so on | nowhere |
| R1c | Identity classes from the old designs: `speckle`, `engraving`, `masthead`, `ws__w`, `plate-*`, `tail-piece`, `article-rail`, `reading-hairline`, `bg-paper-grain`, `ink-grain` | nowhere |
| R2 | `dark:` classes | nowhere |
| R3 | Raw colour: hex literals and Tailwind palette colours | `src/lib/theme-hex.ts`, `globals.css`, the OG and certificate routes |
| R4 | Arbitrary values: `rounded-[…]`, `text-[Npx]`, `tracking-[…]`, and `uppercase` | nowhere |
| R5 | Motion libraries: `framer-motion`, `motion`, `gsap`, `lenis`, and `animate-bounce` / `animate-ping` | nowhere |
| R6 | Gradients and blur | `globals.css`, `sky.tsx` (the footer scene) |
| R7 | Copy: em dash in UI strings, generic CTAs, buzzwords | nowhere |
| R8 | Shadows: `shadow-*` utility classes (except `shadow-none`) and `box-shadow` | `box-shadow` in `globals.css` only |

**Shrinking allowlists.** While the redesign lands, some rules carry a list of files still allowed to break them. The lists only shrink: each PR removes the files it fixes. Only four admin files remain, on R4, until the admin rebuild. Never add a file to an allowlist and never loosen a pattern; fix the file instead. The "Allowed in" column is the only permanent exception.

## Rollout

The redesign ships as v2.0.0 through a series of PRs into the v2 integration branch: token rename (PR0), foundation (PR1), every visitor page in the Josh-style layout with the painted footer (PR2, `v2-pr2-layout`), then the admin rebuild. The old masthead, wordscroll, engraving, logo mark and `Marker` are deleted, not hidden.

Build toward these docs, never toward old code: when you touch a file, move it to these rules, and never copy an old pattern into new code.

## Source of truth in code

- Tokens: `src/app/globals.css` (`:root`, `.dark`, the `.sky` block), `tailwind.config.ts` (colours, `fontSize`, `borderRadius`, `boxShadow.float`, the `out` easing), `src/lib/design-system.ts` (`SURFACE`, `SECTION_SPACING`, widths)
- Hex copies: `src/lib/theme-hex.ts` (`THEME_HEX`)
- Font: `src/app/layout.tsx` (Onest via `next/font/google`, `--font-sans`)
- Shell: `src/components/layout/base-layout.tsx`, `running-head.tsx`, `contents-sheet.tsx`, `footer.tsx`
- Theme: `src/components/layout/theme-provider.tsx`, `theme-toggle.tsx` (`switchTheme()`)
- Footer sky: `src/components/ui/sky.tsx` (`Sky`, `SkyToggle`, `MalangClock`), `src/lib/malang-time.ts` (`skyPhase`), the `.sky` block in `globals.css`
- Primitives: `src/components/ui/`
- Guards: `src/__tests__/unit/lib/contrast.test.ts`, `src/__tests__/unit/lib/ui-gate.test.ts`
- Hover tips: `src/components/ui/hover-tip.tsx`
- Generated card URLs: `ogImageUrl` in `src/lib/site-url.ts`
- Navigation: `src/commons/constants/navigation-menu.ts` (one source for the header, menu, footer and terminal)
