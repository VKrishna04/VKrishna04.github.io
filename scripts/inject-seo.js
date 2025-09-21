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

import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "jsonc-parser";

/**
 * Vite plugin to inject SEO meta tags from settings.json into HTML
 */
export function injectSeoPlugin() {
	return {
		name: "inject-seo",
		transformIndexHtml(html) {
			try {
				// Read settings.json
				const settingsPath = resolve("public/settings.json");
				const settingsContent = readFileSync(settingsPath, "utf-8");

				// Parse JSONC (JSON with comments)
				const settings = parse(settingsContent);
				if (!settings.seo) {
					console.warn("SEO configuration not found in settings.json");
					return html;
				}

				const seo = settings.seo;

				// Generate meta tags
				let metaTags = [];

				// Basic meta tags
				if (seo.title) {
					metaTags.push(`<title>${escapeHtml(seo.title)}</title>`);
					metaTags.push(
						`<meta property="og:title" content="${escapeHtml(seo.title)}" />`
					);
					metaTags.push(
						`<meta name="twitter:title" content="${escapeHtml(
							seo.twitter?.title || seo.title
						)}" />`
					);
				}

				if (seo.description) {
					metaTags.push(
						`<meta name="description" content="${escapeHtml(
							seo.description
						)}" />`
					);
					metaTags.push(
						`<meta property="og:description" content="${escapeHtml(
							seo.openGraph?.description || seo.description
						)}" />`
					);
					metaTags.push(
						`<meta name="twitter:description" content="${escapeHtml(
							seo.twitter?.description || seo.description
						)}" />`
					);
				}

				if (seo.keywords && Array.isArray(seo.keywords)) {
					metaTags.push(
						`<meta name="keywords" content="${escapeHtml(
							seo.keywords.join(", ")
						)}" />`
					);
				}

				if (seo.author) {
					metaTags.push(
						`<meta name="author" content="${escapeHtml(seo.author)}" />`
					);
				}

				if (seo.canonical) {
					metaTags.push(
						`<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`
					);
					metaTags.push(
						`<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`
					);
					metaTags.push(
						`<meta name="twitter:url" content="${escapeHtml(seo.canonical)}" />`
					);
				}

				// Open Graph meta tags
				if (seo.openGraph) {
					const og = seo.openGraph;
					metaTags.push(`<meta property="og:type" content="website" />`);

					if (og.image) {
						metaTags.push(
							`<meta property="og:image" content="${escapeHtml(og.image)}" />`
						);
						metaTags.push(
							`<meta name="twitter:image" content="${escapeHtml(
								seo.twitter?.image || og.image
							)}" />`
						);

						if (og.imageWidth) {
							metaTags.push(
								`<meta property="og:image:width" content="${og.imageWidth}" />`
							);
						}
						if (og.imageHeight) {
							metaTags.push(
								`<meta property="og:image:height" content="${og.imageHeight}" />`
							);
						}
					}

					if (og.siteName) {
						metaTags.push(
							`<meta property="og:site_name" content="${escapeHtml(
								og.siteName
							)}" />`
						);
					}
				}

				// Twitter Card meta tags
				metaTags.push(
					`<meta name="twitter:card" content="summary_large_image" />`
				);
				if (seo.twitter?.creator) {
					metaTags.push(
						`<meta name="twitter:creator" content="${escapeHtml(
							seo.twitter.creator
						)}" />`
					);
				}

				// Additional meta tags for better SEO
				metaTags.push(`<meta name="robots" content="index, follow" />`);
				metaTags.push(
					`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
				);
				metaTags.push(
					`<meta http-equiv="X-UA-Compatible" content="IE=edge" />`
				);

				// Structured Data (JSON-LD)
				if (seo.structuredData?.enabled !== false) {
					const structuredData = generateStructuredData(seo);
					if (structuredData) {
						metaTags.push(
							`<script type="application/ld+json">${JSON.stringify(
								structuredData,
								null,
								2
							)}</script>`
						);
					}
				}

				// Insert meta tags into HTML head
				const headCloseIndex = html.indexOf("</head>");
				if (headCloseIndex !== -1) {
					const injectedMeta = metaTags.map((tag) => `\t\t${tag}`).join("\n");
					return (
						html.slice(0, headCloseIndex) +
						`\n\t\t<!-- SEO Meta Tags (Generated from settings.json) -->\n${injectedMeta}\n\t` +
						html.slice(headCloseIndex)
					);
				}

				return html;
			} catch (error) {
				console.error("Error injecting SEO meta tags:", error);
				return html;
			}
		},
	};
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generate structured data (JSON-LD) from SEO settings
 */
function generateStructuredData(seo) {
	if (!seo.structuredData || seo.structuredData.enabled === false) {
		return null;
	}

	const sd = seo.structuredData;

	const structuredData = {
		"@context": "https://schema.org",
		"@type": sd.type || "Person",
	};

	if (seo.author) {
		structuredData.name = seo.author;
	}

	if (sd.jobTitle) {
		structuredData.jobTitle = sd.jobTitle;
	}

	if (sd.worksFor) {
		if (sd.worksFor === "Independent") {
			structuredData.worksFor = {
				"@type": "Organization",
				name: "Independent",
			};
		} else {
			structuredData.worksFor = {
				"@type": "Organization",
				name: sd.worksFor,
			};
		}
	}

	if (seo.canonical) {
		structuredData.url = seo.canonical;
	}

	if (seo.openGraph?.image) {
		structuredData.image = seo.openGraph.image;
	}

	if (sd.sameAs && Array.isArray(sd.sameAs)) {
		structuredData.sameAs = sd.sameAs;
	}

	if (sd.knowsAbout && Array.isArray(sd.knowsAbout)) {
		structuredData.knowsAbout = sd.knowsAbout;
	}

	if (seo.description) {
		structuredData.description = seo.description;
	}

	return structuredData;
}
