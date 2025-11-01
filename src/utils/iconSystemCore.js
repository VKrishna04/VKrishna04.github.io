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
 * UNIFIED ICON SYSTEM - CORE UTILITIES
 *
 * This module provides utility functions for the icon system.
 * Separated from the React component to avoid Fast Refresh warnings.
 */

// ============================================================================
// ICON LIBRARY REGISTRY
// ============================================================================

/**
 * Complete mapping of icon library prefixes to their import paths
 * This enables automatic detection and loading of ANY react-icons icon
 */
export const ICON_LIBRARY_REGISTRY = {
	// Ant Design Icons
	Ai: "react-icons/ai",
	// Bootstrap Icons
	Bs: "react-icons/bs",
	// Boxicons
	Bi: "react-icons/bi",
	// Circum Icons
	Ci: "react-icons/ci",
	// Devicons
	Di: "react-icons/di",
	// Feather
	Fi: "react-icons/fi",
	// Flat Color Icons
	Fc: "react-icons/fc",
	// Font Awesome (Free)
	Fa: "react-icons/fa",
	// Font Awesome 6
	Fa6: "react-icons/fa6",
	// Game Icons
	Gi: "react-icons/gi",
	// GitHub Octicons
	Go: "react-icons/go",
	// Grommet Icons
	Gr: "react-icons/gr",
	// Heroicons (v1)
	Hi: "react-icons/hi",
	// Heroicons 2
	Hi2: "react-icons/hi2",
	// IcoMoon Free
	Im: "react-icons/im",
	// Ionicons 4
	Io: "react-icons/io",
	// Ionicons 5
	Io5: "react-icons/io5",
	// Lucide
	Lu: "react-icons/lu",
	// Material Design Icons
	Md: "react-icons/md",
	// Phosphor Icons
	Pi: "react-icons/pi",
	// Remix Icon
	Ri: "react-icons/ri",
	// Radix Icons
	Rx: "react-icons/rx",
	// Simple Icons
	Si: "react-icons/si",
	// Simple Line Icons
	Sl: "react-icons/sl",
	// Tabler Icons
	Tb: "react-icons/tb",
	// Themify Icons
	Tfi: "react-icons/tfi",
	// Typicons
	Ti: "react-icons/ti",
	// VS Code Icons
	Vsc: "react-icons/vsc",
	// Weather Icons
	Wi: "react-icons/wi",
	// css.gg
	Cg: "react-icons/cg",
};

/**
 * Cache for loaded icon components to improve performance
 * Prevents redundant imports of the same icon
 */
export const iconCache = new Map();

/**
 * In-flight requests tracker to prevent duplicate loads
 */
export const loadingPromises = new Map();

// ============================================================================
// ICON NAME PARSING
// ============================================================================

/**
 * Extract library prefix from icon name
 * Examples:
 * - FaReact -> Fa
 * - MdHome -> Md
 * - HiUser -> Hi (from hi)
 * - HiBars3 -> Hi (may resolve from hi or hi2)
 * - SiJavascript -> Si
 *
 * @param {string} iconName - The icon name (e.g., "FaReact")
 * @returns {string|null} - The library prefix or null if invalid
 */
export const getIconLibraryPrefix = (iconName) => {
	if (!iconName || typeof iconName !== "string") {
		return null
	}

	// Sort registry keys by length (longest first) to match Hi2 before Hi, Io5 before Io, etc.
	const sortedPrefixes = Object.keys(ICON_LIBRARY_REGISTRY).sort(
		(a, b) => b.length - a.length
	)

	// Try to match the longest possible prefix first
	for (const prefix of sortedPrefixes) {
		if (iconName.startsWith(prefix)) {
			return prefix
		}
	}

	// Fallback: Match icon prefixes (2-3 capital letters at start)
	// Examples: Fa, Md, Hi, Hi2, Io5, Fa6
	const match = iconName.match(/^([A-Z][a-z]*\d*)/)
	if (match) {
		const prefix = match[1]
		console.warn(
			`[UnifiedIconSystem] Prefix '${prefix}' found in icon name '${iconName}' but not in registry. May need to add to ICON_LIBRARY_REGISTRY.`
		)
		return prefix
	}

	console.warn(`[UnifiedIconSystem] Invalid icon name format: ${iconName}`)
	return null
}

/**
 * Get the import path for an icon library
 *
 * @param {string} prefix - Library prefix (e.g., "Fa", "Md")
 * @returns {string|null} - Import path or null if not found
 */
export const getIconLibraryPath = (prefix) => {
	if (!prefix) return null

	const path = ICON_LIBRARY_REGISTRY[prefix]
	if (!path) {
		console.warn(`[UnifiedIconSystem] Unknown icon library prefix: ${prefix}`)
		return null
	}

	return path
}

// ============================================================================
// ICON LOADING
// ============================================================================

/**
 * Dynamically load an icon component from react-icons
 *
 * This function:
 * 1. Checks the cache first
 * 2. Parses the icon name to detect library
 * 3. Dynamically imports the library
 * 4. Extracts and returns the icon component
 *
 * @param {string} iconName - The icon name (e.g., "FaReact")
 * @returns {Promise<React.Component|null>} - Icon component or null
 */
export const getUnifiedIcon = async (iconName) => {
	// Return null for invalid input
	if (!iconName || typeof iconName !== "string") {
		console.warn("[UnifiedIconSystem] Invalid icon name:", iconName)
		return null
	}

	// Check cache first
	if (iconCache.has(iconName)) {
		return iconCache.get(iconName)
	}

	// Check if already loading
	if (loadingPromises.has(iconName)) {
		return loadingPromises.get(iconName)
	}

	// Create loading promise
	const loadingPromise = (async () => {
		try {
			// Parse icon name to get library
			const prefix = getIconLibraryPrefix(iconName)
			if (!prefix) {
				return null
			}

			const libraryPath = getIconLibraryPath(prefix)
			if (!libraryPath) {
				return null
			}

			// Dynamically import the icon library using static paths for Vite
			let iconModule
			switch (prefix) {
				case "Fa":
					iconModule = await import("react-icons/fa")
					break
				case "Fa6":
					iconModule = await import("react-icons/fa6")
					break
				case "Si":
					iconModule = await import("react-icons/si")
					break
				case "Hi":
					iconModule = await import("react-icons/hi")
					// iconModule = await import("@heroicons/react/24/outline");
					break
				case "Hi2":
					iconModule = await import("react-icons/hi2")
					break
				case "Md":
					iconModule = await import("react-icons/md")
					break
				case "Ai":
					iconModule = await import("react-icons/ai")
					break
				case "Bs":
					iconModule = await import("react-icons/bs")
					break
				case "Bi":
					iconModule = await import("react-icons/bi")
					break
				case "Ci":
					iconModule = await import("react-icons/ci")
					break
				case "Di":
					iconModule = await import("react-icons/di")
					break
				case "Fi":
					iconModule = await import("react-icons/fi")
					break
				case "Fc":
					iconModule = await import("react-icons/fc")
					break
				case "Gi":
					iconModule = await import("react-icons/gi")
					break
				case "Go":
					iconModule = await import("react-icons/go")
					break
				case "Gr":
					iconModule = await import("react-icons/gr")
					break
				case "Im":
					iconModule = await import("react-icons/im")
					break
				case "Io":
					iconModule = await import("react-icons/io")
					break
				case "Io5":
					iconModule = await import("react-icons/io5")
					break
				case "Lu":
					iconModule = await import("react-icons/lu")
					break
				case "Pi":
					iconModule = await import("react-icons/pi")
					break
				case "Ri":
					iconModule = await import("react-icons/ri")
					break
				case "Rx":
					iconModule = await import("react-icons/rx")
					break
				case "Sl":
					iconModule = await import("react-icons/sl")
					break
				case "Tb":
					iconModule = await import("react-icons/tb")
					break
				case "Tfi":
					iconModule = await import("react-icons/tfi")
					break
				case "Ti":
					iconModule = await import("react-icons/ti")
					break
				case "Vsc":
					iconModule = await import("react-icons/vsc")
					break
				case "Wi":
					iconModule = await import("react-icons/wi")
					break
				case "Cg":
					iconModule = await import("react-icons/cg")
					break
				default:
					console.warn(
						`[UnifiedIconSystem] Unsupported icon library prefix: ${prefix}`
					)
					return null
			}

			// Get the specific icon component
			let IconComponent = iconModule[iconName]

			// Treat Hi* names as coming from either hi or hi2, exact name only.
			// If prefix is Hi and not found in hi, try the same exact name from hi2.
			if (!IconComponent && prefix === "Hi") {
				try {
					const hi2Module = await import("react-icons/hi2")
					IconComponent = hi2Module[iconName]
				} catch {
					// ignore
				}
			}

			if (!IconComponent) {
				console.warn(
					`[UnifiedIconSystem] Icon "${iconName}" not found in library "${prefix}"`
				)
				return null
			}

			// Cache the result
			iconCache.set(iconName, IconComponent)

			return IconComponent
		} catch (error) {
			console.error(
				`[UnifiedIconSystem] Error loading icon "${iconName}":`,
				error
			)
			iconCache.set(iconName, null) // Cache null to prevent repeated failures
			return null
		} finally {
			// Remove from loading promises
			loadingPromises.delete(iconName)
		}
	})()

	// Track the loading promise
	loadingPromises.set(iconName, loadingPromise)

	return loadingPromise
}

/**
 * Synchronously get a cached icon (returns null if not in cache)
 * Useful for components that can't use async/await
 *
 * @param {string} iconName - The icon name
 * @returns {React.Component|null} - Cached icon or null
 */
export const getCachedIcon = (iconName) => {
	return iconCache.get(iconName) || null;
};

/**
 * Preload multiple icons for better performance
 * Useful for preloading icons that will be needed soon
 *
 * @param {string[]} iconNames - Array of icon names to preload
 * @returns {Promise<void>}
 */
export const preloadIcons = async (iconNames) => {
	if (!Array.isArray(iconNames)) {
		console.warn("[UnifiedIconSystem] preloadIcons expects an array");
		return;
	}

	await Promise.all(iconNames.map((name) => getUnifiedIcon(name)));
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if an icon exists in the unified system
 *
 * @param {string} iconName - Icon name to check
 * @returns {Promise<boolean>}
 */
export const iconExists = async (iconName) => {
	const icon = await getUnifiedIcon(iconName);
	return icon !== null;
};

/**
 * Get all available icon libraries
 *
 * @returns {string[]} - Array of library prefixes
 */
export const getAvailableLibraries = () => {
	return Object.keys(ICON_LIBRARY_REGISTRY);
};

/**
 * Search for icons by partial name match
 * Note: This only searches within cached icons for performance
 *
 * @param {string} query - Search query
 * @returns {string[]} - Array of matching icon names
 */
export const searchCachedIcons = (query) => {
	if (!query) return [];

	const lowerQuery = query.toLowerCase();
	return Array.from(iconCache.keys()).filter((name) =>
		name.toLowerCase().includes(lowerQuery)
	);
};

/**
 * Clear the icon cache (useful for testing or memory management)
 */
export const clearIconCache = () => {
	iconCache.clear();
	loadingPromises.clear();
};

/**
 * Get cache statistics
 *
 * @returns {Object} - Cache stats
 */
export const getIconCacheStats = () => {
	return {
		cachedIcons: iconCache.size,
		loadingIcons: loadingPromises.size,
		libraries: Object.keys(ICON_LIBRARY_REGISTRY).length,
	};
};

// ============================================================================
// LEGACY SUPPORT
// ============================================================================

// Import commonly used icons for legacy fallback (lazy loaded)
let heroiconsModule = null;
let faModule = null;
let siModule = null;

/**
 * Lazy load legacy icon modules
 */
const loadLegacyModules = async () => {
	if (!heroiconsModule) {
		heroiconsModule = await import("@heroicons/react/24/outline");
	}
	if (!faModule) {
		faModule = await import("react-icons/fa");
	}
	if (!siModule) {
		siModule = await import("react-icons/si");
	}

	return {
		...heroiconsModule,
		FaGithub: faModule.FaGithub,
		FaLinkedin: faModule.FaLinkedin,
		FaTwitter: faModule.FaTwitter,
		FaInstagram: faModule.FaInstagram,
		FaDiscord: faModule.FaDiscord,
		FaYoutube: faModule.FaYoutube,
		FaTwitch: faModule.FaTwitch,
		FaTiktok: faModule.FaTiktok,
		FaMedium: faModule.FaMedium,
		FaDev: faModule.FaDev,
		FaStackOverflow: faModule.FaStackOverflow,
		FaDribbble: faModule.FaDribbble,
		FaBehance: faModule.FaBehance,
		FaCodepen: faModule.FaCodepen,
		FaHeart: faModule.FaHeart,
		FaReact: faModule.FaReact,
		FaDatabase: faModule.FaDatabase,
		SiGithub: siModule.SiGithub,
		SiLinkedin: siModule.SiLinkedin,
		SiX: siModule.SiX,
		SiInstagram: siModule.SiInstagram,
		SiDiscord: siModule.SiDiscord,
		SiYoutube: siModule.SiYoutube,
		SiTwitch: siModule.SiTwitch,
		SiTiktok: siModule.SiTiktok,
		SiMedium: siModule.SiMedium,
		SiDevdotto: siModule.SiDevdotto,
		SiStackoverflow: siModule.SiStackoverflow,
		SiDribbble: siModule.SiDribbble,
		SiBehance: siModule.SiBehance,
		SiCodepen: siModule.SiCodepen,
		SiGmail: siModule.SiGmail,
		SiWhatsapp: siModule.SiWhatsapp,
		SiTelegram: siModule.SiTelegram,
		SiSlack: siModule.SiSlack,
		SiReddit: siModule.SiReddit,
		SiFacebook: siModule.SiFacebook,
		SiSnapchat: siModule.SiSnapchat,
		SiSpotify: siModule.SiSpotify,
		SiSoundcloud: siModule.SiSoundcloud,
		SiGithubcopilot: siModule.SiGithubcopilot,
	};
};

/**
 * Get icon from legacy static map
 * @deprecated Use getUnifiedIcon() instead
 *
 * @param {string} iconName - Icon name
 * @returns {Promise<React.Component|null>}
 */
export const getLegacyIcon = async (iconName) => {
	if (!iconName) return null;

	const legacyMap = await loadLegacyModules();
	return legacyMap[iconName] || null;
};

/**
 * Get icon with automatic fallback to legacy system
 * This is the recommended function for maximum compatibility
 *
 * @param {string} iconName - Icon name
 * @returns {Promise<React.Component|null>}
 */
export const getIconWithFallback = async (iconName) => {
	// Try unified system first
	const unifiedIcon = await getUnifiedIcon(iconName);
	if (unifiedIcon) {
		return unifiedIcon;
	}

	// Fallback to legacy system
	const legacyIcon = await getLegacyIcon(iconName);
	if (legacyIcon) {
		console.info(`[UnifiedIconSystem] Using legacy icon for "${iconName}"`);
		return legacyIcon;
	}

	console.warn(
		`[UnifiedIconSystem] Icon "${iconName}" not found in unified or legacy systems`
	);
	return null;
};
