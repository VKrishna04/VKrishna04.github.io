## Hook: useProjectsData

Location: `src/hooks/useProjectsData.js`

Purpose: Central hook that fetches GitHub repositories, augments them with languages and CFlair-Counter view counts, and exposes settings and helper functions for project pages.

Return shape
- `repos: array` — Filtered and transformed repository objects ready for UI components (includes `languages`, `statsUrls`, `counterValue` where available).
- `loading: boolean` — True while data is being fetched.
- `error: string|null` — Error message when fetch fails.
- `settings: object` — Loaded `settings.json` or fallback settings.
- `counterData: object` — Raw CFlair-Counter data collected by the hook (may be empty).
- `counterLoading: boolean` — True when counter-specific requests are ongoing.
- `refetch: function` — Re-run fetching logic.
- `getCounterValue(repoName)` — Small helper to read counter data for a repository.

Behavior & implementation notes
- Reads `/settings.json` for configuration (GitHub API URL, project filters, counter API settings).
- Uses `cachedFetch` (from `githubCache.js`) to avoid repeated GitHub API requests.
- Fetches language stats per repository and attempts to fetch per-project counter values from CFlair-Counter when enabled.
- Applies filtering (ignore list, forks/private visibility, maxProjects) and sorting configured in `settings.json`.
- Handles fallback modes: if GitHub API fails and fallback settings are present, it will populate an empty or static list.

Performance considerations
- Per-repo language requests are done in parallel but may still incur many API calls; rely on `cachedFetch` and `githubCache` to limit the impact.
- Counter fetches are done per-project to match the CFlair-Counter API semantics.

Example
```js
import useProjectsData from '@/hooks/useProjectsData'

const { repos, loading, error } = useProjectsData()
```
