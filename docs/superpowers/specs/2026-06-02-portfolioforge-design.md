# PortfolioForge — Design Specification
**Version:** 1.0  
**Date:** 2026-06-02  
**Repo:** `Life-Experimentalist/PortfolioForge`  
**Status:** Spec — implement separately after portfolio integration work

---

## 1. What Is PortfolioForge?

PortfolioForge is a web-based setup wizard that lets anyone fork `VKrishna04/VKrishna04.github.io`, configure it through a guided form UI, and have a fully deployed personal portfolio in under 10 minutes — without touching code.

**Tagline:** *"Fork. Configure. Ship. Your portfolio, your data."*

**Goals:**
- Zero-code portfolio setup for non-developers
- Schema-driven UI: any new `settings.json` field is automatically reflected in the form
- Secrets stay in GitHub — no API keys ever touch PortfolioForge's servers
- When the template (VKrishna04.github.io) gets updates, forks sync automatically via GitHub Actions
- Become the most-starred "portfolio starter" on GitHub

---

## 2. Architecture

```
PortfolioForge (static SPA, Cloudflare Pages)
├── GitHub OAuth App (for repo access)
├── Schema fetcher (jsdelivr CDN with 3 fallbacks)
├── Dynamic form generator (reads settings.schema.json)
├── GitHub API client (create fork, write files, set secrets)
└── GitHub Actions generator (injects workflows into user's fork)
```

**Hosted at:** Cloudflare Pages, subdomain TBD (e.g., `forge.vkrishna04.me` or standalone domain)

**Tech stack:** React 19 + Vite + Tailwind CSS + Framer Motion + Octokit.js (GitHub API)

**No backend needed.** All GitHub API calls are made client-side using the user's OAuth token. PortfolioForge itself is a pure static site.

---

## 3. Settings Schema CDN Fallbacks

The settings schema is fetched from these URLs in order (first success wins):

```js
const SCHEMA_URLS = [
  "https://vkrishna04.me/settings.schema.json",
  "https://cdn.jsdelivr.net/gh/VKrishna04/VKrishna04.github.io@main/public/settings.schema.json",
  "https://raw.githubusercontent.com/VKrishna04/VKrishna04.github.io/main/public/settings.schema.json",
  "https://cdn.statically.io/gh/VKrishna04/VKrishna04.github.io/main/public/settings.schema.json",
]
```

Rationale: `vkrishna04.me` is primary (always current). jsDelivr has a 24h CDN cache but very high uptime. Raw GitHub is the last resort (rate-limited for unauthenticated users).

---

## 4. Settings.json AI Section (New Schema Addition)

Add to `public/settings.json` and `public/settings.schema.json` in the template portfolio:

```json
"ai": {
  "enabled": false,
  "keySource": "github-secrets",
  "providers": [
    {
      "type": "gemini",
      "model": "gemini-2.0-flash-exp",
      "fallbackModel": "gemini-1.5-flash",
      "keysSecret": "GEMINI_API_KEYS",
      "note": "Comma-separated list of API keys for rotation"
    },
    {
      "type": "openai",
      "model": "gpt-4o-mini",
      "fallbackModel": "gpt-3.5-turbo",
      "keysSecret": "OPENAI_API_KEY"
    },
    {
      "type": "claude",
      "model": "claude-haiku-4-5-20251001",
      "fallbackModel": "claude-haiku-4-5-20251001",
      "keysSecret": "ANTHROPIC_API_KEY"
    },
    {
      "type": "openai-compatible",
      "baseUrl": "",
      "model": "",
      "fallbackModel": "",
      "keysSecret": "CUSTOM_AI_KEY"
    }
  ],
  "activeProvider": "gemini",
  "features": {
    "projectSummaries": true,
    "aboutEnhancement": false,
    "skillsDescriptions": false
  }
}
```

**Dynamic model list retrieval** (in PortfolioForge UI, when user enters API key):
- Gemini: `GET https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}`
- OpenAI: `GET https://api.openai.com/v1/models` (Bearer token)
- Anthropic: `GET https://api.anthropic.com/v1/models` (x-api-key + anthropic-version header)
- OpenAI-compatible: `GET {baseUrl}/models` (Bearer token)

**Key rotation** (GitHub Actions `ai-content.yml`): reads `GEMINI_API_KEYS` secret as comma-separated list, cycles through them on each run to spread load.

---

## 5. GitHub Actions Workflows (Auto-Generated for Each Fork)

### 5.1 `deploy.yml` — Build & Deploy

```yaml
name: Deploy Portfolio

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: pages
  cancel-in-progress: true

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_PAT: ${{ secrets.GITHUB_PAT }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
      - uses: actions/deploy-pages@v4
```

### 5.2 `validate-settings.yml` — Settings Protection

Runs on every PR. Rejects changes to `settings.json` from anyone who is not the repo owner.

```yaml
name: Validate Settings

on:
  pull_request:
    paths:
      - 'public/settings.json'
      - 'public/settings.schema.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check author is repo owner
        run: |
          ACTOR="${{ github.actor }}"
          OWNER="${{ github.repository_owner }}"
          if [ "$ACTOR" != "$OWNER" ]; then
            echo "ERROR: Only the repo owner ($OWNER) can modify settings.json. PR author: $ACTOR"
            exit 1
          fi
          echo "Author check passed: $ACTOR === $OWNER"

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Validate settings.json against schema
        run: |
          npm install --no-save ajv ajv-formats
          node -e "
            const Ajv = require('ajv');
            const addFormats = require('ajv-formats');
            const schema = require('./public/settings.schema.json');
            const data = require('./public/settings.json');
            const ajv = new Ajv({ allErrors: true });
            addFormats(ajv);
            const valid = ajv.validate(schema, data);
            if (!valid) {
              console.error('Settings validation failed:', JSON.stringify(ajv.errors, null, 2));
              process.exit(1);
            }
            console.log('settings.json is valid!');
          "
```

### 5.3 `ai-content.yml` — AI Content Generation

Runs when `settings.json` changes on `main` and `ai.enabled: true`.

```yaml
name: Generate AI Content

on:
  push:
    branches: [main]
    paths:
      - 'public/settings.json'
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check if AI is enabled
        id: check-ai
        run: |
          ENABLED=$(node -e "const s=require('./public/settings.json'); console.log(s.ai?.enabled ? 'true' : 'false')")
          echo "enabled=$ENABLED" >> $GITHUB_OUTPUT

      - name: Generate AI content
        if: steps.check-ai.outputs.enabled == 'true'
        run: node scripts/generate-ai-content.js
        env:
          GEMINI_API_KEYS: ${{ secrets.GEMINI_API_KEYS }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_PAT: ${{ secrets.GITHUB_PAT }}

      - name: Commit generated content
        if: steps.check-ai.outputs.enabled == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add public/generated/
          git diff --staged --quiet || git commit -m "chore: regenerate AI content [skip ci]"
          git push
```

### 5.4 `upstream-sync.yml` — Sync with Template

When the template (VKrishna04.github.io) gets updates, forks can automatically sync non-conflicting changes. **Preserves `public/settings.json`** always.

```yaml
name: Sync with Template

on:
  schedule:
    - cron: '0 6 * * 1'  # Weekly, Monday 6am UTC
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Configure git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git remote add template https://github.com/VKrishna04/VKrishna04.github.io.git || true
          git fetch template main

      - name: Merge template changes (preserve settings.json)
        run: |
          git merge template/main --no-commit --no-ff --allow-unrelated-histories || true
          # Always keep user's own settings
          git checkout HEAD -- public/settings.json
          git checkout HEAD -- public/settings.schema.json
          git diff --staged --quiet || git commit -m "chore: sync with template upstream [skip ci]"
          git push
```

---

## 6. GitHub PAT Integration

Add to `settings.json`:
```json
"github": {
  "type": "user",
  "username": "YOUR_GITHUB_USERNAME",
  "pat": {
    "enabled": false,
    "secretName": "GITHUB_PAT",
    "note": "Personal Access Token for private repos and higher rate limits (5000/hr vs 60/hr)"
  }
}
```

In Vite build (`vite.config.js`): inject `GITHUB_PAT` from environment into the app's build-time constants (available in Actions, never in browser).

For runtime fetching in `useGitHubRepos.js`: read from `import.meta.env.VITE_GITHUB_PAT` (injected at build time by the Action). Never expose in client code.

---

## 7. PortfolioForge UI Flow

### Step 1: Landing
- Hero section: "Fork. Configure. Ship."
- "Get Started" CTA → GitHub OAuth flow
- Feature highlights: dynamic schema, AI, one-click deploy

### Step 2: GitHub Auth
- OAuth via GitHub App (PortfolioForge's own GitHub App)
- Scopes: `repo`, `workflow`, `admin:repo_hook`
- After auth: show user's GitHub profile pic + username

### Step 3: Repository Selection
- Option A: "Fork the template" — create fork of VKrishna04/VKrishna04.github.io
- Option B: "Use existing repo" — pick from user's repos (autocomplete)
- If forking: user sets repo name + description
- Checks if GitHub Pages is enabled on the repo

### Step 4: Settings Configuration
- Tabbed form, one tab per `settings.json` section (derived from schema)
- Tabs: General, GitHub, Home, About, Projects, Resume, Contact, AI, Analytics, Advanced
- Each field rendered by type: `string` → text input, `boolean` → toggle, `array` → tag input, `object` → nested form
- Required fields highlighted
- Live preview iframe (GitHub Pages URL, updates after deploy)
- "Unknown field" fallback: any schema field with no specific renderer gets a JSON textarea

### Step 5: AI Setup (Optional)
- Toggle per provider
- API key input → fetch model list → display dropdown → select model + fallback model
- Key never stored by PortfolioForge — written directly to GitHub Secrets via API
- Cost estimate shown per provider/model

### Step 6: Secrets Setup
- Checklist of required secrets based on `settings.json` config
- For each: copy the secret name + a "Set in GitHub" button (opens GitHub Secrets page)
- Or: PortfolioForge sets secrets via GitHub API if user granted `admin:repo_hook` scope

### Step 7: Deploy
- PortfolioForge commits:
  - `public/settings.json` (configured)
  - `.github/workflows/deploy.yml`
  - `.github/workflows/validate-settings.yml`
  - `.github/workflows/ai-content.yml` (if AI enabled)
  - `.github/workflows/upstream-sync.yml`
- Triggers first deploy
- Shows deploy status (polling Actions API)
- "Your portfolio is live at: `{username}.github.io/{repo}`" + copy URL button

---

## 8. Security Model

1. **GitHub OAuth token**: stored only in browser memory (not localStorage). Never sent to PortfolioForge servers (there are none).
2. **API keys**: entered in Step 5, written directly to GitHub Secrets API, then discarded from browser memory.
3. **Settings protection**: `validate-settings.yml` Action rejects PRs from non-owners that touch `settings.json`.
4. **PortfolioForge itself**: fully static, no server, no database. Audit-friendly.
5. **Upstream sync**: only syncs files that aren't `settings.json`, `settings.schema.json`, or `public/generated/`. User data is never overwritten by sync.

---

## 9. File Structure

```
PortfolioForge/
├── src/
│   ├── App.jsx                    — Main router
│   ├── pages/
│   │   ├── Landing.jsx            — Hero + features
│   │   ├── Setup.jsx              — 7-step wizard orchestrator
│   │   └── steps/
│   │       ├── StepAuth.jsx       — GitHub OAuth
│   │       ├── StepRepo.jsx       — Fork or select repo
│   │       ├── StepSettings.jsx   — Dynamic form from schema
│   │       ├── StepAI.jsx         — AI provider config
│   │       ├── StepSecrets.jsx    — Secrets checklist
│   │       └── StepDeploy.jsx     — Commit + deploy + status
│   ├── components/
│   │   ├── SchemaForm.jsx         — Schema-driven form renderer
│   │   ├── FieldRenderer.jsx      — Per-type field components
│   │   ├── ModelSelector.jsx      — Fetch + display AI models
│   │   ├── StepIndicator.jsx      — Progress bar
│   │   └── LivePreview.jsx        — iframe preview
│   ├── hooks/
│   │   ├── useGitHubAuth.js       — OAuth flow
│   │   ├── useSchema.js           — Fetch schema with fallbacks
│   │   └── useGitHubAPI.js        — Octokit wrapper
│   └── utils/
│       ├── workflowTemplates.js   — GitHub Actions YAML generators
│       ├── schemaParser.js        — Schema → form config
│       └── modelFetcher.js        — Per-provider model list fetchers
├── public/
│   └── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md                      — Compelling README for viral growth
```

---

## 10. README Strategy (for GitHub virality)

The README is critical for adoption. Key elements:

- **Eye-catching hero GIF/screenshot** showing the wizard in action
- **5-minute setup claim** with numbered steps
- **One-click deploy badge** (Cloudflare Pages or Vercel deploy button)
- **Demo link**: live PortfolioForge instance
- **"Built with PortfolioForge" badge** that users add to their portfolios (drives discovery)
- **Showcase section**: gallery of portfolios built with PortfolioForge
- **GitHub Stars button** prominently featured
- **Comparison table**: vs. other portfolio templates (shows differentiation)

Badge for users to add to their portfolio README:
```markdown
[![Built with PortfolioForge](https://img.shields.io/badge/Built%20with-PortfolioForge-06b6d4?style=flat-square&logo=github)](https://github.com/Life-Experimentalist/PortfolioForge)
```

---

## 11. AI Content Generation Script

`scripts/generate-ai-content.js` (runs in GitHub Actions):

```js
// Reads settings.json, fetches GitHub README for each project,
// calls configured AI provider to generate enhanced descriptions,
// writes to public/generated/ai-content.json

const fs = require('fs')
const path = require('path')

async function main() {
  const settings = JSON.parse(fs.readFileSync('public/settings.json', 'utf8'))
  const aiConfig = settings.ai
  if (!aiConfig?.enabled) { console.log('AI disabled, skipping'); return }

  const provider = aiConfig.providers.find(p => p.type === aiConfig.activeProvider)
  if (!provider) throw new Error(`No config for provider: ${aiConfig.activeProvider}`)

  // Get API key (with rotation for Gemini)
  const rawKey = process.env[provider.keysSecret] || ''
  const keys = rawKey.split(',').map(k => k.trim()).filter(Boolean)
  if (!keys.length) throw new Error(`No API keys in secret: ${provider.keysSecret}`)

  // Rotate key based on day of week
  const key = keys[new Date().getDay() % keys.length]

  // Fetch projects from GitHub if PAT available
  const githubPat = process.env.GITHUB_PAT
  const headers = githubPat ? { Authorization: `Bearer ${githubPat}` } : {}
  
  const staticProjects = settings.projects?.staticProjects || []
  const generated = {}

  for (const project of staticProjects) {
    if (!aiConfig.features?.projectSummaries) break
    
    // Fetch README from GitHub
    let readmeContent = ''
    if (project.githubUrl) {
      const match = project.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (match) {
        const [, owner, repo] = match
        const readmeRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/readme`,
          { headers: { ...headers, Accept: 'application/vnd.github.raw' } }
        ).catch(() => null)
        if (readmeRes?.ok) readmeContent = await readmeRes.text()
      }
    }

    // Call AI
    const prompt = `You are writing a portfolio project description. Given this project:
Name: ${project.name}
Description: ${project.description}
Technologies: ${(project.technologies || []).join(', ')}
${readmeContent ? `README excerpt:\n${readmeContent.slice(0, 2000)}` : ''}

Write a 2-3 sentence engaging portfolio description. Be specific, highlight impact, avoid buzzwords.`

    let summary = null
    try {
      if (provider.type === 'gemini') {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          }
        )
        const data = await res.json()
        summary = data.candidates?.[0]?.content?.parts?.[0]?.text
      } else if (provider.type === 'openai' || provider.type === 'openai-compatible') {
        const baseUrl = provider.baseUrl || 'https://api.openai.com/v1'
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model: provider.model, messages: [{ role: 'user', content: prompt }], max_tokens: 200 })
        })
        const data = await res.json()
        summary = data.choices?.[0]?.message?.content
      } else if (provider.type === 'claude') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({ model: provider.model, max_tokens: 200, messages: [{ role: 'user', content: prompt }] })
        })
        const data = await res.json()
        summary = data.content?.[0]?.text
      }
    } catch (e) {
      console.warn(`AI generation failed for ${project.name}:`, e.message)
    }

    if (summary) generated[project.id || project.name] = { summary: summary.trim() }
  }

  const outputDir = path.join('public', 'generated')
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(
    path.join(outputDir, 'ai-content.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), projects: generated }, null, 2)
  )
  console.log(`Generated AI content for ${Object.keys(generated).length} projects`)
}

main().catch(e => { console.error(e); process.exit(1) })
```

---

## 12. Open Questions (for implementation phase)

1. **PortfolioForge hosting**: Use `forge.vkrishna04.me` subdomain or a separate domain like `portfolioforge.dev`?
2. **GitHub App**: Create a GitHub App for OAuth or use OAuth App? GitHub App is more powerful but requires App installation.
3. **Preview iframe**: GitHub Pages preview URL requires a deploy. Show a local Vite dev server preview instead?
4. **"Built with PortfolioForge" badge**: Opt-in (user adds to their README) or opt-out (added by default, user can remove)?
5. **Version pinning**: When syncing upstream, should forks stay on the same minor version or always get latest?

---

*This spec is the complete design document for PortfolioForge. Implementation is tracked separately.*
