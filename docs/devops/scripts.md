````markdown
# Project scripts (scripts/)

This document describes the helper and build-time scripts in the `scripts/` folder, their purpose, and how to run them. These scripts are invoked during development and CI (see `package.json` and `.github/workflows` for automation wiring).

Directory: `scripts/`

Files and purpose

- `build-time-validator.js`
  - Purpose: Internal validation step — maintainer only.

- `generate-cname.js`
  - Purpose: Produce or update the `CNAME` file used by GitHub Pages deployments. Reads configuration and writes `CNAME` at repo root.
  - How to run: `node scripts/generate-cname.js`

- `generate-hashes.js`
  - Purpose: Internal validation step — maintainer only.

- `generate-manifest.js`
  - Purpose: Create `manifest.json` listing versioned assets for the site, used by deployment or offline caching.
  - How to run (automated): invoked as part of `npm run build`; can be run manually:

```powershell
node scripts/generate-manifest.js
```

- `inject-seo.js`
  - Purpose: Post-process built HTML files to inject SEO meta tags, sitemap links, or canonical tags before publishing.
  - How to run: `node scripts/inject-seo.js ./dist` (accepts the build output dir)

- `pre-build-validation.js`
  - Purpose: Lightweight checks executed before the Vite build starts. These checks are fast and designed to fail early if required config or files are missing.
  - How to run: `node scripts/pre-build-validation.js`

- `protection-hashes.json`
  - Purpose: Internal validation step — maintainer only.

- `protection-system-demo.js`
  - Purpose: Internal validation step — maintainer only.

- `register-cflair-projects.js`
  - Purpose: Build-time registration of GitHub projects into the external CFlair-Counter service. Reads `public/settings.json`, fetches GitHub repos, filters them, and registers each project via CFlair API.
  - How it runs in CI: The `build` script appends this script after the Vite build step for automated registration.
  - Manual run: `node scripts/register-cflair-projects.js`

- `setup-dev-env.js`
  - Purpose: Assist contributors by creating local development files, copying example environment files, and printing helpful setup instructions.
  - How to run: `node scripts/setup-dev-env.js`

- `test-bypass-resistance.js`
  - Purpose: Internal validation step — maintainer only.

- `test-settings-guard.js`
  - Purpose: Internal validation step — maintainer only.

- `validate-build-integrity.js`
  - Purpose: Internal validation step — maintainer only.

- `validate-json.js`
  - Purpose: Run JSON validation across the repository for config files (including `public/settings.json`, `settings.schema.json`, etc.).
  - How to run: `node scripts/validate-json.js`

Examples (Common commands)

```powershell
# Run pre-build checks (as used in CI)
node scripts/pre-build-validation.js; node scripts/build-time-validator.js

# Full build sequence (package.json wiring)
npm run build

# Manually run registration script
node scripts/register-cflair-projects.js
```

Notes
- Most scripts assume Node.js >= 18 and access to GitHub API tokens/secrets when fetching repos (see `.github/workflows` for how secrets are passed).
- If you add new scripts, register them in `package.json` scripts or in the CI workflow so they're run as intended.

If you want a separate per-script page (for very long scripts), I can split these into individual docs files under `docs/devops/scripts/`.

````
