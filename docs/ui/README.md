# UI design system: Langit Malang

**This folder is the source of truth for every UI decision in Portfolio v3.** The agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.cursorrules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`) point here or summarise it. When a summary and these docs disagree, these docs win. Code tokens live in `src/app/globals.css`, `tailwind.config.ts`, `src/lib/design-system.ts` and `src/lib/theme-hex.ts`.

Langit Malang ("the Malang sky") is a calm, elegant, Apple-like look, equally good in light and dark: large tight semibold headlines, generous whitespace, soft large radii, quiet grey surfaces, one translucent sticky bar and slow eased motion, all in one font family, Onest. The one bold element is the sky, a blue band at the top of visitor pages whose colour follows the time of day in Malang and turns to the night sky in dark mode. Everything else is quiet. The public site is a centred column; the admin is full width.

## Index

| Doc | Covers |
|---|---|
| [design-system.md](./design-system.md) | Tokens, the accent, contrast and its guard test, Onest and the type scale, width, radii, shadow, blur, the sky, motion and reduced motion, themes |
| [surfaces.md](./surfaces.md) | Page, tile, frame, float, and the one translucent bar |
| [page-shell.md](./page-shell.md) | BaseLayout, header, menu, footer, width and alignment, page patterns, the home |
| [components.md](./components.md) | Primitive rules, links, fields, media, data viz, copy, Umami events, accessibility floor |
| [platforms.md](./platforms.md) | Visitor, user, admin and auth shells, outliers, the agent file map |

## The rules in one screen

1. **Tokens only.** Colours come from the token classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border`, `border-input`, `bg-popover`, `text-destructive`). No hex, no `white` or `black`, no palette colours (`gray-500`, `blue-600`), no `dark:` classes.
2. **Blue is the sky's.** `sky` and `sky-wash` appear in exactly two places: the sky band and the `Marker`. Never for links, buttons, focus, charts or hover.
3. **One family.** Onest everywhere, weights 400, 500 and 600. System mono only for code.
4. **The scale.** Sizes come from the `fontSize` keys, which carry the tracking. No `text-[Npx]`, no `tracking-[…]`, no `uppercase`.
5. **Soft radii that grow with the surface.** Fields and buttons `lg`, chips `md`, floating layers `xl`, tiles `2xl`, dots `full`. No `rounded-[…]`.
6. **Shadow and blur are rare.** `shadow-float` on floating layers only. The translucent sticky header is the only blur. No gradients outside `globals.css` and the sky.
7. **Smooth, never busy.** Route crossfade, project morph, theme crossfade, link underline, card hover, the sky's slow clouds with a pause control. CSS or platform native only; no motion library. Reduced motion stops all of it.
8. **Centred, then left.** Short display lines are centred; prose, lists and rows are left-aligned inside the centred column. The admin is full width.
9. **Plain copy.** Sentence case, plain verbs, honest empty, loading and error states. No em dash in UI strings, no generic CTAs, no buzzwords.
10. **Umami events.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track`.
11. **The gate stays green.** `bun run test` runs the UI gate; see below.

## The UI gate

The gate is the jest test `src/__tests__/unit/lib/ui-gate.test.ts`. `bun run test` runs it, and CI runs `bun run test` before every deploy, so a broken rule blocks the release. It scans `src/`, `content/` and `tailwind.config.ts`. Run it alone with `bunx jest src/__tests__/unit/lib/ui-gate.test.ts`.

| Rule | Bans | Allowed in |
|---|---|---|
| R1 | Old token classes (`text-ink`, `bg-paper`, `bg-tint`, `border-rule`, `text-ink-soft` and every other prefix) and the `font-display` alias | nowhere |
| R1b | Old variables and identifiers: `PRINT_HEX`, `--paper`, `--ink`, `--tint`, `--rule`, `--plate-alpha`, `--ease-print`, `#1E3C9E` and so on | nowhere |
| R1c | Identity classes from the old design: `speckle`, `engraving`, `masthead`, `plate`, `bg-hatch` and so on | nowhere |
| R2 | `dark:` classes | nowhere |
| R3 | Raw colour: hex literals and Tailwind palette colours | `src/lib/theme-hex.ts`, `globals.css`, the OG and certificate routes |
| R4 | Arbitrary values: `rounded-[…]`, `text-[Npx]`, `tracking-[…]`, and `uppercase` | nowhere |
| R5 | Motion libraries: `framer-motion`, `motion`, `gsap`, `lenis`, and `animate-bounce` / `animate-ping` | nowhere |
| R6 | Gradients and blur | `globals.css`, `sky.tsx`, `running-head.tsx` (the one translucent bar) |
| R7 | Copy: em dash in UI strings, generic CTAs, buzzwords | nowhere |

**Shrinking allowlists.** While the redesign lands, some rules carry a list of files still allowed to break them. The lists only shrink: each PR removes the files it fixes, and the cleanup PR empties them. Never add a file to an allowlist and never loosen a pattern; fix the file instead. The "Allowed in" column is the only permanent exception.

## Rollout

The redesign ships as v2.0.0 through a series of PRs into the v2 integration branch: token rename (PR0), foundation with tokens, Onest, primitives and these docs (PR1), the shell, the sky and the home (PR2), projects, writing and view transitions (PR3), the other visitor pages (PR4), the admin (PR5 and PR6) and cleanup (PR7).

Until a piece lands, some code still shows the old look, and some names in these docs (`Sky`, `PageHeader`, `MediaCard`, `Marker`, `PROSE_WIDTH`, `WIDE_WIDTH`, `BREAKOUT`) may not exist yet. Build toward these docs, never toward the old code: when you touch a file, move it to these rules, and never copy an old pattern into new code.

## Source of truth in code

- Tokens: `src/app/globals.css` (`:root`, `.dark`, the `.sky` block), `tailwind.config.ts` (colours, `fontSize`, `borderRadius`, `boxShadow.float`, the `out` easing), `src/lib/design-system.ts` (`SURFACE`, `SECTION_SPACING`, widths)
- Hex copies: `src/lib/theme-hex.ts` (`THEME_HEX`)
- Font: `src/app/layout.tsx` (Onest via `next/font/google`, `--font-sans`)
- Shell: `src/components/layout/base-layout.tsx`, `running-head.tsx`, `contents-sheet.tsx`, `footer.tsx`
- Theme: `src/components/layout/theme-provider.tsx`, `theme-toggle.tsx` (`switchTheme()`)
- Sky: `src/components/ui/sky.tsx`, `src/lib/malang-time.ts` (`skyPhase`)
- Primitives: `src/components/ui/`
- Guards: `src/__tests__/unit/lib/contrast.test.ts`, `src/__tests__/unit/lib/ui-gate.test.ts`
- Hover tips: `src/components/ui/hover-tip.tsx`
- Generated card URLs: `ogImageUrl` in `src/lib/site-url.ts`
- Navigation: `src/commons/constants/navigation-menu.ts` (one source for the header, menu, footer and terminal)
