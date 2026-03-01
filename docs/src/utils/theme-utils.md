## Theme Utilities

Location: `src/utils/themeUtils.js`

Purpose: Small collection of helpers that convert site settings (Tailwind-like classes, color strings, gradient objects) into usable CSS values and inline style objects for React components.

Contract
- Inputs: strings or small objects from `settings.json` (colors, gradients, button configs)
- Outputs: CSS color strings, rgba values, gradient strings, or inline style objects

Primary exports
- `parseColor(value: string): string|null` — Accepts a CSS color or Tailwind-like token (e.g., `text-purple-500`, `purple-500/30`) and returns a CSS color value (hex, rgba, var(), etc.) or null.
- `getButtonStyles(button: object, isHover = false): object` — Returns an inline style object for button configs (primary/outline), resolving gradients, text color and optional shadow.
- `getSocialLinkStyles(platform: object, isHover = false): object` — Returns color styles for social icons/links.
- `applyOpacity(color: string, opacity: number): string|null` — Apply opacity to a hex or rgb color, returns rgba.
- `getGradient(gradient: string|object): string|null` — Normalize gradient configuration into a CSS gradient string.

Notes & behavior
- `parseColor` first accepts direct CSS values (hex, rgb/rgba, hsl, var()), then tries to interpret Tailwind-like tokens using a built-in small color map. If a token contains an opacity like `purple-500/30` it converts the hex to rgba with the requested opacity percent.
- The color map is intentionally small and focused on commonly used colors in the site. Modify or extend where you require more shades.
- `getButtonStyles` supports `type: "primary"` and `type: "outline"`. It will return gradient backgrounds, text colors, and box shadows when configured.

Recommendations and edge-cases
- Keep settings values simple; complex CSS expressions are returned as-is by `parseColor`.
- When using gradients or shadows from settings, validate the values in a UI preview — invalid values will be forwarded to the browser which may ignore them.
- These helpers run fully in the browser and are safe for client rendering. For SSR, ensure the same setting inputs are available server-side if you need identical rendering.

Example
```js
import { parseColor, getButtonStyles } from '@/utils/themeUtils'

const style = getButtonStyles({ type: 'primary', gradient: 'linear-gradient(to right, #a855f7, #ec4899)', textColor: 'white' })

// apply to a React element
<button style={style}>Click</button>
```

--

Where used
- Home page, About page, Navbar, Project cards, and other UI components that read `settings.json`.
