# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Releases are tagged `vX.Y.Z` from `main`. Tagging starts at **1.8.0** — earlier
versions were never tagged, and the entries below 1.8.0 are reconstructed from
the notes that were kept at the time rather than from a release process.

---

## [1.8.0] - 2026-09-01

### ✨ Features

#### Offline support

The site now works with the network gone, including across a reload — no
browser error page. A service worker is generated at build time by
`scripts/generate-sw.js`, which runs after prerendering so every route's real
HTML is on disk to be stored.

- **Every route is precached**, not just the shell: `/`, `/about`, `/projects`,
  `/resume`, `/stats`, `/contact` and every project page. A route nobody has
  visited still opens offline.
- **Navigations are network-first** and fall back to the stored page for that
  URL, then to the shell. `/projects` was written as `/projects/index.html`, so
  the fallback tries both spellings before giving up.
- **Hashed assets are cache-first** — the filename changes when the contents do,
  so the stored copy is always the right one.
- **Same-origin data** (`settings.json`, the project index, images) is
  stale-while-revalidate, which is what lets an offline reload still have data
  to render. Lookups ignore the query string, because the app's own fetches
  carry a `?v=` cache-buster.
- **Cross-origin calls are never intercepted.** The GitHub API and the visitor
  counter are left to fail the way the app already handles.
- The cache name carries the package version and a hash of the built files, so
  a new build throws the old cache away instead of accumulating them.

The web app manifest that was already shipping is no longer inert: with a
service worker present the site is installable.

#### Project pages a repository can own

- A repository can carry `.portfolio/project.json` and get its own page on the
  portfolio, fetched at build time by `scripts/fetch-project-manifests.js`.
- Prize and award totals add themselves up rather than being typed in.

#### Attribution and identity

- Nothing about the site's owner is hardcoded any more. Every name, link and
  image comes from `settings.json`; the only fixed text is the credit the
  licence asks for.
- The credit is spread across the markup, the meta tags, the JSON-LD, the JS
  bundle, `humans.txt`, `NOTICE.txt` and the JSON endpoints, and
  `scripts/verify-attribution.js` fails the build if it has gone missing.
- The footer links out to the [portfolio generator](https://life-experimentalist.github.io/portfolio-creator/).

#### SEO and machine-readable data

- `robots.txt`, `sitemap.xml`, `llms.txt` and the `/api/*.json` endpoints are
  generated from settings, and each is switchable: search engines, AI training
  crawlers and the machine-readable copies are three separate choices.

#### Contact page

- A live availability indicator and an FAQ accordion.

### ♻️ Changed

- **The settings schema is split by section** under
  `public/schemas/settings/`, with the universal parts left in
  `settings.schema.json`. Ajv registers each part under two ids so the root
  compiles either way.
- The upstream protection gate no longer pins a fork to this repository.
- Dependencies refreshed to current minors; ESLint 10 toolchain.

### 🐛 Fixed

- Line endings are normalised before hashing, so CI and Windows agree on the
  integrity hashes.
- Navbar logo examples in the schema use neutral placeholders instead of a
  real account.

### 🔧 Build

- `npm run build` gained `scripts/generate-sw.js`, after `prerender.js`.
- `public/_headers` sends `Cache-Control: no-cache` for `/sw.js` — the worker
  has no hash in its name, so a cached copy would pin the site to an old file
  list.

---

## [1.7.0] - 2026-03-01

### ✨ Features

#### Project Card Enhancements
- **Framework-based icon selection**: Project cards now show framework icons (Flask, React, Vue, etc.) instead of just language icons
  - Priority order: React, Vue, Angular, Svelte, Next.js, Flask, Django, and more
  - Checks technologies first, then topics, then falls back to language
- **Social image support**: Project cards can display GitHub OpenGraph images or custom social previews
  - Configurable via `projects.showSocialImage` (default: true)
  - Per-project override via `socialImage` property in staticProjects
  - Automatic GitHub social preview URL generation
- **Configurable tag styling**: Separate styling for topics and technologies
  - `tagStyles.topics`: backgroundOpacity, textColor, borderOpacity
  - `tagStyles.technologies`: backgroundColor, textColor, borderColor
  - Brighter default colors for better visibility

#### Row-wise Grid Layout
- Projects now flow left-to-right, then top-to-bottom (row-wise)
- Removed column-wise masonry packing for more predictable layout
- Consistent card heights for cleaner visual appearance

#### Project Card Styling System
- **Global accent color support**: Added `projects.accentColor` configuration for consistent accent color across all project cards
- **Global button styles**: Added `projects.buttonStyles` with `codeButton` and `liveButton` gradient configurations
- **Per-project styling overrides**: Each static project can now define custom `styling` object with:
  - `accentColor`: Override the global accent for specific projects
  - `codeButton`/`liveButton`: Custom gradient backgrounds for action buttons

#### Masonry Layout for Projects Page
- Implemented CSS Grid-based masonry layout for the Projects page
- Responsive design: 1 column (mobile) → 2 columns (md) → 3 columns (lg)
- Masonry mode is now the default layout

### 📖 Documentation

#### New UI Documentation
- `docs/ui/background-configuration.md` - Background system configuration guide
- `docs/ui/color-system-guide.md` - Comprehensive color system documentation
- `docs/ui/color-system-quick-reference.md` - Quick reference for color utilities
- `docs/ui/footer.md` - Footer component documentation
- `docs/ui/home.md` - Home page component documentation
- `docs/ui/modular-color-system-implementation.md` - Modular color system implementation details

#### Documentation Cleanup
- Redacted internal validation script details in `docs/devops/scripts.md` (maintainer-only info)

### 🔧 Configuration Changes

#### settings.json
- Added `projects.accentColor: "#7c3aed"` (violet accent)
- Added `projects.buttonStyles`:
  - `codeButton`: Dark slate gradient with slate-300 text
  - `liveButton`: Indigo-to-violet gradient with white text
- Added new certification: "NPTEL - Cloud Computing" (Elite + Silver)

#### settings.schema.json
- Added `$comment` at schema root for documentation
- Added `styling` object schema for staticProjects items
- Added `accentColor` and `buttonStyles` properties to projects section
- Fixed structural issues (removed misplaced `required` arrays, fixed trailing commas)

### 🎨 UI/UX Improvements

#### ProjectCard Component
- Now accepts `accentColor`, `globalButtonStyles`, `tagStyles`, and `showSocialImage` props
- Implements fallback chain: per-project styling → global styling → defaults
- Uses `parseColor` and `applyOpacity` utilities from `themeUtils.js`
- Added `getProjectIcon()` function for framework-based icon selection
- Added `getSocialImageUrl()` function for social preview images
- Dynamic inline styles for:
  - Icon container border and glow
  - Topic badges (accent-tinted backgrounds with configurable colors)
  - Technology badges (independent color configuration)
  - Code/Live buttons (gradient backgrounds, text colors)

#### FeaturedProjects Component
- Passes global styling configuration to ProjectCard children

#### Projects Page
- Integrated row-wise grid layout for predictable left-to-right ordering
- Passes `tagStyles` and `showSocialImage` to ProjectCard instances
- Removed masonry height calculation (now uses natural grid flow)

#### About Page
- Added `mt-20` spacing to skills section for better visual separation

### 🎨 CSS Changes

#### index.css
- Updated Projects page grid to use row-wise flow (`grid-auto-flow: row`)
- Removed `grid-auto-rows: 10px` for natural content height
- Items now flow left-to-right, then top-to-bottom
- Responsive column configuration via `auto-fill` and `minmax()`

---

### 📝 Schema Changes

#### settings.schema.json
- Added `projects.showSocialImage` (boolean) - Enable/disable social preview images
- Added `projects.tagStyles` object with:
  - `topics`: backgroundOpacity, textColor, borderOpacity
  - `technologies`: backgroundColor, textColor, borderColor
- Added `socialImage` property to staticProjects items
