# Platform shells

Every route group shares the same tokens and the same sans, Onest. Groups differ in shell, width and pattern, never in palette.

## Visitor (public portfolio)

**Routes:** `/`, `/blog`, `/project`, `/certificates`, `/changelog`, `/roadmap`, `/tools`, `/stats`, `/chat`, `/legal/*`

**Shell:** `BaseLayout`, a Notion workspace: the grey sidebar (lg and up) or the Menu sheet, the 44px top bar with the breadcrumb and the theme toggle, the page in the 708px column with every line left-aligned, and the closing line. Only the home has a cover (the Langit Malang sky). See [page-shell.md](./page-shell.md).

| Route | Pattern |
|---|---|
| `/` | Cover, portrait, title, properties, bio, then Projects (gallery), Writing (list), Work experience (table, every entry), Recommendations and Contact (one callout and a toggle). See [page-shell.md](./page-shell.md#home) |
| `/project` | `PageHeader`, then gallery views: "Hand-picked" first, then one group per year |
| `/project/[id]` | Article: the screenshot as cover, icon, title, properties, prose, clap, previous and next |
| `/blog` | `PageHeader`, a gallery of the newest posts with a cover, then list views grouped by year |
| `/blog/[slug]`, `/blog/onsite/[slug]`, `/roadmap/[slug]`, `/legal/*` | Article. Post comments are called "Comments" |
| `/roadmap` | Courses as vertical tabs, lessons as list views, view tabs for the level, one callout |
| `/certificates` | Table view |
| `/changelog` | `PageHeader`, then one block per release: a version tag and title as an `h2`, the date, the notes, hairlines between releases |
| `/tools` | Cabinet, `width="wide"`. The anime generator (`?tab=anime-generator`) shows pictures by mood (cringe, blush, dance; waifu and neko stay hidden) and a quote tab |
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

The admin shares the tokens and Onest, has no sky and no blue. **It keeps its own shell for now** (`components/layout/admin/admin-spine.tsx`, `admin-top-header.tsx`): that code predates the Notion design and still breaks R4, so do not copy its patterns into visitor pages. Its rebuild comes later. The target, which new admin work should build toward:

- **Full width**, laid out like the visitor shell: a Notion sidebar (15rem, `bg-muted`, 28px rows with 16px lucide icons, `bg-tint` on hover and on the current item with `aria-current`). The workspace row "Rizky Haksono" with "Admin" under it. Items: Home, Analytics, Feedback, then Content (Projects, Career, Education, Posts), then Settings, then "Open the site", then the avatar and Log out. On phones the sidebar is a left sheet.
- **Top bar:** 44px, with the breadcrumb, the notifications bell (opens on click, not hover) and the theme toggle.
- **Content** fills everything right of the sidebar, with 24px padding (32px from `xl`). Tables and charts use the whole width. Only forms keep a readable cap: the peek editor is 44rem, the Settings fields 40rem, left-aligned.
- **Page titles:** `PageHeader` with the section icon, left-aligned.
- **Collections** (Projects, Career, Education, Posts): a Notion table view with real columns. Clicking a row opens a right-side peek sheet (44rem) with the editor; the URL carries `?edit=<id>` or `?new=1`. "New {noun}" (an ink button) sits at the top. Search appears only above 10 rows. Unsaved changes are guarded. Delete lives in the peek behind a confirm that says what disappears from the site.
- **Errors** are honest: `describeFailure()` in `admin-format.ts` turns status codes into sentences (see [components.md](./components.md#copy)).
- `destructive` is used here, always with a word.
- No terminal overlay or feedback widget.

## Auth

**Routes:** `/auth/*`, `/admin/auth/login`

**Shell:** `layout/auth-shell.tsx`, laid out like notion.so/login, with no sidebar, top bar or sky:

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
