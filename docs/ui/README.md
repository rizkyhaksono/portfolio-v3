# UI Design System — Portfolio v3

Canonical documentation for layout, surfaces, and page shells. Agents should also follow [`AGENTS.md`](../AGENTS.md) and `.cursor/rules/ui-layout-consistency.mdc`.

## Index

| Doc | Purpose |
|---|---|
| [design-system.md](./design-system.md) | Tokens, typography, color, radius |
| [surfaces.md](./surfaces.md) | solid / glass / inset dialects |
| [page-shell.md](./page-shell.md) | BaseLayout, PageBody, PageSection recipes |
| [components.md](./components.md) | Primitive catalog & when to use each |
| [platforms.md](./platforms.md) | Visitor, user, admin, auth shells |

## Quick rules

1. Monochrome, square corners, hairline borders.
2. Only three surface dialects: **solid**, **glass**, **inset**.
3. Page recipe: `BaseLayout` → `PageBody` → `SectionHeading` → content.
4. Tokens live in `src/lib/design-system.ts` and CSS vars in `src/app/globals.css`.

## Source of truth (code)

- Tokens: `src/lib/design-system.ts`
- Primitives: `src/components/ui/{surface,page-body,page-section,mac-window,card,bento,section-heading}.tsx`
- Shell: `src/components/layout/base-layout.tsx`
- Agent rule: `.cursor/rules/ui-layout-consistency.mdc`
