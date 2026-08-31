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
 * Builds the data behind /projects/<slug>.
 *
 * Two layers, so a project page exists whether or not its repo opts in:
 *
 *   1. Base     — derived from settings.json staticProjects. Always present.
 *   2. Manifest — .portfolio/project.json fetched from the project's own repo
 *                 at build time. Overrides and extends the base with content
 *                 the repo owns: long-form sections, metrics, screenshots.
 *
 * Fetch failures are non-fatal at every level: a repo without a manifest keeps
 * its base page, and a network failure keeps whatever was committed last time.
 * The build never ships an empty project page.
 */

/* global process */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const OUT_DIR = path.join(ROOT, "public", "data", "projects")
const TIMEOUT_MS = 10000
const MANIFEST_PATH = ".portfolio/project.json"

// Section shapes the renderer knows about. Anything else is dropped here
// rather than in the browser, so an unknown type can never break a page.
const SECTION_TYPES = new Set(["prose", "list", "code", "table", "media"])

// Deliberately does NOT split camelCase: the slug should be the repo name a
// person would guess and type ("equilens", not "equi-lens"). A repo that wants
// a different slug sets one in its manifest.
export function slugify(value) {
	return String(value || "")
		.replace(/[_\s.]+/g, "-")
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
}

function parseRepo(githubUrl) {
	const m = /github\.com\/([^/]+)\/([^/#?]+)/.exec(githubUrl || "")
	return m ? { owner: m[1], repo: m[2].replace(/\.git$/, "") } : null
}

// A page is only worth its own URL if it says something the card did not.
// Track how much each project actually has so the build report is honest.
function depthScore(project) {
	return (
		(project.sections?.length || 0) * 3 +
		(project.highlights?.length || 0) +
		(project.metrics?.length || 0) * 2 +
		(project.media?.screenshots?.length || 0) * 2
	)
}

function baseFromSettings(sp) {
	const repo = parseRepo(sp.githubUrl)
	return {
		slug: slugify(repo?.repo || sp.name),
		name: sp.name,
		tagline: sp.tagline || "",
		summary: sp.description || "",
		status: sp.status || "",
		category: sp.category || "",
		featured: !!sp.featured,
		role: "",
		period: { start: sp.startDate || null, end: sp.endDate || null },
		technologies: sp.technologies || [],
		tags: sp.tags || [],
		highlights: sp.highlights || [],
		metrics: [],
		links: {
			repo: sp.githubUrl || "",
			live: sp.liveUrl || "",
			demo: sp.demoUrl || "",
			docs: sp.documentationUrl || "",
		},
		media: { cover: sp.imageUrl || "", screenshots: [] },
		sections: [],
		seo: null,
		stats: sp.stats || null,
		source: "settings",
		repo: repo ? `${repo.owner}/${repo.repo}` : null,
		manifestUrl: repo
			? `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/HEAD/${MANIFEST_PATH}`
			: null,
	}
}

// Manifest wins field by field, but only where it actually said something — a
// repo that ships a partial manifest keeps the settings-derived rest.
function merge(base, manifest) {
	if (!manifest || typeof manifest !== "object") return base
	const pick = (a, b) =>
		b === undefined || b === null || b === "" || (Array.isArray(b) && !b.length)
			? a
			: b

	const sections = (manifest.sections || [])
		.filter((s) => s && SECTION_TYPES.has(s.type))
		.slice(0, 20)

	return {
		...base,
		slug: manifest.slug ? slugify(manifest.slug) : base.slug,
		name: pick(base.name, manifest.name),
		tagline: pick(base.tagline, manifest.tagline),
		summary: pick(base.summary, manifest.summary),
		status: pick(base.status, manifest.status),
		category: pick(base.category, manifest.category),
		role: manifest.role || "",
		period: {
			start: pick(base.period.start, manifest.period?.start),
			end: pick(base.period.end, manifest.period?.end),
		},
		technologies: pick(base.technologies, manifest.technologies),
		tags: pick(base.tags, manifest.tags),
		highlights: pick(base.highlights, manifest.highlights),
		metrics: (manifest.metrics || []).filter((m) => m?.label && m?.value),
		links: { ...base.links, ...(manifest.links || {}) },
		media: {
			cover: pick(base.media.cover, manifest.media?.cover),
			screenshots: (manifest.media?.screenshots || []).filter((s) => s?.url),
		},
		sections,
		seo: manifest.seo || null,
		manifestVersion: manifest.manifestVersion || 1,
		source: "manifest",
	}
}

async function fetchManifest(url) {
	const res = await fetch(url, {
		signal: AbortSignal.timeout(TIMEOUT_MS),
		headers: { Accept: "application/json" },
	})
	if (res.status === 404) return null // repo simply has not opted in yet
	if (!res.ok) throw new Error(`HTTP ${res.status}`)
	return res.json()
}

// Rewrite only when something other than the timestamp changed. Otherwise every
// build dirties 22 files and the CI auto-heal commits pure churn.
function writeIfChanged(file, payload) {
	const next = JSON.stringify(payload, null, "\t") + "\n"
	if (fs.existsSync(file)) {
		try {
			const prev = JSON.parse(fs.readFileSync(file, "utf8"))
			const strip = (o) =>
				JSON.stringify(o, (key, value) =>
					key === "generatedAt" ? undefined : value
				)
			if (strip(prev) === strip(payload)) return false
		} catch {
			/* unreadable — fall through and overwrite */
		}
	}
	fs.writeFileSync(file, next)
	return true
}

async function main() {
	const settings = JSON.parse(
		fs.readFileSync(path.join(ROOT, "public", "settings.json"), "utf8")
	)
	const staticProjects = (settings.projects?.staticProjects || []).filter(
		(p) => p.showInProjects !== false && p.githubUrl
	)

	fs.mkdirSync(OUT_DIR, { recursive: true })

	const index = []
	let withManifest = 0
	let kept = 0

	for (const sp of staticProjects) {
		const base = baseFromSettings(sp)
		if (!base.slug) {
			console.warn(`⚠️ ${sp.name}: could not derive a slug — skipped`)
			continue
		}

		let project = base
		if (base.manifestUrl) {
			try {
				const manifest = await fetchManifest(base.manifestUrl)
				if (manifest) {
					project = merge(base, manifest)
					withManifest++
				}
			} catch (e) {
				// Keep the last good manifest merge rather than silently
				// regressing a rich page to its settings-only version.
				const prev = path.join(OUT_DIR, `${base.slug}.json`)
				if (fs.existsSync(prev)) {
					try {
						const cached = JSON.parse(fs.readFileSync(prev, "utf8"))
						if (cached.source === "manifest") {
							project = cached
							kept++
						}
					} catch {
						/* fall through to the settings-derived base */
					}
				}
				console.warn(`⚠️ ${base.repo}: manifest fetch failed (${e.message})`)
			}
		}

		project.generatedAt = new Date().toISOString()
		writeIfChanged(path.join(OUT_DIR, `${project.slug}.json`), project)

		index.push({
			slug: project.slug,
			name: project.name,
			summary: project.summary,
			status: project.status,
			category: project.category,
			featured: project.featured,
			technologies: (project.technologies || []).slice(0, 8),
			cover: project.media?.cover || "",
			repo: project.repo,
			source: project.source,
			depth: depthScore(project),
		})
	}

	index.sort((a, b) => b.depth - a.depth || a.name.localeCompare(b.name))
	writeIfChanged(path.join(OUT_DIR, "index.json"), {
		generatedAt: new Date().toISOString(),
		count: index.length,
		projects: index,
	})

	const settingsOnly = index.length - withManifest - kept
	console.log(
		`✅ Project pages: ${index.length} generated — ${withManifest} from repo manifests, ${kept} kept from cache, ${settingsOnly} settings-only`
	)
	const thin = index.filter((p) => p.depth < 6).map((p) => p.slug)
	if (thin.length) {
		console.log(
			`ℹ️ Thin pages (add ${MANIFEST_PATH} to these repos): ${thin.join(", ")}`
		)
	}
}

main().catch((e) => {
	console.warn("⚠️ Project manifest step failed:", e.message)
	process.exitCode = 0
})
