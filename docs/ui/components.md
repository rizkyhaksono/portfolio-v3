# Components

Restyle shared primitives in place; never fork a second version. Prefer them over ad-hoc bordered `div`s. Keep each primitive's API when you restyle it.

## Catalog

| Primitive | Path | Role |
|---|---|---|
| `BaseLayout` | `components/layout/base-layout.tsx` | Visitor and user shell, see [page-shell.md](./page-shell.md) |
| `PageHeader` | `components/ui/page-header.tsx` | The one page header: a 24px h1 at weight 500 and a muted intro line, left-aligned |
| `PageSection`, `SectionHeading` | `components/ui/page-section.tsx`, `section-heading.tsx` | Section rhythm; a small h2 label (15px, weight 500) with an optional muted description and right-hand link |
| `Card`, `Surface` | `components/ui/card.tsx`, `surface.tsx` | Frame and tile, see [surfaces.md](./surfaces.md) |
| `InkLink` | `components/ui/ink-link.tsx` | Every text link, internal or external, in foreground with a faint underline; optional `icon` |
| `MediaCard` | `components/ui/media-card.tsx` | A screenshot on a tile with title and meta below, only where screenshots matter |
| `PlateFigure` | `components/ui/plate-figure.tsx` | A picture on the grey `rounded-2xl` tile, in its own colours, with a caption |
| `LedgerList`, `LedgerRow` | `components/ui/ledger.tsx` | Plain rows: a title in foreground with one muted line under it, an optional small muted group label |
| `ArticleShell` | `components/ui/article-shell.tsx` | The Article pattern |
| `Sky`, `SkyToggle`, `MalangClock` | `components/ui/sky.tsx` | The painted footer scene, its pause toggle (visually hidden until keyboard focus) and the hour in Malang |
| `ThemeToggle`, `switchTheme()` | `components/layout/theme-toggle.tsx` | The one path for theme changes |
| `HoverTip` | `components/ui/hover-tip.tsx` | The one tooltip for every `data-tip`, mounted once in the root layout |
| `StatStrip` | `components/ui/stat-strip.tsx` | `dt` caption, `dd` numeral, `tabular-nums` |
| `InkChart`, `InkHeatmap`, `HatchBar` | `components/ui/ink-chart.tsx`, `ink-heatmap.tsx`, `app/_components/contribution/wakatime-progress.tsx` | Data viz |
| `StatusLine` | `components/ui/status-line.tsx` | Empty, failed and loading states as one honest line; failed adds an icon |
| `Skeleton` | `components/ui/skeleton.tsx` | Static loading shapes, no pulse |
| `ReadingNow` | `components/ui/reading-now.tsx` | Realtime visitor line (client island) |
| `NotFoundView` | `components/ui/not-found-view.tsx` | 404, error and empty states |
| `AuthShell` | `components/layout/auth-shell.tsx` | One centred column for sign-in |

Deleted, so do not bring them back: `WordScroll`, `Logo` and its art, `Engraving`, `Eyebrow`, `Marker`, the home Skills, About, Career and Site stats sections, and every old identity class the gate's R1c rule names.

## Rules per primitive

- **Button.** `rounded-lg`, `h-9`, `min-h-11` below `md`, `text-body` at weight 500. Default: `bg-primary text-primary-foreground`. Outline: `border-input`. Ghost: `hover:bg-muted`. Destructive (admin): `text-destructive` with an explicit verb ("Delete post"). Never put a `Button` inside a `Link`; use `asChild`.
- **Focus.** The global `:focus-visible` outline (2px `ring`, 2px offset) is always visible. Do not remove or restyle it per component.
- **InkLink** (server). Foreground text with a faint underline (`decoration-foreground/25`) that strengthens to full foreground on hover over `--dur-ui`, so colour is never the only cue against muted prose. No arrow after the text. `icon` shows a 16px lucide icon before the text so the destination is clear before the click. `external` adds `target="_blank"`, `rel`, an sr-only "(opens in a new tab)" and `data-umami-event={event ?? 'outbound-click'}` with `data-umami-event-host`.
- **Fields** (input, textarea, select). A full box with `border-input`, `rounded-lg`, `bg-background`, weight 400, 16px on phones, label above. Errors sit below with an icon and a sentence, wired with `aria-describedby` and `aria-invalid`.
- **Tabs.** Segmented: a `bg-muted` track, the active item on `bg-background`. State lives in the URL (`?tab=`).
- **Switch, radio, avatar.** `rounded-full`.
- **Badge, chip.** `rounded-md`, 12px, on `bg-muted` or with a `border-border` hairline.
- **Skeleton.** `bg-muted`, `rounded-md`, static: no pulse.
- **Table.** Head cells 13px at weight 500 in muted-foreground (sticky in the admin), numbers right-aligned with `tabular-nums`, hover row `bg-muted`.
- **Floating layers.** Dialog, alert dialog, sheet, popover, dropdown menu, select content, hover tip, toasts and the terminal overlay use the float surface and a fixed scrim. Esc closes; focus returns to the trigger.
- **Icons.** lucide only, 16px or 20px, functional only. `react-icons` and `@radix-ui/react-icons` are gone; do not add them back. No emoji in UI.
- **Code.** A server `<pre>` on a tile, system mono, `tabIndex={0}`, no syntax colours. The client `CopyButton` keeps the `Click Copy Code` event.
- **Prose.** `.prose` in `globals.css` (no typography plugin): Onest at the `prose` size (16/28), headings at weight 500, `InkLink`-style links, quiet blockquotes, lists, hairline tables, images on tiles. `.prose--chat` for chat replies.
- **Media.** `MediaCard` and `PlateFigure` show pictures in their own colours on a `bg-muted` tile, `rounded-2xl`, only where screenshots matter (`/project` featured, the `/blog` lead, project heroes); the home has none. Size the picture in the caller so the tile reserves its space (no layout shift). The image scales to 1.015 on hover only under `(hover: hover)` and `motion-safe`.
- **Lists.** `LedgerList` and `LedgerRow`: the title in `text-foreground` at the body size, not bold, one muted line under it, an optional small muted group label. No boxes, no rules, no hover backgrounds.
- **PageHeader.** A left-aligned 24px h1 at weight 500 and an optional intro line in muted-foreground. One per page.
- **Hover tips.** `data-tip="..."` on any element shows an instant tip on the float surface. Never the native `title` attribute: it waits about a second. The tip is `aria-hidden`, so keep an `aria-label` or text beside it.
- **Generated cards.** Build `/api/og` and `/api/certificate` URLs with `ogImageUrl(params, path?)` from `src/lib/site-url.ts`. It always sets `v=5`; raise it when a card's design changes so crawlers and CDNs refetch. They read colours from `THEME_HEX`.

## Data viz

Every chart is server-rendered SVG. Recharts is gone; do not add a chart library.

- Lines and bars in foreground, areas and empty cells in `muted`, grid in `border`. Solid fills only, no hatching. The sky accent is never used in charts.
- `InkChart`: a 1.5px line, a `data-tip` per point and a `<details>` table as the text alternative. `preserveAspectRatio="none"` with `vector-effect="non-scaling-stroke"`.
- `InkHeatmap`: five levels from `muted` to foreground, a `data-tip` per cell.
- `HatchBar`: a solid share bar despite its name.

## Copy

- **Sentence case** everywhere: buttons, headings, labels, menu items, toasts.
- **Plain verbs** that say what happens: "Save changes", "Send message", "Open the site", "Delete post". Toasts echo the button: "Save changes" gives "Changes saved."
- **No generic CTAs**: "Learn more", "Click here", "Read more", "Get started", "Submit", "Explore". Name the destination ("All 27 projects", "Full history in my CV").
- **No buzzwords**: "seamless", "cutting-edge", "leverage", "unlock", "elevate", "supercharge", "game-changing", "next-level". The gate test holds the exact list.
- **No em dash in UI strings.** Use a comma, a colon, a full stop or "to". Comments may use one.
- **Honest states.**
  - Empty: say what is missing and what to do next. A home section with no data hides instead.
  - Loading: a static skeleton or a short line ("Loading projects."), no spinner theatre, no pulse.
  - Error: say what happened and the next step in plain words, never "Oops" or "Something went wrong". In the admin, `describeFailure()` maps status codes: 401 "Your session has ended. Sign in again to keep working.", 403 "This account is not an admin.", 404 "That entry no longer exists."
- No `uppercase`, no all-caps eyebrows, no middle-dot meta strings, no "→" after links. Datelines are words: "Published 3 March 2026, six minute read."
- Numbers only for real sequences: changelog versions, roadmap stages, legal sections.
- Never put PII in copy that reaches analytics.

## Umami events

The tracker is gated to production with `data-domains`, `data-exclude-hash`, `data-performance` and `data-before-send="umamiBeforeSend"` (`src/lib/umami-before-send.ts` strips `token=` and other non-UTM query params and drops `/admin`).

**Where the attribute goes.** Umami's script calls `preventDefault` and reassigns `location.href` on any `<a data-umami-event>` without `target="_blank"`, which turns a client-side navigation into a full page reload. So:

- `data-umami-event` only on `<button>` elements and on external links that open with `target="_blank"`.
- Internal links use `data-track="nav-click"` plus `data-track-*` attributes, for example `data-track-item="blog"`. One capture-phase listener in `src/components/layout/deferred-client-utilities.tsx` forwards them to `track()` without `preventDefault`.
- In code, call `track(name, data)` from `src/lib/analytics.ts`, never `window.umami` directly.
- One event per element.

**Naming.** Kebab-case, 50 characters or fewer, data values from a fixed enum. `Click Copy Code` is the one legacy name kept as is.

**Never send PII:** no emails, names, prompts, chat, JD or OCR text, search queries, chat ids or full URLs.

| Event | Where | Data |
|---|---|---|
| `nav-click`, `menu-open` | Header, menu, footer | `item`, `area` / none |
| `theme-toggle` | ThemeToggle | `to` |
| `outbound-click` | InkLink `external` default | `host`, `area` |
| `cta-click`, `resume-open` | Home bio and list links | `target` / `area` |
| `social-click`, `email-click` | Home bio (`area: bio`), footer (`area: colophon`, social and email), home contact (`area: contact`, email) | `network`, `area` |
| `cert-verify` | `/certificates` rows | `issuer` |
| `contact-send` | Contact form | `status`: `ok`, `error`, `limited` |
| `ai-error` | AI chat, OCR demo, JD matcher catch blocks | `feature`, `status` |
| `not-found` | NotFoundView island | `path` (pathname only) |
| `blog-open`, `rss-subscribe`, `Click Copy Code`, `clap` | Blog | `source` / `feed` / `lang` / `kind` |
| `project-site`, `project-source` | Project rows and detail | `project` |
| `roadmap-lesson-complete`, `video-play` | Roadmap | `course` / `lesson` |
| `tool-open`, `chat-send`, `stats-profile-open` | Tools, chat, stats | `tool` / `reply` / `platform` |
| `anime-generate`, `anime-quote` | Anime generator buttons (`/tools?tab=anime-generator`) | `category` (cringe, blush, dance) / none |
| `ai-tab`, `ai-chat-send`, `ai-ocr-run`, `ai-jd-run`, `hirefit-share` | `/ai` | `tab` / `status` / `mode`, `status` / `band`, `status` |
| `signin-start`, `signin-complete`, `signup-complete`, `profile-save` | Auth, profile | `method` / `status` |

Content counts read "Read by 1,204 people in the last 30 days." and hide below 10. The realtime line reads "N people here in the last five minutes.", renders nothing at 0, never pulses and has no `aria-live`.

## Accessibility floor

- Visible focus on every control; Esc closes layers and focus returns.
- `aria-current` on the current nav item.
- 44px tap targets below `md` on coarse pointers (`min-h-11`, `size-11`).
- State by icon and word, never colour alone.
- A text alternative for every chart.
- A pause control for anything that moves for more than five seconds (the footer sky's `SkyToggle`, visually hidden until keyboard focus).
- No horizontal scroll at 320 or 375px. `<html lang="en">`.
