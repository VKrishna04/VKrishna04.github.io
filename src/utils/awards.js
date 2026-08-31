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

/**
 * Derives the hackathon prize total from the awards that actually list one.
 *
 * The total used to be typed by hand into six different strings (SEO
 * description, OG description, home, footer, the about stat card) and had
 * drifted away from the awards list it was supposed to summarise. Nobody
 * updates six strings when they win something.
 *
 * So: `resume.awards[].rewardAmount.amount` is the only place a prize figure
 * is written, and every sentence that quotes the total writes {{prizeTotal}}
 * instead of a number. Add an award, the total moves everywhere at once.
 *
 * Plain ESM with no imports on purpose — the browser loads this through
 * settingsCache.js and the build scripts import the same file, so there is
 * one implementation rather than a copy that can disagree.
 */

// Written in the Indian numbering system because every prize here is INR and
// "3.2L" is how the reader would say it. 300000 -> "3L", 320000 -> "3.2L".
function formatLakh(amount) {
	const lakhs = amount / 100000
	const text = Number.isInteger(lakhs) ? String(lakhs) : lakhs.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
	return `₹${text}L`
}

/**
 * Sum every award that records a prize.
 *
 * Awards with no `rewardAmount` are wins without prize money (or a prize we
 * have not been told) — they are counted in `unpriced` and deliberately
 * contribute zero rather than being guessed at.
 */
export function summarisePrizes(settings) {
	const awards = settings?.resume?.awards || []
	let total = 0
	const priced = []
	const unpriced = []
	const foreign = []

	for (const award of awards) {
		const amount = award?.rewardAmount?.amount
		if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
			// A marketplace listing is not a hackathon win; only flag entries
			// that look like a competition placement with no figure attached.
			unpriced.push(award?.name || "(unnamed award)")
			continue
		}
		const currency = award.rewardAmount.currency || "INR"
		if (currency !== "INR") {
			foreign.push(`${award?.name || "(unnamed)"} (${currency})`)
			continue
		}
		total += amount
		priced.push(award?.name || "(unnamed award)")
	}

	return { total, display: formatLakh(total), priced, unpriced, foreign }
}

/**
 * Replace {{prizeTotal}} anywhere it appears in the settings tree.
 *
 * Walks strings only. Returns a new object so a caller that keeps the raw
 * settings around (the integrity guard hashes the file on disk) is unaffected.
 */
export function resolveDerivedValues(settings) {
	const { display } = summarisePrizes(settings)
	const tokens = { "{{prizeTotal}}": display }

	const walk = (node) => {
		if (typeof node === "string") {
			let out = node
			for (const [token, value] of Object.entries(tokens)) {
				if (out.includes(token)) out = out.split(token).join(value)
			}
			return out
		}
		if (Array.isArray(node)) return node.map(walk)
		if (node && typeof node === "object") {
			const copy = {}
			for (const [key, value] of Object.entries(node)) copy[key] = walk(value)
			return copy
		}
		return node
	}

	return walk(settings)
}
