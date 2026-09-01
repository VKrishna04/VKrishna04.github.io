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
 * Regenerates public/sitemap.xml and public/robots.txt from settings.json + the
 * generated project index. Both files used to be hand-maintained, which meant
 * every new project page was invisible to crawlers until someone remembered to
 * add it, and robots.txt pointed at the upstream author's sitemap in every fork.
 *
 * Run after scripts/fetch-project-manifests.js and before `vite build`.
 */

/* global process */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const PUBLIC = path.join(ROOT, "public")

// Crawlers that read the site to train or ground a model, as opposed to
// indexing it for search. seo.crawling.aiTraining decides whether they are
// welcome; naming them individually is the only thing robots.txt understands.
const AI_CRAWLERS = [
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-Web",
	"anthropic-ai",
	"PerplexityBot",
	"Google-Extended",
	"Applebot-Extended",
	"CCBot",
	"Bytespider",
	"meta-externalagent",
]

// changefreq/priority per static route. Project pages are derived below.
const STATIC = [
	{ path: "/", changefreq: "weekly", priority: "1.0" },
	{ path: "/about", changefreq: "monthly", priority: "0.8" },
	{ path: "/projects", changefreq: "weekly", priority: "0.9" },
	{ path: "/resume", changefreq: "monthly", priority: "0.7" },
	{ path: "/stats", changefreq: "daily", priority: "0.6" },
	{ path: "/contact", changefreq: "monthly", priority: "0.7" },
]

function readJson(file, fallback) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf8"))
	} catch {
		return fallback
	}
}

function main() {
	const settings = readJson(path.join(PUBLIC, "settings.json"), {})
	const base = (settings.seo?.canonical || settings.seo?.customDomain || "").replace(/\/$/, "")
	// lastmod = the date of the commit being deployed, not "today". Stamping
	// today's date on every build makes every URL look freshly changed on every
	// deploy, which crawlers learn to ignore.
	let lastmod
	try {
		lastmod = execSync("git log -1 --format=%cs", { cwd: ROOT })
			.toString()
			.trim()
	} catch {
		lastmod = ""
	}
	if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
		lastmod = new Date().toISOString().slice(0, 10)
	}

	const index = readJson(
		path.join(PUBLIC, "data", "projects", "index.json"),
		{ projects: [] }
	)

	// A featured project is worth more crawl budget than a thin archive repo,
	// and a page with real manifest content more than a settings-only stub.
	const projects = (index.projects || []).map((p) => ({
		path: `/projects/${p.slug}`,
		changefreq: "monthly",
		priority: p.featured ? "0.8" : p.source === "manifest" ? "0.7" : "0.5",
	}))

	const urls = [...STATIC, ...projects]
	const body = urls
		.map(
			(u) =>
				`\t<url>\n\t\t<loc>${base}${u.path}</loc>\n` +
				`\t\t<lastmod>${lastmod}</lastmod>\n` +
				`\t\t<changefreq>${u.changefreq}</changefreq>\n` +
				`\t\t<priority>${u.priority}</priority>\n\t</url>`
		)
		.join("\n")

	const xml =
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
		body +
		"\n</urlset>\n"

	fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), xml)
	console.log(
		`✅ Sitemap: ${urls.length} URLs (${STATIC.length} pages + ${projects.length} projects)`
	)

	writeRobots(settings, base)
}

/*
 * robots.txt, from the same settings the sitemap came from. It was a static
 * file with a hard-coded Sitemap: line, so a fork advertised the original
 * author's sitemap as its own.
 */
function writeRobots(settings, base) {
	const crawling = settings.seo?.crawling || {}
	const allowSearch = crawling.search !== false
	const allowAi = crawling.aiTraining !== false

	const lines = ["User-agent: *", allowSearch ? "Allow: /" : "Disallow: /"]

	if (!allowAi) {
		lines.push("")
		lines.push("# AI and LLM crawlers are not permitted (seo.crawling.aiTraining)")
		AI_CRAWLERS.forEach((bot) => {
			lines.push("")
			lines.push(`User-agent: ${bot}`)
			lines.push("Disallow: /")
		})
	}

	if (base) {
		lines.push("")
		lines.push(`Sitemap: ${base}/sitemap.xml`)
	}

	fs.writeFileSync(
		path.join(PUBLIC, "robots.txt"),
		lines.join("\n") + "\n"
	)
	console.log(
		`✅ robots.txt: search ${allowSearch ? "allowed" : "blocked"}, AI crawlers ${allowAi ? "allowed" : "blocked"}`
	)
}

try {
	main()
} catch (e) {
	console.warn("⚠️ Sitemap/robots step failed:", e.message)
	process.exitCode = 0
}
