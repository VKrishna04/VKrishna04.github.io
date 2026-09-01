/**
 * registerSW.js — turns on the offline copy of the site.
 *
 * Deliberately not in src/utils/: that directory is hash-pinned by
 * scripts/protection-hashes.json, and a file there means regenerating the
 * hashes on every edit. This has nothing to do with the protection system.
 *
 * Development is left alone. A service worker caching a dev server is a good
 * way to spend an afternoon wondering why an edit did not appear.
 */

export function registerServiceWorker() {
	if (!import.meta.env.PROD) return
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return

	const base = import.meta.env.BASE_URL || "/"

	window.addEventListener("load", () => {
		navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch((error) => {
			// Losing this costs the offline copy and nothing else, so it is a
			// warning rather than something the visitor should hear about.
			console.warn("[sw] registration failed:", error)
		})
	})
}
