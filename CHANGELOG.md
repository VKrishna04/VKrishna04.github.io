# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased] - 2025-01-XX

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

---

## File Summary

| File                             | Type      | Changes                                    |
| -------------------------------- | --------- | ------------------------------------------ |
| `public/settings.json`           | Config    | +12 lines (tagStyles, showSocialImage)     |
| `public/settings.schema.json`    | Schema    | +80 lines (tagStyles, socialImage schemas) |
| `src/components/ProjectCard.jsx` | Component | +80 lines (icons, images, tag styling)     |
| `src/pages/Projects.jsx`         | Page      | +4 lines (pass new props)                  |
| `src/index.css`                  | Styles    | Updated grid layout (row-wise flow)        |
| `src/index.css`                  | Styles    | Masonry rewrite (CSS Grid)                 |
| `docs/devops/scripts.md`         | Docs      | Redacted internal details                  |
| `docs/ui/*.md`                   | Docs      | 6 new documentation files                  |

---

## Commit Message Suggestion

```
feat: add project card styling system and masonry layout

- Add global/per-project accent colors and button styles
- Implement CSS Grid masonry for Projects page
- Add comprehensive UI documentation
- Fix settings.schema.json structure
```
