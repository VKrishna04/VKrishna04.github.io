## Hook: useGitHubRepos

Location: `src/hooks/useGitHubRepos.js`

Purpose: Lightweight hook that fetches GitHub repositories according to settings and supports static or hybrid project modes.

Return shape
- `repos: array` — Repository list (or static projects when configured).
- `loading: boolean` — Loading state.
- `error: string|null` — Error message if API fetch fails.
- `refetch: function` — Re-run the fetch logic.
- `getSettings: function` — Return the loaded settings object.

Behavior
- Reads `/settings.json` and supports project modes: `static`, `github`, and `hybrid`.
- Uses `cachedFetch` to reduce GitHub API calls and avoid rate limit issues.
- When `static` mode is used, returns `staticProjects` from settings without calling GitHub.
- In `hybrid` mode, attempts a GitHub fetch first and falls back to static projects if the API fails.

Example
```js
import useGitHubRepos from '@/hooks/useGitHubRepos'

const { repos, loading } = useGitHubRepos()
```
