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

import { readFileSync, writeFileSync } from "fs"
import { parse } from "jsonc-parser"

/**
 * Generate PWA manifest.json from settings.json
 */
try {
	console.log("Reading settings.json for manifest generation...")
	const content = readFileSync("public/settings.json", "utf-8")
	const settings = parse(content)

	if (settings.seo) {
		const seo = settings.seo
		const name = settings.home?.name || "Portfolio"
		const favicon = settings.favicon || {}
		let manifestIconSrc = "/logo.jpg"
		let manifestIcon192 = "/android-chrome-192x192.png"
		let manifestIcon512 = "/android-chrome-512x512.png"
		let shortcutIcon96 = "/favicon-96x96.png"

		if (favicon.type === "custom" && favicon.customUrl) {
			manifestIconSrc = favicon.customUrl
		} else if (
			(favicon.type === "image" || favicon.type === "url") &&
			(favicon.url || favicon.path)
		) {
			manifestIconSrc = favicon.url || favicon.path
		} else if (favicon.type === "github") {
			const githubUsername =
				favicon.githubUsername ||
				settings.github?.username ||
				settings.projects?.devUsername
			if (githubUsername) {
				manifestIconSrc = `https://github.com/${githubUsername}.png`
			}
		} else if (seo.openGraph?.image) {
			manifestIconSrc = seo.openGraph.image
		}

		if (manifestIconSrc.startsWith("http")) {
			manifestIcon192 = manifestIconSrc
			manifestIcon512 = manifestIconSrc
			shortcutIcon96 = manifestIconSrc
		}

		const iconType =
			manifestIconSrc.endsWith(".jpg") || manifestIconSrc.endsWith(".jpeg")
				? "image/jpeg"
				: "image/png"

		const manifest = {
			name: `${name} - Portfolio`,
			short_name: `${name} Portfolio`,
			description: seo.description || "Personal portfolio website",
			start_url: "/",
			display: "standalone",
			background_color: "#0a0a0a",
			theme_color: "#3b82f6",
			orientation: "portrait-primary",
			icons: [
				{
					src: manifestIcon512,
					sizes: "512x512",
					type: iconType,
					purpose: "any maskable",
				},
				{
					src: manifestIcon192,
					sizes: "192x192",
					type: iconType,
					purpose: "any",
				},
			],
			categories: ["portfolio", "personal", "developer"],
			lang: "en",
			dir: "ltr",
			scope: "/",
			id: `${name.toLowerCase().replace(/\s+/g, "-")}-portfolio`,
			shortcuts: [
				{
					name: "About",
					short_name: "About",
					description: `Learn more about ${name}`,
					url: "/about",
					icons: [
						{
							src: shortcutIcon96,
							sizes: "96x96",
						},
					],
				},
				{
					name: "Projects",
					short_name: "Projects",
					description: "View portfolio projects",
					url: "/projects",
					icons: [
						{
							src: shortcutIcon96,
							sizes: "96x96",
						},
					],
				},
			],
		}

		console.log(`Generating manifest.json for: ${manifest.name}`)
		writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2))
		console.log("Manifest.json generated successfully")
	} else {
		console.log("No SEO configuration found, using default manifest")
	}
} catch (error) {
	console.error("Error generating manifest:", error.message)
}
