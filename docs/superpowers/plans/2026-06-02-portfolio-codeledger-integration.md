# Portfolio × CodeLedger Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate live CodeLedger DSA stats into the portfolio, fix the generated HTML heatmap, improve project card image loading, add AI-friendly data endpoints, and update CFlair-Counter analytics.

**Architecture:** A new `useCodeLedgerStats` hook fetches `https://vkrishna04.me/My-DSA-Life/index.json` (same-origin, 2-min cache-bust) and exposes computed stats. A `/stats` route renders the full DSA progress page; a compact widget sits in About. Both are conditionally hidden when `codeLedger.enabled` is false or the fetch fails. CFlair-Counter gains event-type tracking; the generated CodeLedger HTML heatmap shows the previous full calendar year.

**Tech Stack:** React 19, Vite 7, Tailwind CSS 3, Framer Motion 12, React Router v7, Hono + Cloudflare D1 (CFlair-Counter backend), TypeScript (CFlair-Counter)

**Repos touched:**
- `V:\Code\ProjectCode\VKrishna04.github.io` — main portfolio
- `V:\Code\ProjectCode\CodeLedger` — heatmap fix (Task 1 only)
- `V:\Code\ProjectCode\Cflair-Counter` — backend (Task 13 only)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `CodeLedger/src/handlers/git/github/pages-template.js` | Fix heatmap to show prev calendar year |
| Modify | `portfolio/src/components/ProjectCard.jsx` | Skeleton, error fallback, lazy loading |
| Modify | `portfolio/src/hooks/useGitHubRepos.js` | Apply ignore list, tag code-ledger repos |
| Modify | `portfolio/src/hooks/useMergedProjects.js` | Inject CodeLedger project entry |
| Modify | `portfolio/public/settings.json` | Add codeLedger + counterAPI sections |
| Modify | `portfolio/public/settings.schema.json` | Add codeLedger schema |
| Create | `portfolio/src/hooks/useCodeLedgerStats.js` | Fetch + compute DSA stats |
| Create | `portfolio/src/pages/Stats.jsx` | Full DSA stats page |
| Create | `portfolio/src/components/DSAHeatmap.jsx` | Heatmap React component |
| Modify | `portfolio/src/pages/About.jsx` | Add DSA mini widget |
| Modify | `portfolio/src/App.jsx` | Add /stats route |
| Modify | `portfolio/src/components/Navbar.jsx` | Conditional Stats nav item |
| Modify | `portfolio/src/utils/cflairCounter.js` | New tracking functions, new base URL |
| Create | `portfolio/scripts/generate-ai-data.js` | Build-time API data + llms.txt generator |
| Modify | `portfolio/vite.config.js` or `package.json` | Add generate-ai-data to build |
| Modify | `portfolio/public/_headers` | CORS for /api/* |
| Modify | `Cflair-Counter/functions/index.ts` | event_logs table + /api/events + /api/metrics |

---

## Task 1: Fix CodeLedger heatmap to show previous calendar year

**Repo:** `V:\Code\ProjectCode\CodeLedger`  
**File:** `src/handlers/git/github/pages-template.js`

The `buildHeatmap` function currently uses `setFullYear(year - 1)` for a rolling window. Change to show Jan 1 – Dec 31 of the previous calendar year. The card label updates dynamically.

- [ ] **1.1 — Open and locate the buildHeatmap function**

  Find the `buildHeatmap` function (search for `function buildHeatmap`). The current range setup looks like:
  ```js
  var now = new Date();
  var rangeStart = new Date(now);
  rangeStart.setFullYear(rangeStart.getFullYear() - 1);
  ```

- [ ] **1.2 — Replace the range setup**

  Replace the range setup block at the top of `buildHeatmap` with:
  ```js
  var now = new Date();
  var prevYear = now.getFullYear() - 1;
  var rangeStart = new Date(prevYear, 0, 1);   // Jan 1 of previous year
  var rangeEnd   = new Date(prevYear, 11, 31); // Dec 31 of previous year
  ```

  Then replace all uses of `now` as the loop end condition with `rangeEnd`. The loop `while (cur <= now)` becomes `while (cur <= rangeEnd)`.

- [ ] **1.3 — Update the card label in HTML**

  Find the string `Activity — Last 12 Months` in the HTML template and replace it with a dynamic value. Since this is inside a JS template literal, use a computed value:

  Find:
  ```js
  <div class="card-label">Activity — Last 12 Months</div>
  ```
  
  This is actually in the static HTML string. Find it and replace with a placeholder:
  ```html
  <div class="card-label" id="hm-label">Activity</div>
  ```

  Then in the `main()` function, after `buildHeatmap(problems)`, add:
  ```js
  var prevYr = new Date().getFullYear() - 1;
  var labelEl = document.getElementById('hm-label');
  if (labelEl) labelEl.textContent = 'Activity — ' + prevYr;
  ```

- [ ] **1.4 — Verify the heatmap renders all 52-53 weeks of the year**

  The grid start must snap to the Sunday on/before Jan 1. Find the `cur` initialization:
  ```js
  var cur = new Date(rangeStart);
  cur.setDate(cur.getDate() - cur.getDay()); // snap to Sunday before Jan 1
  ```
  Confirm this line is present and runs before the while loop.

- [ ] **1.5 — Commit**
  ```bash
  cd "V:\Code\ProjectCode\CodeLedger"
  git add src/handlers/git/github/pages-template.js
  git commit -m "fix(pages-template): heatmap shows previous full calendar year"
  ```

---

## Task 2: Fix image loading in ProjectCard.jsx

**Repo:** `V:\Code\ProjectCode\VKrishna04.github.io`  
**File:** `src/components/ProjectCard.jsx`

Add skeleton placeholder, error fallback with initials gradient, lazy loading attributes, and fix masonry recalculation.

- [ ] **2.1 — Add image state to ProjectCard**

  At the top of the `ProjectCard` component function, add:
  ```jsx
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  ```

  Import `useState` if not already imported from React.

- [ ] **2.2 — Replace the image element**

  Find the `<img>` element rendering the project image. Replace it with:
  ```jsx
  <div className="relative w-full aspect-[2/1] overflow-hidden rounded-t-xl bg-gray-900">
    {/* Skeleton while loading */}
    {!imgLoaded && !imgError && (
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-800 to-gray-900" />
    )}

    {/* Initials fallback on error */}
    {imgError && (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-slate-900">
        <span className="text-2xl font-bold text-cyan-400/60 select-none">
          {(project.name || project.full_name || "P")
            .split(/[\s-_]/)
            .slice(0, 2)
            .map(w => w[0]?.toUpperCase() || "")
            .join("")}
        </span>
      </div>
    )}

    {/* Actual image */}
    {!imgError && (project.imageUrl || project.image_url || project.social_image) && (
      <img
        src={project.imageUrl || project.image_url || project.social_image}
        alt={project.name}
        loading="lazy"
        decoding="async"
        fetchpriority={project.featured ? "high" : "auto"}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImgLoaded(true)}
        onError={() => { setImgError(true); setImgLoaded(true); }}
      />
    )}
  </div>
  ```

- [ ] **2.3 — Fix masonry recalculation on image events**

  In `src/hooks/useMasonry.js`, find the code that listens for image `load` events. Ensure it also listens for `error`:

  Find (approximately):
  ```js
  imgs.forEach(img => img.addEventListener('load', recalculate))
  ```
  Replace with:
  ```js
  imgs.forEach(img => {
    img.addEventListener('load', recalculate)
    img.addEventListener('error', recalculate)
  })
  ```
  And in the cleanup, add:
  ```js
  imgs.forEach(img => {
    img.removeEventListener('load', recalculate)
    img.removeEventListener('error', recalculate)
  })
  ```

- [ ] **2.4 — Commit**
  ```bash
  git add src/components/ProjectCard.jsx src/hooks/useMasonry.js
  git commit -m "fix(projects): skeleton loading, error fallback, masonry recalc on image events"
  ```

---

## Task 3: Add `projects.ignore` and CodeLedger detection

**Files:**
- Modify: `public/settings.json` — add `projects.ignore` array
- Modify: `src/hooks/useGitHubRepos.js` — filter ignore list, flag code-ledger repos

- [ ] **3.1 — Add ignore list to settings.json**

  In `public/settings.json`, inside the `"projects"` object, add:
  ```json
  "ignore": [
    "VKrishna04.github.io"
  ]
  ```
  (The portfolio's own GitHub repo — user can add more entries as needed.)

- [ ] **3.2 — Apply ignore list in useGitHubRepos.js**

  In `src/hooks/useGitHubRepos.js`, find where repos are filtered (look for `showForks`, `showPrivate` logic). After that filtering, add:

  ```js
  // Apply ignore list from settings
  const ignoreList = (config.projects?.ignore || []).map(n => n.toLowerCase())
  repos = repos.filter(repo => !ignoreList.includes((repo.name || '').toLowerCase()))
  ```

- [ ] **3.3 — Flag code-ledger repos**

  In the same filtering section, after the ignore filter, add:
  ```js
  // Flag repos managed by CodeLedger (DSA solutions repos)
  repos = repos.map(repo => ({
    ...repo,
    codeLedgerProject: Array.isArray(repo.topics) && repo.topics.includes('code-ledger'),
  }))
  ```

- [ ] **3.4 — Commit**
  ```bash
  git add public/settings.json src/hooks/useGitHubRepos.js
  git commit -m "feat(projects): ignore list and code-ledger topic detection"
  ```

---

## Task 4: Add `codeLedger` to settings.json and schema

**Files:**
- Modify: `public/settings.json`
- Modify: `public/settings.schema.json`

- [ ] **4.1 — Add codeLedger section to settings.json**

  Add after the `"counterAPI"` section:
  ```json
  "codeLedger": {
    "enabled": true,
    "repoOwner": "VKrishna04",
    "repoName": "My-DSA-Life",
    "pagesUrl": "https://vkrishna04.me/My-DSA-Life/",
    "widget": {
      "showInAbout": true,
      "defaultView": "both",
      "note": "defaultView options: 'month', 'year', 'both'"
    }
  }
  ```

- [ ] **4.2 — Update counterAPI in settings.json**

  Change:
  ```json
  "counterAPI": {
    "enabled": false,
    "baseUrl": "https://cflaircounter.pages.dev/",
  ```
  To:
  ```json
  "counterAPI": {
    "enabled": true,
    "baseUrl": "https://counter.vkrishna04.me",
    "trackEvents": {
      "resumeView": true,
      "resumeDownload": true,
      "resumeCopy": true,
      "contactSubmit": true,
      "llmQuery": true,
      "projectsCopy": true
    },
  ```

- [ ] **4.3 — Add codeLedger to settings.schema.json**

  Open `public/settings.schema.json`. Find the `"properties"` top-level object and add:
  ```json
  "codeLedger": {
    "type": "object",
    "description": "CodeLedger DSA stats integration",
    "properties": {
      "enabled": { "type": "boolean", "default": false },
      "repoOwner": { "type": "string", "description": "GitHub username that owns the DSA repo" },
      "repoName": { "type": "string", "description": "Repository name (must have code-ledger topic)" },
      "pagesUrl": { "type": "string", "format": "uri", "description": "GitHub Pages URL for the DSA repo (where index.json lives)" },
      "widget": {
        "type": "object",
        "properties": {
          "showInAbout": { "type": "boolean", "default": true },
          "defaultView": { "type": "string", "enum": ["month", "year", "both"], "default": "both" }
        }
      }
    },
    "required": ["repoOwner", "repoName", "pagesUrl"]
  }
  ```

- [ ] **4.4 — Commit**
  ```bash
  git add public/settings.json public/settings.schema.json
  git commit -m "feat(settings): add codeLedger section and update counterAPI URL"
  ```

---

## Task 5: Create `useCodeLedgerStats` hook

**File:** Create `src/hooks/useCodeLedgerStats.js`

This hook fetches `index.json` from the CodeLedger GitHub Pages, computes derived stats (streaks, this month, this year), and auto-refreshes every 2 minutes.

- [ ] **5.1 — Create the hook file**

  Create `src/hooks/useCodeLedgerStats.js`:

  ```js
  import { useState, useEffect, useCallback, useRef } from "react"

  const REFRESH_INTERVAL_MS = 2 * 60 * 1000 // 2 minutes

  function toMs(ts) {
    const n = Number(ts) || 0
    return n < 1e10 ? n * 1000 : n
  }

  function dayKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  function computeStats(problems) {
    const now = new Date()
    const dayMap = {}
    let thisMonth = 0, thisYear = 0

    problems.forEach(p => {
      if (!p.timestamp) return
      const d = new Date(toMs(p.timestamp))
      const key = dayKey(d)
      dayMap[key] = (dayMap[key] || 0) + 1
      if (d.getFullYear() === now.getFullYear()) {
        thisYear++
        if (d.getMonth() === now.getMonth()) thisMonth++
      }
    })

    // Current streak (consecutive days ending today or yesterday)
    let currentStreak = 0
    for (let i = 0; i < 730; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      if (dayMap[dayKey(d)]) currentStreak++
      else break
    }

    // Longest streak (scan last 5 years)
    let longestStreak = 0, run = 0
    for (let i = 729; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      if (dayMap[dayKey(d)]) { run++; if (run > longestStreak) longestStreak = run }
      else run = 0
    }

    return { thisMonth, thisYear, currentStreak, longestStreak, dayMap }
  }

  export function useCodeLedgerStats() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)
    const [config, setConfig] = useState(null)
    const intervalRef = useRef(null)

    const fetchStats = useCallback(async (force = false) => {
      try {
        // Load config from settings.json
        const settingsRes = await fetch("/settings.json")
        const settings = await settingsRes.json()
        const cfg = settings.codeLedger
        setConfig(cfg)

        if (!cfg?.enabled || !cfg?.pagesUrl) {
          setLoading(false)
          return
        }

        // Cache-bust every 2 minutes so data stays fresh
        const cacheBuster = Math.floor(Date.now() / REFRESH_INTERVAL_MS)
        const url = `${cfg.pagesUrl.replace(/\/$/, "")}/index.json?v=${cacheBuster}`

        const res = await fetch(url, force ? { cache: "no-store" } : {})
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const json = await res.json()
        const problems = json.problems || []
        const computed = computeStats(problems)

        // Top topics
        const topicMap = {}
        problems.forEach(p => {
          (p.tags || []).forEach(tag => {
            topicMap[tag] = (topicMap[tag] || 0) + 1
          })
        })
        const topTopics = Object.entries(topicMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)

        // Recent 10 solves
        const recentProblems = [...problems]
          .sort((a, b) => toMs(b.timestamp) - toMs(a.timestamp))
          .slice(0, 10)

        setData({
          stats: json.stats || {},
          problems,
          recentProblems,
          topTopics,
          updatedAt: json.updatedAt,
          pagesUrl: cfg.pagesUrl,
          ...computed,
        })
        setError(null)
        setLastUpdated(new Date())
      } catch (e) {
        setError(e.message)
        console.warn("[CodeLedger] Failed to fetch stats:", e.message)
      } finally {
        setLoading(false)
      }
    }, [])

    useEffect(() => {
      fetchStats()
      intervalRef.current = setInterval(() => fetchStats(), REFRESH_INTERVAL_MS)
      return () => clearInterval(intervalRef.current)
    }, [fetchStats])

    return { data, loading, error, lastUpdated, config, refresh: () => fetchStats(true) }
  }
  ```

- [ ] **5.2 — Verify the hook doesn't crash when settings has no codeLedger**

  The hook checks `if (!cfg?.enabled || !cfg?.pagesUrl)` and returns early, leaving `data = null`. All consumers must handle `data === null` gracefully.

- [ ] **5.3 — Commit**
  ```bash
  git add src/hooks/useCodeLedgerStats.js
  git commit -m "feat(hooks): useCodeLedgerStats with 2-min refresh and streak computation"
  ```

---

## Task 6: Create `DSAHeatmap` component

**File:** Create `src/components/DSAHeatmap.jsx`

A React heatmap component showing a full calendar year of DSA activity. Renders weeks as columns, days as rows, with hover tooltips and animated entry.

- [ ] **6.1 — Create the component**

  Create `src/components/DSAHeatmap.jsx`:

  ```jsx
  import { useMemo, useState } from "react"
  import { motion } from "framer-motion"

  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const DAY_LABELS = ["","Mon","","Wed","","Fri",""]

  function dayKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
  }

  function getCellColor(count, max) {
    if (!count) return "bg-white/[0.04] hover:bg-white/10"
    const ratio = count / Math.max(1, max)
    if (ratio <= 0.25) return "bg-cyan-900/50 hover:bg-cyan-900/80"
    if (ratio <= 0.5) return "bg-cyan-700/70 hover:bg-cyan-700"
    if (ratio <= 0.75) return "bg-cyan-500/80 hover:bg-cyan-500"
    return "bg-cyan-400 hover:bg-cyan-300"
  }

  export function DSAHeatmap({ dayMap = {}, year }) {
    const [tooltip, setTooltip] = useState(null)

    const { weeks, monthLabels, maxCount } = useMemo(() => {
      const targetYear = year || (new Date().getFullYear() - 1)
      const start = new Date(targetYear, 0, 1)
      const end = new Date(targetYear, 11, 31)
      // Snap to Sunday
      const cur = new Date(start)
      cur.setDate(cur.getDate() - cur.getDay())

      const weeks = []
      const monthLabels = []
      let lastMonth = -1
      let weekIdx = 0

      while (cur <= end) {
        if (cur.getDay() === 0) {
          const week = []
          for (let d = 0; d < 7; d++) {
            const inRange = cur >= start && cur <= end
            week.push({
              date: dayKey(new Date(cur)),
              count: dayMap[dayKey(new Date(cur))] || 0,
              inRange,
              month: cur.getMonth(),
              day: cur.getDate(),
            })
            cur.setDate(cur.getDate() + 1)
          }
          // Month label: label on first week where this month starts
          const firstInRange = week.find(c => c.inRange)
          if (firstInRange && firstInRange.month !== lastMonth) {
            monthLabels.push({ weekIdx, name: MONTH_NAMES[firstInRange.month] })
            lastMonth = firstInRange.month
          }
          weeks.push(week)
          weekIdx++
        }
      }

      const allCounts = Object.values(dayMap)
      const maxCount = allCounts.length ? Math.max(...allCounts) : 1

      return { weeks, monthLabels, maxCount }
    }, [dayMap, year])

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Month labels */}
          <div className="flex mb-1 pl-7">
            {weeks.map((_, wi) => {
              const label = monthLabels.find(l => l.weekIdx === wi)
              return (
                <div key={wi} className="flex-1 text-[9px] text-slate-500 whitespace-nowrap">
                  {label ? label.name : ""}
                </div>
              )
            })}
          </div>

          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pr-1 shrink-0 w-6">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="text-[9px] text-slate-600 h-[11px] flex items-center justify-end">
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex gap-[3px] flex-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px] flex-1">
                  {week.map((cell, di) => (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 7 + di) * 0.001, duration: 0.15 }}
                      className={`w-full h-[11px] rounded-[2px] cursor-pointer transition-colors duration-150 relative
                        ${cell.inRange ? getCellColor(cell.count, maxCount) : "bg-transparent cursor-default"}
                      `}
                      onMouseEnter={e => {
                        if (!cell.inRange) return
                        setTooltip({ cell, x: e.clientX, y: e.clientY })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-2 justify-end">
            <span className="text-[9px] text-slate-600">Less</span>
            {["bg-white/[0.04]","bg-cyan-900/50","bg-cyan-700/70","bg-cyan-500/80","bg-cyan-400"].map((cls,i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${cls}`} />
            ))}
            <span className="text-[9px] text-slate-600">More</span>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none bg-gray-900/95 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 shadow-2xl"
            style={{ left: Math.min(tooltip.x + 12, window.innerWidth - 180), top: tooltip.y - 60 }}
          >
            <div className="text-slate-400 mb-0.5">{tooltip.cell.date}</div>
            <div className="font-semibold text-cyan-400">
              {tooltip.cell.count} {tooltip.cell.count === 1 ? "solve" : "solves"}
            </div>
          </div>
        )}
      </div>
    )
  }
  ```

- [ ] **6.2 — Commit**
  ```bash
  git add src/components/DSAHeatmap.jsx
  git commit -m "feat(components): DSAHeatmap with animated cells, month labels, tooltip"
  ```

---

## Task 7: Create Stats page

**File:** Create `src/pages/Stats.jsx`

Full-page DSA progress dashboard. Returns `null` if no CodeLedger data (hidden route).

- [ ] **7.1 — Create Stats.jsx**

  ```jsx
  import { useState, useEffect } from "react"
  import { motion, AnimatePresence } from "framer-motion"
  import { Link } from "react-router-dom"
  import { useCodeLedgerStats } from "../hooks/useCodeLedgerStats"
  import { DSAHeatmap } from "../components/DSAHeatmap"

  const DIFF_COLORS = {
    Easy: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    Medium: { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    Hard: { text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  }

  function StatCard({ label, value, sub, color = "#06b6d4", delay = 0 }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: "easeOut" }}
        className="relative p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden group hover:border-white/[0.12] transition-all duration-300"
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 0% 0%, ${color}18, transparent 60%)` }}
        />
        <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-1">{label}</div>
        <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
        {sub && <div className="text-[11px] text-slate-500 truncate">{sub}</div>}
      </motion.div>
    )
  }

  function Skeleton() {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-20 md:px-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-white/5 rounded-xl w-48" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl" />
            ))}
          </div>
          <div className="h-48 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  export default function Stats() {
    const { data, loading, error, lastUpdated, config, refresh } = useCodeLedgerStats()
    const [timeSince, setTimeSince] = useState("")

    // Update "X minutes ago" every 30s
    useEffect(() => {
      const update = () => {
        if (!lastUpdated) return
        const diffMs = Date.now() - lastUpdated.getTime()
        const diffMin = Math.floor(diffMs / 60000)
        setTimeSince(diffMin === 0 ? "just now" : `${diffMin}m ago`)
      }
      update()
      const t = setInterval(update, 30000)
      return () => clearInterval(t)
    }, [lastUpdated])

    if (loading) return <Skeleton />
    if (!data || error) return null  // Hidden if unavailable

    const { stats, recentProblems, topTopics, currentStreak, longestStreak, thisMonth, thisYear, dayMap, pagesUrl, updatedAt } = data
    const prevYear = new Date().getFullYear() - 1

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-950 px-4 py-20 md:px-8"
      >
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-bold text-white mb-1"
              >
                DSA Progress
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-slate-500"
              >
                Tracked by{" "}
                <a href="https://codeledger.vkrishna04.me" target="_blank" rel="noreferrer"
                   className="text-cyan-500 hover:text-cyan-400 transition-colors">CodeLedger</a>
                {timeSince && ` · Updated ${timeSince}`}
              </motion.p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refresh}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 border border-white/10 rounded-lg hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
              >
                ↺ Refresh
              </button>
              <a
                href={pagesUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 rounded-lg hover:bg-cyan-500/15 transition-all"
              >
                Open Dashboard ↗
              </a>
            </div>
          </div>

          {/* Stat Cards — 6 across */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Total Solved" value={stats.total || 0}
              sub={`${stats.easy||0}E · ${stats.medium||0}M · ${stats.hard||0}H`}
              color="#06b6d4" delay={0} />
            <StatCard label="Easy" value={stats.easy || 0} color="#34d399" delay={0.05} />
            <StatCard label="Medium" value={stats.medium || 0} color="#fbbf24" delay={0.1} />
            <StatCard label="Hard" value={stats.hard || 0} color="#f87171" delay={0.15} />
            <StatCard label="Streak" value={`${currentStreak}d`}
              sub={`Best: ${longestStreak} days`} color="#10b981" delay={0.2} />
            <StatCard label="This Month" value={thisMonth}
              sub={`${thisYear} this year`} color="#a855f7" delay={0.25} />
          </div>

          {/* Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
                Activity — {prevYear}
              </h2>
            </div>
            <DSAHeatmap dayMap={dayMap} year={prevYear} />
          </motion.div>

          {/* Topics + Recent Solves */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Top Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
            >
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Top Topics</h2>
              <div className="space-y-2.5">
                {topTopics.map(([topic, count], i) => (
                  <div key={topic} className="flex items-center gap-3">
                    <div className="text-[11px] text-slate-400 w-28 truncate">{topic}</div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / (topTopics[0]?.[1] || 1)) * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 w-8 text-right font-mono">{count}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Solves */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
            >
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Recent Solves</h2>
              <div className="space-y-1">
                {recentProblems.map((p, i) => {
                  const diff = p.difficulty || "Unknown"
                  const dc = DIFF_COLORS[diff] || { text: "text-slate-500", bg: "bg-slate-500/10 border-slate-500/20" }
                  const d = new Date(p.timestamp > 1e12 ? p.timestamp : p.timestamp * 1000)
                  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  return (
                    <motion.div
                      key={p.id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.04 }}
                      className="flex items-center gap-2 py-1.5 border-b border-white/[0.04] last:border-0"
                    >
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${dc.bg} ${dc.text} shrink-0`}>
                        {diff[0]}
                      </span>
                      <span className="text-[12px] text-slate-300 flex-1 truncate">
                        {p.title || p.titleSlug}
                      </span>
                      <span className="text-[10px] text-slate-600 shrink-0">{dateStr}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-[11px] text-slate-600 py-4"
          >
            Data from{" "}
            <a href={pagesUrl} target="_blank" rel="noreferrer"
               className="text-slate-500 hover:text-cyan-400 transition-colors underline">
              {config?.repoOwner}/{config?.repoName}
            </a>
            {" · "}
            <a href="https://codeledger.vkrishna04.me" target="_blank" rel="noreferrer"
               className="text-slate-500 hover:text-cyan-400 transition-colors">
              CodeLedger
            </a>
          </motion.div>
        </div>
      </motion.div>
    )
  }
  ```

- [ ] **7.2 — Commit**
  ```bash
  git add src/pages/Stats.jsx
  git commit -m "feat(pages): DSA Stats page with heatmap, topics, and recent solves"
  ```

---

## Task 8: Wire Stats into router and Navbar

**Files:**
- Modify: `src/App.jsx` — add `/stats` route
- Modify: `src/components/Navbar.jsx` — conditional Stats nav item

- [ ] **8.1 — Add route in App.jsx**

  In `src/App.jsx`, find the `<Routes>` block. Add before the catch-all `*` route:
  ```jsx
  import Stats from "./pages/Stats"
  // ...
  <Route path="/stats" element={<Stats />} />
  ```

- [ ] **8.2 — Add conditional Stats nav item in Navbar.jsx**

  In `src/components/Navbar.jsx`, add the hook import at the top:
  ```jsx
  import { useCodeLedgerStats } from "../hooks/useCodeLedgerStats"
  ```

  Inside the Navbar component:
  ```jsx
  const { data: dsaData, config: dsaConfig } = useCodeLedgerStats()
  const showStatsLink = dsaConfig?.enabled && dsaData !== null
  ```

  In the nav items section, after the existing nav links and before the closing nav, add:
  ```jsx
  {showStatsLink && (
    <NavLink
      to="/stats"
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? "text-cyan-400" : "text-slate-300 hover:text-white"}`
      }
    >
      Stats
    </NavLink>
  )}
  ```

  Note: Navbar renders nav items from `settings.json` `navbar.navigation` array. The Stats link is added programmatically here (not from settings, since it's conditional on data availability). This keeps settings.json clean.

- [ ] **8.3 — Commit**
  ```bash
  git add src/App.jsx src/components/Navbar.jsx
  git commit -m "feat(nav): conditional /stats route and nav link when CodeLedger data available"
  ```

---

## Task 9: Add DSA mini widget to About page

**File:** Modify `src/pages/About.jsx`

A compact widget: 3 stat chips (Total / Streak / This Month or Year) with a toggle. Hidden if `data === null`.

- [ ] **9.1 — Add hook import and widget to About.jsx**

  At the top of `src/pages/About.jsx`, add:
  ```jsx
  import { useState } from "react"
  import { Link } from "react-router-dom"
  import { useCodeLedgerStats } from "../hooks/useCodeLedgerStats"
  import { motion } from "framer-motion"
  ```

  Inside the `About` component, add:
  ```jsx
  const { data: dsaData, config: dsaConfig } = useCodeLedgerStats()
  const [dsaView, setDsaView] = useState(dsaConfig?.widget?.defaultView || "both")
  ```

- [ ] **9.2 — Render the widget**

  Find a logical spot in the About page JSX (after the stats row that shows "25+ projects, ₹375k+ prizes", or at the bottom of the about section). Insert:

  ```jsx
  {dsaData && (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">DSA Activity</span>
        <div className="flex gap-1">
          {["month", "year", "both"].map(v => (
            <button
              key={v}
              onClick={() => setDsaView(v)}
              className={`text-[9px] px-2 py-0.5 rounded-full transition-all ${
                dsaView === v
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-600 hover:text-slate-400"
              }`}
            >
              {v === "both" ? "All" : v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stat chips */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-cyan-400">{dsaData.stats?.total || 0}</span>
          <span className="text-[10px] text-slate-500">solved</span>
        </div>
        <div className="text-slate-700">·</div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-emerald-400">{dsaData.currentStreak}d</span>
          <span className="text-[10px] text-slate-500">streak</span>
        </div>
        {(dsaView === "month" || dsaView === "both") && (
          <>
            <div className="text-slate-700">·</div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-amber-400">{dsaData.thisMonth}</span>
              <span className="text-[10px] text-slate-500">this month</span>
            </div>
          </>
        )}
        {(dsaView === "year" || dsaView === "both") && (
          <>
            <div className="text-slate-700">·</div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-purple-400">{dsaData.thisYear}</span>
              <span className="text-[10px] text-slate-500">this year</span>
            </div>
          </>
        )}
        <Link
          to="/stats"
          className="ml-auto text-[10px] text-slate-500 hover:text-cyan-400 transition-colors"
        >
          View full stats →
        </Link>
      </div>
    </motion.div>
  )}
  ```

- [ ] **9.3 — Commit**
  ```bash
  git add src/pages/About.jsx
  git commit -m "feat(about): DSA activity widget with month/year/both toggle"
  ```

---

## Task 10: CodeLedger special card in Projects page

**File:** Modify `src/components/ProjectCard.jsx`

When `project.codeLedgerProject === true`, render a "DSA Stats" badge ribbon.

- [ ] **10.1 — Add CodeLedger ribbon**

  In `ProjectCard.jsx`, find where the project name/title is rendered. Above or beside it, add:
  ```jsx
  {project.codeLedgerProject && (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
        ⚡ CodeLedger
      </span>
    </div>
  )}
  ```

- [ ] **10.2 — Show live solve count on CodeLedger project card**

  Add the hook at the top of ProjectCard (or pass dsaData as a prop from parent). Since ProjectCard is rendered many times, prefer passing as prop.

  In `src/pages/Projects.jsx`, add at the top:
  ```jsx
  import { useCodeLedgerStats } from "../hooks/useCodeLedgerStats"
  // inside Projects component:
  const { data: dsaData } = useCodeLedgerStats()
  ```

  Pass to ProjectCard:
  ```jsx
  <ProjectCard
    project={project}
    // ...existing props...
    dsaStats={project.codeLedgerProject ? dsaData : null}
  />
  ```

  In `ProjectCard.jsx`, destructure `dsaStats` from props. Below the CodeLedger ribbon, add:
  ```jsx
  {dsaStats && (
    <div className="flex gap-3 text-[11px] mb-2">
      <span className="text-emerald-400">{dsaStats.stats?.easy || 0} Easy</span>
      <span className="text-amber-400">{dsaStats.stats?.medium || 0} Med</span>
      <span className="text-rose-400">{dsaStats.stats?.hard || 0} Hard</span>
      <span className="text-slate-500 ml-auto">{dsaStats.currentStreak}d streak</span>
    </div>
  )}
  ```

- [ ] **10.3 — Commit**
  ```bash
  git add src/components/ProjectCard.jsx src/pages/Projects.jsx
  git commit -m "feat(projects): CodeLedger project ribbon with live solve stats"
  ```

---

## Task 11: Update CFlair-Counter client

**File:** Modify `src/utils/cflairCounter.js`

Update base URL to `counter.vkrishna04.me`, add `trackEvent` and named helpers, add event tracking calls in Resume and Contact pages.

- [ ] **11.1 — Update base URL and add trackEvent**

  At the top of `src/utils/cflairCounter.js`, change:
  ```js
  const CFLAIR_BASE_URL = "https://cflaircounter.pages.dev"
  ```
  to:
  ```js
  const CFLAIR_BASE_URL = "https://counter.vkrishna04.me"
  ```

  Add after the `isInRateLimitCooldown` / `markRateLimited` helpers:
  ```js
  /**
   * Track a named event (category + event name)
   * @param {string} category — e.g. "resume", "contact", "llm"
   * @param {string} eventName — e.g. "page-view", "pdf-download", "api-query"
   * @param {object} [metadata] — optional metadata
   * @param {string} [baseUrl]
   */
  export async function trackEvent(category, eventName, metadata = {}, baseUrl = CFLAIR_BASE_URL) {
    if (!category || !eventName) return null
    if (isInRateLimitCooldown()) return null
    try {
      const res = await fetch(`${baseUrl}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ category, event: eventName, metadata }),
      })
      if (res.status === 429) { markRateLimited(); return null }
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  export const trackResumeView       = (base) => trackEvent("resume",   "page-view",      {}, base)
  export const trackResumeDownload   = (base) => trackEvent("resume",   "pdf-download",   {}, base)
  export const trackResumeCopy       = (fmt, base) => trackEvent("resume", "copy",  { format: fmt }, base)
  export const trackContactSubmit    = (base) => trackEvent("contact",  "form-submit",    {}, base)
  export const trackLLMQuery         = (endpoint, base) => trackEvent("llm", "api-query", { endpoint }, base)
  export const trackProjectsCopy     = (fmt, base) => trackEvent("projects", "copy", { format: fmt }, base)
  ```

- [ ] **11.2 — Wire trackResumeView in Resume.jsx**

  In `src/pages/Resume.jsx`, import and call:
  ```jsx
  import { trackResumeView } from "../utils/cflairCounter"
  // Inside useEffect on mount:
  useEffect(() => { trackResumeView() }, [])
  ```

  Find the PDF download link/button. Add `onClick={() => trackResumeDownload()}` to it.

  Find copy buttons. Add `onClick={() => trackResumeCopy(format)}` to each.

- [ ] **11.3 — Wire trackContactSubmit in Contact.jsx**

  In `src/pages/Contact.jsx`, import and add to form submit handler:
  ```jsx
  import { trackContactSubmit } from "../utils/cflairCounter"
  // Inside handleSubmit (or wherever form submission is handled):
  trackContactSubmit()
  ```

- [ ] **11.4 — Commit**
  ```bash
  git add src/utils/cflairCounter.js src/pages/Resume.jsx src/pages/Contact.jsx
  git commit -m "feat(analytics): update CFlair base URL, add event tracking for resume/contact"
  ```

---

## Task 12: CFlair-Counter backend — event_logs + new endpoints

**Repo:** `V:\Code\ProjectCode\Cflair-Counter`  
**File:** `functions/index.ts`

- [ ] **12.1 — Add event_logs table to initDatabase**

  In `initDatabase`, after the `usage_stats` table creation, add:
  ```typescript
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS event_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_category TEXT NOT NULL,
      event_name TEXT NOT NULL,
      session_id TEXT,
      metadata_json TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).run()

  await db.prepare(
    "CREATE INDEX IF NOT EXISTS idx_event_cat ON event_logs(event_category, created_at)"
  ).run()
  ```

- [ ] **12.2 — Add POST /api/events endpoint**

  After the `POST /api/views/:projectName` route, add:
  ```typescript
  app.post("/api/events", customRateLimiter, async (c) => {
    let body: { category?: string; event?: string; metadata?: unknown }
    try {
      body = await c.req.json()
    } catch {
      return c.json({ success: false, error: "Invalid JSON body" }, 400)
    }
    const { category, event: eventName, metadata } = body
    if (!category || !eventName || category.length > 64 || eventName.length > 64) {
      return c.json({ success: false, error: "Invalid category or event name" }, 400)
    }

    await initDatabase(c.env.DB)
    const visitorHash = generateVisitorHash(c.req.raw)

    try {
      await c.env.DB.prepare(`
        INSERT INTO event_logs (event_category, event_name, session_id, metadata_json)
        VALUES (?, ?, ?, ?)
      `).bind(
        category,
        eventName,
        visitorHash,
        metadata ? JSON.stringify(metadata) : null
      ).run()

      await trackUsage(c.env.DB)

      return c.json({ success: true, category, event: eventName, timestamp: new Date().toISOString() })
    } catch (error) {
      console.error("Event log error:", error)
      return c.json({ success: false, error: "Database error" }, 500)
    }
  })
  ```

- [ ] **12.3 — Add GET /api/metrics endpoint**

  After the `/api/events` route, add:
  ```typescript
  app.get("/api/metrics", async (c) => {
    try {
      await initDatabase(c.env.DB)

      const metrics = await c.env.DB.prepare(`
        SELECT event_category, event_name, COUNT(*) as count
        FROM event_logs
        GROUP BY event_category, event_name
        ORDER BY count DESC
        LIMIT 100
      `).all()

      const byCategory: Record<string, Record<string, number>> = {}
      for (const row of metrics.results as { event_category: string; event_name: string; count: number }[]) {
        if (!byCategory[row.event_category]) byCategory[row.event_category] = {}
        byCategory[row.event_category][row.event_name] = row.count
      }

      return c.json({
        success: true,
        metrics: byCategory,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Metrics error:", error)
      return c.json({ success: false, error: "Database error" }, 500)
    }
  })
  ```

- [ ] **12.4 — Add GET /api/views/:projectName/history endpoint**

  After the badge endpoint, add:
  ```typescript
  app.get("/api/views/:projectName/history", async (c) => {
    const projectName = c.req.param("projectName")
    if (!projectName || projectName.length > 100) {
      return c.json({ error: "Invalid project name" }, 400)
    }

    await initDatabase(c.env.DB)

    try {
      const rows = await c.env.DB.prepare(`
        SELECT DATE(last_visit) as date, COUNT(*) as visits
        FROM visitor_tracking
        WHERE project_name = ?
          AND last_visit >= datetime('now', '-30 days')
        GROUP BY DATE(last_visit)
        ORDER BY date ASC
      `).bind(projectName).all()

      return c.json({
        success: true,
        projectName,
        history: rows.results,
      })
    } catch (error) {
      console.error("History error:", error)
      return c.json({ success: false, error: "Database error" }, 500)
    }
  })
  ```

- [ ] **12.5 — Build and verify**
  ```bash
  cd "V:\Code\ProjectCode\Cflair-Counter"
  npm run build:worker
  # Expected: dist/_worker.js generated with no TypeScript errors
  ```

- [ ] **12.6 — Commit**
  ```bash
  git add functions/index.ts
  git commit -m "feat(api): event_logs table, POST /api/events, GET /api/metrics, GET /api/views/:name/history"
  ```

---

## Task 13: Generate AI data files (llms.txt + /api/*.json)

**File:** Create `scripts/generate-ai-data.js`

Build-time script that reads `settings.json` and writes static files to `public/` for AI agents and GET-based copy functionality.

- [ ] **13.1 — Create the script**

  Create `scripts/generate-ai-data.js`:
  ```js
  #!/usr/bin/env node
  // Generates AI-friendly static data files at build time.
  // Run: node scripts/generate-ai-data.js
  // Output: public/llms.txt, public/api/*.json, public/.well-known/ai-plugin.json

  const fs = require("fs")
  const path = require("path")

  const settings = JSON.parse(fs.readFileSync("public/settings.json", "utf8"))
  const { home, about, github, projects, counterAPI } = settings

  const OUT = "public/api"
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync("public/.well-known", { recursive: true })

  // --- portfolio.json ---
  const portfolio = {
    generatedAt: new Date().toISOString(),
    owner: {
      name: home?.name || "Unknown",
      title: about?.title || "",
      location: home?.location || "",
      bio: (about?.paragraphs || []).join(" "),
    },
    skills: (about?.skills || []).flatMap(cat => cat.items || []).map(s => s.name || s),
    stats: about?.stats || [],
    contact: {
      github: `https://github.com/${github?.username}`,
      site: `https://${github?.username}.me`,
    },
    projects: (projects?.staticProjects || [])
      .filter(p => p.showInProjects !== false)
      .map(p => ({
        name: p.name,
        description: p.description,
        technologies: p.technologies,
        category: p.category,
        status: p.status,
        featured: p.featured,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
      })),
  }
  fs.writeFileSync(path.join(OUT, "portfolio.json"), JSON.stringify(portfolio, null, 2))

  // --- projects.json (all formats) ---
  const projectsOut = {
    generatedAt: new Date().toISOString(),
    total: portfolio.projects.length,
    projects: portfolio.projects,
    markdown: portfolio.projects
      .map(p => `## ${p.name}\n${p.description}\n**Tech:** ${(p.technologies||[]).join(", ")}\n${p.githubUrl ? `**GitHub:** ${p.githubUrl}` : ""}`)
      .join("\n\n"),
    plain: portfolio.projects
      .map(p => `${p.name}: ${p.description} | ${(p.technologies||[]).join(", ")}`)
      .join("\n"),
  }
  fs.writeFileSync(path.join(OUT, "projects.json"), JSON.stringify(projectsOut, null, 2))

  // --- about.json ---
  fs.writeFileSync(path.join(OUT, "about.json"), JSON.stringify({
    generatedAt: new Date().toISOString(),
    name: home?.name,
    title: about?.title,
    bio: portfolio.owner.bio,
    location: home?.location,
    skills: portfolio.skills,
    stats: portfolio.stats,
  }, null, 2))

  // --- contact.json ---
  const buttons = home?.buttons || []
  fs.writeFileSync(path.join(OUT, "contact.json"), JSON.stringify({
    generatedAt: new Date().toISOString(),
    github: `https://github.com/${github?.username}`,
    website: `https://${github?.username}.me`,
    links: buttons.map(b => ({ label: b.text, url: b.href })),
  }, null, 2))

  // --- llms.txt ---
  const llmsTxt = `# ${home?.name || "Portfolio"} — AI Context

## About
${portfolio.owner.bio}

## Skills
${portfolio.skills.slice(0, 20).join(", ")}

## Projects (${portfolio.projects.length} total)
${portfolio.projects.slice(0, 10).map(p => `- **${p.name}**: ${p.description}`).join("\n")}

## Links
- Portfolio: https://${github?.username}.me
- GitHub: https://github.com/${github?.username}
- Projects API: https://${github?.username}.me/api/projects.json
- Full data: https://${github?.username}.me/api/portfolio.json

## Machine-Readable Data
All portfolio data available as JSON:
- GET /api/portfolio.json — full portfolio data
- GET /api/projects.json — projects with markdown and plain text formats
- GET /api/about.json — bio, skills, stats
- GET /api/contact.json — contact info and links
`
  fs.writeFileSync("public/llms.txt", llmsTxt)

  // --- .well-known/ai-plugin.json ---
  fs.writeFileSync("public/.well-known/ai-plugin.json", JSON.stringify({
    schema_version: "v1",
    name_for_human: `${home?.name || "Portfolio"} Data`,
    name_for_model: "portfolio_data",
    description_for_human: "Access portfolio data, projects, and bio information.",
    description_for_model: "Provides structured portfolio data including projects, skills, bio, and contact information for AI agents.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: `https://${github?.username}.me/api/openapi.json`,
    },
    logo_url: `https://${github?.username}.me/favicon.ico`,
    contact_email: "",
    legal_info_url: `https://github.com/${github?.username}`,
  }, null, 2))

  console.log("✓ Generated: llms.txt, api/portfolio.json, api/projects.json, api/about.json, api/contact.json, .well-known/ai-plugin.json")
  ```

- [ ] **13.2 — Add to build pipeline**

  In `package.json`, find the `"build-core"` script. Append the script call:
  ```json
  "build-core": "node scripts/pre-build-validation.js && vite build && node scripts/generate-manifest.js && node scripts/generate-ai-data.js"
  ```

- [ ] **13.3 — Add CORS headers for /api/* in _headers**

  Open `public/_headers` (or create if missing). Add:
  ```
  /api/*
    Access-Control-Allow-Origin: *
    Cache-Control: public, max-age=300

  /llms.txt
    Content-Type: text/plain; charset=utf-8
    Cache-Control: public, max-age=300

  /.well-known/*
    Access-Control-Allow-Origin: *
  ```

- [ ] **13.4 — Test the script locally**
  ```bash
  cd "V:\Code\ProjectCode\VKrishna04.github.io"
  node scripts/generate-ai-data.js
  # Expected: ✓ Generated: llms.txt, api/portfolio.json, ...
  cat public/llms.txt
  cat public/api/projects.json
  ```

- [ ] **13.5 — Commit**
  ```bash
  git add scripts/generate-ai-data.js public/_headers package.json
  git commit -m "feat(build): generate llms.txt and /api/*.json at build time for AI agents"
  ```

---

## Task 14: Full build verification and deploy

- [ ] **14.1 — Run full build**
  ```bash
  cd "V:\Code\ProjectCode\VKrishna04.github.io"
  npm run build
  # Expected: dist/ created, no errors
  ```

- [ ] **14.2 — Verify critical files in dist/**
  ```bash
  ls dist/api/
  # Expected: portfolio.json  projects.json  about.json  contact.json
  cat dist/llms.txt | head -20
  cat dist/.well-known/ai-plugin.json
  ```

- [ ] **14.3 — Local dev smoke test**
  ```bash
  npm run dev
  # Open http://localhost:5173/stats — should show Stats page if codeLedger.enabled
  # Open http://localhost:5173/about — should show DSA widget
  # Open http://localhost:5173/projects — CodeLedger project should have ribbon
  # Open http://localhost:5173/api/projects.json — should return JSON
  ```

- [ ] **14.4 — Final commit and push**
  ```bash
  git add -A
  git status  # verify nothing unexpected
  git commit -m "chore: full portfolio × CodeLedger integration — heatmap, stats page, AI data, analytics"
  git push origin main
  ```

---

## Self-Review Checklist

- [x] **A**: pages-template.js heatmap shows previous calendar year (Task 1)
- [x] **B**: Stats page at /stats with heatmap + topics + recent solves (Tasks 5-9)
- [x] **B (About)**: mini widget with month/year/both toggle (Task 9)
- [x] **B (hidden)**: Stats hidden if `codeLedger.enabled: false` or fetch fails (Tasks 5, 7, 8)
- [x] **B (fresh data)**: 2-min cache-bust on index.json, auto-refresh interval (Task 5)
- [x] **C**: projects.ignore filter, code-ledger topic detection, special card (Tasks 3, 10)
- [x] **D+E**: llms.txt, /api/*.json, .well-known/ai-plugin.json, CORS headers (Task 13)
- [x] **F**: CFlair-Counter base URL updated, event tracking added (Tasks 11-12)
- [x] **H**: Image skeleton, error fallback, masonry recalc fix (Task 2)
- [x] **PortfolioForge spec**: Written to `docs/superpowers/specs/` (separate file)
- [x] No TBD or TODO placeholders
- [x] All imports listed in each task
- [x] Type/function names consistent across tasks
