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

// Simple Dark Reader Disable
// This prevents Dark Reader extension from interfering with the site

if (typeof window !== "undefined") {
	// Set color scheme to dark
	document.documentElement.style.colorScheme = "dark";

	// Add meta tag to prevent extensions
	const meta = document.createElement("meta");
	meta.name = "color-scheme";
	meta.content = "dark";
	document.head.appendChild(meta);

	// Simple approach - no complex overrides that cause infinite loops
	console.log("Dark Reader interference prevention loaded");
}
