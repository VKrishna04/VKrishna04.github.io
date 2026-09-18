# Vendored project manifests

A project page is normally owned by the project's own repo, which describes
itself in `.portfolio/project.json` and gets fetched at build time. Some repos
cannot do that: one is archived, another lives in an organisation where pushing
a file is not mine to decide.

Their manifests live here instead, under `<owner>/<repo>.json`, in exactly the
format the repo would use. The build consults this directory when the repo has
no manifest of its own, and as a fallback when the repo cannot be read at all,
which is what keeps a private project's page intact while its build token is
broken. A repo the build can read always wins, so once it ships its own
manifest, deleting the file here hands the page back to it.

Everything in `public/data/projects/` is generated output. This is source.
