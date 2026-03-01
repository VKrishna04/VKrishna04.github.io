## Icon System Core

Location: `src/utils/iconSystemCore.js`

A small, focused dynamic icon loader used across the site. It centralizes runtime logic for discovering which icon library an icon name belongs to (react-icons packages such as `fa`, `md`, `hi`, `hi2`, etc), performs dynamic imports, caches results, and provides utility helpers used by the `UnifiedIcon` React wrapper.

### Contract (inputs / outputs / guarantees)

- Inputs: a canonical icon name string such as `FaReact`, `MdHome`, `HiBars3`.
- Outputs: a React component (the icon) when available, or `null` when not found.
- Guarantees: results are cached in-memory during the page lifetime. The loader attempts a deterministic prefix detection and falls back to an exact-name fallback in ambiguous cases (notably the `Hi` / `Hi2` Heroicons split).

### Main exports / API

- `getUnifiedIcon(name: string): Promise<React.Component|null>`
  - Dynamically imports and returns the icon component OR `null` if not found.

- `getIconWithFallback(name: string): Promise<React.Component|null>`
  - A wrapper used by the React component that performs deterministic lookups and the `Hi` → `Hi2` exact-name fallback.

- `getCachedIcon(name: string): React.Component|null`
  - Synchronous cache check. Returns the cached component if previously loaded.

- `preloadIcons(names: string[]): Promise<void>`
  - Preloads multiple icons in parallel and caches them.

- `iconExists(name: string): Promise<boolean>`
  - Returns whether the loader can find the named icon (uses the same detection rules).

- `getAvailableLibraries(): string[]`
  - Returns the set of registered library prefixes.

### Internal details

- `ICON_LIBRARY_REGISTRY`
  - A map of prefix → package path used to form dynamic import targets (e.g., `Fa` → `react-icons/fa`). The loader prefers longer prefixes first to avoid mismatches.

- `iconCache` (Map)
  - In-memory cache from icon name → React component. If an icon lookup fails, the loader may store `null` for the name to avoid repeated tries.

- `loadingPromises` (Map)
  - Tracks in-flight dynamic imports so concurrent requests for the same icon share a single promise.

- Ambiguity handling
  - Heroicons were historically split between `hi` (v1) and `hi2` (v2). The loader uses prefix detection first and then an exact-name fallback when the `Hi` prefix is ambiguous: if `HiX` is requested and not found in `hi`, it will check `hi2` for an exact name match before deciding it's missing.

### Usage examples

- In components that only need an icon at render time, prefer `UnifiedIcon` (the React wrapper) which uses the cache and renders a fallback while loading.

- For preloading icons (for above-the-fold UI) run:

```js
import { preloadIcons } from '@/utils/iconSystemCore.js';

preloadIcons(['FaReact', 'HiBars3', 'MdHome']);
```

- To synchronously check cache before requesting an async load:

```js
import { getCachedIcon, getIconWithFallback } from '@/utils/iconSystemCore.js';

const cached = getCachedIcon('FaReact');
if (cached) {
  // use cached directly
} else {
  const icon = await getIconWithFallback('FaReact');
}
```

### Edge cases & recommendations

- SSR / static rendering: dynamic imports are inherently runtime operations. If you render server-side, prefer static imports for icons used during SSR or ensure the server environment supports dynamic imports and bundling semantics expected by Vite.

- Performance: the loader caches components; `preloadIcons` for critical icons reduces visual layout shifts. Avoid preloading very large lists.

- Error handling: callers should treat `null` as "not found" and show an appropriate fallback. The React wrapper `UnifiedIcon` already does this.

- Concurrency: `loadingPromises` deduplicates concurrent loads to the same icon name.

- Naming/Prefix changes: If you add or change `ICON_LIBRARY_REGISTRY` to include a new prefix, keep the longest-prefix-first rule to avoid misclassification (e.g., `Si` vs `SiSomeLongPrefix`).

### Where used

- `src/components/UnifiedIcon.jsx` (primary consumer)
- Navbar, Footer and many UI components that render icons by name.

### Next steps for authors

- If you add new icon library mappings, update `ICON_LIBRARY_REGISTRY` and add tests that verify detection for a small set of icons from the new package.

- Consider adding a small timeout to dynamic imports if you observe slow remotes or bundler anomalies; keep `loadingPromises` to avoid races.

---

This doc is a concise reference for maintainers. For examples of use in the app, see `src/components/UnifiedIcon.jsx` and the places that call it (Navbar, pages, Feature cards).
