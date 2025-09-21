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

import { readFileSync, writeFileSync } from "fs";
import { parse } from "jsonc-parser";

/**
 * Generate PWA manifest.json from settings.json
 */
try {
	console.log("Reading settings.json for manifest generation...");
	const content = readFileSync("public/settings.json", "utf-8");
	const settings = parse(content);

	if (settings.seo) {
		const seo = settings.seo;
		const name = settings.home?.name || "Portfolio";

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
					src: seo.openGraph?.image || "https://github.com/VKrishna04.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "any maskable",
				},
				{
					src: seo.openGraph?.image || "https://github.com/VKrishna04.png",
					sizes: "192x192",
					type: "image/png",
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
							src: seo.openGraph?.image || "https://github.com/VKrishna04.png",
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
							src: seo.openGraph?.image || "https://github.com/VKrishna04.png",
							sizes: "96x96",
						},
					],
				},
			],
		};

		console.log(`Generating manifest.json for: ${manifest.name}`);
		writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));
		console.log("Manifest.json generated successfully");
	} else {
		console.log("No SEO configuration found, using default manifest");
	}
} catch (error) {
	console.error("Error generating manifest:", error.message);
}
