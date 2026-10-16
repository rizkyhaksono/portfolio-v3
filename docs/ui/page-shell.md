# Page shell and page patterns

## Shell

```
1024px and up
  Running head (sticky, 52px, paper + grain, 1px rule below):
    Rizky Haksono   Projects Writing Etan AI Chat Tracker Roadmap Tools Stats   [Search ⌘K] [theme] [Account]
  Skip to content
  Bleed slot (home masthead only)
  main#main (overflow-x: clip), wrapper max-w 76rem, side padding clamp(20px, 4vw, 48px)
  Double rule
  Colophon: name, role, email / Read, Try, Site columns / credit line / Back to top
  Engraving band, full bleed, clamp(200px, 26vw, 440px) tall

768px to 1023px   wordmark, Projects Writing Etan AI, [Search] [Contents]
under 768px       wordmark, [Contents]   (48px head, 44px targets)
```

- If the head row overflows at 1024px, Chat moves into Contents for 1024px to 1279px only.
- Credentials and Changelog live in the colophon, Contents and the command palette.
- **Contents** is a full-height Radix Sheet: a search field (opens the palette), every section in 28px italic with a one-line note, a theme radio (Paper, Night, System) and Account.
- The colophon credit line: "Set in Literata. Printed in one ink in Malang, East Java. Plate after Wenceslaus Hollar, *Landscape with a Rider*, 1650, after Jan Wildens, Rijksmuseum (public domain)."
- `src/commons/constants/navigation-menu.ts` is the only nav source. The head, Contents, colophon, command palette and terminal overlay all import it.

### BaseLayout

File: `src/components/layout/base-layout.tsx`. It is a server component and reads no cookies, so pages under it can be static or ISR.

| Prop | Values | Use |
|---|---|---|
| `bleed?` | `ReactNode` | Full-width slot above `main` (home masthead only) |
| `footer?` | `'full'` (default), `'compact'`, `'none'` | `compact` on `/ai` and `/chat` |

- The old `sidebar` and `rightSidebar` props, the navbar, sidebars, right-sidebar windows and visitor panel are gone. Do not bring them back.
- Client islands inside the shell: NavLinks (`aria-current`), ThemeToggle, ContentsTrigger. `DeferredClientUtilities` (command palette, terminal overlay, feedback widget) mounts inside BaseLayout, so admin and auth skip it.
- There is no scroll-to-top button; the colophon has a "Back to top" link.
- Do not add horizontal padding inside BaseLayout. The wrapper already pads.

### PageBody and PageSection

| Primitive | File | Role |
|---|---|---|
| `PageBody` | `src/components/ui/page-body.tsx` | Width preset: `default`, `prose`, `article`, `wide`, `ledger` (`PAGE_WIDTH`) |
| `PageSection` | `src/components/ui/page-section.tsx` | Section rhythm (`SECTION_SPACING.section`) and an optional `SectionHeading` |
| `SectionHeading` | `src/components/ui/section-heading.tsx` | Display title in italic, optional description. `as="h1"` on page routes, `h2` on home sections. No `marker`, no all-caps eyebrow. |

Page heads sit on a double rule. One `h1` per page.

## Page patterns

Every route uses one of these patterns. Pick the pattern first, then the primitives.

| Pattern | Component | Routes |
|---|---|---|
| Ledger | `ui/ledger.tsx` (`LedgerList` with a sticky marker column, `LedgerRow` with a stretched link) | `/blog`, `/certificates`, `/changelog`, `/project` index, home Career and Credentials, admin lists |
| Article | `ui/article-shell.tsx` (server; 13rem sticky rail beside a 66ch column; rail becomes `<details>` under `lg`) | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` |
| Plates | `ui/plate-figure.tsx` (double-rule frame, `.plate` duotone, italic caption) | Covers, project shots, portrait, OCR specimen |
| Cabinet | `tools/_components/tool-shell.tsx` and `ui/pager.tsx` | `/tools`, `/ai` |
| Correspondence | A column of letters, replies set behind a left rule | `/chat`, `/ai` chat, home Contact, admin Feedback |
| Board | Ruled columns of index cards | `/tracker` |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar` | `/stats`, home Readers, admin dashboard and analytics |
| Admin | Ruled spine, `--admin-rail`, inverted active row | `/admin/dashboard/*` |
| Auth | `layout/auth-shell.tsx` (split or narrow) | `/auth/*`, `/admin/auth/login` |
| Profile card | Double-rule sheet, definition list, dotted leaders | `/profile`, `/profile/edit`, admin settings |
| Not found | `ui/not-found-view.tsx` (server) | 404s, `error.tsx`, empty states |

Some pattern components land in phase 2 or 3. Until a route's phase, keep its current primitives but do not add new legacy structure (`MacWindow`, glass cards, sidebars) to it.

## Home

The home page is a story, not a dashboard. Literal `h2`s: About, Skills, Career, Activity, Credentials, Readers, Recommendations, Contact.

- Masthead stage in the `bleed` slot: the `h1` "Rizky Haksono" in display italic (the LCP element, never animated), a lead line, the positioning sentence that inks itself word by word while pinned (`ui/word-scroll.tsx`, server, 0 JS), three ink links visible at first paint, and the static engraving strip at the stage foot.
- Skills is a stacking deck of sticky plates at 768px and up, a ruled list below.
- Sections with no data hide. They never show zeros, `NaN` or `-Infinity`.
- `content-visibility: auto` only on Activity, Credentials, Readers and Recommendations, never on or around sticky content.

## Sticky rules

- Sticky elements use `top: var(--head-h)` (plus an offset) so they clear the running head.
- Opaque sticky surfaces take `.bg-paper-grain`.
- No `overflow: hidden` or `auto` on any ancestor of a sticky element. Use `overflow-x: clip` where clipping is needed.
- Verify sticky still works after the Contents sheet opens and closes.

## Width anti-patterns

| Avoid | Use |
|---|---|
| Nested `max-w-6xl mx-auto px-4` inside BaseLayout | `<PageBody width="wide">` |
| `max-w-8xl` (undefined) | `PAGE_WIDTH` presets |
| A second `container` inside a page | Trust BaseLayout |
| Horizontal scroll at 375px | Wrap, stack, or clip with `overflow-x: clip` |
