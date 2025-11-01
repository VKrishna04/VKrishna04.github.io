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
 * Theme Utilities
 * Handles dynamic color and style configuration from settings.json
 * Allows any valid CSS color value to be used in configuration
 */

/**
 * Parse Tailwind-style class or return CSS color value
 * @param {string} value - Either a Tailwind class or CSS color
 * @returns {string} CSS color value
 */
export const parseColor = (value) => {
	if (!value) return null;

	// If it's already a valid CSS color (hex, rgb, rgba, hsl, named), return it
	if (
		value.startsWith("#") ||
		value.startsWith("rgb") ||
		value.startsWith("hsl") ||
		value.startsWith("var(") ||
		!/^[a-z-]+$/.test(value)
	) {
		return value;
	}

	// Parse Tailwind class format: text-purple-500 -> purple-500
	const tailwindMatch = value.match(
		/(text|bg|border)-([\w-]+)-([\d]+)(?:\/(\d+))?/
	);
	if (tailwindMatch) {
		const [, , color, shade, opacity] = tailwindMatch;
		return getTailwindColor(color, shade, opacity);
	}

	// Try to extract just color-shade format: purple-500
	const colorMatch = value.match(/([\w-]+)-([\d]+)(?:\/(\d+))?/);
	if (colorMatch) {
		const [, color, shade, opacity] = colorMatch;
		return getTailwindColor(color, shade, opacity);
	}

	return value;
};

/**
 * Get Tailwind color value
 * @param {string} color - Color name (purple, blue, etc.)
 * @param {string} shade - Color shade (500, 600, etc.)
 * @param {string} opacity - Optional opacity (30, 50, etc.)
 * @returns {string} CSS color value
 */
const getTailwindColor = (color, shade, opacity) => {
	const colorMap = {
		purple: {
			100: "#f3e8ff",
			200: "#e9d5ff",
			300: "#d8b4fe",
			400: "#c084fc",
			500: "#a855f7",
			600: "#9333ea",
			700: "#7e22ce",
			800: "#6b21a8",
			900: "#581c87",
		},
		blue: {
			100: "#dbeafe",
			200: "#bfdbfe",
			300: "#93c5fd",
			400: "#60a5fa",
			500: "#3b82f6",
			600: "#2563eb",
			700: "#1d4ed8",
			800: "#1e40af",
			900: "#1e3a8a",
		},
		green: {
			100: "#d1fae5",
			200: "#a7f3d0",
			300: "#6ee7b7",
			400: "#34d399",
			500: "#10b981",
			600: "#059669",
			700: "#047857",
			800: "#065f46",
			900: "#064e3b",
		},
		red: {
			100: "#fee2e2",
			200: "#fecaca",
			300: "#fca5a5",
			400: "#f87171",
			500: "#ef4444",
			600: "#dc2626",
			700: "#b91c1c",
			800: "#991b1b",
			900: "#7f1d1d",
		},
		yellow: {
			100: "#fef3c7",
			200: "#fde68a",
			300: "#fcd34d",
			400: "#fbbf24",
			500: "#f59e0b",
			600: "#d97706",
			700: "#b45309",
			800: "#92400e",
			900: "#78350f",
		},
		pink: {
			100: "#fce7f3",
			200: "#fbcfe8",
			300: "#f9a8d4",
			400: "#f472b6",
			500: "#ec4899",
			600: "#db2777",
			700: "#be185d",
			800: "#9d174d",
			900: "#831843",
		},
		gray: {
			100: "#f3f4f6",
			200: "#e5e7eb",
			300: "#d1d5db",
			400: "#9ca3af",
			500: "#6b7280",
			600: "#4b5563",
			700: "#374151",
			800: "#1f2937",
			900: "#111827",
		},
		white: "#ffffff",
		black: "#000000",
	};

	const baseColor = colorMap[color]?.[shade] || colorMap[color] || color;

	if (opacity) {
		const opacityValue = parseInt(opacity) / 100;
		// Convert hex to rgba if needed
		if (baseColor.startsWith("#")) {
			const r = parseInt(baseColor.slice(1, 3), 16);
			const g = parseInt(baseColor.slice(3, 5), 16);
			const b = parseInt(baseColor.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
		}
	}

	return baseColor;
};

/**
 * Get button styles from configuration
 * @param {object} button - Button configuration
 * @param {boolean} isHover - Whether to get hover styles
 * @returns {object} React inline style object
 */
export const getButtonStyles = (button, isHover = false) => {
	if (!button) return {};

	if (button.type === "primary") {
		const gradient = isHover
			? button.hoverGradient || button.gradient
			: button.gradient;
		return {
			background: gradient || "linear-gradient(to right, #a855f7, #ec4899)",
			color: button.textColor ? parseColor(button.textColor) : "#ffffff",
			...(button.shadowColor && {
				boxShadow: `0 10px 25px -5px ${parseColor(button.shadowColor)}`,
			}),
		};
	} else if (button.type === "outline") {
		return {
			borderColor: parseColor(button.borderColor) || "#a855f7",
			color: isHover
				? parseColor(button.hoverText) || "#ffffff"
				: parseColor(button.textColor) || "#c084fc",
			...(isHover &&
				button.hoverBg && {
					backgroundColor: parseColor(button.hoverBg) || "#a855f7",
				}),
		};
	}

	return {};
};

/**
 * Get social link styles from configuration
 * @param {object} platform - Platform configuration
 * @param {boolean} isHover - Whether to get hover styles
 * @returns {object} React inline style object
 */
export const getSocialLinkStyles = (platform, isHover = false) => {
	if (!platform) return {};

	return {
		color: isHover
			? parseColor(platform.hoverColor) || "#c084fc"
			: parseColor(platform.color) || "#9ca3af",
	};
};

/**
 * Apply opacity to a color
 * @param {string} color - CSS color value
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} Color with opacity
 */
export const applyOpacity = (color, opacity) => {
	if (!color) return null;

	// If it's already rgba/hsla, extract and modify opacity
	const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
	if (rgbaMatch) {
		const [, r, g, b] = rgbaMatch;
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	// Convert hex to rgba
	if (color.startsWith("#")) {
		const r = parseInt(color.slice(1, 3), 16);
		const g = parseInt(color.slice(3, 5), 16);
		const b = parseInt(color.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	return color;
};

/**
 * Get theme-aware gradient
 * @param {string|object} gradient - Gradient configuration
 * @returns {string} CSS gradient value
 */
export const getGradient = (gradient) => {
	if (!gradient) return null;

	if (typeof gradient === "string") {
		return gradient;
	}

	if (typeof gradient === "object") {
		const { type = "linear", direction = "to right", colors = [] } = gradient;
		return `${type}-gradient(${direction}, ${colors.join(", ")})`;
	}

	return gradient;
};
