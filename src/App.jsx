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

import React, { lazy, memo, Suspense, useEffect, useRef, useState } from "react"
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import NextPageNav from "./components/NextPageNav"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import FaviconManager from "./components/FaviconManager"
import PrivacyNotice from "./components/PrivacyNotice"
import { configureCflair, trackPortfolioView } from "./utils/cflairCounter"
import { fetchSettings } from "./utils/settingsCache"
import { applyPageMeta } from "./utils/pageMeta"
import { getSiteUrl } from "./utils/identity"
import "./App.css"

// Route-split the heavier pages; Home stays eager so first paint is instant
const About = lazy(() => import("./pages/About"))
const Projects = lazy(() => import("./pages/Projects"))
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"))
const Resume = lazy(() => import("./pages/Resume"))
const Stats = lazy(() => import("./pages/Stats"))
const Contact = lazy(() => import("./pages/Contact"))

const RouteFallback = () => (
	<div className="min-h-screen flex items-center justify-center bg-gray-950">
		<div className="w-10 h-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
	</div>
)

// Custom hook for managing page titles and favicon
// Per-route descriptions live in settings.seo.pageDescriptions. Each
// routed page needs its own or it competes with the homepage for the
// same snippet in search results.

const JSONLD_TYPES = {
	"/about": "AboutPage",
	"/projects": "CollectionPage",
	"/resume": "ProfilePage",
	"/stats": "WebPage",
	"/contact": "ContactPage",
}

const routeJsonLd = (pathname, url, title, description, authorName) => {
	// The homepage already carries the site-wide Person block.
	if (pathname === "/") return null
	return {
		"@context": "https://schema.org",
		"@type": JSONLD_TYPES[pathname] || "WebPage",
		name: title,
		description,
		url,
		isPartOf: { "@type": "WebSite", name: authorName, url: new URL(url).origin },
		about: { "@type": "Person", name: authorName },
	}
}

const usePageConfiguration = (location) => {
	const [settings, setSettings] = useState({})
	const hasTrackedPortfolioView = useRef(false)

	useEffect(() => {
		fetchSettings()
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error))
	}, [])

	// Track portfolio view only when enabled in settings (once per app load)
	useEffect(() => {
		const counterSettings = settings?.counterAPI
		if (!counterSettings) return
		// Resolve the endpoint for every caller, including the resume and
		// contact events raised from pages that never see settings themselves.
		configureCflair(counterSettings)
		if (hasTrackedPortfolioView.current) return
		if (counterSettings.enabled !== true) return

		hasTrackedPortfolioView.current = true
		trackPortfolioView(counterSettings.baseUrl).catch((error) =>
			console.warn("Could not track portfolio view:", error)
		)
	}, [settings])

	useEffect(() => {
		// Wait for settings.json — but don't gate on settings.display: that key
		// doesn't exist in settings.json, and gating on it left every route with
		// the build-time title forever.
		if (!Object.keys(settings).length) return

		// /projects/<slug> owns its own title, description and structured data
		// — it has the project record, this effect only has the URL.
		if (/^\/projects\/[^/]+/.test(location.pathname)) return

		const baseName =
			settings.display?.officialName || settings.seo?.author || "Portfolio"

		// Update page title based on current route
		const getPageTitle = () => {
			const titles = {
				"/": settings.seo?.title || `${baseName} - Portfolio`,
				"/about": `About - ${baseName}`,
				"/projects": `Projects - ${baseName}`,
				"/resume": `Resume - ${baseName}`,
				"/stats": `DSA Stats - ${baseName}`,
				"/contact": `Contact - ${baseName}`,
			}
			return titles[location.pathname] || `${baseName} - Portfolio`
		}

		const title = getPageTitle()

		// Per-route canonical — a single hard-coded homepage canonical makes
		// every other route deduplicate itself out of the index
		const canonicalBase = getSiteUrl(settings)
		const canonicalUrl =
			location.pathname === "/"
				? `${canonicalBase}/`
				: `${canonicalBase}${location.pathname}`

		// Per-route description + social cards. Without these every route
		// shares the homepage card, so a link to /projects previews as the
		// homepage and ranks against it for the same terms.
		const description =
			settings.seo?.pageDescriptions?.[location.pathname] ||
			settings.seo?.description ||
			""

		applyPageMeta({
			title,
			description,
			url: canonicalUrl,
			jsonLd: routeJsonLd(
				location.pathname,
				canonicalUrl,
				title,
				description,
				baseName
			),
		})
	}, [location.pathname, settings])

	return settings
}

const AppContent = memo(() => {
	const location = useLocation()
	const settings = usePageConfiguration(location) // Use the hook to manage page configuration

	// SPA route changes keep the old scroll position — reset like a real navigation
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	return (
		<div className="App">
			<FaviconManager settings={settings} />
			<Navbar />

			{/* key remounts main per route so the page-transition animation replays */}
			<main key={location.pathname} className="page-transition">
				<Suspense fallback={<RouteFallback />}>
					<Routes location={location}>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/projects/:slug" element={<ProjectDetail />} />
						<Route path="/resume" element={<Resume />} />
						<Route path="/stats" element={<Stats />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</main>

			<NextPageNav />
			<Footer />
			<PrivacyNotice />
			<ScrollToTop />
		</div>
	)
})

const App = memo(() => {
	return (
		<Router
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<AppContent />
		</Router>
	)
})

export default App
