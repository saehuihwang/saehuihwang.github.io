# Design system — editorial

Cream ground, royal blue doing nearly all the talking, orange reserved for the
one thing you want clicked. High-contrast serif at display size; everything
else small and quiet. Work is presented as **postage stamps** with
perforated edges and blue duotone imagery.

## Where things live

| What | Where |
|---|---|
| Colour, type scale, spacing, edges | `_sass/_tokens.scss` |
| Stamp cards + duotone | `_sass/_cards.scss` |
| Halftone, grain, patterns | `_sass/_texture.scss` |
| Hand-drawn SVGs | `assets/patterns/` |
| Partial load order | `_sass/main.scss` |
| Behaviour | `assets/js/site.js` |

## Colour

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FFFCF5` | Page ground |
| `--paper` | `#FFFFFF` | Stamp paper — must differ from the ground or perforations vanish |
| `--cream-3` | `#EFE7D3` | The tinted bed stamps sit on |
| `--blue` | `#3465AE` | Primary. 5.7:1 on cream, so it carries body copy |
| `--blue-mute` | `#5B7195` | Muted text, 4.8:1 |
| `--orange` | `#E96629` | Actions only |
| `--ink` | `#16233A` | Text sitting *on* orange (4.8:1) |

Orange only reaches 3.2:1 on cream, so it never carries body text — it fills
buttons, and anything on top of it uses `--ink`. Read `var(--fg)` and
`var(--accent)` in components rather than naming a colour, so panels can
retint themselves (`.on-blue`, `.on-cream-2`).

## Stamps

Perforated edges are four repeating `radial-gradient` masks intersected with
`mask-composite`. Two consequences worth knowing:

1. **A mask cuts the border too**, so stamps get depth from
   `filter: drop-shadow()`, not `box-shadow`.
2. **The notches show the page through the card.** A stamp on a background the
   same colour as itself looks like a plain rectangle. That is why stamp grids
   sit on `.grid--stamps` (a `--cream-3` bed) and the home carousel sits on
   `.slab--sky`. If you add stamps somewhere new, give them a darker bed.

Browsers without `mask-composite` union the layers instead, which resolves to
a plain rectangle — so it degrades to a clean edge rather than breaking.

## Duotone

Blue behind, greyscale photo screened over the top: blacks become the blue,
whites stay paper.

```css
.card__media      { background: var(--blue); }
.card__media img  { filter: grayscale(1) contrast(1.45) brightness(.72);
                    mix-blend-mode: screen; }
```

Hovering a card restores the real photograph. The `contrast`/`brightness`
values matter — without them bright photos wash out to almost nothing.

Projects with no image get a white halftone dot plate instead.

## Type

- **Instrument Serif** — display. One weight, high contrast, set large and tight.
- **Newsreader** — body copy.
- **Instrument Sans** — every label, tag, nav item and button, uppercase and letterspaced.

Sizes are fluid: `var(--step--2)` … `var(--step-6)`, never fixed px.

`.bracket` wraps a label in `[ ]`, the reference's nav idiom.
`.arrow-out` adds the ↗ on external links.

## Layout

Centred: a sticky top bar, then a `--shell` column. Sections are
`.section` / `.slab`, and `.slab--sky` is the gradient band the home
carousel floats on.

Project pages can set `wide: true` in front matter to drop the reading column
and contents rail — used by Silly Bots, which is a headline plus a deck.

## Accessibility

- Every page has one `h1`, a `lang`, no duplicate ids, alt text on every image.
- Motion is gated on `prefers-reduced-motion`.
- Contents rail, carousels, galleries and the focus deck all work without JS.
- Focus rings are orange, 2px, always visible; there is a skip link.
- Duotone is decorative: hovering or focusing restores the true photo.

```bash
bundle exec jekyll serve --livereload
```
