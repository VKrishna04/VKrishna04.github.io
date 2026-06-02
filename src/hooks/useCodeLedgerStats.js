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
	let thisMonth = 0,
		thisYear = 0

	problems.forEach((p) => {
		if (!p.timestamp) return
		const d = new Date(toMs(p.timestamp))
		const key = dayKey(d)
		dayMap[key] = (dayMap[key] || 0) + 1
		if (d.getFullYear() === now.getFullYear()) {
			thisYear++
			if (d.getMonth() === now.getMonth()) thisMonth++
		}
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
			const settingsRes = await fetch("/settings.json")
			const settings = await settingsRes.json()
			const cfg = settings.codeLedger
			setConfig(cfg)

			if (!cfg?.enabled || !cfg?.pagesUrl) {
				setLoading(false)
				return
			}

			// Cache-bust every 2 minutes so data stays fresh as new solves are committed
			const cacheBuster = Math.floor(Date.now() / REFRESH_INTERVAL_MS)
			const url = `${cfg.pagesUrl.replace(/\/$/, "")}/index.json?v=${cacheBuster}`

			const res = await fetch(url, force ? { cache: "no-store" } : {})
			if (!res.ok) throw new Error(`HTTP ${res.status}`)

			const json = await res.json()
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
