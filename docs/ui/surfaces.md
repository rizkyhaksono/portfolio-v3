# Surfaces: page, tile, frame, float

Four surfaces. Most content needs no surface at all: the handle, prose, rows, section labels and figures sit straight on the page, as on joshpuckett.me. Reach for a surface only when the content is a separate object: a screenshot, code, a form, a floating layer. No boxes around sections, no stat cards, no tiles for plain text.

| Surface | Looks like | Code | Use for |
|---|---|---|---|
| **Page** | `bg-background`, no box | nothing | Prose, rows, headings, most of every page |
| **Tile** | `bg-muted`, `rounded-2xl`, no border, no shadow | `MediaCard`, `PlateFigure`, `Surface variant="inset"` | Screenshots and photos where they matter (`/project` featured, the `/blog` lead, project heroes), code blocks, segmented tracks |
| **Frame** | 1px `border-border` hairline, `rounded-2xl`, transparent ground, no shadow | `Card`, `Surface variant="solid"` | Separate objects: a form group, the profile card, admin panels |
| **Float** | `bg-popover`, `rounded-xl`, hairline `border-border`, no shadow | Inside the shared floating primitives | Dialog, alert dialog, sheet, popover, dropdown menu, select content, hover tip, toasts, terminal overlay |

**No bar.** The header is the handle and a short rule as plain text on the page; it is not sticky, translucent or blurred. Nothing on the site is translucent or blurred. The only painted ground is the footer sky.

`Surface variant="glass"` and `"glass-static"` (and `SURFACE.glass` / `glassNoBlur`) are retired aliases of the frame. Do not use them.

## Tile

```tsx
<Surface variant="inset" className="px-4 py-3">...</Surface>
```

- A tile holds a picture or code, never plain text. It has no border and no shadow.
- Media sits on a tile in its own colours, `rounded-2xl`, title and meta below the tile, not on it.
- Code is a tile: server `<pre>`, system mono, `tabIndex={0}`, no syntax colours.
- Text on a tile is `text-foreground` or `text-muted-foreground` only.

## Frame

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Surface } from "@/components/ui/surface"

<Card>...</Card>
<Surface padding="compact">...</Surface>
```

- Do not restate `border border-border bg-card` on `Card`; it is the default.
- Rows never show hover with a background, a shadow, a lift or a border colour change; the title's underline strengthens instead.

## Float

- The hairline border is applied once, inside the shared floating primitives in `src/components/ui/` and in Sonner's `toastOptions.classNames` in `src/components/layout/toaster.tsx`. There is no shadow; feature code never adds one.
- Behind a modal sits a fixed scrim filled with `--scrim`. No backdrop blur.
- Radix layers fade in 150 to 200ms; sheets slide over `--dur-sheet`. Esc closes, and focus returns to the trigger.

## Forbidden

| Avoid | Use instead |
|---|---|
| Glass cards, translucent fills, backdrop blur | A tile or a frame, or no box at all |
| Shadows on cards, hover shadows, `hover:-translate-y-*` lifts, hover backgrounds on rows | The link underline, or the media image scale |
| Gradient fills, glows, coloured borders | The tokens |
| `rounded-[…]` or mixed radii on one level | The radius scale in [design-system.md](./design-system.md#shape) |
| Borders around media tiles | The muted ground alone |
| Window chrome, traffic lights, terminal title bars on content | A tile, or no box at all |
| A tile on a tile, a frame in a frame | One surface per level |
| Boxed sections, stat cards, rules between groups | Whitespace and a small muted label |

## Padding

| Context | Padding |
|---|---|
| Card header and content | `SURFACE_PADDING.default` |
| Compact rows, feedback, education | `padding="compact"` |
| Form groups, profile card | `padding="cozy"` |
