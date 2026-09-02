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
 * /projects/<slug> — one indexable page per project.
 *
 * Content comes from public/data/projects/<slug>.json, written at build time
 * by scripts/fetch-project-manifests.js. That file is same-origin and always
 * present, so the page renders fully during prerender with no network call.
 *
 * After first paint the component re-fetches the project's own
 * .portfolio/project.json from its repo, so an edit there shows up
 * immediately for visitors instead of waiting for the next scheduled build.
 */

import { motion, useReducedMotion } from "framer-motion"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
	ArrowLeftIcon,
	ArrowTopRightOnSquareIcon,
	BookOpenIcon,
	CodeBracketIcon,
	PlayIcon,
} from "@heroicons/react/24/outline"
import { applyPageMeta } from "../utils/pageMeta"
import ProjectGallery from "../components/ProjectGallery"
import UnifiedIcon from "../components/UnifiedIcon"
import { getOwnerName, getSiteUrl } from "../utils/identity"
import { fetchSettings } from "../utils/settingsCache"
import {
	configureCflair,
	getProjectStats,
	trackProjectView,
} from "../utils/cflairCounter"
import {
	normalizeAppearance,
	normalizeIcon,
	normalizeMedia,
	normalizeSections,
} from "../utils/projectManifest"

// react-markdown is only needed by pages whose repo opted into a README, so it
// loads on demand instead of riding in the main bundle.
const ProjectReadme = lazy(() => import("../components/ProjectReadme"))

// The site's own origin, resolved from settings inside the head effect below.
// It cannot be a module constant: a hard-coded domain points every fork at the
// upstream author's site, and window.location.origin is the throwaway localhost
// server during prerender, which would bake "http://localhost:PORT" into the
// static HTML.

/*
 * A manifest can pick a look for its own page, but only from these. The values
 * are literal class strings so Tailwind's scanner sees them; a manifest never
 * supplies CSS. Omitting `appearance` — which is the right default for almost
 * every project — leaves the portfolio's own styling in charge.
 */
const THEME_GRADIENTS = {
	default: "from-slate-900 via-purple-900 to-slate-900",
	aurora: "from-slate-900 via-emerald-900 to-slate-900",
	ember: "from-slate-900 via-orange-900 to-slate-900",
	ocean: "from-slate-900 via-sky-900 to-slate-900",
	forest: "from-slate-900 via-green-900 to-slate-900",
	mono: "from-neutral-900 via-neutral-800 to-neutral-900",
	midnight: "from-black via-slate-900 to-black",
}

const BACKGROUND_LAYERS = {
	grid: "bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]",
	dots: "bg-[radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:22px_22px]",
	glow: "bg-[radial-gradient(60%_45%_at_50%_0%,rgba(168,85,247,0.22),transparent_70%)]",
	plain: "",
}

const LINK_META = {
	repo: { label: "Source code", Icon: CodeBracketIcon },
	live: { label: "Live site", Icon: ArrowTopRightOnSquareIcon },
	demo: { label: "Demo", Icon: PlayIcon },
	docs: { label: "Documentation", Icon: BookOpenIcon },
	paper: { label: "Paper", Icon: BookOpenIcon },
	package: { label: "Package", Icon: ArrowTopRightOnSquareIcon },
}

// The manifest schema's status values, in the wording the cards already use.
// Anything outside the enum is rendered as written.
const Reveal = ({ children, className = "", delay = 0 }) => {
	const reduced = useReducedMotion()
	const still =
		reduced ||
		(typeof window !== "undefined" && window.__PRERENDER__ === true)
	if (still) return <div className={className}>{children}</div>
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
			transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.div>
	)
}

const STATUS_LABELS = {
	active: "Active Development",
	maintained: "Maintenance",
	archived: "Archived",
	experimental: "Experimental",
	complete: "Completed",
}

// Only ever render http(s) destinations that came out of the manifest.
const safeUrl = (url) => {
	// Absolute only — resolving against SITE would turn an empty string into a
	// link to the homepage, which is how every project grew a fake "Demo" button
	if (typeof url !== "string" || !url.trim()) return null
	try {
		const u = new URL(url)
		return u.protocol === "https:" || u.protocol === "http:" ? u.href : null
	} catch {
		return null
	}
}

function formatPeriod(period) {
	if (!period?.start) return ""
	const fmt = (v) =>
		new Date(v.length === 7 ? `${v}-01` : v).toLocaleDateString("en-US", {
			month: "short",
			year: "numeric",
		})
	try {
		return `${fmt(period.start)} — ${period.end ? fmt(period.end) : "present"}`
	} catch {
		return ""
	}
}

// The renderer is deliberately additive: a section type it does not know is
// skipped, so a repo can ship a newer manifest than the portfolio understands
// without breaking its page.
function Section({ section }) {
	const heading = section.heading ? (
		<h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
	) : null

	switch (section.type) {
		case "prose":
			return (
				<section className="mb-10">
					{heading}
					{String(section.body || "")
						.split(/\n{2,}/)
						.filter(Boolean)
						.map((para, i) => (
							<p key={i} className="text-gray-300 leading-relaxed mb-4">
								{para}
							</p>
						))}
				</section>
			)

		case "list":
			return (
				<section className="mb-10">
					{heading}
					<ul className="space-y-3">
						{(section.items || []).map((item, i) => (
							<li key={i} className="flex gap-3 text-gray-300 leading-relaxed">
								<span className="text-purple-400 mt-1">▸</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</section>
			)

		case "code":
			return (
				<section className="mb-10">
					{heading}
					<pre className="overflow-x-auto p-4 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-200">
						<code>{section.body}</code>
					</pre>
				</section>
			)

		case "table": {
			const columns = section.columns || []
			const rows = section.rows || []
			if (!columns.length) return null
			return (
				<section className="mb-10">
					{heading}
					<div className="overflow-x-auto border border-white/10 rounded-xl">
						<table className="w-full text-sm text-left">
							<thead className="bg-white/5 text-gray-200">
								<tr>
									{columns.map((c, i) => (
										<th key={i} className="px-4 py-3 font-semibold">
											{c}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="text-gray-300">
								{rows.map((row, i) => (
									<tr key={i} className="border-t border-white/10">
										{(row || []).map((cell, j) => (
											<td key={j} className="px-4 py-3">
												{cell}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			)
		}

		case "media": {
			const url = safeUrl(section.url)
			if (!url) return null
			return (
				<section className="mb-10">
					{heading}
					<img
						src={url}
						alt={section.alt || section.heading || ""}
						loading="lazy"
						className="w-full rounded-xl border border-white/10"
					/>
					{section.caption && (
						<p className="mt-2 text-sm text-gray-400">{section.caption}</p>
					)}
				</section>
			)
		}

		default:
			return null
	}
}

function NotFoundProject({ slug }) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
			<div className="max-w-3xl mx-auto px-4 py-24 text-center">
				<h1 className="text-3xl font-bold text-white mb-4">
					No project called &ldquo;{slug}&rdquo;
				</h1>
				<p className="text-gray-300 mb-8">
					It may have been renamed. The full list is on the projects page.
				</p>
				<Link
					to="/projects"
					className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
				>
					<ArrowLeftIcon className="h-5 w-5" />
					All projects
				</Link>
			</div>
		</div>
	)
}

const ProjectDetail = () => {
	const { slug } = useParams()
	const [project, setProject] = useState(null)
	const [missing, setMissing] = useState(false)
	const [views, setViews] = useState(null)
	const [siblings, setSiblings] = useState(null)
	const trackedSlug = useRef(null)

	// 1. Build-time data — same origin, always present, captured by prerender.
	useEffect(() => {
		let cancelled = false
		setProject(null)
		setMissing(false)
		fetch(`/data/projects/${encodeURIComponent(slug)}.json`)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				return res.json()
			})
			.then((data) => {
				if (!cancelled) setProject(data)
			})
			.catch(() => {
				if (!cancelled) setMissing(true)
			})
		return () => {
			cancelled = true
		}
	}, [slug])

	// 2. Live manifest — lets a repo update its own page between builds.
	// Purely additive: a failure leaves the build-time content on screen.
	useEffect(() => {
		if (!project?.manifestUrl) return
		let cancelled = false
		fetch(project.manifestUrl, { signal: AbortSignal.timeout(8000) })
			.then((res) => (res.ok ? res.json() : null))
			.then((manifest) => {
				if (cancelled || !manifest?.sections?.length) return
				// Only take the fields a repo owns; never let it change the slug
				// or links the portfolio derived, so a stale manifest can't
				// redirect the page somewhere unexpected. Everything taken here
				// goes through the same normalizers the build step uses, so a
				// live edit cannot slip past a check the build would have made.
				setProject((prev) => {
					if (!prev) return prev
					const media = normalizeMedia(manifest.media, prev.media?.cover)
					return {
						...prev,
						summary: manifest.summary || prev.summary,
						highlights: manifest.highlights?.length
							? manifest.highlights
							: prev.highlights,
						metrics: manifest.metrics?.length
							? manifest.metrics
							: prev.metrics,
						sections: normalizeSections(manifest.sections),
						icon: normalizeIcon(manifest.icon) || prev.icon,
						appearance: normalizeAppearance(manifest.appearance),
						// The README body is fetched at build time, so a live
						// manifest can retitle or collapse it but not swap it
						// for another file until the next build.
						readme: prev.readme,
						media: media.screenshots.length || media.video ? media : prev.media,
					}
				})
			})
			.catch(() => {
				/* build-time content stands */
			})
		return () => {
			cancelled = true
		}
	}, [project?.manifestUrl])

	// 3. Page views — counted per project page rather than per card, because
	// the grid would fire one request per project on every visit to /projects
	// for a number that means little on a card. Entirely optional: any failure
	// just leaves the page without the chip.
	useEffect(() => {
		if (!project?.slug) return
		let cancelled = false
		const repoName = project.repo?.split("/").pop() || project.slug
		fetchSettings()
			.then((settings) => {
				const counter = settings?.counterAPI
				configureCflair(counter)
				if (cancelled || counter?.enabled !== true) return null
				const key =
					counter.projectMapping?.customMappings?.[repoName] || repoName
				// One count per page, not one per re-render or live-manifest update.
				const counted = trackedSlug.current === key
				trackedSlug.current = key
				return (
					counted ? Promise.resolve() : trackProjectView(key, counter.baseUrl)
				).then(() => getProjectStats(key, counter.baseUrl))
			})
			.then((stats) => {
				if (cancelled || !stats?.success) return
				if (typeof stats.totalViews === "number") setViews(stats.totalViews)
			})
			.catch((error) =>
				console.warn("Could not track project view:", error)
			)
		return () => {
			cancelled = true
		}
	}, [project?.slug])

	// 4. Neighbours in the curated order, so the page can be read through
	// instead of dead-ending on the back link. index.json is written by the
	// same build step as the page itself and is already sorted.
	useEffect(() => {
		let cancelled = false
		setSiblings(null)
		fetch("/data/projects/index.json")
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (cancelled || !data?.projects?.length) return
				const list = data.projects
				const at = list.findIndex((p) => p.slug === slug)
				if (at === -1) return
				setSiblings({ prev: list[at - 1] || null, next: list[at + 1] || null })
			})
			.catch(() => {
				// Optional navigation; the back link above always works.
			})
		return () => {
			cancelled = true
		}
	}, [slug])

	// 5. Head — owned here rather than in App.jsx, because the title and
	// description come from the project data the router cannot see.
	useEffect(() => {
		if (!project) return
		let cancelled = false
		const applyHead = (settings) => {
			if (cancelled) return
			const SITE = getSiteUrl(settings)
			const ownerName = getOwnerName(settings)
		const url = `${SITE}/projects/${project.slug}`
		const description =
			project.seo?.description ||
			project.tagline ||
			project.summary ||
			(ownerName
				? `${project.name} — an open-source project by ${ownerName}.`
				: `${project.name} — an open-source project.`)
		const title =
			project.seo?.title ||
			(ownerName
				? `${project.name} — Project by ${ownerName}`
				: `${project.name} — Project`)

		applyPageMeta({
			title,
			description,
			url,
			image: project.seo?.image || project.media?.cover || undefined,
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "SoftwareSourceCode",
				name: project.name,
				description,
				url,
				codeRepository: project.links?.repo || undefined,
				programmingLanguage: project.technologies || undefined,
				keywords: (project.tags || []).join(", ") || undefined,
				dateCreated: project.period?.start || undefined,
				image: project.seo?.image || project.media?.cover || undefined,
				author: ownerName
					? { "@type": "Person", name: ownerName, url: SITE }
					: undefined,
				isPartOf: {
					"@type": "CollectionPage",
					name: "Projects",
					url: `${SITE}/projects`,
				},
			},
			})
		}
		// The owner's name comes from settings; a portfolio with none simply
		// omits the author rather than crediting somebody else.
		fetchSettings()
			.then(applyHead)
			.catch(() => applyHead({}))
		return () => {
			cancelled = true
		}
	}, [project])

	if (missing) return <NotFoundProject slug={slug} />
	if (!project) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
				<div className="max-w-4xl mx-auto px-4 py-24">
					<div className="h-10 w-2/3 bg-white/[0.06] rounded-xl animate-pulse mb-6" />
					<div className="h-4 w-full bg-white/[0.04] rounded-lg animate-pulse mb-3" />
					<div className="h-4 w-5/6 bg-white/[0.04] rounded-lg animate-pulse" />
				</div>
			</div>
		)
	}

	const period = formatPeriod(project.period)
	const prev = siblings?.prev
	const next = siblings?.next
	const links = Object.entries(project.links || {})
		.map(([key, value]) => [key, safeUrl(value)])
		.filter(([key, value]) => value && LINK_META[key])

	// Already normalized upstream — read it defensively anyway, because a
	// cached JSON file written by an older build has no appearance key at all.
	const appearance = project.appearance || {}
	const gradient = THEME_GRADIENTS[appearance.theme] || THEME_GRADIENTS.default
	const backgroundLayer = BACKGROUND_LAYERS[appearance.background] ?? null
	const accent = appearance.accent || ""

	return (
		<div className={`relative min-h-screen bg-gradient-to-br ${gradient} pt-20`}>
			{backgroundLayer && (
				<div
					aria-hidden="true"
					className={`pointer-events-none absolute inset-0 ${backgroundLayer}`}
				/>
			)}
			<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<Link
					to="/projects"
					className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors mb-8"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					All projects
				</Link>

				<motion.header
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
						{project.status && (
							<span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full">
								{STATUS_LABELS[project.status] || project.status}
							</span>
						)}
						{project.category && (
							<span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-full">
								{project.category}
							</span>
						)}
						{period && <span className="text-gray-400">{period}</span>}
						{views !== null && (
							<span className="text-gray-400">
								{views.toLocaleString()}{" "}
								{views === 1 ? "view" : "views"}
							</span>
						)}
					</div>

					<div className="flex items-center gap-4 mb-4">
						{project.icon && (
							<UnifiedIcon
								name={project.icon}
								className="h-10 w-10 shrink-0 text-white/90 md:h-12 md:w-12"
								style={accent ? { color: accent } : undefined}
								fallback={<span className="hidden" />}
							/>
						)}
						<h1
							className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
							style={
								// An accent replaces the gradient outright — clipping a
								// gradient to text and then overriding the colour would
								// just render nothing.
								accent
									? { backgroundImage: "none", color: accent }
									: undefined
							}
						>
							{project.name}
						</h1>
					</div>

					{project.tagline && (
						<p className="text-xl text-gray-200 mb-4">{project.tagline}</p>
					)}
					{project.summary && (
						<p className="text-gray-300 leading-relaxed max-w-3xl">
							{project.summary}
						</p>
					)}
					{project.role && (
						<p className="mt-4 text-sm text-gray-400">
							<span className="text-gray-300 font-medium">Role:</span>{" "}
							{project.role}
						</p>
					)}
				</motion.header>

				{links.length > 0 && (
					<div className="flex flex-wrap gap-3 mt-8">
						{links.map(([key, url]) => {
							const { label, Icon } = LINK_META[key]
							return (
								<a
									key={key}
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-200 text-sm transition-colors"
								>
									<Icon className="h-4 w-4" />
									{label}
								</a>
							)
						})}
					</div>
				)}

				{project.metrics?.length > 0 && (
					<Reveal className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
						{project.metrics.map((m, i) => (
							<div
								key={i}
								className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
							>
								<div className="text-2xl font-bold text-white">{m.value}</div>
								<div className="text-xs text-gray-400 mt-1">{m.label}</div>
							</div>
						))}
					</Reveal>
				)}

				{project.technologies?.length > 0 && (
					<div className="mt-10">
						<h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
							Built with
						</h2>
						<div className="flex flex-wrap gap-2">
							{project.technologies.map((tech) => (
								<span
									key={tech}
									className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-200 rounded-lg text-sm"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				)}

				{project.highlights?.length > 0 && (
					<Reveal className="mt-12">
						<h2 className="text-2xl font-bold text-white mb-4">Highlights</h2>
						<ul className="space-y-3">
							{project.highlights.map((h, i) => (
								<li key={i} className="flex gap-3 text-gray-300 leading-relaxed">
									<span className="text-purple-400 mt-1">▸</span>
									<span>{h}</span>
								</li>
							))}
						</ul>
					</Reveal>
				)}

				{project.sections?.length > 0 && (
					<div className="mt-12">
						{project.sections.map((section, i) => (
							<Reveal key={i}>
								<Section section={section} />
							</Reveal>
						))}
					</div>
				)}

				<ProjectGallery
					media={project.media}
					name={project.name}
					accent={accent}
				/>

				{project.readme?.markdown && (
					<Suspense
						fallback={
							<div className="mt-16 h-4 w-1/3 animate-pulse rounded bg-white/[0.06]" />
						}
					>
						<ProjectReadme readme={project.readme} accent={accent} />
					</Suspense>
				)}

				{(prev || next) && (
					<nav
						aria-label="Other projects"
						className="mt-16 grid gap-4 border-t border-white/[0.07] pt-8 sm:grid-cols-2"
					>
						{prev ? (
							<Link
								to={`/projects/${prev.slug}`}
								className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-white/[0.06]"
							>
								<span className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
									<ArrowLeftIcon className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-1" />
									Previous
								</span>
								<span className="mt-2 block font-semibold text-gray-100 group-hover:text-white">
									{prev.name}
								</span>
								{prev.tagline && (
									<span className="mt-1 block text-sm text-gray-400 line-clamp-2">
										{prev.tagline}
									</span>
								)}
							</Link>
						) : (
							<span aria-hidden="true" />
						)}
						{next && (
							<Link
								to={`/projects/${next.slug}`}
								className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 text-right transition duration-300 hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-white/[0.06] sm:col-start-2"
							>
								<span className="flex items-center justify-end gap-2 text-xs uppercase tracking-wide text-gray-500">
									Next
									<ArrowLeftIcon className="h-3 w-3 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
								</span>
								<span className="mt-2 block font-semibold text-gray-100 group-hover:text-white">
									{next.name}
								</span>
								{next.tagline && (
									<span className="mt-1 block text-sm text-gray-400 line-clamp-2">
										{next.tagline}
									</span>
								)}
							</Link>
						)}
					</nav>
				)}

				{project.source === "settings" && project.repo && (
					<p className="mt-16 text-sm text-gray-500">
						This page is generated from the repository metadata.{" "}
						<a
							href={`https://github.com/${project.repo}`}
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-gray-300"
						>
							{project.repo}
						</a>{" "}
						can add a{" "}
						<code className="text-gray-400">.portfolio/project.json</code> to
						control it directly.
					</p>
				)}
			</div>
		</div>
	)
}

export default ProjectDetail
