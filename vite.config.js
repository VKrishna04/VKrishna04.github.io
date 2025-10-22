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

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), injectSeoPlugin()],
	// base: "/Vkrishna04.me/",
	server: {
		watch: {
			// Watch settings files explicitly for changes
			ignored: ["!**/public/settings.json", "!**/public/settings.schema.json"],
		},
		// Force reload when these files change
		hmr: {
			overlay: true,
		},
	},
	build: {
		outDir: "dist",
		rollupOptions: {
			output: {
				manualChunks: {
					// React core
					"react-vendor": ["react", "react-dom"],
					// Router
					router: ["react-router-dom"],
					// UI libraries
					"ui-vendor": ["framer-motion", "@heroicons/react"],
					// Icons
					icons: ["react-icons/fa", "react-icons/si"],
					// Particles
					particles: [
						"@tsparticles/react",
						"@tsparticles/engine",
						"@tsparticles/slim",
					],
					// Utilities
					utils: ["typewriter-effect", "clsx", "tailwind-merge"],
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
});
