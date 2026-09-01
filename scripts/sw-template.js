/* eslint-env serviceworker */
/**
 * sw-template.js — the service worker, before the build fills in the blanks.
 *
 * scripts/generate-sw.js reads this file, replaces the three __PLACEHOLDER__
 * tokens with the version, the base path and the list of files that came out
 * of the build, and writes the result to dist/sw.js. Editing dist/sw.js
 * directly is pointless: the next build overwrites it.
 *
 * The point of all this is one sentence long — reloading the site with no
 * network should show the site, not the browser's error page.
 */

const VERSION = "__CACHE_VERSION__"
const BASE = "__BASE__"
const ASSETS = __PRECACHE__

const PRECACHE = `precache-${VERSION}`
const RUNTIME = `runtime-${VERSION}`
const KEEP = [PRECACHE, RUNTIME]
const SHELL = `${BASE}index.html`

// The app's own fetches carry a ?v= cache-buster. Matching on the full URL
// would miss every single time, so every lookup here ignores the query.
const MATCH = { ignoreSearch: true }

// Last resort, and it should never be reached: the shell is precached, so a
// navigation has something to fall back on even for a route nobody visited.
const OFFLINE_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline</title>
<style>html{color-scheme:dark}body{margin:0;min-height:100vh;display:flex;align-items:center;
justify-content:center;background:#0a0a0a;color:#e5e7eb;font:16px/1.6 system-ui,sans-serif;
text-align:center;padding:2rem}p{max-width:32ch;color:#9ca3af}</style></head>
<body><div><h1>Offline</h1><p>This page has not been visited before, so there is no copy
of it stored. It will load again once you are back online.</p></div></body></html>`

const offlineResponse = () =>
	new Response(OFFLINE_HTML, {
		status: 200,
		headers: { "Content-Type": "text/html; charset=utf-8" },
	})

self.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(PRECACHE)
			// One missing file must not fail the whole install, so each entry
			// is added on its own and a miss is counted rather than thrown.
			const results = await Promise.allSettled(ASSETS.map((url) => cache.add(url)))
			const failed = results.filter((r) => r.status === "rejected").length
			if (failed) console.warn(`[sw] ${failed}/${ASSETS.length} precache entries failed`)
			await self.skipWaiting()
		})()
	)
})

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const names = await caches.keys()
			await Promise.all(names.filter((n) => !KEEP.includes(n)).map((n) => caches.delete(n)))
			await self.clients.claim()
		})()
	)
})

self.addEventListener("message", (event) => {
	if (event.data === "SKIP_WAITING") self.skipWaiting()
})

/**
 * A navigation to /projects was precached as /projects/index.html, so the
 * request URL never matches the cache key. Try the shapes the build actually
 * writes, then the shell, then the page above.
 */
async function navigationFallback(url) {
	const withSlash = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`
	const candidates = [url.pathname, withSlash, `${withSlash}index.html`, SHELL]
	for (const candidate of candidates) {
		const hit = await caches.match(candidate, MATCH)
		if (hit) return hit
	}
	return offlineResponse()
}

async function networkFirst(request, url) {
	try {
		const response = await fetch(request)
		if (response && response.ok) {
			const cache = await caches.open(RUNTIME)
			cache.put(request, response.clone())
		}
		return response
	} catch {
		return navigationFallback(url)
	}
}

async function cacheFirst(request) {
	const hit = await caches.match(request, MATCH)
	if (hit) return hit
	const response = await fetch(request)
	if (response && response.ok) {
		const cache = await caches.open(RUNTIME)
		cache.put(request, response.clone())
	}
	return response
}

async function staleWhileRevalidate(request) {
	const cache = await caches.open(RUNTIME)
	const hit = await caches.match(request, MATCH)
	const fresh = fetch(request)
		.then((response) => {
			if (response && response.ok) cache.put(request, response.clone())
			return response
		})
		.catch(() => null)
	if (hit) return hit
	const response = await fresh
	return response || Response.error()
}

self.addEventListener("fetch", (event) => {
	const request = event.request
	if (request.method !== "GET") return

	const url = new URL(request.url)
	// Anything off this origin — the GitHub API, the visitor counter — is left
	// alone. It is never cached, and the app already copes with it failing.
	if (url.origin !== self.location.origin) return

	if (request.mode === "navigate") {
		event.respondWith(networkFirst(request, url))
		return
	}

	// Hashed filenames never change contents, so the cache is the truth.
	if (url.pathname.startsWith(`${BASE}assets/`)) {
		event.respondWith(cacheFirst(request))
		return
	}

	// Everything else same-origin — settings.json, the project data, images —
	// is served from cache and refreshed behind the reader's back.
	event.respondWith(staleWhileRevalidate(request))
})
