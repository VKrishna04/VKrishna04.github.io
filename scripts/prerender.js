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
 * Post-build prerender: loads each route of the built SPA in headless
 * Chromium and writes the fully rendered HTML to dist/<route>/index.html,
 * so crawlers and social scrapers receive real content instead of an
 * empty <div id="root">.
 *
 * Non-fatal by design: if puppeteer or Chromium is unavailable in the
 * build environment, the script logs a warning and exits 0 — the site
 * deploys exactly as it did before prerendering existed.
 */

/* global process */

import fs from "fs"
import path from "path"
import http from "http"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, "..", "dist")
const STATIC_ROUTES = ["/", "/about", "/projects", "/resume", "/stats", "/contact"]
const PORT = 41730

// Every generated project page is a real URL and needs real HTML. Read the
// index the manifest step wrote rather than hard-coding a list that drifts.
function projectRoutes() {
	const indexFile = path.join(DIST, "data", "projects", "index.json")
	if (!fs.existsSync(indexFile)) return []
	try {
		const { projects = [] } = JSON.parse(fs.readFileSync(indexFile, "utf8"))
		return projects.map((p) => `/projects/${p.slug}`)
	} catch {
		return []
	}
}

const MIME = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".txt": "text/plain",
	".xml": "application/xml",
	".woff2": "font/woff2",
}

// Minimal static server over dist/ with SPA fallback — mirrors how the
// production host serves the app
function startServer() {
	const server = http.createServer((req, res) => {
		const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname)
		let filePath = path.join(DIST, urlPath)
		if (!filePath.startsWith(DIST)) {
			res.writeHead(403)
			res.end()
			return
		}
		if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
			filePath = path.join(filePath, "index.html")
		}
		if (!fs.existsSync(filePath)) {
			filePath = path.join(DIST, "index.html") // SPA fallback
		}
		try {
			const body = fs.readFileSync(filePath)
			const ext = path.extname(filePath).toLowerCase()
			res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" })
			res.end(body)
		} catch {
			res.writeHead(404)
			res.end()
		}
	})
	return new Promise((resolve) => server.listen(PORT, () => resolve(server)))
}

// Text that only ever appears while a route is still waiting on data.
// If any of these survive the settle window the HTML is not publishable.
const LOADING_MARKERS = ["Loading projects", "Loading..."]
const SETTLE_MS = 15000

// A skeleton has plenty of markup and no words. /stats used to pass the
// innerHTML length check with zero readable text, so measure what a crawler
// would actually index.
const MIN_TEXT_CHARS = 400

// Resolves true once no loading marker is present, false if one persists.
async function waitForContent(page) {
	const deadline = Date.now() + SETTLE_MS
	for (;;) {
		const stillLoading = await page.evaluate((markers) => {
			const text = document.getElementById("root")?.innerText || ""
			return markers.some((m) => text.includes(m))
		}, LOADING_MARKERS)
		if (!stillLoading) return true
		if (Date.now() > deadline) return false
		await new Promise((r) => setTimeout(r, 500))
	}
}

async function main() {
	if (!fs.existsSync(path.join(DIST, "index.html"))) {
		console.error("❌ dist/index.html not found — run the build first")
		process.exit(1)
	}

	let puppeteer
	try {
		puppeteer = (await import("puppeteer")).default
	} catch {
		console.warn("⚠️ puppeteer not installed — skipping prerender (SPA-only deploy)")
		return
	}

	const server = await startServer()
	let browser
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
		})
	} catch (err) {
		console.warn(`⚠️ Chromium failed to launch — skipping prerender: ${err.message}`)
		server.close()
		return
	}

	const routes = [...STATIC_ROUTES, ...projectRoutes()]
	let written = 0
	try {
		const page = await browser.newPage()
		await page.setViewport({ width: 1280, height: 900 })
		// Marks these loads as machine traffic so view counters skip them.
		await page.evaluateOnNewDocument(() => {
			window.__PRERENDER__ = true
		})
		for (const route of routes) {
			try {
				await page.goto(`http://localhost:${PORT}${route}`, {
					waitUntil: "networkidle2",
					timeout: 45000,
				})
			} catch {
				console.warn(`⚠️ ${route}: load did not settle, capturing current state`)
			}
			// let late effects (titles, canonical, async content) flush
			await new Promise((r) => setTimeout(r, 1000))

			// Poll until the route has settled out of every loading state. A
			// route whose data comes from a remote API can still be on its
			// spinner when networkidle2 resolves, and writing that HTML ships
			// a permanently-"Loading..." page to crawlers.
			const settled = await waitForContent(page)
			if (!settled) {
				console.warn(`⚠️ ${route}: still showing a loading state after ${SETTLE_MS}ms — skipped (SPA fallback serves this route)`)
				continue
			}

			const { markup, text } = await page.evaluate(() => {
				const root = document.getElementById("root")
				return {
					markup: root?.innerHTML.length || 0,
					text: (root?.innerText || "").replace(/\s+/g, " ").trim().length,
				}
			})
			if (markup < 500) {
				console.warn(`⚠️ ${route}: rendered almost nothing (${markup} chars) — skipped`)
				continue
			}
			if (text < MIN_TEXT_CHARS) {
				console.warn(`⚠️ ${route}: only ${text} chars of readable text — skipped (skeleton, not content)`)
				continue
			}

			const html = "<!doctype html>\n" + (await page.evaluate(() => document.documentElement.outerHTML))
			const outFile =
				route === "/"
					? path.join(DIST, "index.html")
					: path.join(DIST, route.slice(1), "index.html")
			fs.mkdirSync(path.dirname(outFile), { recursive: true })
			fs.writeFileSync(outFile, html)
			written++
			console.log(`✓ prerendered ${route} (${(html.length / 1024).toFixed(0)} KB)`)
		}
	} finally {
		await browser.close()
		server.close()
	}

	console.log(`✅ Prerender complete: ${written}/${routes.length} routes`)
}

main().catch((err) => {
	// never fail the deploy over prerendering
	console.warn(`⚠️ prerender aborted: ${err.message}`)
})
