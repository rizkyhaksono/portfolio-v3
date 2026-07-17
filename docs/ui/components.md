# UI Primitives Catalog

Prefer these over ad-hoc bordered `div`s.

## Layout & structure

| Primitive | Path | Role |
|---|---|---|
| `BaseLayout` | `components/layout/base-layout.tsx` | Visitor/user page shell |
| `PageBody` | `components/ui/page-body.tsx` | Content width preset |
| `PageSection` | `components/ui/page-section.tsx` | `mt-10` section + optional heading |
| `SectionHeading` | `components/ui/section-heading.tsx` | Eyebrow + title + accent + description |
| `SidebarMain` / `SidebarSecondary` | `components/layout/` | Left nav |
| `RightSidebarWindow` | `components/layout/right-sidebar-window.tsx` | Collapsible glass info panel |
| `VisitorPanel` | `components/layout/visitor-panel.tsx` | IP / status / weather inset blocks |

## Surfaces

| Primitive | Path | Dialect |
|---|---|---|
| `Card` (+ Header/Content/Footer/Title/Description) | `components/ui/card.tsx` | solid |
| `Surface` | `components/ui/surface.tsx` | solid / glass / glass-static / inset |
| `FeatureCard` / `BentoGrid` | `components/ui/bento.tsx` | solid feature grid |
| `MacWindow` | `components/ui/mac-window.tsx` | glass chrome |

### Surface API

```tsx
<Surface variant="solid" | "glass" | "glass-static" | "inset" padding="none" | "default" | "compact" | "cozy">
  …
</Surface>
```

### MacWindow API

```tsx
<MacWindow title="~/tools" backdrop? bodyClassName?>
  …
</MacWindow>
```

- `backdrop` defaults to `true`. Set `false` for DnD pages (tracker).

## Typography & chrome

| Primitive | Role |
|---|---|
| `Eyebrow` | Small uppercase label |
| `Chip` | Mono tag |
| `StatStrip` | Horizontal hairline stats |
| `Typography` | Legacy text helpers — prefer SectionHeading for titles |
| `Button` | shadcn button variants |
| `Badge` | Compact status |

## Media / list cards

| Component | Path | Notes |
|---|---|---|
| `CardBlog` | `app/_components/blog/card-blog.tsx` | solid + `hover:border-foreground/20` |
| `CardBlogMedium` | `app/_components/blog/blog-medium.tsx` | same hover |
| `CardProject` | `app/_components/project/card-project.tsx` | same hover |

Footer pattern: `p-4 pt-4 mt-auto border-t border-border`.

## When to pick what

```
Need a page shell?          → BaseLayout
Need max-width?             → PageBody
Need section spacing?       → PageSection
Need a title block?         → SectionHeading
Need a content box?         → Card or Surface solid
Need a feature/platform tile? → FeatureCard or Surface solid + cozy pad
Need tool/list chrome?      → MacWindow
Need a nested row?          → Surface inset
Need DnD inside a window?   → MacWindow backdrop={false}
```

## Outliers (do not copy)

- `/signal` — standalone dark marketing
- `terminal-overlay` — intentional dark terminal chrome
- Admin login heavy shadows — keep contained to auth; do not spread to visitor UI
