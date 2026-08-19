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
const ROUTES = ["/", "/about", "/projects", "/resume", "/stats", "/contact"]
const PORT = 41730

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

	let written = 0
	try {
		const page = await browser.newPage()
		await page.setViewport({ width: 1280, height: 900 })
		for (const route of ROUTES) {
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

			const rootLength = await page.evaluate(
				() => document.getElementById("root")?.innerHTML.length || 0
			)
			if (rootLength < 500) {
				console.warn(`⚠️ ${route}: rendered almost nothing (${rootLength} chars) — skipped`)
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

	console.log(`✅ Prerender complete: ${written}/${ROUTES.length} routes`)
}

main().catch((err) => {
	// never fail the deploy over prerendering
	console.warn(`⚠️ prerender aborted: ${err.message}`)
})
