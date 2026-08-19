import { useMemo, useState } from "react"

const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
]
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function dayKey(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function getCellColor(count, max) {
	if (!count) return "bg-white/[0.04] hover:bg-white/10"
	const ratio = count / Math.max(1, max)
	if (ratio <= 0.25) return "bg-cyan-900/50 hover:bg-cyan-900/80"
	if (ratio <= 0.5) return "bg-cyan-700/70 hover:bg-cyan-700"
	if (ratio <= 0.75) return "bg-cyan-500/80 hover:bg-cyan-500"
	return "bg-cyan-400 hover:bg-cyan-300"
}

export function DSAHeatmap({ dayMap = {} }) {
	const [tooltip, setTooltip] = useState(null)

	const { weeks, monthLabels, maxCount } = useMemo(() => {
		// Rolling window: exactly 1 year back from today (leap-year aware via setFullYear)
		const end = new Date()
		const start = new Date(end)
		start.setFullYear(start.getFullYear() - 1)
		start.setDate(start.getDate() + 1) // exclusive start so we get exactly 365/366 days

		// Snap to Sunday before range start
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
					})
					cur.setDate(cur.getDate() + 1)
				}
				const firstInRange = week.find((c) => c.inRange)
				if (firstInRange && firstInRange.month !== lastMonth) {
					monthLabels.push({
						weekIdx,
						name: MONTH_NAMES[firstInRange.month],
					})
					lastMonth = firstInRange.month
				}
				weeks.push(week)
				weekIdx++
			} else {
				cur.setDate(cur.getDate() + 1)
			}
		}

		const maxCount = weeks.flat().reduce((m, c) => (c.inRange ? Math.max(m, c.count) : m), 1)

		return { weeks, monthLabels, maxCount }
	}, [dayMap])

	return (
		<div className="w-full overflow-x-auto">
			<div className="min-w-[600px]">
				{/* Month labels */}
				<div className="flex mb-1 pl-7">
					{weeks.map((_, wi) => {
						const label = monthLabels.find((l) => l.weekIdx === wi)
						return (
							<div
								key={wi}
								className="flex-1 text-[9px] text-slate-500 whitespace-nowrap"
							>
								{label ? label.name : ""}
							</div>
						)
					})}
				</div>

				<div className="flex gap-0">
					{/* Day labels */}
					<div className="flex flex-col gap-[3px] pr-1 shrink-0 w-7">
						{DAY_LABELS.map((label, i) => (
							<div
								key={i}
								className="text-[9px] text-slate-600 h-[11px] flex items-center justify-end"
							>
								{label}
							</div>
						))}
					</div>

					{/* Week columns */}
					<div className="flex gap-[3px] flex-1">
						{weeks.map((week, wi) => (
							<div key={wi} className="flex flex-col gap-[3px] flex-1">
								{week.map((cell, di) => (
									<div
										key={di}
										style={{
											animation: `cl-fade-in 0.15s ease-out ${(wi * 7 + di) * 0.0008}s both`,
										}}
										className={`w-full h-[11px] rounded-[2px] cursor-pointer transition-colors duration-150 ${
											cell.inRange
												? getCellColor(cell.count, maxCount)
												: "bg-transparent cursor-default"
										}`}
										onMouseEnter={(e) => {
											if (!cell.inRange) return
											setTooltip({
												cell,
												x: e.clientX,
												y: e.clientY,
											})
										}}
										onMouseLeave={() => setTooltip(null)}
									></div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Legend */}
				<div className="flex items-center gap-1.5 mt-2 justify-end">
					<span className="text-[9px] text-slate-600">Less</span>
					{[
						"bg-white/[0.04]",
						"bg-cyan-900/50",
						"bg-cyan-700/70",
						"bg-cyan-500/80",
						"bg-cyan-400",
					].map((cls, i) => (
						<div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${cls}`} />
					))}
					<span className="text-[9px] text-slate-600">More</span>
				</div>
			</div>

			{/* Tooltip */}
			{tooltip && (
				<div
					className="fixed z-50 pointer-events-none bg-gray-900/95 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 shadow-2xl"
					style={{
						left: Math.min(
							tooltip.x + 12,
							(typeof window !== "undefined" ? window.innerWidth : 1200) - 180
						),
						top: tooltip.y - 60,
					}}
				>
					<div className="text-slate-400 mb-0.5">{tooltip.cell.date}</div>
					<div className="font-semibold text-cyan-400">
						{tooltip.cell.count}{" "}
						{tooltip.cell.count === 1 ? "solve" : "solves"}
					</div>
				</div>
			)}
		</div>
	)
}
