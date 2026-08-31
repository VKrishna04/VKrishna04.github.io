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

/*
 * Build-time snapshot of the CodeLedger (DSA) dataset.
 *
 * /stats used to be blank without JavaScript because every number on it came
 * from a runtime fetch to dsa.vkrishna04.me. This pulls the same data at build
 * time and commits a trimmed copy, so the prerendered HTML ships with real
 * numbers and the browser only refreshes them.
 *
 * Never fails the build: on any error the previously committed snapshot is
 * kept, so a flaky source can't ship an empty stats page.
 */


import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const OUT = path.join(ROOT, "public", "data", "codeledger.json")
const TIMEOUT_MS = 20000

// The solution source of every problem is ~90% of the payload and nothing on
// /stats renders it — drop it so the committed snapshot stays reviewable.
function trim(json) {
	return {
		updatedAt: json.updatedAt,
		snapshotAt: new Date().toISOString(),
		stats: json.stats || {},
		meta: json.meta || {},
		problems: (json.problems || []).map((p) => ({
			id: p.id,
			platform: p.platform,
			title: p.title,
			titleSlug: p.titleSlug,
			difficulty: p.difficulty,
			lang: p.lang,
			language: p.language,
			tags: p.tags,
			topic: p.topic,
			url: p.url,
			timestamp: p.timestamp,
		})),
	}
}

async function main() {
	const settings = JSON.parse(
		fs.readFileSync(path.join(ROOT, "public", "settings.json"), "utf8")
	)
	const cfg = settings.codeLedger
	if (!cfg?.enabled || !cfg?.pagesUrl) {
		console.log("ℹ️ CodeLedger disabled in settings — skipping snapshot")
		return
	}

	const bases = [cfg.pagesUrl.replace(/\/$/, "")]
	if (cfg.repoOwner && cfg.repoName) {
		const fallback = `https://${cfg.repoOwner}.github.io/${cfg.repoName}`
		if (!bases.includes(fallback)) bases.push(fallback)
	}

	for (const base of bases) {
		try {
			const res = await fetch(`${base}/index.json`, {
				signal: AbortSignal.timeout(TIMEOUT_MS),
			})
			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			const json = await res.json()
			const trimmed = trim(json)
			if (!trimmed.problems.length) throw new Error("source returned 0 problems")

			fs.mkdirSync(path.dirname(OUT), { recursive: true })
			fs.writeFileSync(OUT, JSON.stringify(trimmed, null, "\t") + "\n")
			const kb = (fs.statSync(OUT).size / 1024).toFixed(0)
			console.log(
				`✅ CodeLedger snapshot: ${trimmed.problems.length} problems from ${base} (${kb} KB)`
			)
			return
		} catch (e) {
			console.warn(`⚠️ CodeLedger fetch failed for ${base}: ${e.message}`)
		}
	}

	if (fs.existsSync(OUT)) {
		console.warn("⚠️ Keeping the previously committed CodeLedger snapshot")
	} else {
		console.warn("⚠️ No CodeLedger snapshot available — /stats will hydrate client-side only")
	}
}

main().catch((e) => {
	console.warn("⚠️ CodeLedger snapshot skipped:", e.message)
})
