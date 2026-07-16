# Surfaces

Portfolio v3 allows **exactly three** surface dialects. Do not invent blends.

## Dialect matrix

| Variant | Visual | Primitive | Use for |
|---|---|---|---|
| **solid** | `border-border bg-card shadow-sm` | `Card`, `FeatureCard`, `Surface variant="solid"` | Content boxes, lists, feature/platform cards, media cards |
| **glass** | `border-border/60 bg-background/40 backdrop-blur-sm` | `MacWindow`, `Surface variant="glass"` | Window chrome only (title bar + frosted shell) |
| **glass-static** | glass without blur | `MacWindow backdrop={false}`, `Surface variant="glass-static"` | Same chrome when an ancestor filter breaks DnD / fixed positioning |
| **inset** | `border-border/40 bg-secondary/20` | `Surface variant="inset"` | Nested rows, sidebar blocks, status cells |

## Solid (default content)

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Surface } from "@/components/ui/surface"
import { FeatureCard } from "@/components/ui/bento"

<Card className="hover:border-foreground/20">…</Card>
<Surface variant="solid" padding="compact">…</Surface>
<FeatureCard title="…" description="…">…</FeatureCard>
```

Hover standard for interactive solid cards: `hover:border-foreground/20`.  
Do **not** restate `border border-border bg-card shadow-sm` on `Card` — already defaults.

## Glass (chrome only)

```tsx
import { MacWindow } from "@/components/ui/mac-window"

<MacWindow title="~/tools">{/* solid cards inside */}</MacWindow>
<MacWindow title="~/tracker" backdrop={false}>{/* DnD board */}</MacWindow>
```

Glass wraps tools/lists. Put **solid** cards *inside* the window. Never make the content card itself glass.

## Inset (nested)

```tsx
<Surface variant="inset" className="flex items-center justify-between px-4 py-3">
  …
</Surface>
```

Use for visitor-panel blocks, status rows, metric pills inside a larger solid/glass parent.

## Forbidden glass content stack

```
border-white/10 dark:border-white/5
bg-white/5 dark:bg-neutral-900/40
backdrop-blur-md
hover:shadow-xl hover:-translate-y-1
```

Replace with solid + `hover:border-foreground/20`.

## Padding guide

| Context | Padding |
|---|---|
| Default Card Header/Content | `p-6` / `p-6 pt-0` |
| Compact rows / education / feedback | `p-4` (`Surface padding="compact"`) |
| Platform / cozier cards | `p-5` (`padding="cozy"`) |
| MacWindow body | `p-4 sm:p-6` (override only when needed) |
| Media card footer | `p-4` + `border-t border-border` |
