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


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { injectSeoPlugin } from "./scripts/inject-seo.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🧩 Fix __dirname for ESM (Vite uses ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [
		react(),
		injectSeoPlugin(),
		{
			name: "watch-public-settings",
			configureServer(server) {
				const filesToWatch = [
					path.resolve(__dirname, "public/settings.json"),
					path.resolve(__dirname, "public/settings.schema.json"),
				];

				for (const filePath of filesToWatch) {
					if (fs.existsSync(filePath)) {
						fs.watchFile(filePath, { interval: 500 }, () => {
							console.log(
								`\x1b[33m[watch-public-settings]\x1b[0m ${path.basename(
									filePath
								)} changed — triggering full reload...`
							);
							server.ws.send({ type: "full-reload" });
						});
					} else {
						console.warn(
							`\x1b[33m[watch-public-settings]\x1b[0m ${path.basename(
								filePath
							)} not found — skipping watch`
						);
					}
				}
			},
		},
	],
	server: {
		hmr: { overlay: true },
	},
	build: {
		outDir: "dist",
		rollupOptions: {
			output: {
				manualChunks: {
					"react-vendor": ["react", "react-dom"],
					router: ["react-router-dom"],
					"ui-vendor": ["framer-motion", "@heroicons/react"],
					icons: ["react-icons/fa", "react-icons/si"],
					particles: [
						"@tsparticles/react",
						"@tsparticles/engine",
						"@tsparticles/slim",
					],
					utils: ["typewriter-effect", "clsx", "tailwind-merge"],
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
});
