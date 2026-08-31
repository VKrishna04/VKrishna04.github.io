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
 * Head management shared by the route-level effect in App.jsx and by pages
 * that own their own metadata (project detail pages, whose title and
 * description come from data the router doesn't have).
 */

// Upsert a <meta> tag by attribute, creating it when the build-time HTML
// did not already ship one.
export const setMeta = (attr, key, content) => {
	if (!content) return
	let el = document.head.querySelector(`meta[${attr}="${key}"]`)
	if (!el) {
		el = document.createElement("meta")
		el.setAttribute(attr, key)
		document.head.appendChild(el)
	}
	el.setAttribute("content", content)
}

export const setCanonical = (url) => {
	if (!url) return
	let el = document.head.querySelector('link[rel="canonical"]')
	if (!el) {
		el = document.createElement("link")
		el.rel = "canonical"
		document.head.appendChild(el)
	}
	el.href = url
}

// Route-scoped structured data lives in its own node so it never clobbers the
// site-wide Person block that ships in the build-time HTML.
export const setRouteJsonLd = (payload) => {
	let el = document.getElementById("route-jsonld")
	if (!payload) {
		el?.remove()
		return
	}
	if (!el) {
		el = document.createElement("script")
		el.type = "application/ld+json"
		el.id = "route-jsonld"
		document.head.appendChild(el)
	}
	el.textContent = JSON.stringify(payload)
}

// One call to set every head field a page needs. `image` is absolute.
export const applyPageMeta = ({ title, description, url, image, jsonLd }) => {
	if (title) document.title = title
	setCanonical(url)
	setMeta("name", "description", description)
	setMeta("property", "og:title", title)
	setMeta("property", "og:description", description)
	setMeta("property", "og:url", url)
	if (image) {
		setMeta("property", "og:image", image)
		setMeta("name", "twitter:image", image)
		setMeta("name", "twitter:card", "summary_large_image")
	}
	setMeta("name", "twitter:title", title)
	setMeta("name", "twitter:description", description)
	setRouteJsonLd(jsonLd)
}
