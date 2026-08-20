import { useState, useEffect, useCallback, useRef } from "react"
import { fetchSettings } from "../utils/settingsCache"

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
	const ago7 = new Date(now.getTime() - 7 * 86400000)
	const ago30 = new Date(now.getTime() - 30 * 86400000)
	let last7Days = 0,
		last30Days = 0

	problems.forEach((p) => {
		if (!p.timestamp) return
		const d = new Date(toMs(p.timestamp))
		const key = dayKey(d)
		dayMap[key] = (dayMap[key] || 0) + 1
		if (d >= ago7) last7Days++
		if (d >= ago30) last30Days++
	})

	// Current streak (consecutive days going backwards from today)
	let currentStreak = 0
	for (let i = 0; i < 730; i++) {
		const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
		if (dayMap[dayKey(d)]) currentStreak++
		else break
	}

	// Longest streak (scan last 730 days forward)
	let longestStreak = 0,
		run = 0
	for (let i = 729; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
		if (dayMap[dayKey(d)]) {
			run++
			if (run > longestStreak) longestStreak = run
		} else {
			run = 0
		}
	}

	// Active days + average solves per active day (all time)
	const activeDays = Object.keys(dayMap).length
	const totalSolves = Object.values(dayMap).reduce((a, b) => a + b, 0)
	const avgPerActiveDay = activeDays ? totalSolves / activeDays : 0

	// Monthly velocity — last 12 months, split by difficulty
	const monthly = []
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
		monthly.push({
			key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
			label: d.toLocaleDateString("en-US", { month: "short" }),
			easy: 0,
			medium: 0,
			hard: 0,
			total: 0,
		})
	}
	const monthIndex = {}
	monthly.forEach((m, i) => {
		monthIndex[m.key] = i
	})
	problems.forEach((p) => {
		if (!p.timestamp) return
		const d = new Date(toMs(p.timestamp))
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
		const idx = monthIndex[key]
		if (idx === undefined) return
		const m = monthly[idx]
		m.total++
		if (p.difficulty === "Easy") m.easy++
		else if (p.difficulty === "Medium") m.medium++
		else if (p.difficulty === "Hard") m.hard++
	})

	return {
		last7Days,
		last30Days,
		currentStreak,
		longestStreak,
		dayMap,
		activeDays,
		avgPerActiveDay,
		monthly,
	}
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
			const settings = await fetchSettings()
			const cfg = settings.codeLedger
			setConfig(cfg)

			if (!cfg?.enabled || !cfg?.pagesUrl) {
				setData(null)
				setLoading(false)
				return
			}

			// Cache-bust every 2 minutes so data stays fresh as new solves are committed
			const cacheBuster = Math.floor(Date.now() / REFRESH_INTERVAL_MS)
			const fetchOpts = force ? { cache: "no-store" } : {}

			// Auto-fallback: try custom domain first, then github.io URL
			const primaryBase = cfg.pagesUrl.replace(/\/$/, "")
			const fallbackBase =
				cfg.repoOwner && cfg.repoName
					? `https://${cfg.repoOwner}.github.io/${cfg.repoName}`
					: null

			const tryFetch = async (base) => {
				const res = await fetch(`${base}/index.json?v=${cacheBuster}`, fetchOpts)
				if (!res.ok) throw new Error(`HTTP ${res.status} from ${base}`)
				return res.json()
			}

			let json
			try {
				json = await tryFetch(primaryBase)
			} catch (primaryErr) {
				if (fallbackBase && fallbackBase !== primaryBase) {
					console.warn("[CodeLedger] Primary URL failed, trying fallback:", primaryErr.message)
					json = await tryFetch(fallbackBase)
				} else {
					throw primaryErr
				}
			}
			const problems = json.problems || []
			const computed = computeStats(problems)

			// Top topics by frequency
			const topicMap = {}
			problems.forEach((p) => {
				;(p.tags || []).forEach((tag) => {
					topicMap[tag] = (topicMap[tag] || 0) + 1
				})
			})
			const topTopics = Object.entries(topicMap)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 8)

			// Recent 10 solves sorted by timestamp descending
			const recentProblems = [...problems]
				.sort((a, b) => toMs(b.timestamp) - toMs(a.timestamp))
				.slice(0, 10)

			// Languages — prefer the pre-computed stats block, fall back to per-problem
			let langMap = json.stats?.byLang
			if (!langMap || !Object.keys(langMap).length) {
				langMap = {}
				problems.forEach((p) => {
					const name = p.lang?.name || p.language
					if (name) langMap[name] = (langMap[name] || 0) + 1
				})
			}
			// The raw map duplicates casing variants ("python3" vs "Python3") and
			// LeetCode's Python/Python3 split, and carries an "Unknown" bucket —
			// fold before ranking so each language shows as one bar
			const merged = {}
			Object.entries(langMap).forEach(([name, count]) => {
				const lower = name.trim().toLowerCase()
				if (lower === "unknown") return
				const key = lower === "python3" ? "python" : lower
				if (!merged[key]) {
					merged[key] = {
						label: key === "python" ? "Python" : name.trim(),
						count: 0,
						best: 0,
					}
				}
				merged[key].count += count
				if (count > merged[key].best && key !== "python") {
					merged[key].best = count
					merged[key].label = name.trim()
				}
			})
			const topLanguages = Object.values(merged)
				.map((m) => [m.label, m.count])
				.sort((a, b) => b[1] - a[1])
				.slice(0, 8)

			// Platforms — same preference order
			let platMap = json.stats?.byPlatform
			if (!platMap || !Object.keys(platMap).length) {
				platMap = {}
				problems.forEach((p) => {
					if (p.platform) platMap[p.platform] = (platMap[p.platform] || 0) + 1
				})
			}
			const platforms = Object.entries(platMap).sort((a, b) => b[1] - a[1])

			setData({
				stats: json.stats || {},
				problems,
				recentProblems,
				topTopics,
				topLanguages,
				platforms,
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
