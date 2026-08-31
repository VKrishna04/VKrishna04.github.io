# The prompt

Run this inside **any project repository** that should get a rich page on
vkrishna04.me. It is self-contained — it does not assume the agent has seen the
portfolio repo.

---

```
Create `.portfolio/project.json` in this repository.

This file is consumed at build time by my portfolio at https://vkrishna04.me,
which renders it as https://vkrishna04.me/projects/<repo-name-lowercased>. The
page is server-prerendered for SEO, so the text you write here is what search
engines and recruiters read. The portfolio re-fetches this file live, so any push
to this repo updates the page without redeploying the portfolio.

The authoritative schema is:
https://vkrishna04.me/schemas/project-manifest.schema.json
Fetch it and follow it exactly. `additionalProperties` is false everywhere — an
unknown key is a bug, not an extension point.

Before writing anything, READ this repository and ground every claim in it:
- README, docs/, and any architecture notes
- package.json / pyproject.toml / Cargo.toml / go.mod for the real dependency list
- the source tree, to describe what it actually does rather than what the README
  aspires to
- CI config, tests, and release/tag history for status and maturity
- git log for the real start date

Then write the manifest with these rules:

1. Every field is optional. Omit anything you cannot ground in the repo — the
   portfolio falls back to its own settings for anything missing. Do NOT invent
   metrics, download counts, user numbers, benchmarks, or dates. If a number is
   not verifiable from this repo or a linked public source, leave it out.
2. `summary` is the page's meta description. Two or three sentences, max 400
   chars, leading with what the project DOES. No "passion project", no "leveraging
   cutting-edge".
3. `highlights` are concrete outcomes: what it solves, what is technically
   non-obvious, what it measurably achieves. 3–6 bullets. Delete any bullet that
   would be true of every project.
4. `sections` is the body of the page, in order. Aim for 3–5 sections that a
   reader could not get from the README's first paragraph. Good ones:
   - `prose` — the problem, and why the obvious approach did not work
   - `list` — architecture decisions, or features with substance behind them
   - `code` — one short, genuinely illustrative snippet (the API, not boilerplate)
   - `table` — a comparison, a benchmark you actually ran, or a config reference
   - `media` — a screenshot or diagram that exists in the repo
   Section types outside {prose, list, code, table, media} are dropped at build
   time, so do not invent new ones.
5. Image URLs must be ABSOLUTE. For images in this repo use
   https://raw.githubusercontent.com/<owner>/<repo>/HEAD/<path>. Relative paths do
   not resolve — the page is served from vkrishna04.me, not from this repo.
   Verify each image path exists before referencing it.
6. Only http(s) links. Fill `links.repo` with this repository's URL, and
   `links.live` / `links.demo` / `links.docs` / `links.paper` / `links.package`
   only where a real, reachable URL exists.
7. `status` must be one of: active, maintained, archived, experimental, complete.
   Pick it from the actual commit and release history, not optimism.
8. Do NOT set `slug` unless the repo name genuinely makes a bad URL. The default
   is the repo name lowercased, and changing a slug after the page is indexed
   throws away its search ranking.
9. Set `"manifestVersion": 1` and the `$schema` key.
10. Write plain text. Markdown is not parsed — a `**bold**` will render as
    literal asterisks.

Finally:
- Validate the file parses as JSON and conforms to the schema.
- Print the file and a one-line note for each claim you could not ground, so I
  can supply the missing facts myself.
```

---

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

The output line reads `N from repo manifests` — that count should go up by one.
Anything still listed under "Thin pages" has no manifest yet.
