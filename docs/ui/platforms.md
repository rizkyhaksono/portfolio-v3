# Platform shells

Every route group shares the same tokens and the same sans, Onest. Groups differ in shell, width and pattern, never in palette.

## Visitor (public portfolio)

**Routes:** `/`, `/blog`, `/project`, `/certificates`, `/changelog`, `/roadmap`, `/tools`, `/stats`, `/chat`, `/legal/*`

**Shell:** `BaseLayout`, a Notion workspace: the grey sidebar (lg and up) or the Menu sheet, the 44px top bar with the breadcrumb and the theme toggle, the page in the 708px column with every line left-aligned, and the closing line. Only the home has a cover (a photo). From `lg` the sidebar folds to an icon rail. See [page-shell.md](./page-shell.md).

| Route | Pattern |
|---|---|
| `/` | Photo cover, portrait, title, properties, a bio with Notion mentions, then Projects (gallery), Writing (list), Work experience and Education (two tables, every entry), Recommendations and Contact (the form shown directly). See [page-shell.md](./page-shell.md#home) |
| `/project` | `PageHeader`, then gallery views: "Hand-picked" first, then one group per year |
| `/project/[id]` | Article: the screenshot as cover, icon, title, properties, prose, clap, previous and next |
| `/blog` | `PageHeader`, a gallery of the newest posts with a cover, then list views grouped by year |
| `/blog/[slug]`, `/blog/onsite/[slug]`, `/roadmap/[slug]`, `/legal/*` | Article. Post comments are called "Comments" |
| `/roadmap` | Courses as vertical tabs, lessons as list views, view tabs for the level, one callout |
| `/certificates` | Table view |
| `/changelog` | `PageHeader`, then one block per release: a version tag and title as an `h2`, the date, the notes, hairlines between releases |
| `/tools` | Cabinet, `width="wide"`: a gallery of tool cards grouped Play, Practise and Look things up, above the open tool (`?tab=`, Pokédex by default). The anime generator (`?tab=anime-generator`) shows pictures by mood (cringe, blush, dance; waifu and neko stay hidden) and a quote tab |
| `/stats` | Figures: Readers, Coding (heatmap, WakaTime, Duolingo), Status, LeetCode, Typing, Chess.com and npm |
| `/chat` | Correspondence, `width="wide"`, `fit`, `footer="compact"` (no closing line) |

`/signal`, `/status` and `/playground` are redirects (`/`, `/stats`, `/`). `/ai` (Etan AI) has been hidden since 2026-11-05: a temporary redirect home, its `/api/ai/*` proxies answer 404 and the API no longer registers `/v3/ai`; the code stays. Do not rebuild them.

## User (signed in)

**Routes:** `/ai`, `/profile`, `/profile/edit`

**Shell:** `BaseLayout`. `/ai` uses `footer="compact"`. The sidebar's "Account" row leads to `/profile`.

| Route | Pattern |
|---|---|
| `/ai` | Cabinet with Correspondence for chat; tabs in `?tab=` |
| `/profile`, `/profile/edit` | Profile card |

## Admin

**Routes:** `/admin/dashboard/*`

**Shell:** `src/app/(admin)/admin/dashboard/layout.tsx` with `components/layout/admin/*`: the same Notion workspace as the visitor shell, with the same tokens and Onest and no blue. `data-private` keeps it out of Umami session replays. No terminal overlay or feedback widget.

- **Sidebar** (`admin-spine.tsx`, `AdminSidebar`): from `lg`, sticky at full height, 15rem (`w-60`), `bg-muted`. The workspace row (the portrait, "Rizky Haksono", "Admin" under it), then groups under `caption` labels: Overview (Dashboard, Analytics), Content (Projects, Work experience, Education, Career, Blog), Inbox (Feedback), Account (Settings); then "Open the site" (a new tab); at the bottom the avatar, name and email, and Log out behind a confirm. Rows are the visitor sidebar's: 28px from `lg` (44px below), 16px lucide icons, `bg-tint` on hover and on the current page with `aria-current`. It does not fold. Below `lg`, `AdminMenu` (a `PanelLeft` button labelled "Menu") opens the same tree in a left sheet that closes once a page is chosen.
- **Top bar** (`admin-top-header.tsx`): 44px (`--head-h`), sticky, opaque. The Menu button below `lg`, a breadcrumb "Admin / page" with icons (from `adminPageFor()`), then `NotificationBell` (an unread count, opens on click, polls once a minute while the tab is visible) and `ThemeToggle`.
- **Content** fills everything right of the sidebar, with 24px side padding (48px from `xl`). Each page opens with `PageHeader` and its icon from `AdminPageIcon`, left-aligned. Tables and charts use the whole width; forms keep a readable cap (`max-w-2xl`: the collection editor, Settings).
- **Collections** (`_components/collection.tsx`, `Collection`): Projects, Work experience, Education, Career and Blog as Notion databases. View tabs (`ViewTabs`) for the filters with "New {noun}" (an ink button) on the right. The table spans the content width. Adding or editing opens a dialog (about 48rem, full width on phones, scrolling inside) titled with the row or "New {noun}", with Cancel and "Add {noun}" or "Save {noun}"; closing with unsaved edits asks "Discard your changes?" first. The table has Title, a detail column, Status when there is one and the date; rows tint on hover and the row being edited stays tinted. A "..." menu per row holds Edit, an optional link to the live page and Delete, which asks first ("The {noun} is removed for good. This cannot be undone."). Sources with more than one origin switch with `SourceTabs`, kept in `?tab=`.
- **Errors** are honest: `describeFailure()` in `admin-format.ts` turns status codes into sentences (see [components.md](./components.md#copy)).
- `destructive` is used here, always with a word.

## Auth

**Routes:** `/auth/*`, `/admin/auth/login`

**Shell:** `layout/auth-shell.tsx`, laid out like notion.so/login, with no sidebar or top bar:

- The owner's 20px portrait and name top left, linking home.
- One 320px column (`max-w-xs`) centred on the page, a little above the middle.
- A two-line title at the `h2` size, centred: the first line in ink (`title`), the second in grey (`description`). On `/auth`: "One account for the site." then "Sign in or create one."
- The form: Email and Password as 36px fields with labels, a form-level error as a line with a cross, then a full-width ink button ("Sign in", "Create account") at `size="lg"`.
- An "or continue with" divider (hairlines either side), then "Continue with Google" as a full-width outline button with Google's G in the text colour.
- "New here? Create an account" under it switches the form in place and writes `?tab=signup` to the URL (keeping `redirect`); the sign-up form offers "Have an account? Sign in". Name, Email and Password on sign-up.
- Small print under it in `caption` muted text: the terms and privacy links.

No stock photos, no gradients, no shadows, no coloured checks, no blue.

## Outliers

| Item | Guidance |
|---|---|
| Terminal overlay | Its own layout on the float surface, the same tokens |
| OG and certificate images (`/api/og`, `/api/certificate`) | A neutral card, colours from `THEME_HEX`. Request them through `ogImageUrl` (`v=5`) |
| Favicon, icon, apple-icon | A plain "R" tile. `src/app/favicon.ico` must stay at that path: the container healthcheck fetches `/favicon.ico` |
| `not-found`, `error.tsx`, `global-error.tsx` | `NotFoundView`: a 56px muted icon, an `h1`, a muted line and a way back. `global-error.tsx` has no CSS, so it reads `THEME_HEX` and `system-ui` |

## Agent instruction files

All AI platforms share the same UI rules, and this folder is their source of truth.

| Platform | File |
|---|---|
| All agents | [`AGENTS.md`](../../AGENTS.md) |
| Claude | [`CLAUDE.md`](../../CLAUDE.md) |
| Cursor | [`.cursorrules`](../../.cursorrules) and `.cursor/rules/` |
| Gemini | [`.geminirules`](../../.geminirules), [`GEMINI.md`](../../GEMINI.md) |
| Copilot | [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) |
| UI docs | This folder (`docs/ui/`) |
