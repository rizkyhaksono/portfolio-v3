# Surfaces: frame, inset, lift

There are exactly three surfaces. Each one is something a printer could make on one sheet with one ink. Do not blend them and do not invent a fourth.

| Surface | Looks like | Code | Use for |
|---|---|---|---|
| **Frame** | 1px `rule` hairline on the paper, transparent ground, radius 0, no shadow | `Card`, `Surface variant="solid"` (`SURFACE.solid` = `rounded-none border border-border bg-transparent`) | Content boxes, form slips, profile card, plates |
| **Inset** | `tint` ground, no border needed | `Surface variant="inset"` (`SURFACE.inset` = `bg-muted`) | Nested rows, code specimens, hover rows, inline status cells |
| **Lift** | `paper` ground, 1px `ink` border, hard offset ink shadow `3px 3px 0` | `bg-paper border border-ink shadow-[3px_3px_0_hsl(var(--ink))]` inside the floating primitives | Floating layers only: Dialog, AlertDialog, Sheet, Popover, DropdownMenu, Tooltip, Select, Sonner toasts, the tracker card being dragged |

`Surface variant="glass"` and `"glass-static"` (and `SURFACE.glass` / `glassNoBlur`) are retired aliases that render as a frame. Do not use them in new code.

## Frame

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Surface } from "@/components/ui/surface"

<Card>...</Card>
<Surface padding="compact">...</Surface>
```

- Most content needs no box at all. A ledger row or an article sits on the paper between rules. Reach for a frame only when the content is a separate object (a form slip, a profile sheet, a plate).
- Interactive frames show hover with the rule turning ink (`hover:border-ink`) or the row taking `bg-tint`. Never with a shadow or a lift.
- Do not restate `border border-border bg-card` on `Card`; it is the default.
- Page heads and the colophon sit on a single 1px ink rule (`border-t border-ink`), not a frame. Never stack rules: whatever sits right under a head (a ledger, a stat strip, a tab row, board columns) drops its own top rule. Row separators inside a ledger stay.

## Inset

```tsx
<Surface variant="inset" className="px-4 py-3">...</Surface>
```

- Tint is a ground, not a colour. Text on tint is `ink` or `ink-soft` only.
- Code is an inset specimen: server `<pre>`, `bg-tint`, system mono 13.5px, `tabIndex={0}`, no syntax colours.

## Lift

- Lift is applied once, inside the shared floating primitives in `src/components/ui/` and in Sonner's `toastOptions.classNames` in `src/components/layout/toaster.tsx`. Feature code should not add it by hand.
- The scrim behind a modal is ink at low opacity. No backdrop blur, ever.
- Lift is the only shadow in the system. The soft shadow scale (small through 2xl), glows and coloured shadows are banned.

## Reverse

- One reversed block on the site: the `/auth` panel in `layout/auth-shell.tsx`, `bg-ink text-paper`, square, no border or shadow, hidden below `md`. It is a cut printed in reverse, not a fourth surface: no other page uses it.
- Because both tokens flip with the theme, it prints paper type on cobalt in Paper and night type on cream in Night.
- Rules inside it are `border-paper/30`; secondary lines are `text-paper/80`. No links or controls inside it.

## Forbidden

| Avoid | Use instead |
|---|---|
| Translucent white fills and borders, backdrop blur, glass cards | Frame |
| Soft shadows, shadows on hover, `hover:-translate-y-1` lifts | Frame with `hover:border-ink` or `bg-tint` row |
| Gradient fills, glows, coloured borders | Rules in ink or rule |
| `rounded-*` on anything | Radius 0 (radio dot excepted) |
| Window chrome, traffic lights, terminal title bars on content | A plain frame or no box at all |
| Filled cards on a filled card | One surface per level |

## Padding

| Context | Padding |
|---|---|
| Card header and content | `SURFACE_PADDING.default` |
| Compact rows, feedback, education | `padding="compact"` |
| Form slips, profile card | `padding="cozy"` |
