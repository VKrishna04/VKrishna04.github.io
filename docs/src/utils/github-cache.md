## GitHub API Cache (`githubCache`)

Location: `src/utils/githubCache.js`

Purpose: An in-browser cache wrapper around GitHub API calls to reduce rate-limiting and improve perceived performance. Exports a small singleton and helper wrappers used by hooks.

Public API
- `cachedFetch(url, options?)` — Enhanced fetch that returns cached data when available. On cache hit it returns a simple object with `ok: true` and a `json()` method that resolves to cached data.
- `clearGitHubCache()` — Clear all cached entries.
- `getGitHubCacheStats()` — Get statistics about memory and localStorage entries.
- `cleanupGitHubCache()` — Remove expired entries from localStorage.

Behavior
- Caches responses in three layers: in-memory Map, localStorage (serialized), and a fallback enhanced data storage (via `dataStorage.js`).
- Uses recommended TTL heuristics: default 30 minutes; longer TTLs when rate-limited.
- On cache miss, performs a `fetch`, stores successful responses in cache, and returns the data.

Notes
- The cache key includes a simple indicator when auth headers are present to avoid mixing authenticated vs unauthenticated responses.
- The cache auto-cleans expired entries on construction and exposes utility methods for manual maintenance.

Example
```js
import { cachedFetch, getGitHubCacheStats } from '@/utils/githubCache'

const response = await cachedFetch('https://api.github.com/users/VKrishna04/repos')
if (response.ok) {
  const repos = await response.json()
}

console.log(getGitHubCacheStats())
```
