/*
 * Copyright 2025 Krishna GSVV
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useCodeLedgerStats } from "../hooks/useCodeLedgerStats"
import { DSAHeatmap } from "../components/DSAHeatmap"

// ── helpers ──────────────────────────────────────────────────────────────────

function timeSinceLabel(date) {
	if (!date) return "—"
	const secs = Math.floor((Date.now() - date.getTime()) / 1000)
	if (secs < 60) return "just now"
	const mins = Math.floor(secs / 60)
	if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`
	const hrs = Math.floor(mins / 60)
	if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`
	return `${Math.floor(hrs / 24)} days ago`
}

function solveDate(ts) {
	const ms = Number(ts) > 1e12 ? Number(ts) : Number(ts) * 1000
	return new Date(ms).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	})
}

const DIFF_BADGE = {
	Easy: {
		label: "E",
		color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
	},
	Medium: {
		label: "M",
		color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
	},
	Hard: {
		label: "H",
		color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
	},
}

// ── skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard({ className = "" }) {
	return (
		<div
			className={`p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl animate-pulse ${className}`}
		/>
	)
}

function StatsSkeleton() {
	return (
		<div className="min-h-screen bg-gray-950 px-4 py-20 md:px-8">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Header */}
				<div className="space-y-3 animate-pulse">
					<div className="h-8 w-48 bg-white/[0.06] rounded-xl" />
					<div className="h-4 w-72 bg-white/[0.04] rounded-lg" />
					<div className="flex gap-3 pt-1">
						<div className="h-8 w-24 bg-white/[0.04] rounded-lg" />
						<div className="h-8 w-36 bg-white/[0.04] rounded-lg" />
					</div>
				</div>

				{/* Stat cards */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<SkeletonCard key={i} className="h-24" />
					))}
				</div>

				{/* Heatmap */}
				<SkeletonCard className="h-40" />

				{/* Two-column */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<SkeletonCard className="h-64" />
					<SkeletonCard className="h-64" />
				</div>
			</div>
		</div>
	)
}

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accentColor, delay = 0 }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, delay }}
			className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex flex-col gap-1 min-w-0"
		>
			<span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] truncate">
				{label}
			</span>
			<span
				className="text-2xl font-bold text-slate-100 leading-tight"
				style={{ color: accentColor }}
			>
				{value}
			</span>
			{sub && (
				<span className="text-[11px] text-slate-500 leading-tight truncate">
					{sub}
				</span>
			)}
		</motion.div>
	)
}

// ── verified badge ────────────────────────────────────────────────────────────

function VerifiedBadge({ repoOwner, repoName }) {
	if (!repoOwner || !repoName) return null
	return (
		<a
			href={`https://github.com/${repoOwner}/${repoName}`}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-150 no-underline"
			title={`Data verified from ${repoOwner}/${repoName} via CodeLedger`}
		>
			<svg
				viewBox="0 0 20 20"
				fill="currentColor"
				className="w-3 h-3 shrink-0"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					clipRule="evenodd"
				/>
			</svg>
			Verified by CodeLedger
		</a>
	)
}

// ── main component ────────────────────────────────────────────────────────────

const Stats = () => {
	const { data, loading, error, lastUpdated, config, refresh } =
		useCodeLedgerStats()
	const [timeSince, setTimeSince] = useState(() => timeSinceLabel(lastUpdated))

	// Update "X minutes ago" every 30 seconds
	useEffect(() => {
		setTimeSince(timeSinceLabel(lastUpdated))
		const id = setInterval(
			() => setTimeSince(timeSinceLabel(lastUpdated)),
			30_000
		)
		return () => clearInterval(id)
	}, [lastUpdated])

	if (loading) return <StatsSkeleton />
	if (!data || error) return null

	const {
		stats,
		topTopics,
		recentProblems,
		dayMap,
		last7Days,
		last30Days,
		currentStreak,
		longestStreak,
		pagesUrl,
	} = data

	const maxTopicCount = topTopics.length ? topTopics[0][1] : 1

	const statCards = [
		{
			label: "Total Solved",
			value: (stats.easy ?? 0) + (stats.medium ?? 0) + (stats.hard ?? 0),
			sub: `${stats.easy ?? 0}E · ${stats.medium ?? 0}M · ${stats.hard ?? 0}H`,
			accentColor: "#06b6d4",
		},
		{
			label: "Easy",
			value: stats.easy ?? 0,
			accentColor: "#34d399",
		},
		{
			label: "Medium",
			value: stats.medium ?? 0,
			accentColor: "#fbbf24",
		},
		{
			label: "Hard",
			value: stats.hard ?? 0,
			accentColor: "#f87171",
		},
		{
			label: "Streak",
			value: `${currentStreak}d`,
			sub: `Best: ${longestStreak} days`,
			accentColor: "#10b981",
		},
		{
			label: "Last 30 Days",
			value: last30Days,
			sub: `${last7Days} last 7 days`,
			accentColor: "#a855f7",
		},
	]

	return (
		<div className="min-h-screen bg-gray-950 px-4 py-20 md:px-8">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45 }}
					className="space-y-2"
				>
					<div className="flex items-center gap-3 flex-wrap">
						<h1 className="text-3xl font-bold text-slate-100">DSA Progress</h1>
						<VerifiedBadge repoOwner={config?.repoOwner} repoName={config?.repoName} />
					</div>
					<p className="text-sm text-slate-400">
						Tracked by{" "}
						<a
							href="https://codeledger.vkrishna04.me/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-400 hover:text-cyan-300"
						>
							CodeLedger
						</a>{" "}
						at{" "}
						<a
							href={`https://github.com/${config?.repoOwner}/${config?.repoName}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-400 hover:text-cyan-300"
						>
							{config?.repoOwner}/{config?.repoName}
						</a>
						&nbsp;·&nbsp;Updated {timeSince}
					</p>
					<div className="flex flex-wrap gap-3 pt-1">
						<button
							onClick={refresh}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-300 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-lg transition-colors duration-150"
						>
							↺ Refresh
						</button>
						<a
							href={`https://github.com/${config?.repoOwner}/${config?.repoName}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-300 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-lg transition-colors duration-150"
						>
							View Repo ↗
						</a>
						<a
							href={pagesUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 bg-cyan-400/[0.06] hover:bg-cyan-400/[0.10] border border-cyan-400/20 rounded-lg transition-colors duration-150"
						>
							Open Dashboard ↗
						</a>
					</div>
				</motion.div>

				{/* Stat cards */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					{statCards.map((card, i) => (
						<StatCard key={card.label} {...card} delay={0.05 * i} />
					))}
				</div>

				{/* Heatmap */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, delay: 0.35 }}
					className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
				>
					<span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] block mb-4">
						Activity — Last 12 Months
					</span>
					<DSAHeatmap dayMap={dayMap} />
				</motion.div>

				{/* Two-column: Topics + Recent */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Top Topics */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.45 }}
						className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
					>
						<span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] block mb-4">
							Top Topics
						</span>
						{topTopics.length === 0 ? (
							<p className="text-sm text-slate-500">No data yet.</p>
						) : (
							<div className="space-y-2.5">
								{topTopics.map(([topic, count], i) => (
									<div key={topic} className="flex items-center gap-3 min-w-0">
										<span
											className="text-sm text-slate-300 truncate w-36 shrink-0"
											title={topic}
										>
											{topic}
										</span>
										<div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
											<motion.div
												className="h-full bg-cyan-500/70 rounded-full"
												initial={{ width: 0 }}
												animate={{ width: `${(count / maxTopicCount) * 100}%` }}
												transition={{ duration: 0.6, delay: 0.5 + i * 0.05 }}
											/>
										</div>
										<span className="text-xs text-slate-500 w-6 text-right shrink-0">
											{count}
										</span>
									</div>
								))}
							</div>
						)}
					</motion.div>

					{/* Recent Solves */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, delay: 0.5 }}
						className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
					>
						<span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] block mb-4">
							Recent Solves
						</span>
						{recentProblems.length === 0 ? (
							<p className="text-sm text-slate-500">No solves yet.</p>
						) : (
							<div className="space-y-2">
								{recentProblems.map((p, i) => {
									const diff = p.difficulty || "Easy"
									const badge = DIFF_BADGE[diff] || DIFF_BADGE.Easy
									return (
										<motion.div
											key={p.titleSlug || p.title || i}
											initial={{ opacity: 0, x: -8 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: 0.55 + i * 0.04 }}
											className="flex items-center gap-2.5 min-w-0"
										>
											<span
												className={`inline-flex items-center justify-center text-[10px] font-bold w-5 h-5 rounded border shrink-0 ${badge.color}`}
											>
												{badge.label}
											</span>
											<span
												className="text-sm text-slate-300 truncate flex-1"
												title={p.title}
											>
												{p.title}
											</span>
											<span className="text-[11px] text-slate-500 shrink-0">
												{solveDate(p.timestamp)}
											</span>
										</motion.div>
									)
								})}
							</div>
						)}
					</motion.div>
				</div>

				{/* Footer */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.45, delay: 0.65 }}
					className="text-center text-[11px] text-slate-600"
				>
					Data from{" "}
					<a
						href={pagesUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-500 hover:text-slate-400 transition-colors duration-150"
					>
						{config?.repoOwner}/{config?.repoName}
					</a>{" "}
					·{" "}
					<a
						href="https://codeledger.vkrishna04.me"
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-500 hover:text-slate-400 transition-colors duration-150"
					>
						CodeLedger
					</a>
				</motion.p>
			</div>
		</div>
	)
}

export default Stats
