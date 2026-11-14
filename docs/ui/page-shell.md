# Page shell and page patterns

## Shell

```
 ┌ translucent bar ─ Rizky Haksono     Projects Writing Roadmap Tools Stats Chat     [pause][theme] ┐
   ░░░░░░░░░░ Langit Malang band (time-of-day blue), clouds drifting near the top (home only) ░░░░░░░░░░
                                          (o)              72px portrait, centred
                                    Rizky Haksono          display, centred
                    Senior AI engineer at Sarana AI, Malang, East Java.   lead, muted, centred

                I'm Rizky, a senior AI engineer at Sarana AI in Malang. I build LLM systems
                for production ... [marked phrase] ...                     prose, left-aligned
                                        Projects           h2, centred
          ╭──────────── screenshot on a grey tile, 768px breakout, rounded-2xl ────────────╮
          ╰────────────────────────────────────────────────────────────────────────────────╯
                Project title                                                    2024
                                         Writing
                Post title ............................................... 12 Oct
                     Rizky Haksono, email  /  links row  /  year, Malang      centred footer
```

### Header

`src/components/layout/running-head.tsx`. An Apple-style translucent sticky bar, 48px tall (`--head-h`).

- **Background:** a translucent `background` fill with `backdrop-blur-md`, and a hairline that appears after scrolling. It is the only blurred element on the site.
- **Inner row,** centred at `WIDE_WIDTH`:
  - Left: the name "Rizky Haksono" as text, 15px, weight 600. There is no logo mark.
  - Centre, from `md`: the nav from `NAV_SECTIONS`, 13px muted text; the current page is foreground with `aria-current`.
  - Right: the sky pause button and the theme toggle (`size-11`), plus a "Menu" text button below `lg`. Keep the name "Menu": e2e tests find it.
- It carries `viewTransitionName: site-header`, so route crossfades leave it still.

### Menu

`src/components/layout/contents-sheet.tsx`, a Radix sheet on the float surface.

- Every nav item shows its `note` as a second, muted line.
- Theme radios read Light, Dark and System.
- Account and legal links live here.

### Footer

`src/components/layout/footer.tsx`. Centred and quiet, not a four-column template.

- The name and the email.
- One row of links: GitHub, LinkedIn, RSS, Certificates, Changelog, Privacy, Terms, Send feedback.
- The year and place in 12px muted text.
- Keep `data-track-area="colophon"`: it is an analytics value.

`src/commons/constants/navigation-menu.ts` is the only nav source. The header, menu, footer and terminal overlay all import it.

### BaseLayout

`src/components/layout/base-layout.tsx`. A server component that reads no cookies, so pages under it can be static or ISR. It mounts `<Sky/>`.

| Prop | Values | Use |
|---|---|---|
| `width?` | `'prose'` (default), `'wide'` | `wide` (960px) on `/tools` and `/chat` |
| `fit?` | `boolean` | The page takes whatever height the header and footer leave |
| `bleed?` | `ReactNode` | A full-width slot above the column |
| `footer?` | `'full'` (default), `'compact'`, `'none'` | `compact` on `/ai` and `/chat` |

- No sidebars, no right-hand panels, no scroll-to-top button.
- Do not add horizontal padding inside `BaseLayout`; the column already has its gutters.
- `DeferredClientUtilities` (terminal overlay, feedback dialog) mounts inside `BaseLayout`, so the admin and auth skip it. The feedback dialog opens from `[data-open-feedback]` buttons; nothing floats over the page.

## Width and alignment

The public site is centred:

- One 640px column (`PROSE_WIDTH`), centred, with 20px gutters on phones and 24px above.
- **Centred:** the home name block, every page header (`PageHeader`: h1 plus lead), section titles and the footer. These are short display lines.
- **Left-aligned inside the column:** prose, lists, rows, forms and tables. Long centred text is hard to read.
- **Breakout:** media tiles grow symmetrically to 768px on large screens (`BREAKOUT`, `lg:-mx-16`).
- **Wide:** `/tools` and `/chat` use `width="wide"` (960px).

The admin is full width; see [platforms.md](./platforms.md#admin).

| Avoid | Use |
|---|---|
| Centred paragraphs, lists or rows | Left-aligned inside the centred column |
| A second `container` or `mx-auto max-w-*` wrapper inside a page | `BaseLayout` and its `width` prop |
| Hand-made h1 blocks | `PageHeader` |
| Horizontal scroll at 320 or 375px | Wrap, stack, or clip with `overflow-x: clip` |

## Page patterns

Every route uses one of these. Pick the pattern first, then the primitives.

| Pattern | Component | Routes | Look |
|---|---|---|---|
| Ledger | `ui/ledger.tsx` | `/blog` rows, `/certificates`, `/changelog`, `/roadmap`, `/project` rows, home Writing and Work | Rows grouped by year; title left, date right in muted text; hover `bg-muted` with `rounded-lg`; no sticky column |
| Article | `ui/article-shell.tsx` | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` | Centred header, prose at 17/28, contents in the margin from `xl`, a `<details>` above the text below `xl` |
| Media | `MediaCard`, `ui/plate-figure.tsx` | Home Projects, `/project` featured, the `/blog` lead post, covers and screenshots | A picture in its own colours on a `bg-muted` tile, `rounded-2xl`, title and meta below; breaks out to 768px |
| Cabinet | `tools/_components/tool-shell.tsx`, `ui/pager.tsx` | `/tools`, `/ai` | `width="wide"`, segmented tabs, state in `?tab=` |
| Correspondence | The chat column, the contact form | `/chat`, `/ai` chat, home contact, admin Feedback | A column of messages; the home form sits in a `<details>` so its scripts load only when opened |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar` | `/stats`, admin Home and Analytics | Numerals at the `numeral` size, solid fills, a text alternative for every chart |
| Admin | `components/layout/admin/*` | `/admin/dashboard/*` | Full width: sidebar, top bar, tables with a peek sheet |
| Auth | `layout/auth-shell.tsx` | `/auth/*`, `/admin/auth/login` | One centred column |
| Profile card | The profile sheet | `/profile`, `/profile/edit`, admin Settings | A definition list in a frame |
| Not found | `ui/not-found-view.tsx` | 404s, `error.tsx`, empty states | "There is no page at this address." and a way back |

New routes pick one of these. Never add window chrome, glass cards or sidebars to a visitor page.

## Home

The home is a short, calm page written in the first person. Every data block is its own async server component in `<Suspense>`; the name and bio are static, so the LCP is text. Order:

1. **Name block,** centred: the portrait in colour at 72px, the name in `display`, the job line in `lead`.
2. **Bio:** three paragraphs with inline links (`InkLink` with an `icon` for GitHub and LinkedIn), left-aligned, at most one `Marker`.
3. **Projects:** three `MediaCard`s and "All N projects".
4. **Writing:** five rows.
5. **Work:** the newest four career and education rows, with "Full history in my CV".
6. **Recommendations:** at most two, only when the API returns any.
7. **Contact:** one line with the email, and the form inside `<details>`, so Turnstile and EmailJS load only when it opens.

Sections with no data hide. They never show zeros, `NaN` or `-Infinity`. Activity (heatmap, WakaTime, Duolingo) lives on `/stats`, and certificates on `/certificates`, linked from the footer.

## Sticky and overflow rules

- Sticky elements use `top: var(--head-h)` (plus an offset) to clear the header.
- `overflow-x: clip` on `html` and `main` only. Never on `body`, never `overflow: hidden` or `auto` on a sticky ancestor, never `content-visibility` on or around sticky content.
- Anchor targets use `[id] { scroll-margin-top: calc(var(--head-h) + 1rem) }`, not `scroll-padding-top` on `html`.
- Check sticky still works after the menu sheet opens and closes.
