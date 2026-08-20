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
 * UNIFIED ICON SYSTEM — core resolution
 *
 * Icons resolve synchronously from a build-time generated map
 * (src/generated/icon-map.js) that contains exactly the icons referenced in
 * public/settings.json and the source tree — regenerate it with
 * `node scripts/generate-icon-map.js` after adding a new icon name.
 *
 * This replaced runtime barrel imports + per-family dynamic imports that
 * shipped the entire react-icons catalogue (~35 MB of JS) to render ~90 icons.
 *
 * The async signatures are kept so existing callers (UnifiedIcon, About
 * preload, favicon generation) keep working unchanged.
 */

import { ICON_MAP } from "../generated/icon-map.js"

// react-icons family prefixes, used only to sanity-parse icon names.
// Longest first so "Fa6"/"Hi2"/"Io5" are not swallowed by "Fa"/"Hi"/"Io".
const LIBRARY_PREFIXES = [
	"Tfi", "Vsc", "Fa6", "Hi2", "Io5",
	"Ai", "Bi", "Bs", "Cg", "Ci", "Di", "Fa", "Fc", "Fi", "Gi", "Go", "Gr",
	"Hi", "Im", "Io", "Lu", "Md", "Pi", "Ri", "Rx", "Si", "Sl", "Tb", "Ti", "Wi",
]

/**
 * Extract the library prefix from a react-icons style name.
 * @param {string} iconName - e.g. "FaReact" → "Fa"
 * @returns {string|null} the prefix, or null if the name matches no family
 */
export const getIconLibraryPrefix = (iconName) => {
	if (!iconName || typeof iconName !== "string") return null
	return LIBRARY_PREFIXES.find((p) => iconName.startsWith(p)) || null
}

const warned = new Set()
const warnOnce = (iconName) => {
	if (warned.has(iconName)) return
	warned.add(iconName)
	console.warn(
		`[IconSystem] Icon "${iconName}" is not in the generated map — ` +
			`add it to settings.json or source and run: node scripts/generate-icon-map.js`
	)
}

/**
 * Resolve an icon component by name (react-icons or heroicons style).
 * Kept async for API compatibility; resolution is synchronous.
 * @param {string} iconName
 * @returns {Promise<React.Component|null>}
 */
export const getUnifiedIcon = async (iconName) => {
	return getCachedIcon(iconName)
}

/**
 * Synchronous icon lookup.
 * @param {string} iconName
 * @returns {React.Component|null}
 */
export const getCachedIcon = (iconName) => {
	if (!iconName || typeof iconName !== "string") return null
	const icon = ICON_MAP[iconName]
	if (icon) return icon
	warnOnce(iconName)
	return null
}

/**
 * Resolve an icon, falling back to the heroicons naming convention
 * ("User" → "UserIcon") before giving up.
 * @param {string} iconName
 * @returns {Promise<React.Component|null>}
 */
export const getIconWithFallback = async (iconName) => {
	if (!iconName || typeof iconName !== "string") return null
	const direct = ICON_MAP[iconName]
	if (direct) return direct
	if (!iconName.endsWith("Icon") && ICON_MAP[`${iconName}Icon`]) {
		return ICON_MAP[`${iconName}Icon`]
	}
	warnOnce(iconName)
	return null
}

/**
 * Preload a list of icons. With the build-time map everything is already
 * loaded — this now just validates the names (warning on misses).
 * @param {string[]} iconNames
 * @returns {Promise<Array<React.Component|null>>}
 */
export const preloadIcons = async (iconNames = []) => {
	return iconNames.map((name) => getCachedIcon(name))
}

/**
 * @param {string} iconName
 * @returns {boolean} whether the icon exists in the generated map
 */
export const iconExists = (iconName) => Boolean(ICON_MAP[iconName])
