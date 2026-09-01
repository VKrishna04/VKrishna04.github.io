# The prompt

Run this inside **any project repository** that should get a rich page on
vkrishna04.me. It is self-contained — it does not assume the agent has seen the
portfolio repo.

Everything the page can show is in here: the details themselves, the repo's
README rendered underneath them, a screenshot carousel, a demo video, and the
page's own theme, background and accent colour.

---

```
Create `.portfolio/project.json` in this repository.

This file is consumed at build time by my portfolio at https://vkrishna04.me,
which renders it as https://vkrishna04.me/projects/<repo-name-lowercased>. The
page is server-prerendered for SEO, so the text you write here is what search
engines and recruiters read. The portfolio also re-fetches this file live, so a
push to this repo updates the page's body without redeploying the portfolio.

The authoritative schema is:
https://vkrishna04.me/schemas/project-manifest.schema.json
Fetch it and follow it exactly. `additionalProperties` is false everywhere — an
unknown key is a bug, not an extension point. Set `"manifestVersion": 2` and the
`$schema` key.

Before writing anything, READ this repository and ground every claim in it:
- README, docs/, and any architecture notes
- package.json / pyproject.toml / Cargo.toml / go.mod for the real dependency list
- the source tree, to describe what it actually does rather than what the README
  aspires to
- CI config, tests, and release/tag history for status and maturity
- git log for the real start date
- the repo's own images: docs/, assets/, screenshots/, .github/

Then write the manifest with these rules.

## Grounding

1. Every field is optional. Omit anything you cannot ground in the repo — the
   portfolio falls back to its own settings for anything missing. Do NOT invent
   metrics, download counts, user numbers, benchmarks, or dates. If a number is
   not verifiable from this repo or a linked public source, leave it out.
2. Write plain text. Markdown is not parsed in manifest fields — a `**bold**`
   renders as literal asterisks. (The README block below is the one exception:
   that file IS rendered as Markdown.)

## The page body

3. `summary` is the page's meta description. Two or three sentences, max 400
   chars, leading with what the project DOES. No "passion project", no
   "leveraging cutting-edge".
4. `highlights` are concrete outcomes: what it solves, what is technically
   non-obvious, what it measurably achieves. 3-6 bullets. Delete any bullet that
   would be true of every project.
5. `metrics` are {label, value, detail} triples — only for numbers you can point
   at (test count, latency you measured, installs from a public listing).
6. `sections` is the body of the page, in order. Aim for 3-5 sections that a
   reader could not get from the README's first paragraph:
   - `prose` — the problem, and why the obvious approach did not work
   - `list` — architecture decisions, or features with substance behind them
   - `code` — one short, genuinely illustrative snippet (the API, not boilerplate)
   - `table` — a comparison, a benchmark you actually ran, or a config reference
   - `media` — a screenshot or diagram that exists in the repo
   Section types outside {prose, list, code, table, media} are dropped at build
   time, so do not invent new ones.

## The README block

7. `readme` renders a Markdown file from this repo below everything above. Set
   `"readme": true` to render README.md with the defaults, or an object:

       "readme": {
         "path": "docs/OVERVIEW.md",   // repo-relative, must end .md/.markdown,
                                       // no leading slash, no ".."
         "heading": "How it works",    // default "From the README"
         "collapsed": false            // true hides it behind a toggle
       }

   The file is fetched at build time, capped at 100 KB, and rendered without raw
   HTML — a script tag or an onerror attribute in it renders as nothing.
   Repo-relative image and link paths inside it are rewritten to absolute GitHub
   URLs automatically, so they do not need editing.
   Turn it on when the README genuinely adds depth. If the README is a stub, or
   just repeats `summary` and `highlights`, leave `readme` out — a duplicated
   page reads worse than a short one.

## Images and video

8. `media.screenshots` is an array of {url, alt, caption}. Image URLs must be
   ABSOLUTE: for images in this repo use
   https://raw.githubusercontent.com/<owner>/<repo>/HEAD/<path>
   Relative paths do not resolve — the page is served from vkrishna04.me, not
   from this repo. Verify each path exists before referencing it. Always write
   `alt`. Anything that is not http(s) is dropped at build time.
9. `media.layout` picks how they are shown:
   - `auto` (default) — a carousel once there is more than one, a single figure
     otherwise
   - `carousel` — arrows, dots, and arrow-key navigation
   - `grid` — two columns
   - `stack` — full width, one under the other
10. `media.video` is one demo video shown above the screenshots:

        "video": { "url": "...", "title": "...", "caption": "...", "poster": "..." }

    Only youtube.com, youtu.be and vimeo.com embed (YouTube goes through
    youtube-nocookie). Any other https URL is treated as a direct video file and
    must end in .mp4, .webm or .ogg — anything else is dropped silently.
    `poster` applies to direct files only, not to embeds.
11. `media.cover` is the single image used for the card and for link previews.

## The page's look

12. `appearance` lets this page choose its own look. Leave it out entirely
    unless the project has a real visual identity — the portfolio's own styling
    is the right default and stays consistent across pages.

        "appearance": {
          "theme": "ember",      // default|aurora|ember|ocean|forest|mono|midnight
          "background": "grid",  // default|plain|grid|dots|glow
          "accent": "#dea584"    // exactly #rrggbb
        }

    Any value outside those lists is ignored and the portfolio decides. `accent`
    replaces the heading gradient outright, so pick something readable on a dark
    background.

## Identity and links

13. `icon` is a react-icons export name, e.g. SiRust, SiPython, FaReact. It is
    used on the project card and the page header. A name that is not a real
    export renders nothing at all, so verify it exists before writing it.
14. Only http(s) links. Fill `links.repo` with this repository's URL, and
    `links.live` / `links.demo` / `links.docs` / `links.paper` / `links.package`
    only where a real, reachable URL exists.
15. `status` must be one of: active, maintained, archived, experimental,
    complete. Pick it from the actual commit and release history, not optimism.
16. Do NOT set `slug` unless the repo name genuinely makes a bad URL. The default
    is the repo name lowercased, and changing a slug after the page is indexed
    throws away its search ranking.

Finally:
- Validate the file parses as JSON and conforms to the schema.
- Print the file and a one-line note for each claim you could not ground, and
  for each image or video URL you could not verify, so I can supply them myself.
```

---

## A minimal manifest

Everything is optional; this is what a good small one looks like.

```json
{
  "$schema": "https://vkrishna04.me/schemas/project-manifest.schema.json",
  "manifestVersion": 2,
  "tagline": "Prune dead dev directories, fast.",
  "summary": "A Rust CLI that finds and removes build artefacts - node_modules, target, .venv - across a whole drive, showing what it will reclaim before it touches anything.",
  "icon": "SiRust",
  "status": "active",
  "readme": true,
  "highlights": [
    "Walks a 400 GB drive in under 20 seconds by skipping subtrees once a marker file identifies them.",
    "Dry-run by default; deletion needs an explicit flag."
  ],
  "links": { "repo": "https://github.com/OWNER/REPO" }
}
```

## Updating a manifest later

Same prompt, with this line added at the top:

```
`.portfolio/project.json` already exists. Update it against the current state of
the repository — refresh anything stale, add sections for work done since it was
written, and remove claims the code no longer supports. Keep the existing `slug`.
```

## Checking it landed

From the portfolio repo:

```bash
npm run prepare-data
```

The summary line reports how many pages came from repo manifests and how many
have a rendered README — both counts should go up. Anything still listed under
"Thin pages" has no manifest yet. Warnings naming your repo (a README that did
not fetch, a dropped video URL) print there too.
