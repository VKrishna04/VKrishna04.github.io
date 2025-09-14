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

// Favicon utility to dynamically generate favicons from GitHub profile, custom images, or React Icons

import { reactIconToDataUrl, parseIconName } from './reactIcons';

// Dynamic React Icons loader
const loadReactIcon = async (iconName) => {
	try {
		// Map icon prefixes to their respective packages
		const iconMappings = {
			'Fa': () => import('react-icons/fa'),
			'Fc': () => import('react-icons/fc'),
			'Ai': () => import('react-icons/ai'),
			'Bs': () => import('react-icons/bs'),
			'Bi': () => import('react-icons/bi'),
			'Di': () => import('react-icons/di'),
			'Fi': () => import('react-icons/fi'),
			'Go': () => import('react-icons/go'),
			'Gr': () => import('react-icons/gr'),
			'Hi': () => import('react-icons/hi'),
			'Hi2': () => import('react-icons/hi2'),
			'Im': () => import('react-icons/im'),
			'Io': () => import('react-icons/io'),
			'Io5': () => import('react-icons/io5'),
			'Lu': () => import('react-icons/lu'),
			'Md': () => import('react-icons/md'),
			'Pi': () => import('react-icons/pi'),
			'Ri': () => import('react-icons/ri'),
			'Si': () => import('react-icons/si'),
			'Sl': () => import('react-icons/sl'),
			'Tb': () => import('react-icons/tb'),
			'Ti': () => import('react-icons/ti'),
			'Vsc': () => import('react-icons/vsc'),
			'Wi': () => import('react-icons/wi'),
		};

		// Detect icon prefix and load appropriate package
		const prefix = Object.keys(iconMappings).find(p => iconName.startsWith(p));
		if (!prefix) {
			console.warn(`Unknown icon prefix for ${iconName}`);
			return null;
		}

		const iconModule = await iconMappings[prefix]();
		return iconModule[iconName] || null;
	} catch (error) {
		console.error(`Failed to load icon ${iconName}:`, error);
		return null;
	}
};

/**
 * Generate favicon from React Icon
 */
const generateReactIconFavicon = async (iconName, options = {}) => {
	try {
		console.log(`Generating React Icon favicon: ${iconName}`);

		const {
			size = 32,
			color = '#6366f1', // Default purple color
			backgroundColor = 'transparent',
			padding = 4
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
			padding
		});

		if (!dataUrl) {
			console.warn(`Failed to generate data URL for icon: ${iconName}`);
			return null;
		}

		return dataUrl;
	} catch (error) {
		console.error('Error generating React Icon favicon:', error);
		return null;
	}
};

// Generate favicon from React Icon
const generateIconFavicon = async (faviconConfig) => {
	try {
		const { iconName, size = 32, color = '#3b82f6', backgroundColor = 'transparent' } = faviconConfig;

		if (!iconName) {
			console.warn('No icon name provided for favicon generation');
			return null;
		}

		// Load the React icon dynamically
		const IconComponent = await loadReactIcon(iconName);
		if (!IconComponent) {
			console.warn(`Failed to load icon: ${iconName}`);
			return null;
		}

		// Create a canvas to render the icon
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = size;
		canvas.height = size;

		// Set background if not transparent
		if (backgroundColor !== 'transparent') {
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, size, size);
		}

		// Create SVG string from React Icon
		const React = await import('react');
		const ReactDOMServer = await import('react-dom/server');

		const iconElement = React.createElement(IconComponent, {
			size: size * 0.8, // 80% of canvas size for padding
			color: color,
		});

		const svgString = ReactDOMServer.renderToString(iconElement);

		// Extract SVG content and create a data URL
		const svgData = `data:image/svg+xml;base64,${btoa(svgString)}`;

		// Create image and draw to canvas
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, size * 0.1, size * 0.1, size * 0.8, size * 0.8);
				resolve(canvas.toDataURL('image/png'));
			};
			img.onerror = () => resolve(null);
			img.src = svgData;
		});

	} catch (error) {
		console.error('Failed to generate icon favicon:', error);
		return null;
	}
};

export const updateFavicons = async (faviconConfig, fallbackUrl = null) => {
	try {
		let faviconUrl = null;

		// Determine favicon source URL
		switch (faviconConfig?.type) {
			case "github":
				faviconUrl =
					faviconConfig.customUrl ||
					`https://github.com/${
						faviconConfig.githubUsername || "VKrishna04"
					}.png`;
				break;
			case "custom":
				faviconUrl = faviconConfig.customUrl;
				break;
			case "icon":
				// Generate favicon from React Icon
				faviconUrl = await generateIconFavicon(faviconConfig);
				break;
			case "default":
			default:
				faviconUrl = fallbackUrl || "/favicon.ico";
				break;
		}

		if (!faviconUrl) return;

		// Remove existing favicons
		const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
		existingFavicons.forEach((link) => link.remove());

		// Create new favicon links
		const sizes = faviconConfig?.sizes || ["16x16", "32x32", "96x96"];

		sizes.forEach((size) => {
			const link = document.createElement("link");
			link.rel = "icon";
			link.type = "image/png";
			link.sizes = size;
			link.href = faviconUrl;
			document.head.appendChild(link);
		});

		// Add Apple Touch Icon if enabled
		if (faviconConfig?.appleTouchIcon) {
			const appleLink = document.createElement("link");
			appleLink.rel = "apple-touch-icon";
			appleLink.sizes = "180x180";
			appleLink.href = faviconUrl;
			document.head.appendChild(appleLink);
		}

		// Add manifest icon for PWA
		const manifestLink = document.createElement("link");
		manifestLink.rel = "icon";
		manifestLink.type = "image/png";
		manifestLink.sizes = "512x512";
		manifestLink.href = faviconUrl;
		document.head.appendChild(manifestLink);

		console.log("Favicons updated successfully:", faviconUrl);
	} catch (error) {
		console.error("Failed to update favicons:", error);

		// Fallback to default favicon
		const defaultLink = document.createElement("link");
		defaultLink.rel = "icon";
		defaultLink.type = "image/x-icon";
		defaultLink.href = "/favicon.ico";
		document.head.appendChild(defaultLink);
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
			console.warn("No valid favicon could be generated");
		}
	} catch (error) {
		console.error("Error initializing favicons:", error);
	}
};

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
const generateTextFavicon = (text, size = 32, bgColor = '#6366f1', textColor = '#ffffff', fontFamily = 'Arial, sans-serif') => {
	try {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = size;
		canvas.height = size;

		// Draw background
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, size, size);

		// Draw text
		ctx.fillStyle = textColor;
		ctx.font = `bold ${size * 0.6}px ${fontFamily}`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2);

		return canvas.toDataURL('image/png');
	} catch (error) {
		console.error('Error generating text favicon:', error);
		return null;
	}
};
