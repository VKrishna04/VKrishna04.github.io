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

import { getIconLibraryPrefix as parseIconName } from "./iconSystemCore.js"
import { reactIconToDataUrl } from "./reactIcons.js";

/*
 * Enhanced Favicon Management System with React Icons Support
 * Supports static images, GitHub profile images, emoji, text-based favicons, and React Icons
 */

/**
 * Set favicon in the document head
 */
const setFavicon = async (url) => {
	return new Promise((resolve, reject) => {
		// Remove existing favicons
		const existingIcons = document.querySelectorAll('link[rel*="icon"]');
		existingIcons.forEach((icon) => icon.remove());

		// Create new favicon link
		const link = document.createElement("link");
		link.rel = "icon";
		link.type = "image/png";
		link.href = url;

		// Add load and error handlers
		link.onload = () => {
			console.log("Favicon loaded successfully");
			resolve(url);
		};

		link.onerror = (error) => {
			console.error("Failed to load favicon:", error);
			reject(error);
		};

		// Add to document head
		document.head.appendChild(link);

		// Also add apple touch icon for mobile devices
		const appleIcon = document.createElement("link");
		appleIcon.rel = "apple-touch-icon";
		appleIcon.href = url;
		document.head.appendChild(appleIcon);
	});
};

/**
 * Generate favicon from React Icon
 */
const generateReactIconFavicon = async (iconName, options = {}) => {
	try {
		console.log(`Generating React Icon favicon: ${iconName}`);

		const {
			size = 32,
			color = "#6366f1",
			backgroundColor = "transparent",
			padding = 4,
		} = options;

		// Check if icon name is valid
		const parsed = parseIconName(iconName);
		if (!parsed) {
			console.warn(`Invalid React Icon name: ${iconName}`);
			return null;
		}

		// Generate data URL from React Icon
		const dataUrl = await reactIconToDataUrl(iconName, {
			size,
			color,
			backgroundColor,
			padding,
		});

		if (!dataUrl) {
			console.warn(`Failed to generate data URL for icon: ${iconName}`);
			return null;
		}

		return dataUrl;
	} catch (error) {
		console.error("Error generating React Icon favicon:", error);
		return null;
	}
};

/**
 * Generate favicon from emoji
 */
const generateEmojiFavicon = (emoji, size = 32) => {
	try {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = size;
		canvas.height = size;

		// Set font and draw emoji
		ctx.font = `${size * 0.75}px Arial`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(emoji, size / 2, size / 2);

		return canvas.toDataURL("image/png");
	} catch (error) {
		console.error("Error generating emoji favicon:", error);
		return null;
	}
};

/**
 * Generate favicon from text
 */
const generateTextFavicon = (
	text,
	size = 32,
	bgColor = "#6366f1",
	textColor = "#ffffff",
	fontFamily = "Arial, sans-serif"
) => {
	try {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = size;
		canvas.height = size;

		// Draw background
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, size, size);

		// Draw text
		ctx.fillStyle = textColor;
		ctx.font = `bold ${size * 0.6}px ${fontFamily}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2);

		return canvas.toDataURL("image/png");
	} catch (error) {
		console.error("Error generating text favicon:", error);
		return null;
	}
};

/**
 * Enhanced favicon initialization with React Icons support
 */
export const initializeFavicons = async (settings) => {
	try {
		if (!settings?.favicon) {
			console.log("No favicon settings found");
			return;
		}

		const { favicon } = settings;
		let faviconUrl = null;

		// Determine favicon type and generate accordingly
		switch (favicon.type) {
			case "react-icon":
				if (favicon.iconName) {
					faviconUrl = await generateReactIconFavicon(favicon.iconName, {
						size: favicon.size || 32,
						color: favicon.color || "#6366f1",
						backgroundColor: favicon.backgroundColor || "transparent",
						padding: favicon.padding || 4,
					});
				}
				break;

			case "github":
				if (settings.profile?.github?.username) {
					faviconUrl = `https://github.com/${settings.profile.github.username}.png`;
				}
				break;

			case "emoji":
				if (favicon.emoji) {
					faviconUrl = generateEmojiFavicon(favicon.emoji, favicon.size || 32);
				}
				break;

			case "text":
				if (favicon.text) {
					faviconUrl = generateTextFavicon(
						favicon.text,
						favicon.size || 32,
						favicon.backgroundColor || "#6366f1",
						favicon.color || "#ffffff",
						favicon.fontFamily || "Arial, sans-serif"
					);
				}
				break;

			case "url":
			case "image":
			default:
				if (favicon.url || favicon.path) {
					faviconUrl = favicon.url || favicon.path;
				}
				break;
		}

		// Apply favicon if generated/found
		if (faviconUrl) {
			await setFavicon(faviconUrl);
			console.log(`Favicons updated successfully: ${faviconUrl}`);
		} else {
			// Fallback to a default favicon if none could be generated
			console.warn("No valid favicon could be generated, using default");
			// Try to set a simple text-based fallback
			try {
				const fallbackFavicon = await generateTextFavicon(
					"K",
					"#c770f0",
					"#0a0a0a"
				);
				await setFavicon(fallbackFavicon);
				console.log("Fallback favicon applied successfully");
			} catch (fallbackError) {
				console.warn("Could not apply fallback favicon:", fallbackError);
			}
		}
	} catch (error) {
		console.error("Error initializing favicons:", error);
	}
};

/**
 * Utility functions for favicon management
 */
export const setCustomFavicon = setFavicon;
export const createEmojiFavicon = generateEmojiFavicon;
export const createTextFavicon = generateTextFavicon;
export const createReactIconFavicon = generateReactIconFavicon;
