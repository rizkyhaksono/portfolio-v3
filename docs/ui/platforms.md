# Platform shells

Every route group prints in the same ink on the same paper. Groups differ in shell and pattern, never in palette.

## Visitor (public portfolio)

**Routes:** `/`, `/blog`, `/project`, `/certificates`, `/changelog`, `/roadmap`, `/tools`, `/tracker`, `/stats`, `/chat`, `/legal/*`

**Shell:** `BaseLayout` with the running head, menu sheet and colophon. No sidebars.

| Route | Pattern |
|---|---|
| `/` | Masthead stage (`bleed`) then the home story, see [page-shell.md](./page-shell.md) |
| `/blog`, `/certificates`, `/changelog`, `/project` index | Ledger (projects add three featured Plates rows) |
| `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` | Article |
| `/roadmap` | Ledger |
| `/tools` | Cabinet |
| `/tracker` | Board |
| `/stats` | Figures |
| `/chat` | Correspondence, `footer="compact"` |

`/signal`, `/status` and `/playground` are redirects (`/`, `/stats`, `/ai`). Do not rebuild them. `/status` gains the `#status` hash in P2, when /stats gets its `id="status"` strip.

## User (signed in)

**Routes:** `/ai`, `/profile`, `/profile/edit`

**Shell:** `BaseLayout`. `/ai` uses `footer="compact"`.

| Route | Pattern |
|---|---|
| `/ai` | Cabinet with Correspondence for chat; tabs in `?tab=` |
| `/profile`, `/profile/edit` | Profile card |

## Admin

**Routes:** `/admin/dashboard/*`

**Shell:** its own ruled spine (`--admin-rail`) with an inverted active row, not `BaseLayout`. No command palette, terminal or feedback widget.

**Patterns:** Figures for the dashboard and analytics, Ledger for lists, frame form slips for editing, Correspondence for feedback, Profile card for settings. Same tokens, same three surfaces.

## Auth

**Routes:** `/auth/*`, `/admin/auth/login`

**Shell:** `layout/auth-shell.tsx`, split or narrow. A frame form slip with baseline fields. No gradients, stock photos, heavy shadows or coloured checks.

## Outliers

| Item | Guidance |
|---|---|
| Terminal overlay | Own layout, same ink and paper |
| OG and certificate images (`/api/og`, `/api/certificate`) | Always printed on paper colours; the only place hex values are allowed in code |

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
