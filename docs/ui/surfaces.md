# Surfaces: page, tile, frame, float

Four surfaces and one bar. Most content needs no surface at all: prose, rows and headings sit straight on the page. Reach for a surface only when the content is a separate object.

| Surface | Looks like | Code | Use for |
|---|---|---|---|
| **Page** | `bg-background`, no box | nothing | Prose, rows, headings, most of every page |
| **Tile** | `bg-muted`, `rounded-2xl`, no border, no shadow | `Surface variant="inset"`, `MediaCard`, `PlateFigure` | Screenshots and photos, code blocks, inset rows, segmented tracks |
| **Frame** | 1px `border-border` hairline, `rounded-2xl`, transparent ground, no shadow | `Card`, `Surface variant="solid"` | Separate objects: a form group, the profile card, admin panels |
| **Float** | `bg-popover`, `rounded-xl`, `shadow-float`, hairline border | Inside the shared floating primitives | Dialog, alert dialog, sheet, popover, dropdown menu, select content, hover tip, toasts, terminal overlay |

**The bar.** The sticky header is the one translucent element: a translucent `background` fill with `backdrop-blur-md` and a hairline that appears after scrolling, so the sky and the content scroll under a calm, readable bar. Nothing else is translucent or blurred.

`Surface variant="glass"` and `"glass-static"` (and `SURFACE.glass` / `glassNoBlur`) are retired aliases of the frame. Do not use them.

## Tile

```tsx
<Surface variant="inset" className="px-4 py-3">...</Surface>
```

- Grey tiles separate work from prose the Apple way, without lines. A tile has no border and no shadow.
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
- Interactive rows show hover with `bg-muted` and `rounded-lg`, never with a shadow, a lift or a border colour change.

## Float

- Applied once, inside the shared floating primitives in `src/components/ui/` and in Sonner's `toastOptions.classNames` in `src/components/layout/toaster.tsx`. Feature code does not add `shadow-float` by hand.
- Behind a modal sits a fixed scrim filled with `--scrim`. No backdrop blur.
- Radix layers fade in 150 to 200ms; sheets slide over `--dur-sheet`. Esc closes, and focus returns to the trigger.

## Forbidden

| Avoid | Use instead |
|---|---|
| Glass cards, translucent fills, backdrop blur anywhere but the header | A tile or a frame |
| Shadows on cards, hover shadows, `hover:-translate-y-*` lifts | A `bg-muted` hover row, or the media image scale |
| Gradient fills, glows, coloured borders | The tokens |
| `rounded-[…]` or mixed radii on one level | The radius scale in [design-system.md](./design-system.md#shape) |
| Borders around media tiles | The muted ground alone |
| Window chrome, traffic lights, terminal title bars on content | A tile, or no box at all |
| A tile on a tile, a frame in a frame | One surface per level |

## Padding

| Context | Padding |
|---|---|
| Card header and content | `SURFACE_PADDING.default` |
| Compact rows, feedback, education | `padding="compact"` |
| Form groups, profile card | `padding="cozy"` |
