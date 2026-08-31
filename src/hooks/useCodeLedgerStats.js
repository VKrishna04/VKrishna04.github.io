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

	// Rhythm: which weekdays and which hours the solving actually happens on.
	// Both come straight off the timestamps already in the feed.
	const byWeekday = Array.from({ length: 7 }, () => 0)
	const byHour = Array.from({ length: 24 }, () => 0)
	let firstSolve = null
	problems.forEach((p) => {
		if (!p.timestamp) return
		const d = new Date(toMs(p.timestamp))
		byWeekday[d.getDay()]++
		byHour[d.getHours()]++
		if (!firstSolve || d < firstSolve) firstSolve = d
	})

	// Momentum — calendar month to date against the same span last month, so a
	// mid-month comparison is not flattered by a full previous month
	const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
	const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
	const prevMonthKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`
	const thisMonth = monthly[monthIndex[thisMonthKey]]?.total ?? 0
	const lastMonth = monthly[monthIndex[prevMonthKey]]?.total ?? 0
	const monthsTracked = firstSolve
		? Math.max(1, Math.round((now - firstSolve) / 2629800000))
		: 0

	return {
		last7Days,
		last30Days,
		currentStreak,
		longestStreak,
		dayMap,
		activeDays,
		avgPerActiveDay,
		monthly,
		byWeekday,
		byHour,
		firstSolve,
		thisMonth,
		lastMonth,
		monthsTracked,
	}
}

// Shared shaping for both the build-time snapshot and the live feed, so the
// prerendered HTML and the hydrated page compute identical numbers.
function buildData(json, pagesUrl) {
	const problems = json.problems || []
	const computed = computeStats(problems)

	// Top topics by frequency
	const topicMap = {}
	problems.forEach((p) => {
		;(p.tags || []).forEach((tag) => {
			topicMap[tag] = (topicMap[tag] || 0) + 1
		})
	})
	const allTopics = Object.entries(topicMap).sort((a, b) => b[1] - a[1])
	const topTopics = allTopics.slice(0, 8)
	const topicCount = allTopics.length

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

	return {
		stats: json.stats || {},
		problems,
		recentProblems,
		topTopics,
		topicCount,
		topLanguages,
		platforms,
		updatedAt: json.updatedAt,
		pagesUrl,
		...computed,
	}
}

export function useCodeLedgerStats() {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [lastUpdated, setLastUpdated] = useState(null)
	const [config, setConfig] = useState(null)
	const intervalRef = useRef(null)
	const hasDataRef = useRef(false)

	const publish = useCallback((json, pagesUrl, stamp) => {
		setData(buildData(json, pagesUrl))
		setError(null)
		setLoading(false)
		hasDataRef.current = true
		if (stamp) setLastUpdated(new Date())
	}, [])

	const fetchStats = useCallback(
		async (force = false) => {
			const settings = await fetchSettings()
			const cfg = settings.codeLedger
			setConfig(cfg)

			if (!cfg?.enabled || !cfg?.pagesUrl) {
				setData(null)
				setLoading(false)
				return
			}

			// 1. Build-time snapshot — same origin, no rate limit, always present.
			// This is what the prerenderer captures, so /stats has real numbers
			// in its HTML instead of a skeleton.
			if (!hasDataRef.current) {
				try {
					const res = await fetch("/data/codeledger.json", {
						signal: AbortSignal.timeout(8000),
					})
					if (res.ok) {
						const snapshot = await res.json()
						if (snapshot.problems?.length) publish(snapshot, cfg.pagesUrl, false)
					}
				} catch (e) {
					console.warn("[CodeLedger] Snapshot unavailable:", e.message)
				}
			}

			// 2. Live refresh — upgrades the snapshot with anything solved since
			// the last build. A failure here leaves the snapshot on screen.
			try {
				const cacheBuster = Math.floor(Date.now() / REFRESH_INTERVAL_MS)
				const fetchOpts = force ? { cache: "no-store" } : {}
				const primaryBase = cfg.pagesUrl.replace(/\/$/, "")
				const fallbackBase =
					cfg.repoOwner && cfg.repoName
						? `https://${cfg.repoOwner}.github.io/${cfg.repoName}`
						: null

				const tryFetch = async (base) => {
					const res = await fetch(`${base}/index.json?v=${cacheBuster}`, {
						...fetchOpts,
						signal: AbortSignal.timeout(15000),
					})
					if (!res.ok) throw new Error(`HTTP ${res.status} from ${base}`)
					return res.json()
				}

				let json
				try {
					json = await tryFetch(primaryBase)
				} catch (primaryErr) {
					if (fallbackBase && fallbackBase !== primaryBase) {
						console.warn(
							"[CodeLedger] Primary URL failed, trying fallback:",
							primaryErr.message
						)
						json = await tryFetch(fallbackBase)
					} else {
						throw primaryErr
					}
				}
				publish(json, cfg.pagesUrl, true)
			} catch (e) {
				console.warn("[CodeLedger] Failed to refresh stats:", e.message)
				// Only surface an error if there is nothing at all to show
				if (!hasDataRef.current) setError(e.message)
			} finally {
				setLoading(false)
			}
		},
		[publish]
	)

	useEffect(() => {
		fetchStats()
		intervalRef.current = setInterval(() => fetchStats(), REFRESH_INTERVAL_MS)
		return () => clearInterval(intervalRef.current)
	}, [fetchStats])

	return {
		data,
		loading,
		error,
		lastUpdated,
		config,
		refresh: () => fetchStats(true),
	}
}
