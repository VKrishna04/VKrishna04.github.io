# Project pages (`/projects/<slug>`)

Every project in `settings.json` gets its own URL on the portfolio. A repo can
take control of what that page says by committing one file — `.portfolio/project.json`.

## How it works

```
settings.json  ──┐
                 ├──► scripts/fetch-project-manifests.js ──► public/data/projects/<slug>.json
repo manifest  ──┘            (build time)                   public/data/projects/index.json
                                                                        │
                                                        vite build ─────┤
                                                                        ▼
                                          scripts/prerender.js ──► dist/projects/<slug>/index.html
                                                                  (real HTML, no JS needed)
                                                                        │
                                                                        ▼
                                          src/pages/ProjectDetail.jsx hydrates, then
                                          re-fetches the repo manifest live
```

Three layers, in priority order:

| Layer | Source | When it runs | What it is for |
|---|---|---|---|
| Base | `settings.json` → `projects.staticProjects` | build | Guarantees a page exists for every project |
| Manifest | `.portfolio/project.json` in the repo | build | The repo owns its own long-form content |
| Live | the same manifest, over `raw.githubusercontent.com` | in the browser | Edits show up without redeploying the portfolio |

A repo's README is fetched during the manifest step, so it is part of the
build-time layer too — it lands in `public/data/projects/<slug>.json` and is in
the prerendered HTML. The live layer can retitle or collapse the README block but
cannot swap the file it renders; that takes a portfolio build.

The build-time layer is what makes the page rank: `scripts/prerender.js` writes
fully rendered HTML per slug, so a crawler with JavaScript disabled still sees the
project name, summary, highlights and body copy. The live layer is what makes it
updateable on the fly — push a manifest change to the project repo and the page
reflects it on the next visitor's load, no portfolio rebuild required. (The
prerendered HTML still shows the last build's copy, so ship a portfolio build when
you want the crawler-visible version refreshed too.)

## Why JSON and not HTML

The obvious alternative — each repo hosting its own HTML page that the portfolio
pulls in — was rejected:

- Injecting foreign HTML into the portfolio is an XSS hole. `.portfolio/project.json`
  is data; the portfolio decides how it renders.
- Repo-authored HTML would not match the site's design, and would break every time
  the portfolio's styling changed.
- A JSON manifest is diffable, schema-validated, and can be written by a script or
  an agent without touching markup.

## Safety rules the portfolio enforces

These are enforced in code, not by convention, so a bad manifest degrades instead
of breaking:

- A missing manifest (404) is normal — the settings-derived page still renders.
- A network failure at build time keeps the last good committed manifest rather
  than regressing a rich page to a stub.
- Unknown `sections[].type` values are dropped at build time; the renderer also
  returns nothing for a type it does not know.
- Only `http(s)` URLs render. Any other scheme is dropped.
- The live re-fetch takes **only** `summary`, `highlights`, `metrics`,
  `sections`, `icon`, `appearance` and `media`, and only when the manifest still
  has at least one section. A manifest can never change the page's slug or its
  links — a stale or hijacked manifest cannot redirect the page. It cannot swap
  the rendered README either: that body is build-time only.
- `appearance` is a closed vocabulary. A theme, background or accent outside it
  is discarded and the portfolio's own styling applies, so a manifest can pick a
  look but cannot inject arbitrary CSS.
- A README is rendered without raw HTML — no `rehype-raw` — and `script`,
  `style`, `iframe`, `object`, `embed` and `form` are dropped on top of that.
  Every URL inside it is resolved and then discarded unless it is `http(s)`.
- Only youtube.com, youtu.be and vimeo.com are embedded, and only after the
  video ID matches its expected shape. Everything else must be a direct
  `.mp4`/`.webm`/`.ogg` file over https or it is dropped.
- `icon` must match a react-icons export name; the build-time icon map resolves
  it against the real library and skips anything that is not a real export.
- Every string field is length-capped by the schema.

## Authoring a manifest

Schema: <https://vkrishna04.me/schemas/project-manifest.schema.json>

Minimum viable file:

```json
{
	"$schema": "https://vkrishna04.me/schemas/project-manifest.schema.json",
	"manifestVersion": 2,
	"tagline": "Offline-first spell-check sync for VS Code",
	"summary": "cSpell Sync keeps custom dictionaries in step across machines without a server, using the editor's own settings sync channel.",
	"highlights": [
		"2,100+ installs on the VS Code Marketplace",
		"Zero-config: detects and merges existing cspell.json files"
	]
}
```

Everything is optional. Anything omitted falls back to the `settings.json` entry.

Section types: `prose` (`body`), `list` (`items`), `code` (`body`), `table`
(`columns` + `rows`), `media` (`url`, `alt`, `caption`). Each also takes an
optional `heading`.

Image URLs must be absolute — the page is served from `vkrishna04.me`, so a
relative repo path does not resolve. Use
`https://raw.githubusercontent.com/<owner>/<repo>/HEAD/<path>` for images that live
in the repo.

`docs/project-manifest-prompt.md` is a single self-contained prompt that writes a
schema-valid manifest for any repo it is run in. That is the intended way to
author one.

### The rendered README

`"readme": true` renders the repo's `README.md` below the page body. The object
form takes `path` (any `.md`/`.markdown` file inside the repo — no leading slash,
no `..`), `heading` (default "From the README"), and `collapsed` to put it behind
a toggle. The file is fetched at build time and capped at 100 KB, with a link to
the rest on GitHub when it is truncated. Repo-relative images inside it resolve
against `raw.githubusercontent.com` and repo-relative links against the GitHub
blob view, so a README does not need editing to render correctly here.

Leave it off when the README only repeats `summary` and `highlights` — a page
that says the same thing twice reads worse than a short one.

### Screenshots and video

`media.screenshots` is a list of `{url, alt, caption}`. `media.layout` chooses
how they render: `auto` (a carousel once there is more than one, a single figure
otherwise), `carousel` (arrows, dots, arrow-key navigation, live region for
screen readers), `grid` (two columns), or `stack`.

`media.video` is one demo video shown above the screenshots. YouTube and Vimeo
URLs become privacy-mode embeds; any other https URL must be a direct
`.mp4`/`.webm`/`.ogg` file and gets a native player, where `poster` applies.

### Choosing a look

`appearance` lets a repo style its own page: `theme` (`default`, `aurora`,
`ember`, `ocean`, `forest`, `mono`, `midnight`), `background` (`default`,
`plain`, `grid`, `dots`, `glow`) and `accent` (`#rrggbb`). Omitting it — which is
the right default for almost every project — leaves the page under the
portfolio's control, and `"default"` is stripped rather than stored so the
fallback stays live. An `accent` replaces the heading gradient outright.

## Adding a new project

1. Add it to `projects.staticProjects` in `public/settings.json` with a `githubUrl`.
2. Run `npm run prepare-data` — the slug, page data, and sitemap entry are generated.
3. Optionally commit `.portfolio/project.json` in the project repo for real depth.

The build prints which pages are thin (`depth < 6`) so it is obvious which repos
still need a manifest.

## Choosing a slug

The slug defaults to the repository name, lowercased, with `_`, `.` and spaces
turned into `-`. camelCase is deliberately **not** split, so `EquiLens` becomes
`equilens` — the thing a person would type. Override it with `"slug"` in the
manifest if you must, but only before the page is indexed: changing a slug later
throws away its search ranking.
