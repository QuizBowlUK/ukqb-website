# UK Quizbowl website

## Page update timestamps

Use Node.js 22.6 or newer to run the TypeScript build script and tests directly.

Every page displays the latest Git commit date for its content, in UK time
(GMT/BST). Blog publication dates remain separate. The homepage also tracks
tournament and blog data; the blog index tracks blog data; the committee page
tracks committee data. Referenced blog images and committee portraits also count
as content updates. Shared navigation and styling changes do not reset content
timestamps. New Astro pages must pass their content paths to `Layout` via
`sourceFiles`; Markdown pages use their source file automatically.

Builds need Git history, not just a source archive. `npm run build` automatically
fetches full history for shallow checkouts, including hosting builds; fetching
requires access to the Git remote. Direct Astro commands reject shallow history
with instructions to run `git fetch --unshallow`. CI fetches full history upfront.
New files without history show “Not yet committed” in development; production
builds still require a committed timestamp. Uncommitted edits receive their
timestamp after committing.

## How to add a new blog post

All blog posts are stored as Markdown files under `src/data/blog`. To add a new blog post:

1. Create a new Markdown file with the contents of the blog post in its body.
2. Fill in the contents of the frontmatter. Each blog post must have a title, a date, a description, and a teaser image. It is good practice to add alt text for the teaser image for accessibility reasons. You may also specify a different image for the feature image in the body of the blog post. The frontmatter for a blog post may look like:

```md
---
title: "MRNA IV: A New Hope"
date: 2025-07-12
description: "An overview of the antepenultimate tournament of the 2024-2025 UK QuizBowl season from moderators and players."
image:
  teaser:
    path: 2025-mrna-iv/imperial-soton.webp
    alt: A group of student quizzers sat in a lecture theatre at Royal School of Mines, London. The student groups are Imperial A and Southampton B. Two moderators appear in the image.
  feature: 2025-mrna-iv/imperial-soton.webp
---
```

The schema of the frontmatter is specified in `src/content.config.ts`.

### Adding images

Put all images under `src/assets`.

Image paths in the frontmatter are relative to `src/assets/blog`. Image paths in the body of the blog post are relative to the Markdown file. To add an image in the body of the blog post, use standard Markdown syntax, e.g.

```md
![This is some alt text](../../assets/blog/2025-mrna-iv/warwick-manchester.webp)
```

Images in the body of the blog post are centred by default.

## How to update tournaments

All tournament details are specified in `src/data/tournaments.json`. The tournaments are sorted by date before rendering so there's no need to manually sort the tournament objects, although it may be helpful to sort them in the JSON file anyway. A tournament object may look like:

```json
{
  "name": "X, formerly known as TitA",
  "id": "x",
  "dots": 2,
  "eligibility": "open",
  "popCulture": true,
  "date": "13 Dec 2025",
  "location": {
    "Southern": "University of Southern",
    "Northern": "University of Northern"
  },
  "link": {
    "Southern mirror link": "https://fb.me/e/xxx",
    "Northern mirror link": "https://fb.me/e/yyy"
  }
}
```

The schema of the tournament object is specified in `src/content.config.ts`.

## How to update committee bios

The committee bios are specified in `src/data/committee.json`. Image paths are relative to `src/assets`. To force a paragraph break in the bio, add `\n\n` between paragraphs. A bio object may look like:

```json
{
  "position": "Tournament Supervisor",
  "name": "Bio Hazard",
  "bio": "This is a bio",
  "image": "committee-25/biohazard.png"
}
```

The schema of the bio object is specified in `src/content.config.ts`.
