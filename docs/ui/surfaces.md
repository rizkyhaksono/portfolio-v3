# Surfaces: page, tile, frame, float, tint

Five grounds, as in a Notion workspace. Most content needs no box: titles, page text, properties, list rows, tables and headings sit straight on the page. Reach for a surface only when the content is a separate object: a gallery card, a picture, code, a form group, a floating layer. No boxes around sections, no stat cards, no tiles for plain text.

| Surface | Looks like | Code | Use for |
|---|---|---|---|
| **Page** | `bg-background`, no box | nothing | Page text, properties, list rows, tables, headings, most of every page |
| **Sidebar** | `bg-muted`, no border | `Sidebar`, the menu sheet | The page tree on the left (lg and up) and the same tree in the left sheet below lg |
| **Tile** | `bg-muted`, `rounded-lg`, no border, no shadow | `PlateFigure`, `Surface variant="inset"`, `.prose pre` | Pictures, code blocks, the image area of a gallery card |
| **Frame** | 1px `border-border` hairline, `rounded-lg`, page ground, no shadow | `Card`, `Surface variant="solid"`, `MediaCard` | Gallery cards, a form group, the profile card |
| **Float** | `bg-popover`, `rounded-lg`, hairline `border-border`, no shadow | Inside the shared floating primitives | Dialog, alert dialog, sheet, popover, dropdown menu, select content, terminal overlay |
| **Inverted** | `bg-foreground text-background`, no border | `HoverTip`, the Sonner toast | The tooltip (`rounded-md`) and toasts (`rounded-lg`), as in Notion |

**Tints.** Notion's translucent fills sit on any ground: `bg-tint` (6% ink) for hover on rows, buttons and menu items, for the `Callout` block and for skeletons; `bg-tint-strong` (10% ink) for tags and selected items. They are the only hover feedback on rows and cards.

**The top bar** is opaque `bg-background`, sticky, with no border, blur or shadow. Nothing on the site is translucent except the tints. The only painted ground is the home cover.

`Surface variant="glass"` and `"glass-static"` (and `SURFACE.glass` / `glassNoBlur`) are retired aliases of the frame. Do not use them.

## Tile

```tsx
<Surface variant="inset" className="px-4 py-3">...</Surface>
```

- A tile holds a picture or code, never plain text. It has no border and no shadow.
- Pictures show in their own colours on the grey ground; captions sit under the tile in `caption` muted text.
- Code is a tile: server `<pre>`, system mono, `tabIndex={0}`, no syntax colours.

## Frame

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Surface } from "@/components/ui/surface"

<Card>...</Card>
<Surface padding="compact">...</Surface>
```

- Do not restate `border border-border bg-card` on `Card`; it is the default.
- A clickable frame (a gallery card) shows hover with `hover:bg-tint`, never a shadow, a lift, a scale or a border colour change.

## Float

- The hairline border is applied once, inside the shared floating primitives in `src/components/ui/`. Toasts are styled in Sonner's `toastOptions.classNames` in `src/components/layout/toaster.tsx`. There is no shadow; feature code never adds one.
- Menu rows are 28px (44px on touch), `rounded-md`, `text-small`, with `focus:bg-tint`.
- Behind a modal sits a fixed scrim filled with `--scrim`. No backdrop blur.
- Radix layers fade in with a 4px slide over 150 to 200ms; sheets slide over `--dur-sheet`. Esc closes, and focus returns to the trigger.

## Callout

`Callout` (`components/ui/callout.tsx`) is Notion's grey callout block: an icon and a short passage on `bg-tint`, `rounded-md`. **One per page at most.** It is not a frame for sections.

## Forbidden

| Avoid | Use instead |
|---|---|
| Glass cards, translucent fills other than the tints, backdrop blur | A tile, a frame, or no box at all |
| Shadows on cards, hover shadows, `hover:-translate-y-*` lifts, hover scaling | `hover:bg-tint` |
| Gradient fills, glows, coloured borders, blue hover states | The tokens and the tints |
| `rounded-[…]`, `rounded-xl`, `rounded-2xl`, mixed radii on one level | The radius scale in [design-system.md](./design-system.md#shape) |
| Window chrome, traffic lights, terminal title bars on content | A tile, or no box at all |
| A tile on a tile, a frame in a frame | One surface per level |
| Boxed sections, stat cards, more than one callout | Headings, whitespace, a `Properties` list or a `Table` |

## Padding

| Context | Padding |
|---|---|
| Card header and content | `p-4` (inside `Card`) or `SURFACE_PADDING.default` |
| Compact rows, feedback, education | `padding="compact"` |
| Form groups, profile card | `padding="cozy"` |
| Gallery card text | `px-2.5 pb-2.5 pt-2` (inside `MediaCard`) |
