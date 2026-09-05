import { useEffect, useRef } from "react"

/*
 * Per-section URLs on the long pages.
 *
 * A reader who is looking at the skills block on /about should be able to copy
 * the address bar and send someone to the skills block, not to the top of the
 * page. This watches the sections a page marks with `data-section-anchor` and
 * rewrites the fragment as they pass, then jumps to the named one when a page
 * is opened with a fragment already in the URL.
 *
 * Deliberately not scroll-snapping. Locking the wheel to one section per
 * gesture breaks trackpad momentum, Page Down and find-in-page, and there is no
 * way to opt out of it once it is on. Scrolling stays exactly as it was; only
 * the URL follows along.
 *
 * Off unless settings.navigation.sectionAnchors.enabled is true.
 */

// The line that decides which section the reader is on, as a fraction of the
// viewport: the current section is the last one whose top has passed it. A
// short section that never fills the viewport still gets its turn, which an
// "is the section on screen" test does not give it.
const TRIGGER = 0.4

// The band the observer watches, either side of that line. It exists only to
// wake the callback up when a section edge crosses; the answer itself comes
// from measuring, not from which sections happen to be intersecting.
const TRIGGER_BAND = "-40% 0px -55% 0px"

// The navbar is fixed, so a section scrolled flush to the top of the document
// sits underneath it.
const NAV_OFFSET = 80

/**
 * @param {boolean} enabled  settings.navigation.sectionAnchors.enabled
 * @param {unknown} ready    anything that changes once the sections exist —
 *                           these pages render empty until settings load, so an
 *                           effect that only runs on mount observes nothing.
 * @returns {import("react").RefObject<HTMLElement>} attach to the page root
 */
export function useSectionAnchors(enabled, ready) {
	const rootRef = useRef(null)
	// A deep link is honoured once. Re-running the effect when more content
	// loads must not yank a reader who has since scrolled somewhere else.
	const jumped = useRef(false)

	useEffect(() => {
		if (enabled !== true) return
		// The build's headless pass loads every route to capture its HTML.
		// Scrolling it, or rewriting its URL, would bake a fragment into the
		// markup that every visitor then starts on.
		if (typeof window === "undefined" || window.__PRERENDER__ === true) return
		if (typeof IntersectionObserver === "undefined") return

		const root = rootRef.current
		if (!root) return

		const sections = Array.from(
			root.querySelectorAll("[data-section-anchor][id]")
		)
		if (!sections.length) return

		const reduced =
			typeof window.matchMedia === "function" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches

		if (!jumped.current) {
			jumped.current = true
			const wanted = window.location.hash.slice(1)
			const target = wanted && sections.find((s) => s.id === wanted)
			if (target) {
				window.scrollTo({
					top:
						target.getBoundingClientRect().top +
						window.scrollY -
						NAV_OFFSET,
					behavior: reduced ? "auto" : "smooth",
				})
			}
		}

		// replaceState, never pushState: a hundred fragments in the history
		// stack would make the back button walk the page instead of leaving it.
		// Raw history rather than useNavigate, so react-router never sees a
		// location change and the page transition does not replay mid-scroll.
		let currentId = null
		const setFragment = (id) => {
			if (id === currentId) return
			currentId = id
			const { pathname, search } = window.location
			window.history.replaceState(
				null,
				"",
				id ? `${pathname}${search}#${id}` : `${pathname}${search}`
			)
		}

		const update = () => {
			const line = window.innerHeight * TRIGGER
			let active = null
			// Document order, so the last one still above the line wins.
			for (const section of sections) {
				if (section.getBoundingClientRect().top > line) break
				active = section
			}
			// Above the first section the fragment is dropped: leaving the last
			// one in place would have the URL claim the reader is somewhere they
			// have already scrolled away from.
			setFragment(active ? active.id : null)
		}

		const observer = new IntersectionObserver(update, {
			rootMargin: TRIGGER_BAND,
			threshold: 0,
		})

		for (const section of sections) observer.observe(section)
		return () => observer.disconnect()
	}, [enabled, ready])

	return rootRef
}

export default useSectionAnchors
