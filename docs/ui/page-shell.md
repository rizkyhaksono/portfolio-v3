# Page shell and page patterns

## Shell

Every visitor page is laid out like a Notion workspace: a grey page tree on the left, a thin top bar with the page's path, then the page in Notion's 708px column.

```
┌────────────────────┬──────────────────────────────────────────────────────────────┐
│ [R] Rizky Haksono «│ [≡] (below lg)  ⌂ Rizky Haksono / ✎ Writing          [◐]     │  top bar, 44px
│                    ├──────────────────────────────────────────────────────────────┤
│ ⌂ Home             │                                                              │
│ ▦ Projects         │        ✎                                  page icon          │
│ ✎ Writing          │        Writing                            40px bold title    │
│ ⌖ Roadmap          │        Essays and notes on AI and ...     muted description  │
│ ⚒ Tools            │                                                              │
│ ▥ Stats            │        2026                               group label        │
│ ✉ Chat             │        ▤ A post title          3 Mar      list view rows     │
│                    │        ▤ Another post          1 Feb      (tint on hover)    │
│ More               │                                                              │
│ ✪ Certificates     │        ...                                                   │
│ ↺ Changelog        │                                                              │
│ ◯ Account          │        ──────────────────────────────────                    │
│ ⌁ RSS feed         │        © 2026 Rizky Haksono. 14:05 in Malang   email         │  closing line
│                    │                                                              │
│ ✉ Send feedback    │                                                              │
│ @ Email            │                                                              │
│ ⌥ GitHub           │                                                              │
│ in LinkedIn        │                                                              │
│ ────────────────── │                                                              │
│ Privacy Terms ☀ ☾ ▭│                                                              │
└────────────────────┴──────────────────────────────────────────────────────────────┘
  sidebar: bg-muted, 15rem, lg and up                page column: 708px, centred in the space
```

### Sidebar

`src/components/layout/sidebar.tsx` (the `aside`) and `sidebar-nav.tsx` (the tree, a client component).

- **Where.** From `lg`, a sticky full-height `aside` (`aria-label="Site"`), 15rem wide through `.app-sidebar` in `globals.css`, `bg-muted`, no border. Below `lg` it is hidden and the same `SidebarNav` opens in the menu sheet.
- **Owner's row** (`.sidebar-head`). The 20px portrait (`rounded`) and "Rizky Haksono" in `small` at weight 500, linking home, then the « button (`CollapseToggle`) on the desktop sidebar only.
- **Main pages.** "Home", then the `NAV_SECTIONS` entries with `head` set (Projects, Writing, Roadmap, Tools, Stats, Chat), each with its 16px lucide icon from `SECTION_ICONS`.
- **More.** A `caption` muted group label, then the other sections (Certificates, Changelog), Account (`/profile`) and the RSS feed.
- **Bottom block** (pushed down with `mt-auto`): Send feedback (`data-open-feedback`), Email, GitHub and LinkedIn; then, over a hairline, one line with the legal links (Privacy, Terms) in `caption` on the left and the theme control on the right: three icon radios (`ThemeChoice`, a Radix radio group labelled "Theme"), Sun "Light theme", Moon "Dark theme" and Monitor "Theme from the device", 28px from `lg` (44px below), the checked one on `bg-tint-strong` in ink.
- **Fold.** `CollapseToggle` folds the desktop sidebar to a 3.25rem icon rail and back, after Notion's « button. `aria-label` and `data-tip` read "Collapse the sidebar" or "Expand the sidebar", with `aria-expanded`. Folded, the width eases over 280ms, every `.sidebar-label` becomes screen-reader text so rows keep their names, `.sidebar-expanded-only` (the "More" label and the legal and theme line) hides, and `.sidebar-head` stacks the owner's row over the button. The state is `data-sidebar="collapsed"` on `<html>`: an inline script with the CSP nonce in `src/app/layout.tsx` sets it from localStorage `sidebar` before paint, so a returning visitor never sees the sidebar open and then close. Each change sends `sidebar-toggle` with `to: collapsed` or `open`. The menu sheet's tree never folds.
- **Rows.** `text-small text-muted-foreground`, `rounded-md`, 28px tall from `lg` (44px below), a 16px icon with `strokeWidth={1.5}`, the hover tint at `duration-75`. Hover and the current page (`aria-current="page"`) get `bg-tint` and ink text; the current page is also weight 500.
- Internal rows use `navTrack(href, area)`; outside rows carry `data-umami-event="social-click"` with `area: sidebar` (or `menu` in the sheet).

### Top bar

`src/components/layout/top-bar.tsx`. Notion's top bar: 44px (`--head-h`), sticky, opaque `bg-background`, no border, no blur, no shadow. It carries `viewTransitionName: site-header`.

- **Left, below `lg`:** the "Menu" button (`ContentsTrigger`, a `PanelLeft` icon, `aria-label="Menu"`, `data-umami-event="menu-open"`). Keep the name "Menu": e2e tests find it.
- **Breadcrumb** (`breadcrumb.tsx`): "Rizky Haksono" with the home icon, then `/` and the section this page belongs to (from `NAV_SECTIONS`, `LEGAL_LINKS` or Account), each with its icon. Only two levels. `aria-current="page"` on the crumb that is the page itself.
- **Right:** `ThemeToggle`, a ghost icon button labelled "Dark theme" with `aria-pressed`.

### Menu sheet

`src/components/layout/contents-sheet.tsx`, loaded on first open by `contents-trigger.tsx`. Below `lg` the sidebar tree slides in from the left in a Radix sheet, `bg-muted`, 18rem wide (at most 85vw), with an sr-only "Menu" title. Any link or the feedback button inside closes it, and focus returns to the trigger.

### Page icon and title

Every page opens with `PageHeader` (or `ArticleShell` on article pages): the page's lucide icon at 56px from `SECTION_ICONS` (`<SectionIcon href="/blog" />`), then the title at `text-title sm:text-display` (32px, 40px from `sm`, weight 700), an optional muted description, and an optional slot for `Properties`, view tabs or a feed link. One per page.

### Closing line

`src/components/layout/footer.tsx`. The page ends on one quiet line in the page column, over a hairline: "© {year} Rizky Haksono. {HH:MM} in Malang" (`MalangClock`) and the email as a muted `InkLink` (`email-click`, `area: colophon`). `caption` muted text. The sidebar holds every other link. There is no sky band and no link row.

`src/commons/constants/navigation-menu.ts` is the only nav source (`NAV_SECTIONS`, `LEGAL_LINKS`, `isCurrentPath`, `navTrack`). The sidebar, the menu sheet, the breadcrumb and the terminal overlay all import it. `SECTION_ICONS` in `src/components/layout/section-icons.tsx` is the only icon map for pages.

### BaseLayout

`src/components/layout/base-layout.tsx`. A server component that reads no cookies, so pages under it can be static or ISR. It mounts the sidebar, the top bar, the page column, the closing line and `DeferredClientUtilities`.

| Prop | Values | Use |
|---|---|---|
| `width?` | `'prose'` (default, 708px), `'wide'` (full width) | `wide` on `/tools` and `/chat` |
| `fit?` | `boolean` | App-like page that fills the viewport under the top bar and never scrolls itself (`/chat`) |
| `footer?` | `'full'` (default, the closing line), `'none'`; `'compact'` is an alias of `'none'` | `compact` on `/chat` and `/ai` |
| `cover?` | `ReactNode` | Notion's page cover, full width above the column. Only the home passes one (`<PageCover src={cover} />`) |

- No right-hand panels, no scroll-to-top button, no second sidebar.
- Do not add horizontal padding inside `BaseLayout`; the column already has its gutters.
- `DeferredClientUtilities` (terminal overlay, feedback dialog) mounts inside `BaseLayout`, so the admin and auth skip it. The feedback dialog opens from `[data-open-feedback]` buttons; nothing floats over the page.

## Width and alignment

- One 708px column (`PROSE_WIDTH`), centred in the space right of the sidebar, with 24px gutters on phones and 48px from `sm`.
- **Everything inside the column is left-aligned:** icons, titles, headings, page text, lists, tables and forms. Only the auth column centres its title and small print.
- **Images** stay as wide as the column (`BREAKOUT` is empty), so their edges line up with the text. A gallery fills the column in two columns (three from `lg`).
- **Full width:** `/tools` and `/chat` use `width="wide"`.

The admin has its own copy of the Notion shell; see [platforms.md](./platforms.md#admin).

| Avoid | Use |
|---|---|
| Centred paragraphs, titles, lists or rows | Left-aligned inside the centred column |
| A second `container` or `mx-auto max-w-*` wrapper inside a page | `BaseLayout` and its `width` prop |
| Hand-made h1 blocks | `PageHeader` |
| Boxes around sections, stat cards, tiles for plain text | Headings, `Properties`, list or table views |
| Horizontal scroll at 320 or 375px | Wrap, stack, or let a wide table scroll inside its own wrapper |

## Page patterns

Every route uses one of these Notion page types. Pick the pattern first, then the primitives.

| Pattern | Component | Routes | Look |
|---|---|---|---|
| Page | `PageHeader`, `Properties` | Every visitor page | Icon, 40px bold title, muted description, then properties (a muted name with its icon, the value in ink) |
| List view | `ui/ledger.tsx` (`LedgerList`, `LedgerRow`) | Home Writing, `/blog` rows, `/roadmap` lessons | Rows with an optional 16px icon, the title in ink at weight 500, one muted line under it, meta on the right. The whole row is the link and tints on hover. A small muted group label (a year, a level) above each group |
| Gallery view | `MediaCard` in `Gallery` (`ui/media-card.tsx`) | Home Projects, `/project` (grouped by "Hand-picked" and year), the newest `/blog` posts with a cover | Cards with a hairline and 10px corners: the picture on the grey ground, then the title and a property or two in `small`. Two columns, three from `lg`. Tint on hover |
| Table view | `ui/table.tsx` | Home Work experience and Education, `/certificates`, admin collections | Hairline cells, grey head cells in `small` at weight 400, numbers with `tabular-nums`. Wide tables scroll in their wrapper |
| Article | `ui/article-shell.tsx` | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` | The cover picture, the icon, the 40px title, a muted standfirst, properties, tags, the contents in a closed toggle, a hairline, `.prose`, then previous and next |
| Cabinet | `tools/_components/tool-shell.tsx`, `ui/pager.tsx` | `/tools`, `/ai` | `width="wide"`, state in `?tab=`. `/tools` is a gallery of tool cards in three groups (Play, Practise, Look things up), each card a 32px icon tile, the name and one muted line, the open one with an ink border; under a hairline, the open tool's `h2`, its note and its panel. `/ai` uses view tabs |
| Correspondence | The chat column, the contact form | `/chat`, `/ai` chat, home Contact, admin Feedback | A column of messages; the home form shows directly as a bordered Notion form, and Turnstile loads only once someone starts filling it in |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar` | `/stats`, admin Home and Analytics | Numerals at the `numeral` size, no cards around them, solid fills, a text alternative for every chart |
| Auth | `layout/auth-shell.tsx` | `/auth/*`, `/admin/auth/login` | Notion's sign-in page, see [platforms.md](./platforms.md#auth) |
| Admin | `components/layout/admin/*`, `app/(admin)/**` | `/admin/dashboard/*` | The Notion shell: grey grouped sidebar, 44px top bar, full-width content, collections as Notion tables, see [platforms.md](./platforms.md#admin) |
| Profile card | The profile sheet | `/profile`, `/profile/edit`, admin Settings | A definition list in a frame |
| Not found | `ui/not-found-view.tsx` | 404s, `error.tsx`, empty states | "There is no page at this address." and a way back |

Blocks a page may use: `Callout` (one per page at most), the Notion toggle (`Accordion`, or a `<details>` with the rotating triangle), view tabs (`Tabs`), quotes (a 3px ink bar on the left, as in `.prose blockquote`) and headings (`text-h2` sections).

New routes pick one of these. Never add window chrome, glass cards, shadows or a second sidebar to a visitor page.

## Loading

Every route's `loading.tsx` mirrors its page, so nothing jumps when the data lands. `PageLoading` (`src/components/ui/page-loading.tsx`) renders the head for real and the body in grey:

| Prop | Use |
|---|---|
| `label` | Read to screen readers through `LoadingStatus`, for example "Loading the posts…" |
| `icon` | The page's own icon (`<SectionIcon href=… />`), shown as is |
| `title` | The route's real h1 |
| `description?` | Fixed text shows as is; `true` stands in a grey line for a description that comes with the data |
| `headerExtra?` | What sits under the title on the real page (a feed link, properties) |
| `children?` | The body in its real shapes; a few grey text lines when left out |
| `className?` | On the wrapper |

The shapes live in the same file: `TextSkeleton`, `GroupLabelSkeleton`, `GallerySkeleton` (with `GALLERY_NARROW`, one column below 360px) and `ListSkeleton`. Article routes use `ArticleLoading` (`label`, `icon?`, `cover?`, `properties?`). The page wraps the part that replaces the skeleton in `FADE_IN`, a 300ms fade under `motion-safe`, never the head. A route whose skeleton must sit inside the sidebar and top bar puts `BaseLayout` in its `layout.tsx` (for example `/blog`, `/stats`).

## Home

`src/app/page.tsx`. The home is a Notion page about the owner, under a photo cover. The intro is static, so the LCP is text and the cover; every data list is its own async server component in `<Suspense>` with a skeleton. Order:

1. **Cover:** `PageCover` with `src/assets/cover/home.webp` (see [design-system.md](./design-system.md#the-home-cover)).
2. **Icon and title:** the round portrait (96px, 112px from `sm`, a 4px page-coloured ring) overlapping the cover's lower edge, then "Rizky Haksono" as the h1 at `text-title sm:text-display`.
3. **Properties:** Role, Based in, Email and Elsewhere (GitHub, LinkedIn, CV).
4. **Bio:** under a hairline, three short paragraphs in ink at the body size. Once the projects load, the names (Sarana AI, the projects, the university) become Notion mentions (`Mention`, `src/app/_components/home/mention.tsx`): the name in ink at weight 500 with a 16px picture or icon before it and a grey underline, and on hover or keyboard focus a 18rem preview card on the float surface with the screenshot, the title and one to three lines. The card is `aria-hidden` (the link text names the place) and devices without hover just follow the link. Clicks send `mention-click` through `data-track`.
5. **Projects:** a gallery of up to six cards (featured first, then newest), then "All N projects" when there are more.
6. **Writing:** the newest five posts as a list view with a page icon and the date, then "All writing".
7. **Work experience** (`#work`): a table of **every** career entry, newest first, never sliced: Role, Company, When.
8. **Education** (`#education`): a separate table of every study, newest first: Study, School, When.
9. **Recommendations:** every LinkedIn recommendation as a quote with a 3px ink bar, only when the API returns real ones.
10. **Contact:** a line with the email, then the form shown directly as a bordered Notion form (`rounded-lg`, hairline): Name and Email side by side from `sm`, then Message, labels in ink at 14px. Turnstile loads once someone starts filling it in.

Every list has an honest failed or empty line (`StatusLine`), for example "Projects did not load just now. The code is on GitHub in the meantime." Recommendations hide when there are none. Nothing shows zeros, `NaN` or `-Infinity`. Activity (heatmap, WakaTime, Duolingo) lives on `/stats`, and certificates on `/certificates`, both in the sidebar.

## Sticky and overflow rules

- The top bar is sticky at 44px (`--head-h`); the sidebar is sticky at full height. Anchor targets keep `[id] { scroll-margin-top: calc(var(--head-h) + 1rem) }` from `globals.css`, not `scroll-padding-top` on `html`.
- `overflow-x: clip` on `html` and `main` only. Never on `body`, never `overflow: hidden` or `auto` on a sticky ancestor, never `content-visibility` on or around sticky content.
- Radix scroll lock is moved to `html` in `globals.css` so the sticky bar does not jump; check sticky still works after the menu sheet opens and closes.
