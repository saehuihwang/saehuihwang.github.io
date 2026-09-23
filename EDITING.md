# How to edit this site

Everything is plain text. You edit Markdown files, commit, and push — GitHub
rebuilds the site automatically. You never touch HTML or CSS to change words.

## The loop

```bash
bundle exec jekyll serve --livereload     # start preview at localhost:4000
# ...edit files; the browser refreshes itself...
git add -A && git commit -m "update projects" && git push
```

After the push, GitHub Pages rebuilds in 1–2 minutes. If it doesn't appear,
check the **Actions** tab on github.com for a red build.

## Where everything lives

| To change… | Edit |
|---|---|
| Homepage text | `_includes/landing.html` |
| A project | `_projects/<name>.md` |
| A blog post | `_posts/YYYY-MM-DD-title.md` |
| Teaching page | `pages/Teaching.md` |
| Videography page | `pages/Hobbies.md` |
| Watson page | `_data/watson.yml` |
| Your name, email, social links | `_config.yml` |
| Images | `assets/images/` |
| PDFs | `assets/pdf/` — `papers/`, `reports/`, `resume.pdf` |
| Header links | `nav:` in `_config.yml` |
| Colours, fonts, spacing | `_sass/_tokens.scss` (see `DESIGN.md`) |

## Front matter

Every content file starts with a block between `---` lines. That's settings;
everything below it is your actual writing in Markdown.

```markdown
---
title: My post title
tags: [Travel, Watson]
---

Write normally here. **Bold**, *italic*, [a link](https://example.com).

![Describe the image for screen readers](/assets/images/blog/ship.JPG)
```

## Add a project

Create a file in `_projects/`. **The filename becomes the URL**, so keep it
short and lowercase — `tactile-map.md` gives `/projects/tactile-map`.

Order is controlled by the `order:` field, not the filename:

```markdown
---
order: 9
name: Tactile Map Prototype
tools: [Arduino, Fusion 360]
image: /assets/images/tactile-map.jpg
description: A one-line summary, used on the project card.
---

# Tactile Map Prototype

Your write-up goes here.

## Process

Use `##` and `###` headings — they build the left-hand contents list
automatically once there are two or more.
```

To reorder, change the numbers. Gaps are fine (10, 20, 30 leaves room to slot
things in later). The current order is 1–8.

- `name` is the **card** label; the `#` heading is the **page** title. They can differ.
- `description` and `image` only show on the card.
- Leave `image` out and the card gets a hand-drawn placeholder.

### Image galleries

```markdown
{% capture carousel_images %}
/assets/images/project/one.jpg
/assets/images/project/two.jpg
{% endcapture %}
{% include elements/carousel.html carousel_images=carousel_images %}
```

### Videos

```markdown
{% include elements/video.html video_ids="89TspaI5IoY" %}
```

Two side by side: `video_ids="abc123,def456"`.

## Add a publication

Same folder, but set `layout: publication`:

```markdown
---
layout: publication
title: Your Paper Title
year: 2026
journal: CHI
doi: "10.1145/xxxxxxx"
image: /assets/images/paper.jpg
authors:
  - Saehui Hwang
  - Sean Follmer
abstract: >
  The scientific abstract.
summary: >
  Optional plain-language version, shown above the abstract.
pdf: /assets/pdf/papers/your-paper.pdf   # renders an inline preview
buttons:
  - name: PDF
    icon: fas fa-file-pdf
    link: /assets/pdf/papers/your-paper.pdf
  - name: ACM DL
    icon: fas fa-external-link-alt
    link: https://doi.org/10.1145/xxxxxxx
---
```

### PDFs

Drop the file in `assets/pdf/papers/` (or `reports/` for course and project
write-ups) and name it after the project, not the DOI. Then add a `pdf:` line
in front matter — any project or paper with one gets an inline preview at the
foot of the page, using the browser's own PDF viewer.

Keep them under a few MB. `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/printer
-o out.pdf in.pdf` takes a typical conference PDF from tens of megabytes to
one or two without visible loss.

Your own name is bolded automatically in the author list.

## Add a blog post

Create `_posts/2026-03-14-a-good-title.md`. **The date in the filename is
required** and sets the publication date.

```markdown
---
title: A good title
tags: [Travel, Watson]
---

Your writing.
```

Posts appear on `/stories/`. Reading time is calculated for you.

> Older posts carry `style: border` and `color: primary` in their front
> matter. Those were for the old theme and are ignored now — safe to delete.

## Edit the Watson page

This page is generated from `_data/watson.yml` — you never touch HTML. To add
a country, append to `stops`:

```yaml
  - place: Uruguay
    map: "-56.0,-32.8,5.5"        # longitude,latitude,zoom
    photo: /assets/images/watson/uruguay.jpg
    alt: Saehui filming in Uruguay
    paragraphs:
      - >
        First paragraph. Indent continuation lines; the `>` folds them
        into one paragraph.
      - >
        Second paragraph.
```

The layout alternates text-left / text-right automatically, so you don't have
to think about sides. The intro and closing notes are the `intro:` and
`outro:` blocks at the top and bottom of the same file.

Map coordinates come from the [Mapbox static playground](https://docs.mapbox.com/playground/static/).

> The Mapbox token in that file is a public `pk.` key, which is normal — it's
> meant to be visible in the browser. Worth adding a URL restriction to it in
> your Mapbox account settings so nobody else can run up your quota.

## Navigation

The header is an explicit list in `_config.yml` — what's in it is what
shows, in that order:

```yaml
nav:
  - title: Research
    url: /projects/#research
  - title: Creative Projects
    url: /projects/#creative-projects
  - title: Résumé
    url: /assets/pdf/resume.pdf
```

`url` can be a page (`/teaching/`), a section anchor (`/projects/#research`),
or a file. Section anchors come from the `category:` name, lowercased and
hyphenated — so a new category called "Field Notes" is `#field-notes`.

Adding a page no longer adds it to the header; add a line here if you want it
linked. **Restart `jekyll serve` after editing `_config.yml`.**

**Two pages are currently reachable only by typing the URL:** `/teaching/` and
`/stories/` (your eight blog posts). Add them to `nav` above, or link them
from a project card the way Videography and the Watson year are.

## Page titles

Most pages open with their own `#` heading, so the layout does **not** add a
title — otherwise you'd see it twice. If a page has no heading of its own and
you want one, add `page_title: true` to its front matter.

## Images

Put files in `assets/images/` and reference them from the site root:

```markdown
![Alt text describing the image](/assets/images/folder/photo.jpg)
```

Always write real alt text — it's what a screen reader announces, and it's the
one accessibility detail only you can supply.

For a caption:

```markdown
{% include elements/figure.html image="/assets/images/photo.jpg" caption="Bermuda, 2022" %}
```

### Stamp thumbnails

The `image:` on a project or paper fills the stamp, so crop it yourself rather
than hoping a teaser figure happens to frame well. Make it **square**: the
projects grid shows the middle 4:3 of it and the homepage carousel shows the
whole square, so a square file reads the same in both.

The paper thumbnails in `assets/images/papers/` are `*-thumb.*`, cut from the
full teaser figure next to them. A teaser that is already close to 4:3 only
needs padding out to square; the white bands disappear into the plate, since
the figure's own background is white too:

```bash
# pick a meaningful 4:3 region, then pad it out to a square
sips -c 495 660 --cropOffset 168 432 teaser.jpg --out crop.jpg   # offset is top-left y x
sips -p 660 660 --padColor FFFFFF crop.jpg --out paper-thumb.jpg
```

## Site-wide settings

`_config.yml` holds your name, email, and social handles:

```yaml
author:
  name: Saehui HWANG
  email: saehui@stanford.edu
  github: saehuihwang
  linkedin: saehui-hwang-3ba1a3165
  instagram: saehui_sayhi/
```

Delete a line to remove that icon from the footer. Add one from
`_data/social-media.yml` to add an icon.

**Changing `_config.yml` requires restarting `jekyll serve`** — it's the one
file live reload doesn't pick up.

## Two things to fix when you get a chance

1. `_data/timeline.yml` says you joined the *Duaskardt Group*, which contradicts
   your homepage (SHAPE Lab, Prof. Follmer). It's no longer shown anywhere, but
   worth correcting before you use it again.
2. The Watson hero expects
   `assets/profiles/Grays-Anatomy-hand-public-domain_1.png`, which isn't in the
   repo. The page is designed to work without it; drop the file in and it appears.

## If something breaks

Jekyll will refuse to build and print the file and line. Most common causes:

- A missing `---` line in front matter
- A colon inside an unquoted front-matter value → wrap it in quotes:
  `title: "Robots: a study"`
- Inconsistent indentation in YAML (spaces only, never tabs)

Your last working version is always one `git checkout <file>` away.
