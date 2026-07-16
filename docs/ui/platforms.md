# Platform Shells

How each route group should compose layout and surfaces.

## Visitor (public portfolio)

**Routes:** `/`, `/blog`, `/project`, `/certificates`, `/tools`, `/tracker`, `/status`, `/stats`, `/chat`, `/roadmap`, …

**Shell:** `BaseLayout` + usually `SidebarMain`; some pages also mount `RightSidebarWindow` / `VisitorPanel`.

**Surfaces:**

- Page title → `SectionHeading as="h1"`
- Tools / boards / lists → wrap in `MacWindow`
- Content tiles → solid `Card` / `FeatureCard` / `Surface`
- Nested rows (status, leetcode pills) → `Surface variant="inset"`

**Examples:**

| Page | Pattern |
|---|---|
| Home sections | `PageSection` + solid rows |
| Blog / Project index | `MacWindow` + media Cards |
| Stats | `PageBody width="wide"` + `MacWindow` + solid PlatformCards |
| Tracker | `MacWindow backdrop={false}` + board |
| Status | `MacWindow` + inset service rows |

## User (authenticated)

**Routes:** `/profile`, `/ai`, …

**Shell:** `BaseLayout` + left sidebar.

**Surfaces:** solid `Card` for profile header/content. No glass content cards. Prefer `PageBody` without inventing `max-w-8xl`.

## Admin

**Routes:** `/admin/dashboard/*`

**Shell:** Admin expandable sidebar + top header (not `BaseLayout`). Main area uses `p-4 sm:p-5` offset layout.

**Surfaces:** still solid only — `Card` / `Surface variant="solid"`. Page headers may use `SectionHeading` / `Eyebrow`. Do not invent a third dialect (`border-border/50` raw divs → `Surface` or `Card`).

## Auth

**Routes:** `/auth/*`, `/admin/auth/login`

**Shell:** Pass-through / centered form. Often a solid `Card` with constrained `max-w-sm` / `max-w-md` / `max-w-3xl`.

**Surfaces:** solid Card. Heavier shadows are acceptable here but must not leak into visitor UI.

## Standalone / outliers

| Route | Status | Guidance |
|---|---|---|
| `/legal/*` | Often no BaseLayout | Prefer joining BaseLayout or a documented standalone shell |
| `/changelog` | Sticky custom header | Same |
| `/signal` | Intentional dark marketing | Do not copy patterns elsewhere |
| Terminal overlay | Dark chrome | Keep isolated |

## Cross-platform agent docs

All AI platforms share the same UI rules. Entry points:

| Platform | File |
|---|---|
| All agents | [`AGENTS.md`](../../AGENTS.md) |
| Claude | [`CLAUDE.md`](../../CLAUDE.md) |
| Cursor | [`.cursorrules`](../../.cursorrules) + `.cursor/rules/` |
| Gemini | [`.geminirules`](../../.geminirules) |
| Copilot | [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) |
| UI docs | This folder (`docs/ui/`) |
