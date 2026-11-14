# Design system: tokens, type, shape, motion

## Tokens

Tokens are HSL triples (no `hsl()` wrapper) in `src/app/globals.css`: `:root` is light and `<html class="dark">` is dark. `tailwind.config.ts` exposes them as `hsl(var(--x) / <alpha-value>)` under the shadcn names, so every primitive follows the theme with no `dark:` class.

| Token | Class | Light | Dark | Role |
|---|---|---|---|---|
| `--background` | `bg-background` | #F8F8F6 | #1A1A19 | The page |
| `--foreground` | `text-foreground` | #1F201D | #ECECE8 | Text, icons, primary button, focus ring |
| `--muted-foreground` | `text-muted-foreground` | #62635E | #A3A49E | Secondary text, meta, nav |
| `--border` | `border-border` | #E2E2DE | #30312D | Hairlines, decoration only |
| `--muted` | `bg-muted` | #EFEFEB | #242522 | Tiles, hover rows, code, segmented tracks, admin sidebar |
| `--input` | `border-input` | #85867F | #71726C | Borders of controls that must be seen (3:1, WCAG 1.4.11) |
| `--popover` | `bg-popover` | #FFFFFF | #232322 | Floating layers |
| `--destructive` | `text-destructive` | #B42318 | #F97066 | Destructive actions and errors in the admin, always with a word |
| `--sky` | `text-sky` | #2D5B8C | #8DB6E6 | Accent, the sky band only |
| `--sky-wash` | `bg-sky-wash` | #D9E6F4 | #203247 | Accent, the `Marker` fill only |

Derived tokens, so shadcn parts keep working:

| Token | Maps to |
|---|---|
| `--card`, `--primary-foreground`, `--destructive-foreground` | background |
| `--primary`, `--ring`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--accent-foreground` | foreground |
| `--secondary`, `--accent` | muted |
| `--radius` | `.75rem` |

Other variables:

| Variable | Value | Use |
|---|---|---|
| `--dur-press` | 120ms | Button press |
| `--dur-ui` | 200ms | Hover, underline, menus, tabs |
| `--dur-sheet` | 280ms | Sheets and dialogs |
| `--ease-out` | `cubic-bezier(.25,.1,.25,1)` | Every transition; Tailwind class `ease-out` |
| `--scrim` | `60 2% 6% / .45` | The fixed backdrop behind dialogs and sheets, both themes |
| `--head-h` | 3rem | Header height, for sticky offsets |

**Hex copies.** CSS variables cannot reach meta theme-color, the manifest, `global-error.tsx` or the OG and certificate cards, so `src/lib/theme-hex.ts` exports `THEME_HEX.light` and `THEME_HEX.dark`. It is the only file outside `globals.css` and the card routes allowed raw hex. Change a token and its copy in the same commit; the contrast test checks they agree within one step per channel.

### The accent

Blue belongs to the sky. `sky` and `sky-wash` appear in exactly two places:

1. The sky band (`Sky`, see below).
2. The `Marker` highlight (`bg-sky-wash`), at most one landing phrase per page.

Never for links, buttons, focus rings, charts, icons or hover states. The admin uses neither.

### Colour rules

- Colours only through the token classes. No hex, no `white` or `black`, no Tailwind palette colours (`gray-500`, `blue-600`, `zinc-*`), no `dark:` classes.
- Text never takes an opacity modifier (`text-foreground/70`). Use `text-muted-foreground`.
- `border-border` is decoration. Controls that must be seen (inputs, checkboxes, outline buttons) use `border-input`.
- State is an icon plus a word (`StatusLine`), never colour alone. `destructive` exists for the admin's delete and error states and still carries a word.

### Contrast

| Pair | Light | Dark |
|---|---|---|
| foreground on background | 15.4 | 14.7 |
| muted-foreground on background | 5.7 | 6.9 |
| sky on background | 6.6 | 8.3 |
| foreground on sky-wash | 12.9 | 11.0 |
| input on background | 3 or more | 3 or more |

**Guard test.** `src/__tests__/unit/lib/contrast.test.ts` parses the triples from `globals.css` and fails below the floors in both themes: foreground 7:1 and muted-foreground 4.5:1 on the background, on `muted` and over every sky stop; input 3:1; text on sky-wash 4.5:1. It also checks `THEME_HEX` against the tokens. If a pair falls short, nudge the token, never the floor.

## Type: Onest

One family, **Onest** (variable, OFL), everywhere: site, admin, OG and certificate cards. It loads once with `next/font/google` in `src/app/layout.tsx` (latin and latin-ext, `--font-sans`, preloaded). `font-sans` reads it. There is no second face and no `font-display` alias. Code uses the system mono stack (`font-mono`), and only for code.

Why Onest: a clean neo-grotesk close in spirit to Apple's SF, with a tall x-height that stays readable at 15px, and rarer than Inter. Why one family: the owner asked for the same font throughout, and hierarchy comes from size, weight and tracking instead of a second face.

### Scale

The `fontSize` keys in `tailwind.config.ts`. Weight and tracking live on the keys, so a heading needs only its size class.

| Key | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| `caption` (`xs`) | 12 / 16 | 400 | | Footer year, captions, small meta |
| `small` | 13 / 20 | 400 | | Nav, labels, row meta, table heads |
| `body` | 15 / 24 | 400 | | UI text, rows, the admin |
| `prose` | 17 / 28 | 400 | | Articles and the home bio |
| `lead` | 19 / 28 | 400, muted | | One line under a page title |
| `h4` | 15 / 24 | 500 | | Row titles, small headings |
| `h3` | 19 / 26 | 600 | -0.01em | Sub-sections |
| `h2` | 24 / 30 | 600 | -0.015em | Section titles, admin page titles |
| `h1` | 40 / 44, 32 on phones | 600 | -0.02em | Page titles |
| `display` | 56 / 60, 40 on phones | 600 | -0.025em | The home name only |
| `numeral` | 32 / 36 | 600 | tabular figures | Figures on `/stats` and the admin |

### Type rules

- Weights 400, 500 and 600 only (`font-normal`, `font-medium`, `font-semibold`). No bold, no light.
- `font-synthesis: none`. Onest has no italic, so never rely on italics for meaning; use weight or muted colour.
- Never `text-[Npx]`; use a key. Never `tracking-[…]`; the tight tracking is on the keys.
- No `uppercase`, no small caps, no all-caps labels or eyebrows.
- Inputs use 16px on phones so iOS does not zoom.
- `tabular-nums` in rows, tables and figures.
- Headings are literal and in sentence case ("Projects", not "Things I've built").

## Spacing and width

- 4px base. Sections sit 56px apart (`SECTION_SPACING.section`).
- The public site is a centred column: `PROSE_WIDTH` is 640px with 20px gutters on phones and 24px above. `WIDE_WIDTH` is 960px, for `/tools` and `/chat`. `BREAKOUT` (`lg:-mx-16`) lets media grow to 768px on large screens. All three live in `src/lib/design-system.ts`.
- The admin is full width. See [platforms.md](./platforms.md).

## Shape

Radius grows with surface size, so it also carries hierarchy.

| Radius | Class | Value | Use |
|---|---|---|---|
| Dots | `rounded-full` | | Switch, radio, avatar, status dots |
| Chips | `rounded-md` | .5rem | Badges, chips, skeleton lines |
| Fields and buttons | `rounded-lg` | .75rem (`--radius`) | Input, textarea, select trigger, button, segmented tabs, hover rows |
| Floating layers | `rounded-xl` | .75rem | Dialog, sheet edge, menu, popover, select content, hover tip, toast |
| Tiles | `rounded-2xl` | 1rem | Media tiles, cards, code blocks |

Never `rounded-[…]`.

## Shadow, blur and gradients

- **`shadow-float`** (two soft layers in foreground at 6% and 18%) on floating layers only: dialog, alert dialog, sheet, popover, dropdown menu, select content, hover tip, toasts, the terminal overlay. The shared primitives apply it; feature code does not.
- Nothing on the page casts a shadow: no `shadow-sm` to `shadow-2xl`, no hover shadows, no glows, no coloured shadows.
- **One blur.** The translucent sticky header in `running-head.tsx` (a translucent `background` fill with `backdrop-blur-md`, a hairline after scrolling) is the only blurred element on the site. Scrims are a fixed `--scrim` fill, never blurred.
- **Gradients** only in `globals.css` and the sky (`sky.tsx`). No gradient text, buttons, borders or backgrounds anywhere else.

## Langit Malang: the sky

The sky gives the site its identity: it says where the owner works from and that the page is alive at this hour. It is the one bold element.

- **Where.** `Sky` (`src/components/ui/sky.tsx`, a client island) is mounted by `BaseLayout`. Home gets the full band, about 50vh, with clouds. Other visitor pages get a shorter static band with no clouds. The admin has no sky.
- **What.** A top band, `aria-hidden` and `pointer-events-none`, behind the content: a vertical gradient that fades into the page background. Its top colour follows the time of day in Malang (Asia/Jakarta, WIB), wherever the visitor is.

| Phase (WIB) | Light top colour |
|---|---|
| Dawn, 5 to 8 | #D4E3F2 |
| Day, 8 to 15 | #D6E7F7 |
| Dusk, 15 to 18 | #DAE1EE |
| Evening, 18 to 5 | #D8E0EF |

- **Dark mode** is always the night sky: top #16263C with a few static stars that do not twinkle.
- **Phase.** `skyPhase(date)` in `src/lib/malang-time.ts` is a pure function with a unit test for all four boundaries and the WIB offset. The server renders the neutral day stop; a client effect sets `data-sky="dawn|day|dusk|evening"` on mount and the stop crossfades over 600ms, so there is no flash.
- **Clouds.** Two or three soft shapes drift horizontally near the top on a slow loop (about 90s): white at .7 in light, #2A3B55 at .5 in dark. They are pre-blurred SVG or radial gradients, never `filter: blur`, so phones paint them cheaply. Hidden below `sm`; phones get the static band.
- **Pause control.** The clouds move for more than five seconds, so there is an icon button beside the theme toggle, labelled "Pause the sky" or "Play the sky", with `aria-pressed`. The choice is saved in localStorage, and the animation also stops while the tab is hidden.
- **Contrast.** Text over the band keeps the floors above; the contrast test checks every stop in both themes.
- **CSS.** One `.sky` block in `globals.css` holds the stop colours. They live nowhere else.

## Motion: smooth, never busy

All of it is CSS or platform native. No motion library.

| Motion | How | Timing |
|---|---|---|
| Route crossfade | React `ViewTransition` around the `BaseLayout` content; opacity only; the header and footer do not animate | old page out 140ms, new page in 200ms |
| Project morph | The `MediaCard` image and the project hero share `viewTransitionName: project-<id>` | 320ms |
| Theme crossfade | `switchTheme()` wraps the change in a view transition | `--dur-sheet` |
| Link underline | Dotted muted underline becomes solid foreground | 150ms |
| Card hover | The media image scales to 1.015, only under `(hover: hover)` and `motion-safe` | 400ms |
| Floating layers | Radix fade, sheets also slide | 150 to 280ms |
| The sky | Clouds drift; the phase stop crossfades on mount | about 90s loop; 600ms |

Use `--dur-*` and `ease-out` for anything else that responds to input (press, hover, focus, open and close).

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- The global kill switch in `globals.css` drops durations to near zero.
- Every `::view-transition-*` pseudo-element gets `animation: none`, and `switchTheme()` skips the view transition.
- The sky is a static frame; card images do not scale; smooth scrolling is off.
- The check: with `reducedMotion: 'reduce'`, `document.getAnimations().length` is 0 and the sky does not move.

### Banned motion

Scroll reveal or fade-up on sections, parallax, scroll-jacking or anything tied to scroll position, marquees, typing effects, custom cursors, pulsing or bouncing (`animate-ping`, `animate-bounce`, pulse skeletons), hover lifts (`hover:-translate-y-*`), autoplaying media (YouTube is a click-to-load facade), framer-motion, `motion`, GSAP, Lenis or any other animation library.

## Themes

- next-themes with `attribute="class"`, `defaultTheme="system"` and `enableSystem`. `ThemeProvider` receives the CSP nonce so its script runs before paint and dark-OS visitors never see a light frame.
- Light and dark are equal. Dark is a calm warm-neutral (#1A1A19) with the night sky, not an inversion.
- Labels are Light, Dark and System. The header toggle is labelled "Dark theme" with `aria-pressed`.
- `switchTheme()` in `src/components/layout/theme-toggle.tsx` is the one path for theme changes. Do not call `setTheme` directly from new code.
- `color-scheme` follows the theme. The viewport `themeColor` is an array with one entry per `prefers-color-scheme`, read from `THEME_HEX`, as is the manifest.

## Shared class tokens

```ts
import { SURFACE, SURFACE_PADDING, SECTION_SPACING } from "@/lib/design-system"
```

| Export | Use |
|---|---|
| `SURFACE` | `solid` (frame) and `inset` (tile) classes, see [surfaces.md](./surfaces.md). `glass` and `glassNoBlur` are retired aliases; do not use them. |
| `SURFACE_PADDING` | `default`, `compact`, `cozy` inner padding |
| `SECTION_SPACING` | `section` (56px between sections), `sectionGap` |
| `PROSE_WIDTH`, `WIDE_WIDTH`, `BREAKOUT` | The centred column, the wide column and the media breakout |
