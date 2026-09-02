#!/usr/bin/env node

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
 * Live package-registry stats.
 *
 * A project declares where it is published via `packages` on its
 * settings.json entry; this fetches the real numbers at build time and writes
 * public/data/project-stats.json. Nothing here is estimated - a registry that
 * cannot be reached contributes no number rather than a guessed one, and the
 * last committed file is kept so a network blip never regresses a page to zero.
 */

import fs from "fs"
import path from "path"
import process from "process"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const SETTINGS = path.join(ROOT, "public", "settings.json")
const OUT = path.join(ROOT, "public", "data", "project-stats.json")
const TIMEOUT_MS = 10000

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ""
const nf = new Intl.NumberFormat("en-US")

async function get(url, init = {}) {
	const res = await fetch(url, {
		...init,
		signal: AbortSignal.timeout(TIMEOUT_MS),
		headers: {
			"User-Agent": "VKrishna04-Portfolio-Stats",
			...(init.headers || {}),
		},
	})
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
	return res.json()
}

/*
 * One fetcher per registry. Each resolves to { label, value, detail?, url }
 * or null when the registry has nothing to say. Throwing is fine - the caller
 * isolates failures so one dead registry cannot fail a build.
 */
const registries = {
	async npm(id) {
		const d = await get(`https://api.npmjs.org/downloads/point/last-year/${id}`)
		if (typeof d.downloads !== "number") return null
		return {
			label: "npm downloads",
			value: nf.format(d.downloads),
			detail: "last 12 months",
			url: `https://www.npmjs.com/package/${id}`,
		}
	},

	async crates(id) {
		const d = await get(`https://crates.io/api/v1/crates/${id}`)
		if (!d.crate) return null
		return {
			label: "crates.io downloads",
			value: nf.format(d.crate.downloads),
			detail: `v${d.crate.max_version}`,
			url: `https://crates.io/crates/${id}`,
		}
	},

	async pypi(id) {
		// pypistats rate-limits hard; the version is always available from PyPI
		// itself, so fall back to that rather than dropping the row entirely.
		const meta = await get(`https://pypi.org/pypi/${id}/json`)
		const out = {
			label: "PyPI",
			value: `v${meta.info.version}`,
			url: `https://pypi.org/project/${id}/`,
		}
		try {
			const s = await get(`https://pypistats.org/api/packages/${id}/recent`)
			if (s && s.data && typeof s.data.last_month === "number") {
				out.label = "PyPI downloads"
				out.value = nf.format(s.data.last_month)
				out.detail = "last 30 days"
			}
		} catch {
			/* version-only is still a true statement */
		}
		return out
	},

	async openvsx(id) {
		const [ns, name] = id.split("/")
		const d = await get(`https://open-vsx.org/api/${ns}/${name}`)
		if (typeof d.downloadCount !== "number") return null
		return {
			label: "Open VSX downloads",
			value: nf.format(d.downloadCount),
			detail: `v${d.version}`,
			url: `https://open-vsx.org/extension/${ns}/${name}`,
		}
	},

	async vscode(id) {
		const d = await get(
			"https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json;api-version=7.2-preview.1",
				},
				body: JSON.stringify({
					filters: [{ criteria: [{ filterType: 7, value: id }] }],
					flags: 914,
				}),
			}
		)
		const ext =
			d && d.results && d.results[0] && d.results[0].extensions
				? d.results[0].extensions[0]
				: null
		if (!ext) return null
		const stat = (ext.statistics || []).find(
			(s) => s.statisticName === "install"
		)
		if (!stat) return null
		return {
			label: "VS Code installs",
			value: nf.format(stat.value),
			detail: "Marketplace",
			url: `https://marketplace.visualstudio.com/items?itemName=${id}`,
		}
	},

	async ghreleases(id) {
		const d = await get(
			`https://api.github.com/repos/${id}/releases?per_page=100`,
			token ? { headers: { Authorization: `Bearer ${token}` } } : {}
		)
		if (!Array.isArray(d) || d.length === 0) return null
		const total = d.reduce(
			(sum, rel) =>
				sum +
				(rel.assets || []).reduce((a, x) => a + (x.download_count || 0), 0),
			0
		)
		if (total === 0) return null
		return {
			label: "Release downloads",
			value: nf.format(total),
			detail: `${d.length} release${d.length === 1 ? "" : "s"}`,
			url: `https://github.com/${id}/releases`,
		}
	},

	// Not a download count - a third party vouching for the project, which is
	// worth more on a portfolio than any of the numbers above.
	async schemastore(id) {
		const cat = await get("https://www.schemastore.org/api/json/catalog.json")
		const hit = (cat.schemas || []).find((s) => s.name === id)
		if (!hit) return null
		return {
			label: "SchemaStore",
			value: id,
			detail: "in the official catalog",
			url: "https://www.schemastore.org/",
		}
	},
}

function readJson(file, fallback) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf8"))
	} catch {
		return fallback
	}
}

async function statsFor(project) {
	const out = []
	for (const pkg of project.packages || []) {
		const fn = registries[pkg.registry]
		if (!fn) {
			console.warn(`  ?  unknown registry "${pkg.registry}"`)
			continue
		}
		try {
			const entry = await fn(pkg.id)
			if (entry) {
				out.push({ registry: pkg.registry, ...entry })
				console.log(`  ok ${pkg.registry}: ${entry.label} = ${entry.value}`)
			} else {
				console.log(`  -  ${pkg.registry}: no data`)
			}
		} catch (err) {
			console.warn(`  !  ${pkg.registry} (${pkg.id}): ${err.message}`)
		}
	}
	return out
}

async function main() {
	const settings = readJson(SETTINGS, null)
	if (!settings) {
		console.error("settings.json unreadable - skipping stats")
		return
	}

	const projects = (settings.projects?.staticProjects || []).filter(
		(p) => (p.packages || []).length > 0
	)

	if (projects.length === 0) {
		console.log("No projects declare packages - nothing to fetch.")
		return
	}

	console.log(`Fetching live stats for ${projects.length} project(s)...`)
	if (!token) {
		console.log("  (no GITHUB_TOKEN - release counts use the anonymous limit)")
	}

	const previous = readJson(OUT, { projects: {} })
	const result = {}
	let fromCache = 0

	for (const p of projects) {
		console.log(`\n${p.name}`)
		const entries = await statsFor(p)
		if (entries.length > 0) {
			result[p.name] = entries
		} else if (previous.projects && previous.projects[p.name]) {
			// Every registry failed. Keeping the last good numbers beats
			// publishing a page that silently lost its metrics.
			console.warn("  -> all sources failed; keeping committed stats")
			result[p.name] = previous.projects[p.name]
			fromCache++
		}
	}

	// Compare without the timestamp so an unchanged run does not churn CI.
	if (JSON.stringify(previous.projects || {}) === JSON.stringify(result)) {
		console.log("\nStats unchanged.")
		return
	}

	fs.mkdirSync(path.dirname(OUT), { recursive: true })
	fs.writeFileSync(
		OUT,
		JSON.stringify({ generatedAt: new Date().toISOString(), projects: result }, null, "\t") + "\n"
	)
	console.log(
		`\nWrote ${path.relative(ROOT, OUT)} - ${Object.keys(result).length} projects, ${fromCache} from cache`
	)
}

main().catch((err) => {
	// Never fail the build over stats. The committed file stays in place.
	console.error("Stats fetch failed:", err.message)
})
