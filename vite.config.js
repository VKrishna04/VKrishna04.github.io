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

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { injectSeoPlugin } from "./scripts/inject-seo.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { spawn } from "child_process"

// 🧩 Fix __dirname for ESM (Vite uses ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
	plugins: [
		react(),
		injectSeoPlugin(),
		{
			name: "watch-public/settings",
			configureServer(server) {
				const filesToWatch = [
					path.resolve(__dirname, "public/settings.json"),
					path.resolve(__dirname, "public/settings.schema.json"),
				]

				for (const filePath of filesToWatch) {
					if (fs.existsSync(filePath)) {
						server.watcher.add(filePath)
					} else {
						console.warn(
							`\x1b[33m[watch public/settings]\x1b[0m ${path.basename(
								filePath
							)} not found — skipping watch`
						)
					}
				}

				server.watcher.on("change", (changedPath) => {
					if (filesToWatch.includes(changedPath)) {
						console.log(
							`\x1b[33m[watch public/settings]\x1b[0m ${path.basename(
								changedPath
							)} changed — triggering full reload...`
						)
						// settings.json is a source of icon names — keep the
						// generated icon map in sync during dev
						if (changedPath.endsWith("settings.json")) {
							spawn("node", ["scripts/generate-icon-map.js"], {
								cwd: __dirname,
								stdio: "inherit",
							})
						}
						server.ws.send({ type: "full-reload" })
					}
				})
			},
		},
	],
	server: {
		hmr: { overlay: true },
	},
	build: {
		outDir: "dist",
		target: "es2020",
		rollupOptions: {
			output: {
				// Function form: the object form silently produced an empty
				// react-vendor chunk (React stayed in the entry) because the
				// entry itself depended on it synchronously.
				manualChunks(id) {
					if (!id.includes("node_modules")) return
					if (id.includes("react-router")) return "router"
					if (id.includes("framer-motion")) return "motion"
					if (id.includes("react-icons") || id.includes("@heroicons")) {
						return "icons"
					}
					if (
						id.includes("/react/") ||
						id.includes("/react-dom/") ||
						id.includes("/scheduler/")
					) {
						return "react-vendor"
					}
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
})
