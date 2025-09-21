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
 * Generate CNAME file from settings.json custom domain
 */
try {
	console.log("Reading settings.json...");
	const content = readFileSync("public/settings.json", "utf-8");
	const settings = parse(content);

	if (settings.seo && settings.seo.customDomain) {
		const domain = settings.seo.customDomain;
		console.log(`Generating CNAME file for domain: ${domain}`);
		writeFileSync("dist/CNAME", domain);
		console.log("CNAME file created successfully");
	} else {
		console.log(
			"No custom domain found in settings.json, skipping CNAME generation"
		);
	}
} catch (error) {
	console.error("Error generating CNAME:", error.message);
}
