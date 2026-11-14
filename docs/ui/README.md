# UI design system: Notion workspace

**This folder is the source of truth for every UI decision in Portfolio v3.** The agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.geminirules`, `.cursorrules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`) point here or summarise it. When a summary and these docs disagree, these docs win; when these docs and the code disagree, the code in the files listed at the end wins and the docs get fixed. Code tokens live in `src/app/globals.css`, `tailwind.config.ts`, `src/lib/design-system.ts` and `src/lib/theme-hex.ts`.

The site is laid out like a Notion workspace, equally good in light and dark. Every visitor page has Notion's grey sidebar with the owner's row and the pages with their icons, a thin top bar with the page's path and the theme toggle, then the page in Notion's 708px column: an icon above a 40px bold title, a muted description, properties, and the content as Notion blocks and views (list, gallery, table, callout, toggle). Everything is monochrome: ink, grey and translucent tints, set in one sans, Onest. Blue appears only in the home page's cover, where the Langit Malang sky (the painted Malang sky by the hour, with Arjuno, Semeru and grass hills) survives as Notion's page cover, and in the text selection. Each page ends on one quiet line. The admin keeps its own shell until its rebuild.

## Index

| Doc | Covers |
|---|---|
| [design-system.md](./design-system.md) | Tokens and tints, colour use, contrast and its guard test, Onest and the Notion type scale, width, radii, shadow, the home cover, motion and reduced motion, themes |
| [surfaces.md](./surfaces.md) | Page, sidebar, tile, frame, float, inverted, tints |
| [page-shell.md](./page-shell.md) | BaseLayout, sidebar, top bar and breadcrumb, menu sheet, closing line, width and alignment, page patterns, the home |
| [components.md](./components.md) | Primitive rules, links, fields, views, data viz, copy, Umami events, accessibility floor |
| [platforms.md](./platforms.md) | Visitor, user, admin and auth shells, outliers, the agent file map |

## The rules in one screen

1. **Tokens only.** Colours come from the token classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border`, `border-input`, `bg-popover`, `text-destructive`) and the tints (`bg-tint`, `bg-tint-strong`). No hex, no `white` or `black`, no palette colours (`gray-500`, `blue-600`), no `dark:` classes.
2. **Monochrome Notion.** Page text, titles and links are ink (`text-foreground`); secondary text is grey. Hover and callouts are `bg-tint`, tags and selected items `bg-tint-strong`. The primary button is ink. Blue (`sky`, `sky-wash`) lives only in the home cover and the text selection; the cover's grass greens are an illustration-only exception. Never blue for links, buttons, focus, charts, tags or hover.
3. **One sans.** Onest everywhere, weights 400 to 700: 400 text, 500 UI emphasis, 600 headings, 700 page titles. No serif, no handwritten face. System mono only for code.
4. **The scale.** Sizes come from the `fontSize` keys, which carry weight and tracking: 14px UI (`small`), 16px page text (`body`, `prose`), 24px sections (`h2`), 40px page titles (`text-title sm:text-display`). No `text-[Npx]`, no `tracking-[…]`, no `uppercase`.
5. **Notion radii.** Tags `rounded` (4px), controls and rows `rounded-md` (6px), cards, images and floating layers `rounded-lg` (10px), dots `rounded-full`. No `rounded-[…]`, `rounded-xl` or `rounded-2xl`. No boxes around sections; at most one callout per page.
6. **No shadows, no blur.** Floating layers are set apart by a hairline; the tooltip and toast are inverted. The top bar is sticky and opaque. No gradients outside `globals.css` and `sky.tsx`.
7. **Quiet motion.** Hover tints, the link underline, the toggle triangle, the tab bar, the theme crossfade, Radix fades, and the cover's slow clouds and grass with a pause toggle that stays visually hidden until keyboard focus. CSS or platform native only; no motion library. Phones get a still cover, and reduced motion stops all of it.
8. **The shell.** Every visitor page uses `BaseLayout`: sidebar (lg and up) or the Menu sheet, the 44px top bar, the 708px column with every line left-aligned (`/tools` and `/chat` full width), and the closing line. One `PageHeader` per page; content as list, gallery or table views.
9. **Plain copy.** Sentence case, plain verbs, honest empty, loading and error states. No em dash in UI strings, no generic CTAs, no buzzwords.
10. **Umami events.** `data-umami-event` only on `<button>` and external `target="_blank"` links. Internal links use `data-track`.
11. **The gate stays green.** `bun run test` runs the UI gate; see below.

## The UI gate

The gate is the jest test `src/__tests__/unit/lib/ui-gate.test.ts`. `bun run test` runs it, and CI runs `bun run test` before every deploy, so a broken rule blocks the release. It scans `src/`, `content/` and `tailwind.config.ts`. Run it alone with `bunx jest src/__tests__/unit/lib/ui-gate.test.ts`.

| Rule | Bans | Allowed in |
|---|---|---|
| R1 | Print-era token classes (`text-ink`, `bg-paper`, `border-rule`, `text-ink-soft`, `border-rule-strong` on any prefix) and the `font-display` alias. `tint` is no longer on the list: the name now belongs to Notion's fills (`bg-tint`, `bg-tint-strong`) | nowhere |
| R1b | Print-era variables and identifiers: `var(--ink)`, `var(--paper)`, `var(--tint)`, `var(--rule)`, `var(--plate-alpha)`, `var(--ease-print)`, `PRINT_HEX`, `Plus_Jakarta`, `#1E3C9E`, `#F3ECDC` | `src/app/api/og/print-assets.ts` (the card font, until it moves to Onest); old changelog entries |
| R1c | Identity classes from the old designs: `speckle`, `engraving`, `masthead`, `ws__w`, `plate-paper`, `plate-night`, `plate-swap`, `tail-piece`, `article-rail`, `reading-hairline`, `bg-paper-grain`, `ink-grain` | old changelog entries |
| R2 | `dark:` classes | nowhere |
| R3 | Raw colour in `src/` code: hex literals and Tailwind palette colours, `text-white` and the like | `src/lib/theme-hex.ts`; CSS files are not scanned |
| R4 | Arbitrary values in `src/`: `rounded-[…]`, `text-[Npx]`, `tracking-[…]`, and `uppercase` | four admin files, until the admin rebuild |
| R5 | Motion libraries: `framer-motion`, `motion`, `gsap`, `lenis`, and `animate-bounce` / `animate-ping` | nowhere |
| R6 | Gradients and blur | `globals.css`, `sky.tsx` (the home cover) |
| R7 | Em dash in UI strings under `src/app`, `src/components`, `src/commons` | `src/app/_components/blog/format.ts` |
| R8 | Shadows: `shadow-*` and `drop-shadow-*` classes (except `shadow-none`), `box-shadow`, `boxShadow` | `box-shadow` in `globals.css` only |

Comment lines are skipped by R3, R4, R6, R7 and R8. Generic CTAs and buzzwords are copy rules (see [components.md](./components.md#copy)) checked in review.

**Shrinking allowlists.** Some rules carry a list of files still allowed to break them. The lists only shrink: each PR removes the files it fixes. Only the four admin files on R4 and the OG font file on R1b remain. Never add a file to an allowlist and never loosen a pattern; fix the file instead.

## Rollout

The redesign ships as v2.0.0 through a series of PRs into the v2 integration branch: token rename (PR0), foundation (PR1), the visitor pages (PR2), then the Notion workspace (PR3, `v2-pr3-notion`): the sidebar shell, Notion neutrals, the Notion type scale and components, the Langit Malang sky moved from the footer to the home cover, and the Notion-style sign-in. The admin rebuild comes after. The old masthead, wordscroll, engraving, logo mark, `Marker`, the handle header and the footer sky band are deleted, not hidden.

Build toward these docs, never toward old code: when you touch a file, move it to these rules, and never copy an old pattern into new code.

## Source of truth in code

- Tokens: `src/app/globals.css` (`:root`, `.dark`, `.prose`, the `.sky` block with `.sky--cover`), `tailwind.config.ts` (colours with `tint`, `fontSize`, `borderRadius`, durations, the `out` easing), `src/lib/design-system.ts` (`SURFACE`, `SECTION_SPACING`, `PROSE_WIDTH`, `WIDE_WIDTH`)
- Hex copies: `src/lib/theme-hex.ts` (`THEME_HEX`)
- Font: `src/app/layout.tsx` (Onest via `next/font/google`, `--font-sans`)
- Shell: `src/components/layout/base-layout.tsx`, `sidebar.tsx`, `sidebar-nav.tsx`, `top-bar.tsx`, `breadcrumb.tsx`, `contents-trigger.tsx`, `contents-sheet.tsx`, `section-icons.tsx`, `footer.tsx`, `auth-shell.tsx`
- Theme: `src/components/layout/theme-provider.tsx`, `theme-toggle.tsx` (`switchTheme()`)
- Home cover: `src/components/ui/sky.tsx` (`Sky`, `SkyCover`, `SkyToggle`, `MalangClock`), `src/lib/malang-time.ts` (`skyPhase`), the `.sky` block in `globals.css`
- Primitives: `src/components/ui/` (Notion page patterns: `page-header.tsx`, `properties.tsx`, `callout.tsx`, `ledger.tsx`, `media-card.tsx`, `table.tsx`, `article-shell.tsx`)
- Guards: `src/__tests__/unit/lib/contrast.test.ts`, `src/__tests__/unit/lib/ui-gate.test.ts`
- Hover tips: `src/components/ui/hover-tip.tsx`
- Generated card URLs: `ogImageUrl` in `src/lib/site-url.ts`
- Navigation: `src/commons/constants/navigation-menu.ts` (one source for the sidebar, the menu sheet, the breadcrumb and the terminal)
