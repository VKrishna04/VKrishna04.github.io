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
 * The rules that turn an untrusted .portfolio/project.json into something the
 * page is allowed to render.
 *
 * Shared deliberately: scripts/fetch-project-manifests.js applies these at
 * build time, and ProjectDetail.jsx applies the same functions to the manifest
 * it re-fetches in the browser. If they lived in only one of the two, a repo
 * could change its appearance or its demo video live and bypass the checks the
 * build does — or, more likely, edit a field that then never updates.
 *
 * The shape of every rule here is a whitelist. A manifest picks from a closed
 * vocabulary; it never supplies CSS, markup, or a URL we have not parsed.
 */

// Section shapes the renderer knows about. Anything else is dropped rather than
// rendered, so an unknown type can never break a page.
export const SECTION_TYPES = new Set([
	"prose",
	"list",
	"code",
	"table",
	"media",
])

export const THEMES = new Set([
	"default",
	"aurora",
	"ember",
	"ocean",
	"forest",
	"mono",
	"midnight",
])
export const BACKGROUNDS = new Set(["default", "plain", "grid", "dots", "glow"])
export const MEDIA_LAYOUTS = new Set(["auto", "carousel", "grid", "stack"])

const HEX = /^#[0-9a-fA-F]{6}$/
const ICON_NAME = /^[A-Z][A-Za-z0-9]{1,39}$/
const VIDEO_FILE = /\.(mp4|webm|ogg)$/i
const README_PATH_OK = /^[^/][A-Za-z0-9._/-]*\.(md|markdown)$/i

/** Absolute http(s) only. Relative paths are rejected rather than resolved. */
export function httpUrl(value) {
	// Resolving against the site would turn an empty string into a link to the
	// homepage, which is how every project once grew a fake "Demo" button.
	if (typeof value !== "string" || !value.trim()) return ""
	try {
		const u = new URL(value)
		return u.protocol === "https:" || u.protocol === "http:" ? u.href : ""
	} catch {
		return ""
	}
}

export const normalizeIcon = (icon) => (ICON_NAME.test(icon || "") ? icon : "")

/*
 * YouTube and Vimeo watch URLs become privacy-mode embeds; anything else has to
 * be a file <video> can play. Deciding this here means the renderer picks an
 * element from a `kind` we produced, never from a string the manifest supplied.
 */
export function normalizeVideo(video) {
	const url = httpUrl(video?.url)
	if (!url) return null
	const meta = {
		title: video.title || "",
		poster: httpUrl(video.poster),
		caption: video.caption || "",
	}
	const u = new URL(url)
	const host = u.hostname.replace(/^www\./, "")

	if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
		const id =
			host === "youtu.be"
				? u.pathname.slice(1)
				: u.searchParams.get("v") || u.pathname.split("/").pop()
		if (!/^[A-Za-z0-9_-]{6,20}$/.test(id || "")) return null
		return {
			...meta,
			kind: "embed",
			src: `https://www.youtube-nocookie.com/embed/${id}`,
			poster: "",
		}
	}
	if (host === "vimeo.com" || host === "player.vimeo.com") {
		const id = u.pathname.split("/").filter(Boolean).pop()
		if (!/^\d{5,12}$/.test(id || "")) return null
		return {
			...meta,
			kind: "embed",
			src: `https://player.vimeo.com/video/${id}`,
			poster: "",
		}
	}
	if (u.protocol === "https:" && VIDEO_FILE.test(u.pathname)) {
		return { ...meta, kind: "file", src: url }
	}
	return null
}

/** `true` is shorthand for the defaults. A path may not climb out of the repo. */
export function normalizeReadme(readme) {
	if (readme === true) readme = {}
	if (!readme || typeof readme !== "object" || readme.show === false) return null
	const path = String(readme.path || "README.md")
	if (path.includes("..") || !README_PATH_OK.test(path)) return null
	return {
		path,
		heading: String(readme.heading || "From the README").slice(0, 80),
		collapsed: readme.collapsed === true,
	}
}

/*
 * Absent, or anything outside the vocabulary, means "the portfolio decides" —
 * which is what almost every project should want. "default" is stripped rather
 * than stored so that the page's own styling stays the fallback everywhere.
 */
export function normalizeAppearance(appearance) {
	if (!appearance || typeof appearance !== "object") return null
	const out = {}
	if (THEMES.has(appearance.theme) && appearance.theme !== "default")
		out.theme = appearance.theme
	if (
		BACKGROUNDS.has(appearance.background) &&
		appearance.background !== "default"
	)
		out.background = appearance.background
	if (HEX.test(appearance.accent || ""))
		out.accent = appearance.accent.toLowerCase()
	return Object.keys(out).length ? out : null
}

export function normalizeMedia(media, fallbackCover = "") {
	return {
		cover: httpUrl(media?.cover) || fallbackCover,
		screenshots: (media?.screenshots || [])
			.filter((s) => httpUrl(s?.url))
			.slice(0, 12),
		layout: MEDIA_LAYOUTS.has(media?.layout) ? media.layout : "auto",
		video: normalizeVideo(media?.video),
	}
}

export const normalizeSections = (sections) =>
	(sections || []).filter((s) => s && SECTION_TYPES.has(s.type)).slice(0, 20)
