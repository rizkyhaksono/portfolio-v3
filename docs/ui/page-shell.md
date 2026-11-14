# Page shell and page patterns

## Shell

```
   @rizkyhaksono                                Projects  Writing  Roadmap  Tools  Stats  Chat  [theme]
   ────                                         (40px rule under the handle; "Menu" below lg)

   Senior AI engineer at Sarana AI in Malang, East Java, building LLM systems     muted prose, the names
   for production ...                                                             in full ink, 15/24

   Projects                                                                       h2, 15/24, weight 500
   Info Pangan Jakarta                                                            title in ink
   The city's official food price monitor.                                        one muted sentence
   ...
   All 27 projects

   Writing / Work experience / Recommendations / Contact                          the same plain rows

 ░░░░░░░░░ Langit Malang: sky by Malang's hour, clouds, Arjuno and Semeru, grass hills ░░░░░░░░░
   @rizkyhaksono
   Write to me at email.  GitHub LinkedIn RSS Certificates Changelog Privacy Terms Send feedback
   (c) 2026 Rizky Haksono. 14:05 in Malang
```

### Header

`src/components/layout/running-head.tsx`. Plain text at the top of the column, after joshpuckett.me. It is not sticky, not translucent and not blurred; it scrolls away with the page.

- **Left:** the handle "@rizkyhaksono" at the `h1` size (24px, weight 500), linking home, with a 40px `bg-foreground` rule under it (`h-px w-10`). There is no logo mark.
- **Right:** from `md`, the nav from `NAV_SECTIONS` as `small` muted text (Projects and Writing from `md`, the rest from `lg`); the current page is foreground with `aria-current`. Then the theme toggle, and a "Menu" text button below `lg`. Keep the name "Menu": e2e tests find it.
- It sits in the same column as the page (`PROSE_WIDTH`, or `WIDE_WIDTH` on wide pages) and carries `viewTransitionName: site-header`, so route crossfades leave it still.

### Menu

`src/components/layout/contents-sheet.tsx`, a Radix sheet on the float surface.

- Every nav item shows its `note` as a second, muted line.
- Theme radios read Light, Dark and System.
- Account and legal links live here.

### Footer

`src/components/layout/footer.tsx`. The painted Langit Malang scene (`Sky`, see [design-system.md](./design-system.md#langit-malang-the-footer-sky)) fills a full-width band at the very bottom of every visitor page, and the footer text sits in its upper sky, in the page column:

- The handle "@rizkyhaksono" at the `h1` size.
- "Write to me at" and the email.
- One line of links: GitHub, LinkedIn, RSS, Certificates, Changelog, Privacy, Terms, Send feedback, and the sky's pause toggle, which is never shown: it stays `sr-only`, appears only on keyboard focus, and is `display: none` below 640px, where the scene stands still.
- The year and the hour in Malang (`MalangClock`) in `caption` muted text.
- Keep `data-track-area="colophon"`: it is an analytics value.

`variant="compact"` (on `/chat`) keeps only the line of links over a hairline, with no sky.

`src/commons/constants/navigation-menu.ts` is the only nav source. The header, menu, footer and terminal overlay all import it.

### BaseLayout

`src/components/layout/base-layout.tsx`. A server component that reads no cookies, so pages under it can be static or ISR. It mounts the handle header, the page column and the footer (which mounts `<Sky/>`).

| Prop | Values | Use |
|---|---|---|
| `width?` | `'prose'` (default, 36rem), `'wide'` (60rem) | `wide` on `/tools` and `/chat` |
| `fit?` | `boolean` | The page takes whatever height the header and footer leave |
| `footer?` | `'full'` (default, with the sky), `'compact'`, `'none'` | `compact` on `/chat` |

- No sidebars, no right-hand panels, no scroll-to-top button.
- Do not add horizontal padding inside `BaseLayout`; the column already has its gutters.
- `DeferredClientUtilities` (terminal overlay, feedback dialog) mounts inside `BaseLayout`, so the admin and auth skip it. The feedback dialog opens from `[data-open-feedback]` buttons; nothing floats over the page.

## Width and alignment

- One 36rem column (`PROSE_WIDTH`), centred on the page, with 20px gutters on phones and 24px above.
- **Everything inside the column is left-aligned:** the handle, page titles, section labels, prose, lists, forms and the footer text. Nothing is centred but the column itself (and the auth form).
- **Images** stay exactly as wide as the column (`BREAKOUT` is empty), so their edges line up with the text.
- **Wide:** `/tools` and `/chat` use `width="wide"` (60rem).

The admin is full width; see [platforms.md](./platforms.md#admin).

| Avoid | Use |
|---|---|
| Centred paragraphs, titles, lists or rows | Left-aligned inside the centred column |
| A second `container` or `mx-auto max-w-*` wrapper inside a page | `BaseLayout` and its `width` prop |
| Hand-made h1 blocks | `PageHeader` |
| Boxes around sections, stat cards, tiles for plain text, rules between groups | Whitespace and a small muted label |
| Horizontal scroll at 320 or 375px | Wrap, stack, or clip with `overflow-x: clip` |

## Page patterns

Every route uses one of these. Pick the pattern first, then the primitives.

| Pattern | Component | Routes | Look |
|---|---|---|---|
| Ledger | `ui/ledger.tsx` | Home lists, `/blog` rows, `/certificates`, `/changelog`, `/roadmap`, `/project` rows | Plain rows: a title in foreground (not bold) with one muted line under it, meta on the right where it helps, an optional small muted group label (a year, a version). No boxes, no rules, no hover backgrounds; the title's underline strengthens on hover |
| Article | `ui/article-shell.tsx` | `/blog/[slug]`, `/blog/onsite/[slug]`, `/project/[id]`, `/roadmap/[slug]`, `/legal/*` | A quiet head in the column (back link, 24px title, dateline), the contents in a closed `<details>`, the text, then previous and next |
| Media | `MediaCard`, `ui/plate-figure.tsx` | Only where screenshots matter: `/project` featured, the `/blog` lead post, project heroes | A picture in its own colours on a `bg-muted` tile, `rounded-2xl`, as wide as the column, title and meta below |
| Cabinet | `tools/_components/tool-shell.tsx`, `ui/pager.tsx` | `/tools`, `/ai` | `width="wide"`, segmented tabs, state in `?tab=` |
| Correspondence | The chat column, the contact form | `/chat`, `/ai` chat, home contact, admin Feedback | A column of messages; the home form sits in a `<details>` so its scripts load only when opened |
| Figures | `StatStrip`, `ui/ink-chart.tsx`, `ui/ink-heatmap.tsx`, `HatchBar` | `/stats`, admin Home and Analytics | Numerals at the `numeral` size, no cards around them, solid fills, a text alternative for every chart |
| Admin | `components/layout/admin/*` | `/admin/dashboard/*` | Full width: sidebar, top bar, tables with a peek sheet |
| Auth | `layout/auth-shell.tsx` | `/auth/*`, `/admin/auth/login` | One centred column |
| Profile card | The profile sheet | `/profile`, `/profile/edit`, admin Settings | A definition list in a frame |
| Not found | `ui/not-found-view.tsx` | 404s, `error.tsx`, empty states | "There is no page at this address." and a way back |

New routes pick one of these. Never add window chrome, glass cards or sidebars to a visitor page.

## Home

The home is a short, calm page in the first person, laid out like joshpuckett.me: text lists, no screenshots, no tiles. The name is a sr-only h1 ("Rizky Haksono"), since the handle above says it. The bio is static, so the LCP is text; every data list is its own async server component in `<Suspense>` with a static skeleton. Order:

1. **Bio:** three muted paragraphs with the names in full ink (Sarana AI, Info Pangan Jakarta, Adaro, Biofarma, Universitas Muhammadiyah Malang) and `InkLink`s to GitHub, LinkedIn and the CV.
2. **Projects:** the featured projects, then the newest, up to 8 rows of a title and the first sentence of its description, linking to `/project/[id]`. Then "All N projects" when there are more.
3. **Writing:** the newest five posts as a title and one sentence, then "All writing".
4. **Work experience:** **every** career and education entry, newest first, never sliced. Each row is the role in ink, then "company, duration" muted.
5. **Recommendations:** every LinkedIn recommendation, only when the API returns real ones.
6. **Contact:** one sentence with the email, and the form inside `<details>` ("Or leave a message here"), so Turnstile and EmailJS load only when it opens.

Every list has an honest failed or empty line (`StatusLine`), for example "Projects did not load just now. The code is on GitHub in the meantime." Recommendations hide when there are none. Nothing shows zeros, `NaN` or `-Infinity`. Activity (heatmap, WakaTime, Duolingo) lives on `/stats`, and certificates on `/certificates`, linked from the footer.

## Sticky and overflow rules

- The visitor header is not sticky, so nothing on a visitor page needs a header offset. The admin keeps `--head-h` for its own bar.
- `overflow-x: clip` on `html` and `main` only. Never on `body`, never `overflow: hidden` or `auto` on a sticky ancestor, never `content-visibility` on or around sticky content.
- Anchor targets keep `[id] { scroll-margin-top }` from `globals.css`, not `scroll-padding-top` on `html`.
- Check sticky still works after the menu sheet opens and closes.
