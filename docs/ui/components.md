# Components

Restyle shared primitives in place; never fork a second version. Prefer them over ad-hoc bordered `div`s. Keep each primitive's API when you restyle it. Every primitive is monochrome Notion: ink, grey and the tints, never blue.

## Catalog

| Primitive | Path | Role |
|---|---|---|
| `BaseLayout` | `components/layout/base-layout.tsx` | Visitor and user shell, see [page-shell.md](./page-shell.md) |
| `Sidebar`, `SidebarNav` | `components/layout/sidebar.tsx`, `sidebar-nav.tsx` | The grey page tree (lg and up), also used inside the menu sheet |
| `TopBar`, `Breadcrumb` | `components/layout/top-bar.tsx`, `breadcrumb.tsx` | The 44px bar with the Menu button, the path and the theme toggle |
| `ContentsTrigger`, `ContentsSheet` | `components/layout/contents-trigger.tsx`, `contents-sheet.tsx` | "Menu" below lg: the sidebar tree in a left sheet |
| `SECTION_ICONS`, `SectionIcon` | `components/layout/section-icons.tsx` | One lucide icon per page, shared by the sidebar, the breadcrumb and page headers |
| `Footer` | `components/layout/footer.tsx` | The closing line: year, Malang time, email |
| `PageHeader` | `components/ui/page-header.tsx` | The top of a Notion page: icon, 40px bold title, muted description, then a slot for properties or tabs |
| `Properties` | `components/ui/properties.tsx` | Notion's page properties: a muted name with its icon, the value in ink |
| `Callout` | `components/ui/callout.tsx` | Notion's grey callout block, one per page at most |
| `LedgerList`, `LedgerRow` | `components/ui/ledger.tsx` | Notion's list view: rows that tint on hover under a small muted group label |
| `MediaCard`, `Gallery` | `components/ui/media-card.tsx` | Notion's gallery view: cover picture, title, a property or two |
| `Table` and parts | `components/ui/table.tsx` | Notion's table view: hairline cells |
| `ArticleShell` | `components/ui/article-shell.tsx` | The Article pattern as a Notion page |
| `Tabs` | `components/ui/tabs.tsx` | Notion's view tabs: an ink bar under the open one |
| `Accordion` | `components/ui/accordion.tsx` | Notion's toggle: a triangle that turns when open |
| `PageSection`, `SectionHeading` | `components/ui/page-section.tsx`, `section-heading.tsx` | Section rhythm and an `h2` heading (24px, weight 600) with an optional muted description and right-hand link |
| `Card`, `Surface` | `components/ui/card.tsx`, `surface.tsx` | Frame and tile, see [surfaces.md](./surfaces.md) |
| `Badge`, `Chip` | `components/ui/badge.tsx`, `chip.tsx` | Notion's grey select tag |
| `InkLink` | `components/ui/ink-link.tsx` | Every text link, internal or external: ink with a grey underline; optional `icon` |
| `PlateFigure` | `components/ui/plate-figure.tsx` | Notion's image block: a picture on the grey ground, 10px corners, a caption |
| `Sky`, `SkyCover`, `SkyToggle`, `MalangClock` | `components/ui/sky.tsx` | The home cover, its hidden pause control, and the hour in Malang |
| `ThemeToggle`, `switchTheme()` | `components/layout/theme-toggle.tsx` | The one path for theme changes |
| `HoverTip` | `components/ui/hover-tip.tsx` | The one tooltip for every `data-tip`, mounted once in the root layout |
| `StatStrip` | `components/ui/stat-strip.tsx` | Figures: `dt` label, `dd` numeral, in hairline cards |
| `InkChart`, `InkHeatmap`, `HatchBar` | `components/ui/ink-chart.tsx`, `ink-heatmap.tsx`, `app/_components/contribution/wakatime-progress.tsx` | Data viz |
| `StatusLine` | `components/ui/status-line.tsx` | Empty, failed and loading states as one honest line; failed adds an icon |
| `Skeleton` | `components/ui/skeleton.tsx` | Loading shapes on `bg-tint` |
| `ReadingNow` | `components/ui/reading-now.tsx` | Realtime visitor line (client island) |
| `NotFoundView` | `components/ui/not-found-view.tsx` | 404, error and empty states |
| `AuthShell` | `components/layout/auth-shell.tsx` | Notion's sign-in page |

Deleted, so do not bring them back: the handle header (`running-head.tsx`), the footer sky band, `WordScroll`, `Logo` and its art, `Engraving`, `Eyebrow`, `Marker`, and every old identity class the gate's R1c rule names.

## Rules per primitive

- **Button.** Notion buttons: `rounded-md` (6px), `text-small` at weight 500, 32px tall (`h-8`; `sm` 28px, `lg` 40px, `xl` 44px), at least 44px on coarse pointers. Default is the **ink** button (`bg-foreground text-background`, `hover:bg-foreground/85`); there is no blue button. Outline: a faint ink hairline (`border-foreground/15`) on the page, `hover:bg-tint`. Secondary: `bg-tint`, `hover:bg-tint-strong`. Ghost: `hover:bg-tint`. Destructive: `bg-destructive` with a cross icon and an explicit verb ("Delete post"). No lift, no shadow. Never put a `Button` inside a `Link`; use `asChild`.
- **Focus.** The global `:focus-visible` outline (2px `ring`, which is ink, 2px offset) is always visible. Fields swap it for an ink border and a 1px ink ring. Do not remove or restyle focus per component.
- **InkLink** (server). Ink text with a grey underline (`decoration-foreground/40`) that turns full ink on hover over `--dur-ui`. No arrow after the text. `icon` shows a 16px mark before the text. `external` adds `target="_blank"`, `rel`, an sr-only "(opens in a new tab)" and `data-umami-event={event ?? 'outbound-click'}` with `data-umami-event-host`.
- **Fields** (input, textarea, select trigger). 36px (`h-9`), `rounded-md`, `border-input`, `bg-background`, weight 400, 16px on phones and 14px from `sm`, label above. The border is the 3:1 `input` token, firmer than Notion's on purpose (WCAG 1.4.11). Focus turns the border ink with a 1px ink ring. Errors sit below with a cross and a sentence (`FieldMessage`), wired with `aria-describedby` and `aria-invalid`.
- **Tabs.** Notion's view tabs: muted `small` labels at weight 500 over a hairline, the open tab in ink with a 2px ink bar under it. They scroll sideways on phones. State lives in the URL (`?tab=`).
- **Toggle.** `Accordion`, or a `<details>` styled the same way: a 16px `ChevronRight` before the title that turns 90 degrees when open, the row `rounded-md` with `hover:bg-tint`, content indented 24px.
- **Switch, radio, avatar.** `rounded-full`. The switch is ink when on and `input` grey when off.
- **Badge, chip.** Notion's select tag: `rounded` (4px), `text-small`, ink text on `bg-tint-strong` (`secondary` on `bg-tint`). `status` adds an 8px square before the word: filled for on, outline for off, dashed for draft. Never colour-coded.
- **Skeleton.** `bg-tint`, `rounded-md`, with a soft pulse only under `motion-safe`.
- **Table.** Notion's table: `text-small`, hairlines on every row and between cells, head cells in muted-foreground at weight 400, `tabular-nums`, numbers right-aligned. Selected rows `bg-tint`. Wide tables scroll inside their wrapper; give the table a `min-w-*` so columns keep their words.
- **Properties.** A `dl` grid: the name in muted `small` with a 16px icon, the value in ink. Use it for facts about a page (Role, Published, Reading time, Source, Tags), not for prose.
- **Callout.** An icon and a short passage on `bg-tint`, `rounded-md`. One per page at most.
- **List rows.** `LedgerRow`: an optional 16px icon in muted-foreground, the title in ink at the body size and weight 500, one muted `small` line under it, meta on the right in `small` muted `tabular-nums`. With `href` the whole row is one stretched link, `rounded-md`, `hover:bg-tint`, with the focus ring on the row. Other controls inside the row need `relative z-10`.
- **Gallery cards.** `MediaCard`: a frame (`rounded-lg`, hairline) with the picture at 16:10 on `bg-muted` over a hairline, then the title in `small` at weight 500, a description and a `caption` meta line. The whole card is one link and tints on hover. Without a picture the title shows on the grey ground. Lay cards out with `Gallery`.
- **Floating layers.** Dialog, alert dialog, sheet, popover, dropdown menu, select content and the terminal overlay use the float surface (`bg-popover`, `rounded-lg`, hairline) and a fixed scrim. Menu items are 28px, `text-small`, `focus:bg-tint`. Esc closes; focus returns to the trigger.
- **Tooltip and toast.** Inverted, as in Notion: `bg-foreground text-background`, no border, no shadow. The hover tip is `rounded-md` `caption` at weight 500; the toast is `rounded-lg` `small` at the bottom centre.
- **Icons.** lucide only, 16px in rows, buttons and properties, 20px in the Menu button, 56px as a page icon, `strokeWidth={1.5}` (1.25 for page icons). Functional only. `react-icons` and `@radix-ui/react-icons` are gone; do not add them back. No emoji in UI.
- **Code.** A server `<pre>` on a tile, system mono, `tabIndex={0}`, no syntax colours. Inline code is a grey wash (ink at 8%), 4px corners, in ink. The client `CopyButton` keeps the `Click Copy Code` event.
- **Prose.** `.prose` in `globals.css` (no typography plugin): Notion's page text, Onest at the `prose` size (16/26) in ink, headings at weight 600 in a 1.5, 1.25, 1 em ladder, links as `InkLink`, quotes with a 3px ink bar, hairline tables with a grey head row, images on the grey ground, hairline `hr`. `.prose--chat` for chat replies at the body size.
- **Media.** `PlateFigure` and gallery cards show pictures in their own colours on `bg-muted`. Size the picture in the caller so the ground reserves its space (no layout shift). No hover scaling.
- **PageHeader.** Icon (optional, from `SECTION_ICONS`), then the h1 at `text-title sm:text-display`, then a muted `body` description, then children (properties, tabs). One per page.
- **Hover tips.** `data-tip="..."` on any element shows an instant tip. Never the native `title` attribute: it waits about a second. The tip is `aria-hidden`, so keep an `aria-label` or text beside it.
- **Generated cards.** Build `/api/og` and `/api/certificate` URLs with `ogImageUrl(params, path?)` from `src/lib/site-url.ts`. It always sets `v=5`; raise it when a card's design changes so crawlers and CDNs refetch. They read colours from `THEME_HEX`.

## Data viz

Every chart is server-rendered SVG. Recharts is gone; do not add a chart library.

- Lines and bars in foreground, areas and empty cells in `muted`, grid in `border`. Solid fills only, no hatching. The sky accent is never used in charts.
- `InkChart`: a 1px line, a `data-tip` per point and a `<details>` table as the text alternative. `preserveAspectRatio="none"` with `vector-effect="non-scaling-stroke"`.
- `InkHeatmap`: five levels from `muted` to foreground, a `data-tip` per cell.
- `HatchBar`: a solid share bar despite its name.
- `StatStrip`: each figure in a hairline `rounded-lg` card, label in muted `small`, value at the `numeral` size. It is the only place figures sit in cards.

## Copy

- **Sentence case** everywhere: buttons, headings, labels, menu items, toasts.
- **Plain verbs** that say what happens: "Save changes", "Send message", "Open the site", "Delete post". Toasts echo the button: "Save changes" gives "Changes saved."
- **No generic CTAs**: "Learn more", "Click here", "Read more", "Get started", "Submit", "Explore". Name the destination ("All 27 projects", "Full history in my CV").
- **No buzzwords**: "seamless", "cutting-edge", "leverage", "unlock", "elevate", "supercharge", "game-changing", "next-level". The gate test holds the exact list.
- **No em dash in UI strings.** Use a comma, a colon, a full stop or "to". Comments may use one.
- **Honest states.**
  - Empty: say what is missing and what to do next. A home section with no data hides instead.
  - Loading: a skeleton or a short line ("Loading projects."), no spinner theatre.
  - Error: say what happened and the next step in plain words, never "Oops" or "Something went wrong". In the admin, `describeFailure()` maps status codes: 401 "Your session has ended. Sign in again to keep working.", 403 "This account is not an admin.", 404 "That entry no longer exists."
- No `uppercase`, no all-caps eyebrows, no middle-dot meta strings, no "→" after links. Datelines are words: "Published 3 March 2026. Six minutes to read."
- Numbers only for real sequences: changelog versions, roadmap stages, legal sections.
- Never put PII in copy that reaches analytics.

## Umami events

The tracker is gated to production with `data-domains`, `data-exclude-hash`, `data-performance` and `data-before-send="umamiBeforeSend"` (`src/lib/umami-before-send.ts` strips `token=` and other non-UTM query params and drops `/admin`).

**Where the attribute goes.** Umami's script calls `preventDefault` and reassigns `location.href` on any `<a data-umami-event>` without `target="_blank"`, which turns a client-side navigation into a full page reload. So:

- `data-umami-event` only on `<button>` elements and on external links that open with `target="_blank"`.
- Internal links use `data-track="nav-click"` plus `data-track-*` attributes, for example `data-track-item="blog"` (`navTrack(href, area)` builds them). One capture-phase listener in `src/components/layout/deferred-client-utilities.tsx` forwards them to `track()` without `preventDefault`.
- In code, call `track(name, data)` from `src/lib/analytics.ts`, never `window.umami` directly.
- One event per element.

**Naming.** Kebab-case, 50 characters or fewer, data values from a fixed enum. `Click Copy Code` is the one legacy name kept as is. Nav areas are `sidebar`, `menu`, `head` (the breadcrumb) and `colophon` (the closing line).

**Never send PII:** no emails, names, prompts, chat, JD or OCR text, search queries, chat ids or full URLs.

| Event | Where | Data |
|---|---|---|
| `nav-click`, `menu-open` | Sidebar, menu sheet, breadcrumb / the Menu button | `item`, `area` / none |
| `theme-toggle` | ThemeToggle, the sidebar's theme control | `to` |
| `outbound-click` | InkLink `external` default | `host`, `area` |
| `cta-click`, `resume-open` | Home list links / the CV link | `target` / `area` |
| `social-click`, `email-click` | Sidebar (`area: sidebar` or `menu`), home properties (`area: bio`), home contact (`area: contact`, email), closing line (`area: colophon`, email) | `network`, `area` |
| `cert-verify` | `/certificates` rows | `issuer` |
| `contact-send` | Contact form | `status`: `ok`, `error`, `limited` |
| `ai-error` | AI chat, OCR demo, JD matcher catch blocks | `feature`, `status` |
| `not-found` | NotFoundView island | `path` (pathname only) |
| `blog-open`, `rss-subscribe`, `Click Copy Code`, `clap` | Blog, the sidebar's RSS row | `source` / `feed`, `area` / `lang` / `kind` |
| `project-site`, `project-source` | Project rows and detail | `project` |
| `roadmap-lesson-complete`, `video-play` | Roadmap | `course` / `lesson` |
| `tool-open`, `chat-send`, `stats-profile-open` | Tools, chat, stats | `tool` / `reply` / `platform` |
| `anime-generate`, `anime-quote` | Anime generator buttons (`/tools?tab=anime-generator`) | `category` (cringe, blush, dance) / none |
| `ai-tab`, `ai-chat-send`, `ai-ocr-run`, `ai-jd-run`, `hirefit-share` | `/ai` | `tab` / `status` / `mode`, `status` / `band`, `status` |
| `signin-start`, `signin-complete`, `signup-complete`, `profile-save` | Auth, profile | `method` / `status` |

Content counts read "Read by 1,204 people in the last 30 days." and hide below 10. The realtime line reads "N people here in the last five minutes.", renders nothing at 0, never pulses and has no `aria-live`.

## Accessibility floor

- Visible focus on every control; Esc closes layers and focus returns.
- `aria-current="page"` on the current sidebar row and breadcrumb crumb.
- 44px tap targets on phones and coarse pointers (`min-h-11`, `size-11`); Notion's 28 to 32px rows only from `md` or `lg` (the sidebar and top bar from `lg`).
- Field borders at 3:1 (`border-input`).
- State by icon and word, never colour alone.
- A text alternative for every chart.
- A pause control for anything that moves for more than five seconds (the cover's `SkyToggle`, visually hidden until keyboard focus).
- No horizontal scroll at 320 or 375px. `<html lang="en">`.
