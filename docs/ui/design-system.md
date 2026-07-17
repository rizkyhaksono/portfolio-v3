# Design System Tokens

## Visual language

- **Monochrome** — near-black on white (light) / near-white on near-black (dark). No accent hue.
- **Square** — every named Tailwind radius collapses to `0` in `tailwind.config.ts`. Keep `rounded-full` only for avatars, status dots, and icon bubbles.
- **Hairline borders** — use semantic `border` / `border-border` tokens, not heavy shadows or glow.

## CSS variables

Defined in `src/app/globals.css` (`:root` and `.dark`):

| Token | Role |
|---|---|
| `--background` / `--foreground` | Page canvas + body text |
| `--card` / `--card-foreground` | Solid content boxes |
| `--primary` / `--primary-foreground` | Primary actions / emphasis |
| `--secondary` / `--muted` / `--accent` | Soft fills and nests |
| `--border` / `--input` / `--ring` | Hairlines and focus |
| `--destructive` | Errors / danger only |
| `--radius` | `0rem` (square) |

Fonts (via layout / Tailwind):

- `--font-sans` — body
- `--font-display` — section titles
- `--font-serif` — italic accent words in headings
- `--font-mono` — chips, MacWindow titles, code

## Shared class tokens

Import from `@/lib/design-system`:

```ts
import { SURFACE, SURFACE_PADDING, SECTION_SPACING, PAGE_WIDTH } from "@/lib/design-system"
```

| Export | Keys | Use |
|---|---|---|
| `SURFACE` | `solid`, `solidHover`, `glass`, `glassNoBlur`, `inset` | Box chrome |
| `SURFACE_PADDING` | `default` (`p-6`), `compact` (`p-4`), `cozy` (`p-5`) | Inner pad |
| `SECTION_SPACING` | `section` (`mt-10`), `sectionGap` (`mt-6`) | Section rhythm |
| `PAGE_WIDTH` | `default`, `prose`, `article`, `wide` | Max-width presets |

## Forbidden patterns

| Avoid | Prefer |
|---|---|
| `neutral-*`, `text-black`, `dark:text-white` | `foreground`, `muted-foreground` |
| Hex hovers (`#262626`, `#D9D9D9`) | `accent`, `secondary`, `muted` |
| `border-white/10 bg-white/5 backdrop-blur-md` on content | solid `Card` / `Surface` |
| `hover:shadow-xl hover:-translate-y-1` on cards | `hover:border-foreground/20` |
| `max-w-8xl` (undefined) | `PAGE_WIDTH` via `PageBody` |
| Extra `px-4 lg:px-0` inside BaseLayout | Trust container padding |

## Container

Tailwind `container`: centered, `padding: 2rem`, `2xl: 1400px`.  
`BaseLayout` uses `container` **without** stacking another horizontal `px-*`.
