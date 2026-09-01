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
 * The media block of a project page: an optional demo video, then the
 * screenshots.
 *
 * `layout` comes from the manifest but is a closed vocabulary resolved in
 * src/utils/projectManifest.js — "auto" means a carousel once there is more
 * than one screenshot, a single figure otherwise. The video's `kind` is
 * likewise decided during normalization, so this component never inspects a
 * URL to choose between <iframe> and <video>.
 */

import { useEffect, useRef, useState } from "react"
import {
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { httpUrl } from "../utils/projectManifest"

function Video({ video, accent }) {
	if (video.kind === "embed") {
		return (
			<figure className="mb-10">
				<div
					className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black"
					style={{ aspectRatio: "16 / 9", borderColor: accent || undefined }}
				>
					<iframe
						src={video.src}
						title={video.title || "Project demo"}
						loading="lazy"
						allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
						className="absolute inset-0 h-full w-full"
					/>
				</div>
				{video.caption && (
					<figcaption className="mt-2 text-sm text-gray-400">
						{video.caption}
					</figcaption>
				)}
			</figure>
		)
	}

	return (
		<figure className="mb-10">
			{/* No <track>: the manifest has no way to supply a caption file for a
			    third-party demo video. */}
			<video
				src={video.src}
				poster={video.poster || undefined}
				controls
				preload="metadata"
				className="w-full rounded-xl border border-white/10 bg-black"
				style={{ borderColor: accent || undefined }}
			/>
			{video.caption && (
				<figcaption className="mt-2 text-sm text-gray-400">
					{video.caption}
				</figcaption>
			)}
		</figure>
	)
}

function Carousel({ shots, name, accent }) {
	const [index, setIndex] = useState(0)
	const liveRef = useRef(null)
	const count = shots.length
	const go = (next) => setIndex(((next % count) + count) % count)

	// Arrow keys only while the carousel itself has focus — a global listener
	// would hijack the arrow keys for the whole page.
	const onKeyDown = (e) => {
		if (e.key === "ArrowLeft") {
			e.preventDefault()
			go(index - 1)
		} else if (e.key === "ArrowRight") {
			e.preventDefault()
			go(index + 1)
		}
	}

	useEffect(() => {
		// Announce the change for screen readers without moving focus.
		if (liveRef.current) liveRef.current.textContent = `Image ${index + 1} of ${count}`
	}, [index, count])

	const shot = shots[index]

	return (
		<div
			role="group"
			aria-roledescription="carousel"
			aria-label={`${name} screenshots`}
			tabIndex={0}
			onKeyDown={onKeyDown}
			className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
		>
			<figure className="relative">
				<img
					src={shot.url}
					alt={shot.alt || `${name} screenshot ${index + 1}`}
					loading={index === 0 ? "eager" : "lazy"}
					className="w-full rounded-xl border border-white/10 bg-black/20"
					style={{ borderColor: accent || undefined }}
				/>
				<button
					type="button"
					onClick={() => go(index - 1)}
					aria-label="Previous screenshot"
					className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/80"
				>
					<ChevronLeftIcon className="h-5 w-5" />
				</button>
				<button
					type="button"
					onClick={() => go(index + 1)}
					aria-label="Next screenshot"
					className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/80"
				>
					<ChevronRightIcon className="h-5 w-5" />
				</button>
				{shot.caption && (
					<figcaption className="mt-2 text-sm text-gray-400">
						{shot.caption}
					</figcaption>
				)}
			</figure>

			<div className="mt-4 flex items-center justify-center gap-2">
				{shots.map((s, i) => (
					<button
						key={i}
						type="button"
						onClick={() => go(i)}
						aria-label={`Go to screenshot ${i + 1}`}
						aria-current={i === index}
						className={`h-2 rounded-full transition-all ${
							i === index ? "w-6 bg-purple-400" : "w-2 bg-white/25 hover:bg-white/40"
						}`}
						style={i === index && accent ? { backgroundColor: accent } : undefined}
					/>
				))}
			</div>
			<span ref={liveRef} aria-live="polite" className="sr-only" />
		</div>
	)
}

const ProjectGallery = ({ media, name, accent }) => {
	const video = media?.video || null
	const shots = (media?.screenshots || [])
		.map((s) => ({ ...s, url: httpUrl(s.url) }))
		.filter((s) => s.url)

	if (!video && !shots.length) return null

	const layout = media?.layout || "auto"
	const mode =
		layout === "auto" ? (shots.length > 1 ? "carousel" : "stack") : layout

	return (
		<section className="mt-12">
			<h2 className="text-2xl font-bold text-white mb-6">
				{video && !shots.length ? "Demo" : "Screenshots"}
			</h2>

			{video && <Video video={video} accent={accent} />}

			{mode === "carousel" && shots.length > 1 && (
				<Carousel shots={shots} name={name} accent={accent} />
			)}

			{mode === "grid" && shots.length > 0 && (
				<div className="grid gap-6 sm:grid-cols-2">
					{shots.map((shot, i) => (
						<figure key={i}>
							<img
								src={shot.url}
								alt={shot.alt || `${name} screenshot ${i + 1}`}
								loading="lazy"
								className="w-full rounded-xl border border-white/10"
								style={{ borderColor: accent || undefined }}
							/>
							{shot.caption && (
								<figcaption className="mt-2 text-sm text-gray-400">
									{shot.caption}
								</figcaption>
							)}
						</figure>
					))}
				</div>
			)}

			{(mode === "stack" || (mode === "carousel" && shots.length === 1)) &&
				shots.length > 0 && (
					<div className="space-y-6">
						{shots.map((shot, i) => (
							<figure key={i}>
								<img
									src={shot.url}
									alt={shot.alt || `${name} screenshot ${i + 1}`}
									loading="lazy"
									className="w-full rounded-xl border border-white/10"
									style={{ borderColor: accent || undefined }}
								/>
								{shot.caption && (
									<figcaption className="mt-2 text-sm text-gray-400">
										{shot.caption}
									</figcaption>
								)}
							</figure>
						))}
					</div>
				)}
		</section>
	)
}

export default ProjectGallery
