#!/usr/bin/env node
/**
 * generate-sw.js — writes dist/sw.js after the build has produced dist/.
 *
 * This runs after prerender.js on purpose. Prerendering is what puts a real
 * /about/index.html and /projects/index.html on disk, and those files are the
 * whole reason a reload with no network can show the page you were on rather
 * than the browser's error screen.
 *
 * What gets precached is deliberately small: the HTML for every route, the
 * hashed assets that HTML pulls in, the settings and project data the app
 * reads on first paint, and the icons. The résumé PDF and the large images are
 * left out — they are not needed to render anything, and the runtime cache
 * picks them up if a visitor actually opens them.
 */

/* global process */

import crypto from "crypto"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const DIST = path.join(ROOT, "dist")

if (!fs.existsSync(DIST)) {
	console.error("✗ dist/ does not exist — run the build first")
	process.exit(1)
}

const BASE = (process.env.BASE_PATH || "/").replace(/\/?$/, "/")
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))

/** Files that never help offline and only make the install slower. */
const SKIP_EXACT = new Set([
	"desktop.ini",
	"robots.txt",
	"sitemap.xml",
	"humans.txt",
	"llms.txt",
	"NOTICE.txt",
	"resume.pdf",
	"resume.pdf.txt",
	"social.jpg",
	"favicon-1080x1080.jpg",
	"sw.js",
])

/** Whole directories the app does not need to boot. */
const SKIP_DIRS = ["api/", "schemas/"]

const walk = (dir, prefix = "") =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const rel = prefix + entry.name
		return entry.isDirectory()
			? walk(path.join(dir, entry.name), `${rel}/`)
			: [rel]
	})

const keep = (rel) => {
	if (SKIP_EXACT.has(rel)) return false
	if (SKIP_DIRS.some((dir) => rel.startsWith(dir))) return false
	if (rel.endsWith(".html")) return true
	if (rel.startsWith("assets/")) return true
	if (rel === "settings.json" || rel === "manifest.json") return true
	// The two lists the app reads before it can draw anything. Individual
	// project files are left to the runtime cache: there can be dozens, and
	// nobody opens all of them.
	if (rel === "data/codeledger.json" || rel === "data/projects/index.json") return true
	if (/^(favicon|apple-touch-icon|android-chrome)/.test(rel)) return true
	return false
}

const files = walk(DIST).filter(keep).sort()

// A route is served at /about as well as /about/index.html, so both spellings
// go in — the navigation handler tries them in turn.
const urls = new Set()
for (const rel of files) {
	urls.add(BASE + rel)
	if (rel.endsWith("/index.html")) urls.add(BASE + rel.slice(0, -"index.html".length))
}
urls.add(BASE)

const precache = [...urls].sort()

// The cache name changes whenever any precached file does, which is what makes
// the old cache get thrown away on activate instead of lingering.
const stamp = crypto
	.createHash("sha256")
	.update(files.map((rel) => rel + fs.statSync(path.join(DIST, rel)).size).join("\n"))
	.digest("hex")
	.slice(0, 8)

const template = fs.readFileSync(path.join(__dirname, "sw-template.js"), "utf8")
const sw = template
	.replace("__CACHE_VERSION__", `${pkg.version}-${stamp}`)
	.replace("__BASE__", BASE)
	.replace("__PRECACHE__", JSON.stringify(precache, null, "\t"))

fs.writeFileSync(path.join(DIST, "sw.js"), sw)

console.log(`✓ dist/sw.js written — ${precache.length} URLs precached, cache v${pkg.version}-${stamp}`)
