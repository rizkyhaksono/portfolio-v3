# Page shell and page patterns

## Shell

```
1024px and up
  Running head (sticky, 52px, paper, 1px rule below):
    [RH] Rizky Haksono   Projects Writing Etan AI Chat Tracker Roadmap Tools Stats   [Search ⌘K] [theme] [Account]
  Bleed slot (home masthead only)
  main#main (overflow-x: clip), wrapper max-w 76rem, side padding clamp(20px, 4vw, 48px)
  Double rule
  Colophon: title block / Read, Try, Site columns / credit line, Send feedback, Back to top

768px to 1023px   [RH] wordmark, Projects Writing Etan AI, [Search] [menu icon]
under 768px       [RH] wordmark, [menu icon]   (48px head, 44px targets)
```

- The running head wordmark is the `mini` logo (32px) before "Rizky Haksono". The current nav item is underlined 2px in `mark` (`aria-current="page"`).
- If the head row overflows at 1024px, Chat moves into the menu for 1024px to 1279px only.
- Credentials and Changelog live in the colophon, the menu and the command palette.
- **Menu** (below 1024px) is a two-rule icon button labelled "Menu" that opens a full-height Radix Sheet: every section in 26px display type, then a footer row with the theme radio (Light, Dark, System) and Account. No search field, no notes.
- **Colophon** (`footer.tsx`): the double rule, the title block, three link columns (Read, Try, Site, with the legal links in Site), then the credit line "Set in IBM Plex Sans and IBM Plex Mono. Drawn in Malang, East Java." beside the "Send feedback" and "Back to top" controls.
- `src/commons/constants/navigation-menu.ts` is the only nav source. The head, menu, colophon, command palette and terminal overlay all import it.

### Title block

The colophon opens with `TitleBlock` (`src/components/layout/title-block.tsx`), an engineering drawing's title block: a 1px ink outline around the `mark` logo (`w-20`, `md:w-24`, outside the list) and a ruled `dl` grid. Labels are Plex Sans caption in ink-soft; values are Plex Mono.

| Cell | Value |
|---|---|
| Drawn by | Rizky Haksono |
| Role | `JOB_TITLE`, Sarana AI |
| Location | Malang, East Java |
| Revision | The newest changelog entry: `version, date`, read from `content/changelog` through `getAllChangelogs()[0]` |
| Set in | IBM Plex Sans and IBM Plex Mono |
| Contact | The email address, a `mailto:` link with `data-track="email-click"` and `data-track-area="colophon"` |

Every value is real data; the Revision moves with each release, so a changelog entry is also a colophon update. The compact footer (`footer="compact"`, on `/ai` and `/chat`) is one ruled line with no title block.

### BaseLayout

File: `src/components/layout/base-layout.tsx`. It is a server component and reads no cookies, so pages under it can be static or ISR.

| Prop | Values | Use |
|---|---|---|
| `bleed?` | `ReactNode` | Full-width slot above `main` (home masthead only) |
| `footer?` | `'full'` (default), `'compact'`, `'none'` | `compact` on `/ai` and `/chat` |

- The old `sidebar` and `rightSidebar` props, the navbar, sidebars, right-sidebar windows and visitor panel are gone. Do not bring them back.
- Client islands inside the shell: NavLinks (`aria-current`), ThemeToggle, ContentsTrigger (a two-rule menu icon labelled "Menu"). `DeferredClientUtilities` (command palette, terminal overlay, feedback dialog) mounts inside BaseLayout, so admin and auth skip it. The palette opens from `[data-open-search]` buttons and ⌘K, the feedback dialog from `[data-open-feedback]` buttons (colophon); nothing floats over the page.
- There is no scroll-to-top button; the colophon has a "Back to top" link.
- Do not add horizontal padding inside BaseLayout. The wrapper already pads.

### Page width and PageSection

| Primitive | File | Role |
|---|---|---|
| `PageSection` | `src/components/ui/page-section.tsx` | Section rhythm (`SECTION_SPACING.section`) and an optional `SectionHeading` |
| `SectionHeading` | `src/components/ui/section-heading.tsx` | Display title (weight 600), optional description. `as="h1"` on page routes, `h2` on home sections. No `marker`, no all-caps eyebrow. |

Page heads sit on a double rule. One `h1` per page.

## Page patterns

Every route uses one of these patterns. Pick the pattern first, then the primitives.

| Pattern | Component | Routes |
|---|---|---|
| Ledger | `ui/ledger.tsx` (`LedgerList` with a sticky marker column, `LedgerRow` with a stretched link) | `/blog`, `/certificates`, `/changelog`, `/project` index, home Career and Credentials, admin lists |
| Article | `ui/article-shell.tsx` (server; 13rem sticky rail beside a 66ch column; rail becomes `<details>` under `lg`) | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` |
| Plates | `ui/plate-figure.tsx` (1px ink frame, orange crop marks, grayscale photos, caption) | Covers, project shots, portrait, OCR specimen |
| Cabinet | `tools/_components/tool-shell.tsx` and `ui/pager.tsx` | `/tools`, `/ai` |
| Correspondence | A column of letters, replies set behind a left rule | `/chat`, `/ai` chat, home Contact, admin Feedback |
| Board | Ruled columns of index cards | `/tracker` |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar` | `/stats`, home Readers, admin dashboard and analytics |
| Admin | Ruled spine, `--admin-rail`, inverted active row | `/admin/dashboard/*` |
| Auth | `layout/auth-shell.tsx` (split or narrow; the split view shows the large `mark` logo from 768px) | `/auth/*`, `/admin/auth/login` |
| Profile card | Double-rule sheet, definition list, dotted leaders | `/profile`, `/profile/edit`, admin settings |
| Not found | `ui/not-found-view.tsx` (server; title, one standfirst, two links, the large `mark` logo) | 404s, `error.tsx`, empty states |

Every route already uses one of these patterns. New routes pick one; never add legacy structure (window chrome, glass cards, sidebars).

## Home

The home page is a story, not a dashboard. Literal `h2`s: About, Skills, Career, Activity, Credentials, Readers, Recommendations, Contact.

- **Masthead stage** in the `bleed` slot (`Masthead` in `src/app/page.tsx`): the `h1` "Rizky Haksono" in display type (it never animates), a lead line, the portrait, the positioning sentence that inks itself word by word while pinned (`ui/word-scroll.tsx`, server, 0 JS), and three ink links visible at first paint. The portrait is the likely LCP element.
- **Portrait** (`HeroPortrait`): `/rizky.jpg`, 1200 by 1200, alt "Rizky Haksono", `priority`, `sizes="(min-width: 1024px) 26rem, 20rem"`, always inside a `PlateFigure` (orange crop marks, grayscale). Below the stage there is no strip or image: the stage is the whole hero.

| Width | Layout |
|---|---|
| 1024px and up | Two columns `[minmax(0,1fr) \| minmax(18rem,26rem)]`. Left: h1 (sized to its column so it holds one line), lead, sentence, links. Right: the portrait, square, top-aligned with the h1, capped at `min(26rem,60svh)` so the stage fits the viewport |
| Under 1024px | The portrait sits inside the stage, directly after the lead line, left-aligned and square, at `size-[min(24svh,20rem)]` (`sm:size-[min(30svh,20rem)]` from 640px). The svh caps keep the pinned stage within the viewport; the sentence and links follow it |

- **About** is a single text column on the reading measure: no drop cap, no portrait.
- Skills is a stacking deck of sticky plates at 768px and up, a ruled list below.
- Sections with no data hide. They never show zeros, `NaN` or `-Infinity`.
- `content-visibility: auto` only on Activity, Credentials, Readers and Recommendations, never on or around sticky content.

## Sticky rules

- Sticky elements use `top: var(--head-h)` (plus an offset) so they clear the running head.
- Opaque sticky surfaces take `bg-paper`.
- No `overflow: hidden` or `auto` on any ancestor of a sticky element. Use `overflow-x: clip` where clipping is needed.
- Verify sticky still works after the menu sheet opens and closes.

## Width anti-patterns

| Avoid | Use |
|---|---|
| Nested `max-w-6xl mx-auto px-4` inside BaseLayout | a `PAGE_WIDTH` preset from `src/lib/design-system.ts` |
| `max-w-8xl` (undefined) | `PAGE_WIDTH` presets |
| A second `container` inside a page | Trust BaseLayout |
| Horizontal scroll at 375px | Wrap, stack, or clip with `overflow-x: clip` |
