# Design system — risograph

Two spot inks printed flat on white, plus black. Where the inks overlap they
multiply, the way a real two-colour riso pull does. No rounded corners, no
gradients, no soft shadows, no centred column.

## Where things live

| What | Where |
|---|---|
| Inks, type scale, spacing, edges | `_sass/_tokens.scss` |
| Colour slabs (`.on-orange` etc.) | `_sass/_tokens.scss` |
| Grain, halftone, overprint | `_sass/_texture.scss` |
| Hand-drawn SVGs | `assets/patterns/` |
| Pattern URLs (Liquid, baseurl-safe) | `assets/css/style.scss` |
| Partial load order | `_sass/main.scss` |
| Behaviour | `assets/js/site.js` |

## The inks

| Token | Value | Use |
|---|---|---|
| `--orange` | `#E96629` | Fills, slabs, display type |
| `--teal` | `#0093A5` | Fills, slabs, display type |
| `--ink` | `#0E0E0E` | Type, rules, borders |
| `--canvas` | `#FFFFFF` | Paper |
| `--orange-text` | `#B8410F` | Orange at body size on white (5.5:1) |
| `--teal-text` | `#006B78` | Teal at body size on white (6.2:1) |

The raw inks only reach ~3:1 on white. That clears AA for large text and for
borders, but **not** for body copy — hence the `-text` variants. Black on
orange is 5.9:1 and black on teal is 5.3:1, so type sitting *on* a slab is
always black.

## Colour slabs

Put one of these on a section and everything inside — section numbers, rules,
borders, links, buttons — retints itself:

```html
<section class="slab on-ink">   <!-- black field, orange accents -->
<section class="slab on-teal">  <!-- teal field, orange accents -->
<section class="slab on-orange"><!-- orange field, teal accents -->
<section class="slab on-canvas"><!-- white -->
```

Each sets `--bg`, `--fg`, `--fg-soft`, `--rule` and `--accent`. Never hard-code
a colour in a component; read `var(--fg)` / `var(--accent)` and it will work on
any slab.

The home page runs white → black → teal → orange top to bottom.

## Overprint

The signature move. Two inks that overlap genuinely mix, because the top layer
is set to `mix-blend-mode: multiply`:

```html
<span class="halftone" style="--halftone-ink: var(--orange); --halftone-size: 12px"></span>
```

`.halftone`, `.pattern` and `.overprint` all multiply by default, and flip to
`screen` in dark mode so the effect survives inversion. Orange over teal gives
the dark green you see on the Watson hero — that is correct, not a bug.

## Patterns

Every pattern is a **CSS mask**, so the SVG's own colours are ignored. Draw in
solid black on transparent and the CSS tints it:

- `halftone.svg` — one dot per tile; the screen
- `squiggle.svg` — tiles horizontally
- `contour.svg` — the Watson hero field
- `scribble.svg` — fallback art for projects with no image
- `arch.svg` — solid organic blob
- `dots.svg`, `underline.svg`

To place one, the parent needs `position: relative`:

```html
<span class="pattern" aria-hidden="true"
      style="--pattern: var(--pat-contour); --pattern-color: var(--teal);
             inset: -10% -5%;"></span>
```

Register a new file by adding a `--pat-*` line in `assets/css/style.scss`.

## Type

- **Bricolage Grotesque** — display. Variable: `"wdth" 75` is condensed (used
  for the logotype), `100` is wide. Headings are uppercase and tightly tracked.
- **Space Grotesk** — body.
- **Space Mono** — every label, year, number and nav item, uppercase and
  widely tracked.

Sizes are fluid: `var(--step--2)` … `var(--step-6)`, never fixed px.

Headings shout in caps; the hero lede deliberately does **not** — a 30-word
sentence in all caps is genuinely hard to read.

## Layout

Navigation is a fixed orange rail down the left edge (`--rail-w`, 16rem above
60rem, collapsing to a solid orange top bar below it). `body` carries a
matching `padding-left`. `.shell` is left-aligned rather than centred, so the
page reads as a poster with a wide right margin.

Card grids have **no gutters**: cards butt together and share one ink rule via
negative margins, like frames on a contact sheet.

## Page titles

Most pages open with their own Markdown heading, and for project documents
`page.title` is a Jekyll-generated slug rather than the real name. So
`_layouts/page.html` renders **no** title by default — set `page_title: true`
in front matter on pages that need one.

## Accessibility

Worth holding onto, given what you research:

- All motion is gated behind `prefers-reduced-motion`.
- The TOC, carousels and galleries work with JavaScript disabled.
- Focus rings are teal, 3px, always visible; there's a skip link.
- Every page has exactly one `h1`, a `lang`, and no duplicate ids.
- Icon-only links carry `aria-label`.
- Photographs are duotone by default and return to full colour on hover/focus
  — remove the `filter` on `.portrait__img`, `.card__media img` and
  `.feature__media img` to turn that off.

```bash
bundle exec jekyll serve --livereload
```
