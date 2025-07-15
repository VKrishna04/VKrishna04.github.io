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

// Favicon utility to dynamically generate favicons from GitHub profile or custom images
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

// Initialize favicons when settings are loaded
export const initializeFavicons = async (settings) => {
	if (!settings?.favicon) return;

	// Use home profile image as fallback if favicon type matches
	const fallbackUrl =
		settings.home?.profileImage?.type === "github"
			? settings.home.profileImage.customUrl
			: null;

	await updateFavicons(settings.favicon, fallbackUrl);
};

// Update favicon dynamically (useful for theme changes or user preferences)
export const changeFavicon = async (newConfig) => {
	await updateFavicons(newConfig);
};
