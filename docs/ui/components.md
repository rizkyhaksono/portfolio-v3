# Components

Restyle shared primitives in place; do not fork a second version. Prefer these over ad-hoc bordered `div`s.

## Catalog

| Primitive | Path | Role |
|---|---|---|
| `BaseLayout` | `components/layout/base-layout.tsx` | Visitor and user shell, see [page-shell.md](./page-shell.md) |
| `PageSection`, `SectionHeading` | `components/ui/` | Width, rhythm, titles |
| `Card`, `Surface` | `components/ui/card.tsx`, `surface.tsx` | Frame and inset, see [surfaces.md](./surfaces.md) |
| `InkLink` | `components/ui/ink-link.tsx` | Every text link, internal or external |
| `LedgerList`, `LedgerRow` | `components/ui/ledger.tsx` | Ledger pattern |
| `PlateFigure` | `components/ui/plate-figure.tsx` | Framed figure with italic caption: duotone by default, `tone="color"` keeps the picture's colour |
| `Logo` | `components/ui/logo.tsx` | The RH mark: `mini`, `mark`, `tile`, see [README.md](./README.md#brand) |
| `Engraving` | `components/ui/engraving.tsx` | The engraving band (colophon), the riders crop (404, auth) and the press plate (home hero, from `lg`) |
| `HoverTip` | `components/ui/hover-tip.tsx` | The one tooltip for every `data-tip`, mounted once in the root layout |
| `WordScroll` | `components/ui/word-scroll.tsx` | Home masthead sentence |
| `StatStrip` | `components/ui/stat-strip.tsx` | `dt` caption, `dd` numeral, `tabular-nums` |
| `InkChart`, `InkHeatmap`, `HatchBar` | `components/ui/ink-chart.tsx`, `ink-heatmap.tsx`, `app/_components/contribution/wakatime-progress.tsx` | Data viz (HatchBar takes `name`, `percent`, `value`) |
| `ReadingNow` | `components/ui/reading-now.tsx` | Realtime visitor line (client island) |
| `NotFoundView` | `components/ui/not-found-view.tsx` | 404, error and empty states |

## Rules per primitive

- **Button.** Default: `bg-ink text-paper`, 15px roman 600, `min-h-10` (44px on coarse pointers). Outline: 1px ink. Ghost: underline on hover. Destructive: outline with an SVG cross and an explicit verb ("Delete post"), never red. Pressed: `active:translate-y-px`. Never put a `Button` inside a `Link`; use `asChild`.
- **Focus.** Global `:focus-visible { outline: 2px solid hsl(var(--ring)); outline-offset: 2px }`. Do not remove or restyle it per component.
- **InkLink** (server). Underlined 1px, 2px on hover, no arrow. `external` adds `target="_blank"`, `rel`, the sr-only "(opens in a new tab)", and `data-umami-event={event ?? 'outbound-click'}` with `data-umami-event-host`.
- **Fields** (input, textarea, select). Baseline only: `border-0 border-b border-input`, 16px text, 2px ink baseline on focus, label above. Errors: italic ink text with an SVG cross, wired with `aria-describedby`.
- **Tabs.** Bottom rule; the active tab gets a 2px ink underline. State lives in the URL (`?tab=`).
- **Tag** (Chip and Badge merged). 1px `rule-strong`, 12px roman (`text-xs`). Status is an 8px square, filled, outline or dashed, plus a word.
- **Eyebrow.** An italic caption `<p>`, only when it adds information. Never all-caps, never mono.
- **Table.** `th` 12px / 600 in ink-soft (sticky in admin), numbers right-aligned with `tabular-nums`, hover row `bg-tint`.
- **Plates.** `PlateFigure` is a double-rule frame (1px ink, 3px paper, 1px rule) around the picture with an italic caption. `tone="photo"` (default) prints it in duotone. `tone="color"` skips the duotone for pictures that must keep their colour: anime and Pokémon pictures, the OCR upload, and site-generated `/api/og` covers (the blog passes `tone={isSiteImage(src) ? "color" : "photo"}`). The photo clips its own focus outline, so the frame draws it (2px ring outline) when an interactive child is focused. Size the picture in the caller so the frame reserves its space.
- **Generated cards.** Build `/api/og` and `/api/certificate` URLs with `ogImageUrl(params, path?)` from `src/lib/site-url.ts`. It always sets `v=3`, so a changed card design reaches crawlers and CDNs that cache the old one; raise the number when a card changes.
- **Hover tips.** `data-tip="..."` on any element shows an instant lift tip (`ui/hover-tip.tsx`, mounted once in the root layout). SVG marks follow the cursor, other elements anchor below; touch shows it on tap. Never use the native `title` attribute: it waits about a second. The tip is `aria-hidden`, so keep an `aria-label` or text table beside it.
- **Floating layers.** Dialog, AlertDialog, Sheet, Popover, DropdownMenu, Tooltip, Select, Command and Sonner toasts use the lift surface and an ink scrim. No backdrop blur.
- **Controls.** Square switch and checkbox, round radio dot (the only circle), static ruled skeleton with no pulse, square duotone avatar.
- **Icons.** lucide only, stroke 1.5, 16px or 20px, functional only. `react-icons` and `@radix-ui/react-icons` are removed; do not add them back.
- **Code.** Server `<pre>` specimen box (inset ground, system mono 13.5px, `tabIndex={0}`), no syntax colours. The client `CopyButton` keeps the `Click Copy Code` event.
- **Prose.** `.prose` in `globals.css` (no typography plugin): 66ch, display `h2` and `h3`, ink links, 22px italic blockquote, SVG fleuron `hr`, en-dash bullets, ledger tables, framed images. `.prose--chat` for chat replies.

## Data viz

All charts are server-rendered SVG in ink. Recharts is removed; do not add a chart library.

- `InkChart`: 1.5px ink line, hatched area, dotted grid, italic tabular axes, a `data-tip` per point, and a `<details>` table as the text alternative. `preserveAspectRatio="none"` with `vector-effect="non-scaling-stroke"`. Sessions as a dashed line.
- `InkHeatmap`: five levels with a `rule-strong` outline and a `data-tip` per cell.
- `HatchBar`: `repeating-linear-gradient(135deg, ...)` in CSS.

## Umami events

The tracker is gated to production with `data-domains`, `data-exclude-hash`, `data-performance` and `data-before-send="umamiBeforeSend"` (`src/lib/umami-before-send.ts` strips `token=` and other non-UTM query params and drops `/admin`).

**Where the attribute goes.** Umami's script calls `preventDefault` and reassigns `location.href` on any `<a data-umami-event>` without `target="_blank"`, which turns a client-side navigation into a full page reload. So:

- `data-umami-event` only on `<button>` elements and on external links that open with `target="_blank"`.
- Internal links use `data-track="nav-click"` plus `data-track-*` data attributes, for example `data-track-item="blog"`. One capture-phase listener in `src/components/layout/deferred-client-utilities.tsx` forwards them to `track()` without `preventDefault`.
- In code, call `track(name, data)` from `src/lib/analytics.ts`, never `window.umami` directly.
- One event per element.

**Naming.** Kebab-case, 50 characters or fewer, data values from a fixed enum. `Click Copy Code` is the one legacy name kept as is.

**Never send PII:** no emails, names, prompts, chat, JD or OCR text, search queries, chat ids or full URLs.

| Event | Where | Data |
|---|---|---|
| `nav-click`, `menu-open`, `search-open` | Head, menu, colophon, command palette | `item`, `area` / none / `via` |
| `theme-toggle` | ThemeToggle | `to` |
| `outbound-click` | InkLink `external` default | `host`, `area` |
| `cta-click`, `resume-open`, `portfolio-open` | Masthead, About | `target` / `area` |
| `social-click`, `email-click` | Contact (both), colophon (email only) | `network`, `area` |
| `cert-verify` | Certificates rows, `/certificates` | `issuer` |
| `contact-send` | Contact form | `status`: `ok`, `error`, `limited` |
| `ai-error` | AI chat, OCR demo, JD matcher catch blocks | `feature`, `status` |
| `not-found` | NotFoundView island | `path` (pathname only) |
| `blog-open`, `rss-subscribe`, `Click Copy Code`, `clap` | Blog | `source` / `feed` / `lang` / `kind` |
| `project-site`, `project-source` | Project rows and detail | `project` |
| `roadmap-lesson-complete`, `video-play` | Roadmap | `course` / `lesson` |
| `tool-open`, `chat-send`, `tracker-card-move`, `stats-profile-open` | Tools, chat, tracker, stats | `tool` / `reply` / `from`, `to` / `platform` |
| `anime-generate`, `anime-quote` | Anime generator buttons (`/tools?tab=anime-generator`) | `category` (cringe, blush, dance) / none |
| `ai-tab`, `ai-chat-send`, `ai-ocr-run`, `ai-jd-run`, `hirefit-share` | `/ai` | `tab` / `status` / `mode`, `status` / `band`, `status` |
| `signin-start`, `signin-complete`, `signup-complete`, `profile-save` | Auth, profile | `method` / `status` |

Content counts read "Read by 1,204 people in the last 30 days." and hide below 10. The realtime line reads "N people here in the last five minutes.", renders nothing at 0, never pulses and has no `aria-live`.

## Accessibility floor

`aria-current` on the current nav item, 44px targets under 768px, state by shape and word, text alternatives for every chart, no horizontal scroll at 375px, `<html lang="en">`.

## Outliers

- `terminal-overlay` is re-skinned to ink and paper like everything else. It keeps its own layout, not its own palette.
