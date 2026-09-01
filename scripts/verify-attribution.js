#!/usr/bin/env node
/**
 * verify-attribution.js
 * Confirms the project credit survived the bundler and the prerenderer.
 * Run: node scripts/verify-attribution.js (last step of `npm run build`)
 *
 * pre-build-validation.js already refuses to build when src/utils/attribution.js
 * has been blanked, but a source check cannot see what actually shipped: a
 * tree-shake, a Footer edit or a stray prerender change could drop the credit
 * from dist/ while every source file still looks correct. This reads the built
 * output instead, so the only way to publish without the credit is to publish
 * without building.
 *
 * The credit is required by NOTICE under Apache License section 4(d). It is
 * deliberately the only identity in this project that a fork may not change —
 * everything about the *site owner* comes from settings.json and should change.
 */

/* global process */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { ATTRIBUTION } from "../src/utils/attribution.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, "..", "dist")

const htmlFiles = []
const jsFiles = []

const walk = (dir) => {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory()) walk(full)
		else if (entry.name.endsWith(".html")) htmlFiles.push(full)
		else if (entry.name.endsWith(".js")) jsFiles.push(full)
	}
}

if (!fs.existsSync(DIST)) {
	console.error("❌ dist/ not found - run this after the build, not before")
	process.exit(1)
}
walk(DIST)

const { author, github } = ATTRIBUTION
const failures = []

// The footer renders the author name inside a link, so the two facts land in
// the markup separately. Both have to be there for the credit to read as one.
const missingHtml = htmlFiles.filter(
	(f) => {
		const html = fs.readFileSync(f, "utf8")
		return !html.includes(author) || !html.includes(github)
	}
)
if (missingHtml.length) {
	failures.push(
		`credit missing from ${missingHtml.length} of ${htmlFiles.length} prerendered pages:\n` +
			missingHtml
				.slice(0, 5)
				.map((f) => `     ${path.relative(DIST, f)}`)
				.join("\n")
	)
}

// And in the bundle, so pages rendered client-side carry it too.
const inBundle = jsFiles.some((f) => fs.readFileSync(f, "utf8").includes(author))
if (!inBundle) {
	failures.push(`credit missing from every JavaScript chunk in dist/`)
}

if (failures.length) {
	console.error("❌ Attribution missing from the built site")
	failures.forEach((f) => console.error(`   ${f}`))
	console.error(
		`\n   The credit "${ATTRIBUTION.credit}" is required by NOTICE under`
	)
	console.error("   Apache License section 4(d). Restore it and rebuild.")
	process.exit(1)
}

console.log(
	`✓ Attribution present in ${htmlFiles.length} pages and the JS bundle`
)
