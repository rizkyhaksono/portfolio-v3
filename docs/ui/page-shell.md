# Page shell and page patterns

## Shell

```
1024px and up
  Running head (sticky, 52px, paper + grain, 1px rule below):
    [RH mark] Rizky Haksono   Projects Writing Etan AI Chat Tracker Roadmap Tools Stats   [theme] [Account]
  Bleed slot (home masthead only)
  main#main (overflow-x: clip), wrapper max-w 76rem, side padding clamp(20px, 4vw, 48px)
  Ink rule (single, 1px)
  Colophon: RH mark beside name, role, email / Read, Try, Site columns / credit line / Send feedback, Back to top
  Engraving band, full bleed, 100:26 (about 26vw tall), at most 440px, at least min(200px, 18svh)

768px to 1023px   wordmark, Projects Writing Etan AI, [Search] [menu icon]
under 768px       wordmark, [menu icon]   (48px head, 44px targets)
```

- If the head row overflows at 1024px, Chat moves into the menu for 1024px to 1279px only.
- Certificates and Changelog live in the colophon and the menu.
- **Menu** (below 1024px) is a two-rule icon button labelled "Menu" that opens a full-height Radix Sheet: every section in italic at the `h2` size (22 to 30px), then a footer row with the theme radio (Paper, Night, System) and Account. No search field, no notes.
- The colophon credit line: "Set in Literata. Printed in one ink in Malang, East Java. Plate after Wenceslaus Hollar, *Landscape with a Rider*, 1650, after Jan Wildens, Rijksmuseum (public domain)."
- `src/commons/constants/navigation-menu.ts` is the only nav source. The head, menu, colophon and terminal overlay all import it.

### BaseLayout

File: `src/components/layout/base-layout.tsx`. It is a server component and reads no cookies, so pages under it can be static or ISR.

| Prop | Values | Use |
|---|---|---|
| `bleed?` | `ReactNode` | Full-width slot above `main` (home masthead only) |
| `footer?` | `'full'` (default), `'compact'`, `'none'` | `compact` on `/ai` and `/chat` |

- The old `sidebar` and `rightSidebar` props, the navbar, sidebars, right-sidebar windows and visitor panel are gone. Do not bring them back.
- Client islands inside the shell: NavLinks (`aria-current`), ThemeToggle, ContentsTrigger (a two-rule menu icon labelled "Menu"). `DeferredClientUtilities` (terminal overlay, feedback dialog) mounts inside BaseLayout, so admin and auth skip it. There is no site search. The feedback dialog opens from `[data-open-feedback]` buttons (colophon); nothing floats over the page.
- There is no scroll-to-top button; the colophon has a "Back to top" link.
- Do not add horizontal padding inside BaseLayout. The wrapper already pads.

### Page width and PageSection

| Primitive | File | Role |
|---|---|---|
| `PageSection` | `src/components/ui/page-section.tsx` | Section rhythm (`SECTION_SPACING.section`) and an optional `SectionHeading` |
| `SectionHeading` | `src/components/ui/section-heading.tsx` | Display title in italic. `as="h1"` on page routes, `h2` on home sections. No `marker`, no all-caps eyebrow. `description` is for figures only (the LeetCode summary), never a standfirst. |

One width for every page. Every visitor and user route fills BaseLayout's wrapper (`SHELL_WIDTH` in `layout/running-head.tsx`), so the page head starts on the logo's left edge and the widest rule or row ends under "Account". Pages never narrow or centre their outer container: no `mx-auto max-w-*` wrapper, no width preset. Admin keeps its own shell, and Auth keeps `AuthShell`.

- **Page head.** The `h1`, then a single 1px ink rule (`border-t border-ink`), both full width. Never stack rules: a list, strip, tab row or board right under the head drops its own top rule, so only the head rule shows. No description, standfirst or italic lead under the title. Only short functional meta lines stay: counts, "Subscribe by RSS", "Times are Jakarta time.", datelines.
- **Running text keeps a readable measure.** Prose, article bodies, chat messages, form text and excerpts cap at about 60 to 66ch (`.prose` is 66ch, otherwise `max-w-[66ch]`), left-aligned on the same edge. Never centre them.
- **Ledgers.** Rows, rules and the marker (date) column span the full width.
- **Articles.** `ArticleShell` starts on the shell's left edge: the 13rem rail, then a column that takes the rest; `.prose` inside it holds the 66ch measure. An article's own summary (a post or lesson description) may sit under its title as the one standfirst.
- **Cards.** The Profile card and the Etan sign-in slip fill the width; their text keeps its measure.

## Page patterns

Every route uses one of these patterns. Pick the pattern first, then the primitives.

| Pattern | Component | Routes |
|---|---|---|
| Ledger | `ui/ledger.tsx` (`LedgerList` with a sticky marker column, `LedgerRow` with a stretched link) | `/blog`, `/certificates`, `/changelog`, `/project` index, home Career and Certificates, admin lists |
| Article | `ui/article-shell.tsx` (server; 13rem sticky rail beside a 66ch column; rail becomes `<details>` under `lg`) | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` |
| Plates | `ui/plate-figure.tsx` (double-rule frame, `.plate` duotone unless `tone="color"`, italic caption) | Covers, project shots, About portrait, OCR specimen, anime and Pokémon pictures |
| Cabinet | `tools/_components/tool-shell.tsx` and `ui/pager.tsx` | `/tools`, `/ai` |
| Correspondence | A column of letters, replies set behind a left rule | `/chat`, `/ai` chat, home Contact, admin Feedback |
| Board | Ruled columns of index cards | `/tracker` |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar` | `/stats`, home Readers, admin dashboard and analytics |
| Admin | Ruled spine, `--admin-rail`, inverted active row | `/admin/dashboard/*` |
| Auth | `layout/auth-shell.tsx` (split or narrow) | `/auth/*`, `/admin/auth/login` |
| Profile card | Double-rule sheet, definition list, dotted leaders | `/profile`, `/profile/edit`, admin settings |
| Not found | `ui/not-found-view.tsx` (server) | 404s, `error.tsx`, empty states |

Every route already uses one of these patterns. New routes pick one; never add legacy structure (window chrome, glass cards, sidebars).

## Home

The home page is a story, not a dashboard. Literal `h2`s: About, Skills, Career, Activity, Certificates, Readers, Recommendations, Contact.

- Masthead stage in the `bleed` slot (`Masthead` in `src/app/page.tsx`): the `h1` "Rizky Haksono" in display italic (never animated, the LCP element), the job line, the positioning sentence that inks itself word by word while pinned (`ui/word-scroll.tsx`, server, 0 JS), and three ink links visible at first paint. From `lg` the "In this issue" column sits to the right (below). The stage carries no photo.
- The text block is centred in the pinned stage, so the slack falls above and below the block, never between the job line and the sentence. The name is the `display` token capped at `15svh` (104px at 1280x800, 90px at 1280x600, 44px and one line at 375), so the stage fits 375x667 and 1280x600.
- "In this issue" column (`IssueIndex`, `src/app/_components/issue-index.tsx`, server), from `lg` only: the text and the column share a grid (`auto` text column, the index takes the rest). It is absolute in its grid area inside `<Suspense fallback={null}>`, so it adds no height, never delays the h1 and causes no layout shift. One `rule` hairline on its left, no frame. Up to three entries, each an italic caption label, a roman title link (clamped to three lines) and an italic meta line: Latest writing (newest post from every source, with its date), Latest project (with a two-line excerpt), Most read (with readers this month). An entry whose source fails or is empty is dropped; with none left the column renders nothing. No motion. Below `lg` the hero is text only.
- The hero sentence keeps a 24px floor below `sm` (it is `h2` size otherwise) so its unscrolled ghost still passes as large text (3.17:1).
- About: the duotone portrait (`PlateFigure`, `next/image`, lazy) and three prose paragraphs under the `h2`, the first with an italic drop cap. From `md` the portrait is an 18rem left column, its top rule on the first line's cap height; on phones it sits under the heading, before the text, left-aligned at up to 20rem.
- Skills is a stacking deck of sticky plates at 768px and up, a ruled list below.
- Sections with no data hide. They never show zeros, `NaN` or `-Infinity`.
- `content-visibility: auto` only on Activity, Certificates, Readers and Recommendations, never on or around sticky content.

## Sticky rules

- Sticky elements use `top: var(--head-h)` (plus an offset) so they clear the running head.
- Opaque sticky surfaces take `.bg-paper-grain`.
- No `overflow: hidden` or `auto` on any ancestor of a sticky element. Use `overflow-x: clip` where clipping is needed.
- Verify sticky still works after the menu sheet opens and closes.

## Width anti-patterns

| Avoid | Use |
|---|---|
| `mx-auto max-w-*` on a page wrapper, page head or section | Nothing: the page fills BaseLayout's wrapper |
| A width preset or a narrower "ledger" or "article" column | The shell width; cap only running text with `max-w-[66ch]` |
| A centred text column (`mx-auto max-w-[66ch]`) | Left-aligned `max-w-[66ch]` on the shell's left edge |
| A description, standfirst or italic lead under a page `h1` | Nothing, or a short functional meta line (a count, a feed link, a dateline) |
| A second `container` inside a page | Trust BaseLayout |
| Horizontal scroll at 375px | Wrap, stack, or clip with `overflow-x: clip` |
