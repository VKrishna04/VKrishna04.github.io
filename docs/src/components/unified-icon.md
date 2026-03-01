## UnifiedIcon React Component

Location: `src/components/UnifiedIcon.jsx`

A thin React wrapper around the icon system core loader. It provides a stable component API for rendering icons by name, handling loading state, caching, and fallback rendering.

### Props (contract)

- `name` (string) - Required. The canonical icon name like `FaReact`, `MdHome`, `HiBars3`.
- `className` (string) - Optional. Tailwind/CSS classes passed to the icon component.
- `size` (number|string) - Optional. Size prop forwarded to the icon.
- `color` (string) - Optional. Color forwarded to the icon.
- `style` (object) - Optional. Inline styles.
- `fallback` (ReactNode) - Optional. Element shown while loading or if icon missing. Defaults to an empty square of w-6 h-6.
- `showError` (boolean) - Optional. When true, renders a small error indicator if the icon is not found.
- Other props are forwarded directly to the underlying icon component.

### Behavior

- Synchronous cache lookup via `getCachedIcon` is attempted first to avoid flashing a fallback if the icon is already loaded.
- Asynchronous load uses `getIconWithFallback` which performs deterministic prefix detection and a `Hi`→`Hi2` exact name fallback for the Heroicons split.
- While loading, `fallback` is returned (so keep it light).
- If the icon cannot be found, the `fallback` is used and an optional error indicator is available when `showError` is set.

### Examples

Basic usage:

```jsx
import { UnifiedIcon } from '@/components/UnifiedIcon';

<UnifiedIcon name="FaReact" className="w-6 h-6 text-cyan-500" />
```

Custom fallback:

```jsx
<UnifiedIcon name="SiJavascript" fallback={<span>...</span>} />
```

Show an error indicator when icon missing:

```jsx
<UnifiedIcon name="UnknownIcon" showError />
```

Programmatic preload + render:

```jsx
// preload ahead of time
await preloadIcons(['HiBars3']);
// then the regular usage will hit cache synchronously
<UnifiedIcon name="HiBars3" />
```

### Notes & maintenance

- Keep the fallback element minimal to avoid layout shift.
- Avoid constructing huge lists of icons within a single synchronous render path that will cause many dynamic imports at once.
- The component logs a warning to console when an icon is not found.

### Where used

- Navbar (mobile menu icon toggles)
- Project cards and feature lists
- Footer and other small UI pieces

---

See `docs/src/utils/icon-system-core.md` for details on the loader's API and behavior.
