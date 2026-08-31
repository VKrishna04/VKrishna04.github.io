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
- The live re-fetch takes **only** `summary`, `highlights`, `metrics` and
  `sections`. A manifest can never change the page's slug or its links — a stale
  or hijacked manifest cannot redirect the page.
- Every string field is length-capped by the schema.

## Authoring a manifest

Schema: <https://vkrishna04.me/schemas/project-manifest.schema.json>

Minimum viable file:

```json
{
	"$schema": "https://vkrishna04.me/schemas/project-manifest.schema.json",
	"manifestVersion": 1,
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
