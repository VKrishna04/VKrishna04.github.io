````markdown
# src/utils — overview

Utilities used across the app. Short descriptions and key exported functions.

- `advanced-obfuscation.js` — Build-time obfuscation helpers.
- `build-time-protection.js` — Internal protection utilities (internal/dev only).
- `consolidatedIcons.js` — LEGACY exports for icons (kept for compatibility).
- `favicon.js` / `faviconEnhanced.js` — Helpers for favicon generation and metadata.
- `githubCache.js` — Local caching layer for GitHub API responses.
- `integrity-guard.js` — (INTERNAL) integrity checks and runtime guard (developer-only).
- `origin-tracker.js` — Analytics/origin tracking helpers.
- `reactIcons.js` — LEGACY re-exports for react-icons (kept for compatibility).
- `resume.js` — Utilities for rendering/resolving resume data.
- `settings-guard.js` — Validation and enforcement for `settings.json` at runtime.
- `stealth-validator.js` — (INTERNAL) stealth checks for build-time validation.
- `faviconEnhanced.js` — enhanced favicon helpers used by `FaviconManager`.

If you want full API docs for each util (exports, params, return types), I can auto-generate them from source files.

````
