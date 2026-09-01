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

/**
 * Whose portfolio is this — resolved from settings, never hard-coded.
 *
 * Every component that needs the owner's name, site URL or GitHub handle used
 * to end its fallback chain in a literal ("Krishna GSVV", "VKrishna04",
 * "https://vkrishna04.me"). That made a fork silently publish the original
 * author's identity in its own meta tags and JSON-LD. These resolvers end in
 * empty strings instead, so a missing settings key renders nothing rather than
 * someone else's name.
 *
 * This is deliberately NOT the attribution module. `src/utils/attribution.js`
 * carries the project credit, which is NOTICE-backed and must survive a fork.
 * This file carries the *site owner's* identity, which must not.
 */

/**
 * The portfolio owner's display name.
 * @param {object} settings - The loaded settings object
 * @returns {string} The owner's name, or "" when unset
 */
export const getOwnerName = (settings) =>
	settings?.seo?.author ||
	settings?.home?.name ||
	settings?.navbar?.logo?.name ||
	""

/**
 * The site's canonical origin, without a trailing slash.
 * Falls back to the browser's own origin so a fork is self-referential
 * before its owner has configured anything.
 * @param {object} settings - The loaded settings object
 * @returns {string} Origin such as "https://example.com", or "" when unresolvable
 */
export const getSiteUrl = (settings) => {
	const configured = settings?.seo?.canonical || settings?.seo?.customDomain
	if (configured) return String(configured).replace(/\/$/, "")
	// Falling back to the live origin keeps an unconfigured fork self-referential,
	// but the prerenderer serves the build from a throwaway localhost port — and
	// a canonical or JSON-LD URL pointing at localhost is worse than none at all.
	const origin =
		typeof window !== "undefined" ? window.location?.origin || "" : ""
	if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(origin)) {
		return ""
	}
	return origin
}

/**
 * The GitHub account (user or org) the portfolio pulls repositories from.
 * @param {object} settings - The loaded settings object
 * @returns {string} The handle, or "" when unset
 */
export const getGitHubUsername = (settings) =>
	settings?.github?.username || settings?.projects?.devUsername || ""

/**
 * The REST endpoint for the configured account's repositories.
 * Built from the handle and `github.type` so the org/user distinction lives in
 * settings rather than in a hard-coded URL.
 * @param {object} settings - The loaded settings object
 * @returns {string} The API URL, or "" when no handle is configured
 */
export const getGitHubApiUrl = (settings) => {
	if (settings?.github?.apiUrl) return settings.github.apiUrl
	const username = getGitHubUsername(settings)
	if (!username) return ""
	const scope = settings?.github?.type === "org" ? "orgs" : "users"
	return `https://api.github.com/${scope}/${username}/repos`
}

/**
 * The User-Agent sent with GitHub API requests. GitHub requires one; the
 * generic default identifies the software, not its operator.
 * @param {object} settings - The loaded settings object
 * @returns {string} A User-Agent string
 */
export const getUserAgent = (settings) =>
	settings?.github?.userAgent || "Portfolio"
