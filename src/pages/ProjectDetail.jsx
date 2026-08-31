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

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
	ArrowLeftIcon,
	ArrowTopRightOnSquareIcon,
	BookOpenIcon,
	CodeBracketIcon,
	PlayIcon,
} from "@heroicons/react/24/outline"
import { applyPageMeta } from "../utils/pageMeta"

const SITE = "https://vkrishna04.me"

const LINK_META = {
	repo: { label: "Source code", Icon: CodeBracketIcon },
	live: { label: "Live site", Icon: ArrowTopRightOnSquareIcon },
	demo: { label: "Demo", Icon: PlayIcon },
	docs: { label: "Documentation", Icon: BookOpenIcon },
	paper: { label: "Paper", Icon: BookOpenIcon },
	package: { label: "Package", Icon: ArrowTopRightOnSquareIcon },
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
				// redirect the page somewhere unexpected.
				setProject((prev) =>
					prev
						? {
								...prev,
								summary: manifest.summary || prev.summary,
								highlights: manifest.highlights?.length
									? manifest.highlights
									: prev.highlights,
								metrics: manifest.metrics?.length
									? manifest.metrics
									: prev.metrics,
								sections: manifest.sections,
							}
						: prev
				)
			})
			.catch(() => {
				/* build-time content stands */
			})
		return () => {
			cancelled = true
		}
	}, [project?.manifestUrl])

	// 3. Head — owned here rather than in App.jsx, because the title and
	// description come from the project data the router cannot see.
	useEffect(() => {
		if (!project) return
		const url = `${SITE}/projects/${project.slug}`
		const description =
			project.seo?.description ||
			project.tagline ||
			project.summary ||
			`${project.name} — an open-source project by Krishna GSVV.`
		const title =
			project.seo?.title || `${project.name} — Project by Krishna GSVV`

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
				author: { "@type": "Person", name: "Krishna GSVV", url: SITE },
				isPartOf: {
					"@type": "CollectionPage",
					name: "Projects",
					url: `${SITE}/projects`,
				},
			},
		})
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
	const links = Object.entries(project.links || {})
		.map(([key, value]) => [key, safeUrl(value)])
		.filter(([key, value]) => value && LINK_META[key])

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
								{project.status}
							</span>
						)}
						{project.category && (
							<span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-full">
								{project.category}
							</span>
						)}
						{period && <span className="text-gray-400">{period}</span>}
					</div>

					<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
						{project.name}
					</h1>

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
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
						{project.metrics.map((m, i) => (
							<div
								key={i}
								className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl"
							>
								<div className="text-2xl font-bold text-white">{m.value}</div>
								<div className="text-xs text-gray-400 mt-1">{m.label}</div>
							</div>
						))}
					</div>
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
					<section className="mt-12">
						<h2 className="text-2xl font-bold text-white mb-4">Highlights</h2>
						<ul className="space-y-3">
							{project.highlights.map((h, i) => (
								<li key={i} className="flex gap-3 text-gray-300 leading-relaxed">
									<span className="text-purple-400 mt-1">▸</span>
									<span>{h}</span>
								</li>
							))}
						</ul>
					</section>
				)}

				{project.sections?.length > 0 && (
					<div className="mt-12">
						{project.sections.map((section, i) => (
							<Section key={i} section={section} />
						))}
					</div>
				)}

				{project.media?.screenshots?.length > 0 && (
					<section className="mt-12 space-y-6">
						<h2 className="text-2xl font-bold text-white">Screenshots</h2>
						{project.media.screenshots.map((shot, i) => {
							const url = safeUrl(shot.url)
							if (!url) return null
							return (
								<figure key={i}>
									<img
										src={url}
										alt={shot.alt || `${project.name} screenshot ${i + 1}`}
										loading="lazy"
										className="w-full rounded-xl border border-white/10"
									/>
									{shot.caption && (
										<figcaption className="mt-2 text-sm text-gray-400">
											{shot.caption}
										</figcaption>
									)}
								</figure>
							)
						})}
					</section>
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
