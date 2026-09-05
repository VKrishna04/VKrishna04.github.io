# How updates reach your portfolio

You made this portfolio with GitHub's **Use this template** button. That gives you
a repository that is entirely yours — not a fork, no "forked from" banner, and no
shared history with the original. Which is the point, and also the catch: because
there is no shared history, `git merge upstream/main` has nothing to merge and
will refuse to run. The usual way of pulling in upstream changes simply does not
apply here.

So updates arrive a different way: a workflow copies the code across and opens a
pull request. You read the diff and merge it, or you close it. Nothing lands on
`main` without you.

## Turn one setting on first

This is the only setup step, and without it nothing below works.

**Settings → Actions → General → Workflow permissions →
check "Allow GitHub Actions to create and approve pull requests" → Save.**

That box is off by default on new repositories. If it stays
off, the sync runs, copies everything correctly, and then fails on the last step
with *"GitHub Actions is not permitted to create or approve pull requests"* — so
the update exists and you never hear about it. Thirty seconds now saves a
confusing failure later.

## What happens after that

`.github/workflows/upstream-sync.yml` runs every Monday at 04:00 UTC. When
upstream has changed, it opens (or updates) one pull request on a branch called
`chore/upstream-sync`.

You can also run it yourself any time: **Actions → Sync from upstream → Run
workflow**. Worth knowing, because GitHub switches scheduled workflows off in a
repository after 60 days of no activity. If the weekly PR stops appearing, that
is usually why — re-enable it on the Actions tab, or just use the manual run.

## What it touches, and what it will not

Copied from upstream, replaced wholesale:

| | |
|---|---|
| `src/` | every component, page, hook and utility |
| `scripts/` | the build and validation scripts |
| `public/schemas/` | the settings schema this repo validates against |
| build config | `package.json`, `package-lock.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `index.html` |
| `NOTICE`, `LICENSE.md` | the Apache-2.0 attribution — see below |

Never touched, and each for its own reason:

| | |
|---|---|
| `public/settings.json` | your content. The entire site is this one file |
| `public/images/`, `public/assets/` | your pictures |
| `public/resume.*` | yours |
| `CNAME` | your domain |
| `README.md` | your project, described your way |
| `.portfolio/` | how other sites describe this repo |
| `.github/workflows/` | see the note further down |

The short version: **the code is upstream's, the content is yours.** A sync PR
should never show your own writing in the diff. If it ever does, that is a bug —
close the PR and open an issue.

## Reading the pull request

The PR body tells you whether the site still builds with the new code. That check
runs inside the sync job, before the PR is opened, because GitHub does not run
your normal CI on a PR that a workflow opened — so if the build were not checked
here it would not be checked anywhere until after you merged.

**If it says the build failed**, the usual cause is that upstream added a setting
that your `settings.json` does not have yet. The validator names the missing
field in the workflow log. Add it to your `settings.json` on the sync branch, and
the PR goes green.

That is deliberate. Finding out in a pull request is the whole reason this is a
pull request and not a direct push to `main`.

## Workflow files are the one manual bit

`.github/workflows/` is excluded from the copy list, and not by preference. The
token a workflow runs with is not permitted to write workflow files, so a sync
that included them would do all the work and then fail at the push.

If a release note ever says a workflow changed, copy that file across by hand
from [the upstream repository](https://github.com/VKrishna04/VKrishna04.github.io/tree/main/.github/workflows).
It does not come up often.

## About the attribution

`NOTICE` and `LICENSE.md` are in the copy list on purpose. This project is
Apache-2.0, and section 4(d) of that licence asks derivative works to keep the
`NOTICE` file and the credit in it. Keeping those current is the point of
including them, not an oversight.

The credit is deliberately small — one line in the footer, and some metadata no
visitor ever sees. Adding your own name and copyright alongside it is expected
and explicitly permitted. `NOTICE` explains the rest, and `AGENTS.md` says the
same thing to any AI tool you point at this repository.

## If you would rather not have any of this

Delete `.github/workflows/upstream-sync.yml`. Nothing else depends on it, and the
portfolio builds and deploys exactly the same without it. You would then be
picking up upstream changes by hand, which is a perfectly reasonable choice for a
site you have customised heavily.
