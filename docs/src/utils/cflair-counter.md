## CFlair-Counter utilities

Location: `src/utils/cflairCounter.js`

Purpose: Lightweight helper functions to interact with a CFlair-Counter service used to track project view counts and provide badge URLs.

Public API
- `trackProjectView(projectName, baseUrl?)` — POST to increment a project's view counter. Returns response data or null on error.
- `getProjectStats(projectName, baseUrl?)` — GET current stats for a project. Returns stats object or null.
- `getProjectBadgeUrl(projectName, options?, baseUrl?)` — Build a badge SVG URL for embedding.
- `trackPortfolioView(baseUrl?)` — Convenience to track a single `vkrishna04-portfolio` project view.
- `batchTrackViews(projectNames[], baseUrl?, delayMs?)` — Sequentially POST views for multiple projects with a configurable delay.
- `isCFlairCounterAvailable(baseUrl?)` — Health check for the service.

Behavior and recommendations
- Functions gracefully handle network errors and return `null` when the service is unreachable.
- `batchTrackViews` includes a small delay between requests to avoid rate limiting.
- Use `getProjectBadgeUrl` to embed dynamic SVG badges in markdown or project pages.

Example
```js
import { trackProjectView, getProjectBadgeUrl } from '@/utils/cflairCounter'

// Track a view
await trackProjectView('my-cool-project')

// Get badge URL
const badge = getProjectBadgeUrl('my-cool-project', { color: 'blue', label: 'views' })
```

Notes
- The code calls an external service. If you host your own instance, pass `baseUrl` to use a custom domain.
- The module logs warnings on failures but does not throw for ordinary network errors. Callers should treat `null` as "unavailable" and show a fallback UI.

Security / Privacy
- No personal data is sent by these utilities beyond simple project identifiers. Badge URLs are public resources.

Internal integrity checks
- The project includes developer-only integrity checks (scripts and utilities under `scripts/` and `src/utils/*guard.js`) that validate attribution and protection metadata at build time.
- These integrity utilities are intentionally not documented here beyond this short notice. They exist to help preserve attribution and protect build integrity. Treat them as internal; do not publish implementation details.
