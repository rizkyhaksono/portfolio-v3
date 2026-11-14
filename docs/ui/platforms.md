# Platform shells

Every route group shares the same tokens and the same sans, Onest. Groups differ in shell, width and pattern, never in palette.

## Visitor (public portfolio)

**Routes:** `/`, `/blog`, `/project`, `/certificates`, `/changelog`, `/roadmap`, `/tools`, `/stats`, `/chat`, `/legal/*`

**Shell:** `BaseLayout`: the handle and a short rule at the top, one 36rem column with every line left-aligned, the menu sheet, and the painted Langit Malang footer. No sidebars, no top sky.

| Route | Pattern |
|---|---|
| `/` | Bio, then Projects, Writing, Work experience (every entry), Recommendations and Contact as plain text lists. See [page-shell.md](./page-shell.md#home) |
| `/project` | `PageHeader`, the featured `MediaCard`s, then plain rows grouped by year |
| `/project/[id]` | Article: back link, h1, dateline, links, the morph hero, prose, clap, previous and next |
| `/blog` | A lead `MediaCard`, then rows grouped by year |
| `/blog/[slug]`, `/blog/onsite/[slug]`, `/roadmap/[slug]`, `/legal/*` | Article. Post comments are called "Comments" |
| `/certificates`, `/changelog`, `/roadmap` | Ledger |
| `/tools` | Cabinet, `width="wide"`. The anime generator (`?tab=anime-generator`) shows pictures by mood (cringe, blush, dance; waifu and neko stay hidden) and a quote tab |
| `/stats` | Figures: Readers, Coding (heatmap, WakaTime, Duolingo), Status, LeetCode, Typing, Chess.com and npm |
| `/chat` | Correspondence, `width="wide"`, `fit`, `footer="compact"` (no sky) |

`/signal`, `/status` and `/playground` are redirects (`/`, `/stats`, `/`). `/ai` (Etan AI) has been hidden since 2026-11-05: a temporary redirect home, its `/api/ai/*` proxies answer 404 and the API no longer registers `/v3/ai`; the code stays. Do not rebuild them.

## User (signed in)

**Routes:** `/ai`, `/profile`, `/profile/edit`

**Shell:** `BaseLayout`. `/ai` uses `footer="compact"`.

| Route | Pattern |
|---|---|
| `/ai` | Cabinet with Correspondence for chat; tabs in `?tab=` |
| `/profile`, `/profile/edit` | Profile card |

## Admin

**Routes:** `/admin/dashboard/*`

The admin shares the tokens and Onest. It is a work tool, so it has **no sky**, and it is **full width**.

- **Sidebar** (like macOS Finder or Notes): 15rem wide from `md`, `bg-muted` at half strength, no rules. The workspace name "Rizky Haksono" with "Admin" under it, one lucide icon per item. Items: Home, Analytics, Feedback, then Content (Projects, Career, Education, Posts), then Settings, then "Open the site", then the avatar and Log out. The active item has a `bg-muted` ground and `aria-current`. On phones the sidebar is a left sheet.
- **Top bar:** 44px, with the breadcrumb, the notifications bell (opens on click, not hover) and the theme toggle.
- **Content** fills everything right of the sidebar, with 24px padding (32px from `xl`). Tables and charts use the whole width. Only forms keep a readable cap: the peek editor is 44rem, the Settings fields 40rem, left-aligned.
- **Page titles:** one plain h1 per page at the `h2` size, left-aligned.
- **Collections** (Projects, Career, Education, Posts): a table with real columns. Clicking a row opens a right-side peek sheet (44rem) with the editor; the URL carries `?edit=<id>` or `?new=1`. "New {noun}" sits at the top. Search appears only above 10 rows. Unsaved changes are guarded. Delete lives in the peek behind a confirm that says what disappears from the site.
- **Errors** are honest: `describeFailure()` in `admin-format.ts` turns status codes into sentences (see [components.md](./components.md#copy)).
- `destructive` is used here, always with a word.
- No terminal overlay or feedback widget.

## Auth

**Routes:** `/auth/*`, `/admin/auth/login`

**Shell:** `layout/auth-shell.tsx`, one centred column: the name, a short line on what an account is for, the form, then the Langit Malang landscape as a band at the bottom (no footer text) with the same visually hidden sky toggle. Fields are full boxes with `border-input`. No stock photos, no gradients outside the sky, no shadows, no coloured checks.

## Outliers

| Item | Guidance |
|---|---|
| Terminal overlay | Its own layout on the float surface, the same tokens |
| OG and certificate images (`/api/og`, `/api/certificate`) | A neutral card, colours from `THEME_HEX`. With `src/lib/theme-hex.ts` and `globals.css`, the only places raw hex is allowed. Request them through `ogImageUrl` (`v=5`) |
| Favicon, icon, apple-icon | A plain "R" tile. `src/app/favicon.ico` must stay at that path: the container healthcheck fetches `/favicon.ico` |
| `not-found`, `error.tsx`, `global-error.tsx` | The name as text; `global-error.tsx` has no CSS, so it reads `THEME_HEX` and `system-ui` |

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
