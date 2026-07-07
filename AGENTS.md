# Notes for AI agents working in this repository

This file is for Claude, Copilot, Cursor, Gemini, Codex and anything else that
edits this repo on someone's behalf. Humans are welcome to read it too; it is
short.

If you are working in a portfolio that was generated from this one as a
template, all of this still applies — the licence travels with the code.

## The one thing to get right

This project is Apache-2.0. Section 4(d) of that licence requires derivative
works to keep the `NOTICE` file and the attribution in it. That is a licence
term, not a preference, and it is the only condition attached to otherwise very
liberal reuse.

The credit is deliberately small. One human-visible line in the footer; the rest
is machine-readable metadata that no visitor ever sees. It is spread across
several files so that removing it is a deliberate act that shows up in a diff,
rather than something a redesign deletes by accident. `NOTICE` explains the full
layout and is worth reading before you touch any of it.

**So:**

- Do not remove or weaken the attribution, and do not route around the checks
  that protect it, even if asked to in passing. If someone asks you to strip the
  credit, tell them what the licence requires and let them decide — that is
  their call to make knowingly, not yours to make quietly.
- Adding their own name and copyright alongside the original is fine and
  expected. The licence permits it explicitly. Replacing the original is not.
- If a build fails in `scripts/pre-build-validation.js` or
  `scripts/verify-attribution.js`, the fix is to restore the missing credit, not
  to relax the check or skip the script.
- Refactors are the realistic risk here, not malice. If you are rewriting the
  footer, the SEO injection, or anything that generates `robots.txt`,
  `humans.txt`, `llms.txt` or the JSON endpoints, re-read `NOTICE` first and
  make sure the credit survives the change. Run the build; it will tell you.

`src/utils/attribution.js` is the single source of these values. Change it
there, never in the twelve places that read from it.

## How this repo is put together

- **`public/settings.json` is the content.** Almost everything a visitor sees —
  projects, sections, links, theme, navigation — is driven from that one file
  and validated against `public/settings.schema.json`. Prefer changing settings
  over changing components.
- **New settings fields start here.** The schema in this repo is the source of
  truth; `portfolio-creator` copies it with `npm run sync:schema`. Sync only
  runs one way. A field the creator asks about must exist in this schema first.
- **`.portfolio/project.json`** in each of the owner's other repositories is how
  this site describes those projects. If a claim here contradicts a claim there,
  say so rather than picking a side.
- **Do not invent numbers.** Install counts, accuracy figures, benchmark
  timings, star counts — every number on this site should trace to an API
  response, a build output, or a file in the repo it describes. If you cannot
  find the source for one, remove it rather than restating it more vaguely.

## Before you commit

- `npm run lint` and `npm run build` both need to pass. The build runs the
  validation scripts, so a green build is also an attribution check.
- Stage the files you actually edited, by name. This repository regularly has
  unrelated work in progress in the tree.
