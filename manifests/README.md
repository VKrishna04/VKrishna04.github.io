# Vendored project manifests

A project page is normally owned by the project's own repo, which describes
itself in `.portfolio/project.json` and gets fetched at build time. Some repos
cannot do that: one is archived, another lives in an organisation where pushing
a file is not mine to decide.

Their manifests live here instead, under `<owner>/<repo>.json`, in exactly the
format the repo would use. The build consults this directory **only** when the
repo itself has no manifest — so the day a repo ships its own, it wins, and
deleting the file here hands the page back to it.

Everything in `public/data/projects/` is generated output. This is source.
