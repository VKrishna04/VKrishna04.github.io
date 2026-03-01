````markdown
# src/ — Application source overview

This section documents the application's source code layout (`src/`) and provides quick references to major folders: `components/`, `utils/`, `hooks/`, and `pages/`.

Use the per-folder overview pages for quick file descriptions and important notes.

- Components: `docs/src/components.md`
- Utils: `docs/src/utils.md`
- Hooks: `docs/src/hooks.md`
- Pages: `docs/src/pages.md`

Mermaid overview:

```mermaid
flowchart LR
  App[src/main.jsx] --> Components[src/components]
  App --> Pages[src/pages]
  Components --> Utils[src/utils]
  Pages --> Hooks[src/hooks]
```

If you'd like fully-generated per-file docs (one file per source file) I can produce them in a follow-up pass.

````
