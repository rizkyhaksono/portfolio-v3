# Page Shell

## Visitor / user recipe

```
BaseLayout(sidebar?, rightSidebar?, useGridBackground?, useInteractiveGrid?)
  └─ PageBody width="default" | "prose" | "article" | "wide"
       └─ SectionHeading as="h1" …
       └─ MacWindow?  OR  Card / FeatureCard / Surface grid
```

### BaseLayout

File: `src/components/layout/base-layout.tsx`

- Applies Tailwind `container` + top padding.
- Optional left `sidebar` and right `rightSidebar`.
- Includes Navbar (mobile), Footer, ScrollProgress, optional grid background.
- **Do not** add extra horizontal `px-4` / `lg:px-0` on children.

### PageBody

File: `src/components/ui/page-body.tsx`

| `width` | Classes | When |
|---|---|---|
| `default` | `w-full` | Most pages inside BaseLayout |
| `prose` | `max-w-3xl` | Long-form articles |
| `article` | `max-w-5xl` | Project detail, changelog-like |
| `wide` | `max-w-7xl` | Dense grids (stats, roadmap) |

Always includes `flex flex-col gap-6`.

### PageSection

File: `src/components/ui/page-section.tsx`

- Wrapper with `mt-10` rhythm.
- Optional `heading` prop → renders `SectionHeading`.
- Content gap `mt-6` when a heading is present.

```tsx
<PageSection
  heading={{
    eyebrow: "Education",
    title: "Academic",
    accent: "foundation",
    description: "…",
  }}
>
  <Surface variant="solid" padding="compact">…</Surface>
</PageSection>
```

### SectionHeading

File: `src/components/ui/section-heading.tsx`

- Eyebrow + display title + optional serif italic `accent` + muted description.
- Use `as="h1"` on page routes; `as="h2"` (default) for home sections.

## Micro-UI

| Component | Role |
|---|---|
| `Eyebrow` | Uppercase mono label |
| `Chip` | Compact tag / duration |
| `StatStrip` | Hairline grid of stats |

## Width anti-patterns

| Avoid | Prefer |
|---|---|
| Nested `max-w-6xl mx-auto px-4 lg:px-0` inside BaseLayout | `<PageBody width="wide">` |
| `max-w-8xl` | Does not exist — use `wide` or `default` |
| Double `container` on child pages | Trust BaseLayout |

## Standalone pages

Some routes intentionally skip BaseLayout (legal, changelog sticky header, `/signal`). Prefer joining BaseLayout over time, or document a dedicated standalone shell — do not invent a one-off padding dialect.
