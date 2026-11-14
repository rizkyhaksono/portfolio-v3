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
| `--sky` | `text-sky` | #2D5B8C | #8DB6E6 | Accent, the footer sky only |
| `--sky-wash` | `bg-sky-wash` | #D9E6F4 | #203247 | Accent, the text selection fill only |

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

### Colour use

The tokens stay; what matters is how they are applied, after joshpuckett.me:

- **Prose and descriptions** are `text-muted-foreground`: the bio, a row's sentence, a page's intro, meta.
- **Names, titles and links** are `text-foreground`: a company or project named in the bio, a row title, a section label, every link label. Links go through `InkLink`, a faint underline (`decoration-foreground/25`) that strengthens to full foreground on hover, so colour is never the only cue.
- **Blue belongs to the sky.** `sky` and `sky-wash` appear only in the footer sky and the `::selection` fill. Never for links, buttons, focus rings, charts, icons or hover states. The admin uses neither.
- **The grass greens and the mountain haze** in the footer scene are an illustration-only exception to the two-to-three colour cap: they belong to the one illustration, live only in the `.sky` block of `globals.css`, and are never UI colour.

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

**Guard test.** `src/__tests__/unit/lib/contrast.test.ts` parses the triples from `globals.css` and fails below the floors in both themes: foreground 7:1 and muted-foreground 4.5:1 on the background, on `muted`, and over the `--sky-top` of every footer sky stop (`.sky[data-sky=dawn|day|dusk|evening]` against the light tokens, `.dark .sky` against the dark ones), since the footer text sits in the upper sky; input 3:1; text on sky-wash 4.5:1. It also checks `THEME_HEX` against the tokens. If a pair falls short, nudge the token, never the floor.

## Type: Onest

One sans, **Onest** (variable, OFL), everywhere on the site and in the admin. It loads once with `next/font/google` in `src/app/layout.tsx` as `--font-sans`, and `font-sans` reads it. There is no second face, no serif, no handwritten face and no `font-display` alias. Code uses the system mono stack (`font-mono`), and only for code.

Why Onest: the owner asked for the clean, Apple-like sans back. Onest is close in spirit to SF, with open shapes, free, and reads well at 15px. Why one face: hierarchy comes from colour and size, not from a second family or heavy weights.

### Scale

The `fontSize` keys in `tailwind.config.ts`. Weight lives on the keys, so a heading needs only its size class.

| Key | Size / line height | Weight | Use |
|---|---|---|---|
| `caption` | 12 / 18 | 400 | Footer year, captions, small meta |
| `small` | 13 / 20 | 400 | Nav, group labels, row meta, table heads |
| `body` | 15 / 24 | 400 | Rows, UI text, the admin |
| `prose` | 16 / 28 | 400 | Article prose (`.prose`) |
| `lead` | 16 / 26 | 400 | A lead line or a quote |
| `h2`, `h3`, `h4` | 15 / 24 | 500, foreground | Section labels ("Projects", "Writing", "Work experience") |
| `h1`, `display` | 24 / 32, -0.015em | 500 | Page titles and the handle |
| `numeral` | 28 / 32, -0.015em | 500, tabular figures | Figures on `/stats` and the admin |

`xs` stays for older call sites; new code uses the keys above.

### Type rules

- Weights 400 and 500 only: 400 for text, 500 for headings, titles and figures (the keys carry it) or `font-medium` for rare emphasis. Never `font-semibold` or `font-bold` on headings.
- Never `text-[Npx]`; use a key. Never `tracking-[…]`.
- No `uppercase`, no small caps, no all-caps labels or eyebrows.
- Inputs use 16px on phones so iOS does not zoom.
- `tabular-nums` in rows, tables and figures.
- Headings are literal and in sentence case ("Projects", not "Things I've built").

## Spacing and width

- 4px base. Sections sit 56px apart (`SECTION_SPACING.section`).
- The public site is one column: `PROSE_WIDTH` is 36rem, centred on the page, with 20px gutters on phones and 24px above; every line inside it is left-aligned. `WIDE_WIDTH` is 60rem, for `/tools` and `/chat`. `BREAKOUT` is empty: images stay exactly as wide as the column so their edges line up with the text. All three live in `src/lib/design-system.ts`.
- The admin is full width. See [platforms.md](./platforms.md).

## Shape

Radii appear only on real objects: tiles and images, and controls. Plain text never sits in a tile, sections are never boxed, and there are no dividers except the short rule under the handle and the hairline inside the footer.

| Radius | Class | Value | Use |
|---|---|---|---|
| Dots | `rounded-full` | | Switch, radio, avatar, status dots |
| Chips | `rounded-md` | .5rem | Badges, chips, skeleton lines |
| Fields and buttons | `rounded-lg` | .75rem (`--radius`) | Input, textarea, select trigger, button, segmented tabs |
| Floating layers | `rounded-xl` | .75rem | Dialog, sheet edge, menu, popover, select content, hover tip, toast |
| Tiles | `rounded-2xl` | 1rem | Screenshots and images, code blocks |

Never `rounded-[…]`.

## Shadow, blur and gradients

- **No shadows anywhere.** `boxShadow` is gone from `tailwind.config.ts`, so there is no float shadow and no `shadow-sm` to `shadow-2xl`. Floating layers (dialog, alert dialog, sheet, popover, dropdown menu, select content, hover tip, toasts, the terminal overlay) are set apart from the page by a hairline `border-border` only. The shared primitives apply it; feature code does not.
- No hover shadows, no glows, no coloured shadows. The UI gate (R8) fails on any `shadow-*` class except `shadow-none`, and on `box-shadow` outside `globals.css`.
- **No blur.** The header is plain text on the page and scrolls away with it; nothing is translucent. Scrims are a fixed `--scrim` fill, never blurred. The footer clouds are pre-softened radial shapes, never `filter: blur`.
- **Gradients** only in `globals.css` and the footer sky (`sky.tsx`). No gradient text, buttons, borders or backgrounds anywhere else.

## Langit Malang: the footer sky

The sky gives the site its identity: it says where the owner works from and that the page is alive at this hour. It is the one bold element, and it sits where the page ends, as in the soft painted backgrounds the owner picked.

- **Where.** `Sky` (`src/components/ui/sky.tsx`, a client island) is mounted by the full `Footer` of every visitor page, behind the footer text, about 34rem tall on phones and 42rem from `sm`. There is no sky at the top of any page. The `/auth` pages end on the same landscape as a band at the bottom, with no footer text. The compact footer on `/chat` and the admin have none.
- **What.** CSS and inline SVG only, no image file, `aria-hidden` and `pointer-events-none`. Back to front: a vertical gradient from the page background into the sky colour, the sun or the moon, two or three soft clouds, Arjuno's ridge and Semeru's cone in haze, the name set large between the hills, rolling grass hills with blades that sway in the wind, and a fine grain.
- **Colour by the hour.** The sky colour (`--sky-top`) follows the time of day in Malang (Asia/Jakarta, WIB), wherever the visitor is:

| Phase (WIB) | Light `--sky-top` |
|---|---|
| Dawn, 5 to 8 | `210 57.7% 89%` |
| Day, 8 to 15 | `211 68.4% 90.4%` |
| Dusk, 15 to 18 | `220 37.5% 90.6%` |
| Evening, 18 to 5 | `219 44.4% 89.4%` |

- **Dark mode** is always the night sky (`215 46.3% 16.1%`) with the moon and a few static stars that do not twinkle.
- **Grass greens and haze** are two or three muted greens per theme plus a mountain haze, an illustration-only exception to the colour cap. They live only in the `.sky` block of `globals.css`.
- **Phase.** `skyPhase(date)` in `src/lib/malang-time.ts` is a pure function with a unit test for all four boundaries and the WIB offset. The server renders the day stop; a client effect sets `data-sky="dawn|day|dusk|evening"` on mount, so there is no flash.
- **Footer text in the sky.** The handle, the email, one line of links and the year with the hour in Malang (`MalangClock`) sit in the upper sky. The contrast test checks foreground and muted-foreground against every stop.
- **Clouds.** Pre-softened radial shapes (never `filter: blur`) drift slowly, and the grass sways, as soon as the page loads. The clouds are hidden below 640px, so phones get the still scene; so does `prefers-reduced-motion: reduce`.
- **Pause control.** The clouds and grass move for more than five seconds, so `SkyToggle` ("Pause the sky" or "Play the sky") stays in the DOM for keyboard and screen-reader users (WCAG 2.2.2). There is no visible button: it is `sr-only` in the footer link line (and in the `/auth` band) and appears only on keyboard focus. The choice is saved in localStorage and sets `data-sky-paused` on `<html>`. Below 640px and under reduced motion it is `display: none`, since nothing moves there.
- **CSS.** One `.sky` block in `globals.css` holds every scene colour. They live nowhere else.

## Motion: smooth, never busy

All of it is CSS or platform native. No motion library.

| Motion | How | Timing |
|---|---|---|
| Route crossfade | React `ViewTransition` around the `BaseLayout` content; opacity only; the header and footer do not animate | old page out 140ms, new page in 200ms |
| Project morph | The `MediaCard` image and the project hero share `viewTransitionName: project-<id>` | 320ms |
| Theme crossfade | `switchTheme()` wraps the change in a view transition | `--dur-sheet` |
| Link underline | The faint underline strengthens to full foreground | `--dur-ui` |
| Card hover | The media image scales to 1.015, only under `(hover: hover)` and `motion-safe` | 400ms |
| Floating layers | Radix fade, sheets also slide | 150 to 280ms |
| The footer sky | Clouds drift; grass blades sway | slow loops; grass 6s alternate |

Use `--dur-*` and `ease-out` for anything else that responds to input (press, hover, focus, open and close).

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- The global kill switch in `globals.css` drops durations to near zero.
- Every `::view-transition-*` pseudo-element gets `animation: none`, and `switchTheme()` skips the view transition.
- The footer sky is a still scene (no drifting clouds, no swaying grass); card images do not scale; smooth scrolling is off.
- The check: with `reducedMotion: 'reduce'`, `document.getAnimations().length` is 0 and the sky does not move.

### Banned motion

Scroll reveal or fade-up on sections, parallax, scroll-jacking or anything tied to scroll position, marquees, typing effects, custom cursors, pulsing or bouncing (`animate-ping`, `animate-bounce`, pulse skeletons), hover lifts (`hover:-translate-y-*`), autoplaying media (YouTube is a click-to-load facade), framer-motion, `motion`, GSAP, Lenis or any other animation library.

## Themes

- next-themes with `attribute="class"`, `defaultTheme="system"` and `enableSystem`. `ThemeProvider` receives the CSP nonce so its script runs before paint and dark-OS visitors never see a light frame.
- Light and dark are equal. Dark is a calm warm-neutral (#1A1A19) with the night sky in the footer, not an inversion.
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
| `PROSE_WIDTH`, `WIDE_WIDTH`, `BREAKOUT` | The 36rem reading column, the 60rem wide column, and the (empty) media breakout |
