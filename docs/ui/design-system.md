# Design system: tokens, type, shape, motion

## Tokens

Tokens are HSL triples (no `hsl()` wrapper) in `src/app/globals.css`: `:root` is light and `<html class="dark">` is dark. `tailwind.config.ts` exposes them as `hsl(var(--x) / <alpha-value>)` under the shadcn names, so every primitive follows the theme with no `dark:` class. The values are Notion's neutrals.

| Token | Class | Light | Dark | Role |
|---|---|---|---|---|
| `--background` | `bg-background` | #FFFFFF | #191919 | The page, cards, fields |
| `--foreground` | `text-foreground` | #37352F | #D4D4D4 | Page text, titles, icons, the ink button, the focus ring |
| `--muted-foreground` | `text-muted-foreground` | #6E6D69 | #9B9B9B | Secondary text: sidebar rows, descriptions, properties, meta |
| `--border` | `border-border` | #E9E9E7 | #2F2F2F | Hairlines: table cells, card edges, floating layers, dividers |
| `--muted` | `bg-muted` | #F7F7F5 | #202020 | The sidebar and the menu sheet, image grounds, code blocks, table head cells in prose |
| `--input` | `border-input` | #8F8E8A | #6E6E6E | Borders of fields that must be seen (3:1, WCAG 1.4.11) |
| `--popover` | `bg-popover` | #FFFFFF | #252525 | Floating layers |
| `--destructive` | `text-destructive` | #C4321F | #F27166 | Destructive actions and errors, always with a word |
| `--sky` | `text-sky` | #2D5B8C | #8DB6E6 | Accent: the home cover sky only |
| `--sky-wash` | `bg-sky-wash` | #D9E6F4 | #203247 | Accent: the text selection fill only |

Notion's translucent fills, built from the text colour in `tailwind.config.ts` so they work on the page, the sidebar and menus alike:

| Class | Value | Use |
|---|---|---|
| `bg-tint` | foreground at 6% | Hover on rows, buttons, sidebar items, menu items; callouts; the segmented theme track; skeletons |
| `bg-tint-strong` | foreground at 10% | Tags (`Badge`, `Chip`), the secondary button's hover, selected states |

Derived tokens, so shadcn parts keep working:

| Token | Maps to |
|---|---|
| `--card`, `--primary-foreground`, `--destructive-foreground` | background |
| `--primary`, `--ring`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--accent-foreground` | foreground |
| `--secondary`, `--accent` | muted |
| `--radius` | `.625rem` (10px) |

Other variables:

| Variable | Value | Use |
|---|---|---|
| `--dur-press` | 120ms | Button press and hover |
| `--dur-ui` | 200ms | Hover, underline, menus, tabs, the toggle triangle |
| `--dur-sheet` | 280ms | Sheets, dialogs, the theme crossfade |
| `--ease-out` | `cubic-bezier(.25,.1,.25,1)` | Every transition; Tailwind class `ease-out` |
| `--scrim` | `0 0% 6% / .5` | The fixed backdrop behind dialogs and sheets, both themes |
| `--head-h` | 2.75rem (44px) | The top bar height, and the anchor offset |

**Hex copies.** CSS variables cannot reach meta theme-color, the manifest, `global-error.tsx` or the OG and certificate cards, so `src/lib/theme-hex.ts` exports `THEME_HEX.light` and `THEME_HEX.dark` (background, foreground, mutedForeground, border, muted, sky). It is the only file in `src/` outside the CSS allowed raw hex. Change a token and its copy in the same commit; the contrast test checks they agree within one step per channel.

### Colour use

After a Notion page:

- **Page text is ink.** Body copy, `.prose`, row titles, table cells that name things and every link label are `text-foreground`. Links go through `InkLink`: ink with a grey underline (`decoration-foreground/40`) that turns full ink on hover, so colour is never the only cue (WCAG 1.4.1).
- **Grey is for secondary text:** sidebar rows until hovered or current, page descriptions, property names, row meta, table head cells, captions.
- **Hover and selection are tints**, never colour: `hover:bg-tint` on anything clickable that is a row or a quiet button, `bg-tint-strong` on tags and selected items.
- **Blue belongs to the cover.** `sky` and `sky-wash` appear only in the home page's Langit Malang cover and the `::selection` fill. Never for links, buttons, focus rings, charts, icons, tags or hover. The admin uses neither.
- **The grass greens and the mountain haze** in the cover are an illustration-only exception to the colour cap: they live only in the `.sky` block of `globals.css` and are never UI colour.

### Colour rules

- Colours only through the token classes and `tint`. No hex, no `white` or `black`, no Tailwind palette colours (`gray-500`, `blue-600`, `zinc-*`), no `dark:` classes.
- Text never takes an opacity modifier (`text-foreground/70`). Use `text-muted-foreground`. Opacity on fills and decoration (`bg-foreground/85` for the ink button's hover, `decoration-foreground/40`) is fine.
- `border-border` is a hairline for decoration and structure. Fields that must be seen (inputs, textareas, select triggers, radios) use `border-input`.
- State is an icon plus a word (`StatusLine`, the `Badge` status square), never colour alone. `destructive` keeps its word and its cross.

### Contrast

| Pair | Light | Dark |
|---|---|---|
| foreground on background | 12.3 | 11.9 |
| foreground on muted (the sidebar) | 11.4 | 11.0 |
| muted-foreground on background | 5.2 | 6.3 |
| muted-foreground on muted | 4.8 | 5.9 |
| input on background | 3.3 | 3.4 |
| destructive on background | 5.5 | 6.1 |
| sky on background | 7.0 | 8.4 |
| foreground on sky-wash | 9.7 | 8.8 |

**Guard test.** `src/__tests__/unit/lib/contrast.test.ts` parses the triples from `globals.css` and fails below the floors in both themes: foreground 7:1 on background, muted and popover; muted-foreground 4.5:1 on background, muted and popover; input 3:1; destructive 4.5:1; sky 4.5:1; foreground on sky-wash 7:1. It checks `THEME_HEX` against the tokens and that the print block pins the light triples. There are no footer-sky checks any more: no text sits on the sky. If a pair falls short, nudge the token, never the floor.

## Type: Onest

One sans, **Onest** (variable, OFL), everywhere on the site and in the admin. It loads once with `next/font/google` in `src/app/layout.tsx` as `--font-sans`, and `font-sans` reads it. There is no second face, no serif, no handwritten face and no `font-display` alias. Code uses the system mono stack (`font-mono`), and only for code.

### Scale

The `fontSize` keys in `tailwind.config.ts`, on Notion's scale: 14px for UI (sidebar, tables, properties, controls), 16px for page text, 40px bold page titles. Weight and tracking live on the keys, so a heading needs only its size class.

| Key | Size / line height | Weight | Use |
|---|---|---|---|
| `caption` | 12 / 16 | 400 | The closing line, captions, group labels in the sidebar, tooltips |
| `small` | 14 / 20 | 400 | UI: sidebar rows, breadcrumb, buttons, tabs, tables, properties, row meta, tags |
| `body` | 16 / 24 | 400 | Page text, row titles, callouts |
| `prose` | 16 / 26 | 400 | Article text (`.prose`) |
| `lead` | 16 / 24 | 400 | Kept for older call sites |
| `h4` | 16 / 24 | 600 | Small headings, chat headings |
| `h3` | 20 / 28 | 600 | Sheet and dialog titles |
| `h2` | 24 / 32, -0.01em | 600 | Section headings on a page ("Projects", "Writing"), the auth title |
| `h1` | 30 / 38, -0.015em | 600 | A heading 1 block |
| `title` | 32 / 40, -0.02em | 700 | Page titles on phones |
| `display` | 40 / 48, -0.02em | 700 | Page titles from `sm` (`text-title sm:text-display`) |
| `numeral` | 32 / 40, -0.015em | 600 | Figures on `/stats` and the admin, with `tabular-nums` |

`xs` stays for older call sites; new code uses the keys above.

### Type rules

- Weights 400 to 700: 400 for text, `font-medium` (500) for UI emphasis (current sidebar row, row titles, buttons, tabs), 600 for headings, 700 only for page titles. The keys carry the heading weights; do not add `font-bold` to anything else.
- Never `text-[Npx]`; use a key. Never `tracking-[…]`.
- No `uppercase`, no small caps, no all-caps labels or eyebrows.
- Fields use 16px on phones (`text-base`) and 14px from `sm` so iOS does not zoom.
- `tabular-nums` in rows, tables, properties and figures.
- Headings are literal and in sentence case ("Projects", not "Things I've built").

## Spacing and width

- 4px base. Sections sit 48px apart (`SECTION_SPACING.section`, `mt-12`), their content 12px under the heading (`sectionGap`, `mt-3`).
- **Page column.** `PROSE_WIDTH` is Notion's 708px column (`44.25rem` of content), centred in the space right of the sidebar, with 24px gutters on phones and 48px from `sm`. Every line in it is left-aligned.
- **Full width.** `WIDE_WIDTH` is Notion's full-width page (up to 90rem, gutters 24, 48 and 96px), for `/tools` and `/chat`.
- `BREAKOUT` is empty: images stay as wide as the column so their edges line up with the text. All three live in `src/lib/design-system.ts`.
- Pages without a cover start 48px under the top bar (80px from `sm`) and leave 96px before the closing line.

## Shape

Notion's radii. `--radius` is 10px.

| Radius | Class | Value | Use |
|---|---|---|---|
| Dots | `rounded-full` | | Switch, radio, avatar on the home page, status dots |
| Tags | `rounded` | 4px | `Badge`, `Chip`, the theme segments, inline code, the owner's 20px portrait in the sidebar |
| Controls | `rounded-md` | 6px | Buttons, fields, select triggers, sidebar and menu rows, list rows, toggles, callouts, the hover tip |
| Cards and layers | `rounded-lg` | 10px | `MediaCard`, `Card`, `Surface`, `PlateFigure` images, dialogs, menus, select content, toasts |

`rounded-sm` (2px) exists but has no use. `rounded-xl` and `rounded-2xl` are not part of the scale; do not use them. Never `rounded-[…]`.

## Shadow, blur and gradients

- **No shadows anywhere.** `boxShadow` is gone from `tailwind.config.ts`. Floating layers (dialog, alert dialog, sheet, popover, dropdown menu, select content, terminal overlay) are set apart by a hairline `border-border`; the toast and the hover tip are inverted slabs (`bg-foreground text-background`) with no border. The shared primitives apply this; feature code does not. The UI gate (R8) fails on any `shadow-*` class except `shadow-none`, and on `box-shadow` outside `globals.css`.
- **No blur.** The top bar is opaque `bg-background`; nothing is translucent. Scrims are a fixed `--scrim` fill, never blurred. The cover's clouds are pre-softened radial shapes, never `filter: blur`.
- **Gradients** only in `globals.css` and the cover (`sky.tsx`). No gradient text, buttons, borders or backgrounds anywhere else.

## Langit Malang: the home cover

The painted Malang sky survives as Notion's page cover on the home page, and only there. It says where the owner works from and that the page is alive at this hour.

- **Where.** `SkyCover` (`src/components/ui/sky.tsx`) is passed to `BaseLayout` as `cover` by `src/app/page.tsx`. It runs edge to edge above the page column, 30% of the viewport tall (at least 11rem, at most 20rem). No other page has a cover sky; there is no footer sky and no auth band.
- **What.** `Sky variant="cover"`: CSS and inline SVG only, no image file, `aria-hidden`. Back to front: a sky gradient (deeper blue overhead, from `.sky--cover`), the sun or the moon up on the right, two or three soft clouds, Arjuno's ridge and Semeru's cone in haze, rolling grass hills with blades that sway, and a fine grain. The cover variant has no name between the hills. The `band` variant (with the name) still exists in `sky.tsx` but no page mounts it.
- **Colour by the hour.** The sky colour (`--sky-top`) follows the time of day in Malang (Asia/Jakarta, WIB), wherever the visitor is:

| Phase (WIB) | Light `--sky-top` |
|---|---|
| Dawn, 5 to 8 | `210 57.7% 89%` |
| Day, 8 to 15 | `211 68.4% 90.4%` |
| Dusk, 15 to 18 | `220 37.5% 90.6%` |
| Evening, 18 to 5 | `219 44.4% 89.4%` |

- **Dark mode** is always the night sky (`215 46.3% 16.1%`) with the moon and a few static stars.
- **Phase.** `skyPhase(date)` in `src/lib/malang-time.ts` is a pure function with a unit test for all four boundaries and the WIB offset. The server renders the day stop; a client effect sets `data-sky="dawn|day|dusk|evening"` on mount and refreshes it every five minutes.
- **Motion.** The clouds drift and the grass sways as soon as the page loads. Phones (below 640px) and `prefers-reduced-motion: reduce` get a still scene.
- **Pause control.** The scene moves for more than five seconds, so `SkyToggle` ("Pause the sky" or "Play the sky") sits inside the cover for keyboard and screen-reader users (WCAG 2.2.2). It is `sr-only` and shows in the cover's top left only on keyboard focus. The choice is saved in localStorage and sets `data-sky-paused` on `<html>`. Below 640px and under reduced motion it is `display: none`, since nothing moves there.
- **The page under it.** The home's round portrait overlaps the cover's lower edge like a Notion page icon, then the title and properties follow.
- **CSS.** One `.sky` block in `globals.css` holds every scene colour. They live nowhere else.

## Motion: quiet and functional

All of it is CSS or platform native. No motion library.

| Motion | How | Timing |
|---|---|---|
| Hover tint | `bg-tint` fades in on rows, buttons, sidebar items | `--dur-ui` (buttons `--dur-press`) |
| Link underline | The grey underline turns full ink | `--dur-ui` |
| Toggle | The triangle (`ChevronRight`) turns 90 degrees; accordion content opens by height | `--dur-ui` |
| View tabs | The 2px ink bar moves to the open tab with the colour | `--dur-ui` |
| Theme crossfade | `switchTheme()` wraps the change in a view transition | `--dur-sheet` |
| Floating layers | Radix fade with a 4px slide; sheets slide | 150 to 280ms |
| Skeleton | A soft pulse on `bg-tint`, only under `motion-safe` | Tailwind `animate-pulse` |
| The home cover | Clouds drift; grass blades sway | slow loops; grass 6s alternate |

There is no route crossfade and no project morph in the current code. Use `--dur-*` and `ease-out` for anything else that responds to input (press, hover, focus, open and close).

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- The global kill switch in `globals.css` drops durations to near zero.
- Every `::view-transition-*` pseudo-element gets `animation: none`, and `switchTheme()` skips the view transition.
- The cover is a still scene (no drifting clouds, no swaying grass); skeletons do not pulse; smooth scrolling is off.
- The check: with `reducedMotion: 'reduce'`, `document.getAnimations().length` is 0.

### Banned motion

Scroll reveal or fade-up on sections, parallax, scroll-jacking or anything tied to scroll position, marquees, typing effects, custom cursors, attention loops (`animate-ping`, `animate-bounce`), hover lifts (`hover:-translate-y-*`), hover scaling, autoplaying media (YouTube is a click-to-load facade), framer-motion, `motion`, GSAP, Lenis or any other animation library.

## Themes

- next-themes with `attribute="class"`, `defaultTheme="system"` and `enableSystem`. `ThemeProvider` receives the CSP nonce so its script runs before paint and dark-OS visitors never see a light frame.
- Light and dark are equal: Notion's white page with a #F7F7F5 sidebar, and Notion's #191919 page with a #202020 sidebar.
- Two controls: the top bar's `ThemeToggle` (labelled "Dark theme", `aria-pressed`, flips light and dark) and the sidebar's segmented Light, Dark and System radio group.
- `switchTheme()` in `src/components/layout/theme-toggle.tsx` is the one path for theme changes. Do not call `setTheme` directly from new code.
- `color-scheme` follows the theme. The viewport `themeColor` is an array with one entry per `prefers-color-scheme`, read from `THEME_HEX`, as is the manifest.

## Shared class tokens

```ts
import { SURFACE, SURFACE_PADDING, SECTION_SPACING, PROSE_WIDTH, WIDE_WIDTH } from "@/lib/design-system"
```

| Export | Use |
|---|---|
| `SURFACE` | `solid` (frame: hairline, 10px, card ground), `inset` (tile: `bg-muted`, 10px), `solidHover`. `glass` and `glassNoBlur` are retired aliases of `solid`; do not use them. |
| `SURFACE_PADDING` | `default`, `compact`, `cozy` inner padding |
| `SECTION_SPACING` | `section` (48px between sections), `sectionGap` (12px under a heading) |
| `PROSE_WIDTH`, `WIDE_WIDTH`, `BREAKOUT` | The 708px page column, the full-width page, and the (empty) media breakout. `SHELL_WIDTH` is a deprecated alias of `PROSE_WIDTH` |
