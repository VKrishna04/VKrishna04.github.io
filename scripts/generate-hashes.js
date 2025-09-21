/**
 * Hash Generator for Protection System
 * Pre-computes integrity hashes for all protection files
 * Run during build to generate validation checksums
 * @fileoverview Node.js script for generating protection system hashes
 */

/* eslint-env node */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTECTION_FILES = [
	"src/utils/integrity-guard.js",
	"src/utils/stealth-validator.js",
	"src/utils/origin-tracker.js",
	"src/utils/advanced-obfuscation.js",
	"src/utils/build-time-protection.js",
];

/**
 * Generates SHA-256 hash for file content
 * @param {string} content - File content to hash
 * @returns {string} SHA-256 hash
 */
function generateHash(content) {
	return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

/**
 * Generates simple hash (for client-side validation)
 * @param {string} content - Content to hash
 * @returns {string} Simple hash
 */
function generateSimpleHash(content) {
	let hash = 0;
	for (let i = 0; i < content.length; i++) {
		const char = content.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash).toString(16);
}

/**
 * Computes hashes for all protection files
 * @returns {object} Object containing file paths and their hashes
 */
function computeProtectionHashes() {
	const hashes = {
		timestamp: new Date().toISOString(),
		files: {},
	};

	PROTECTION_FILES.forEach((filePath) => {
		try {
			const fullPath = path.resolve(filePath);
			const content = fs.readFileSync(fullPath, "utf8");

			hashes.files[filePath] = {
				sha256: generateHash(content),
				simple: generateSimpleHash(content),
				size: content.length,
				lastModified: fs.statSync(fullPath).mtime.toISOString(),
			};

			console.log(`✓ Generated hash for ${filePath}`);
		} catch (error) {
			console.error(`✗ Failed to hash ${filePath}:`, error.message);
		}
	});

	return hashes;
}

/**
 * Updates the integrity-guard.js file with computed hashes
 * @param {object} hashes - Computed hash data
 */
function updateIntegrityGuard(hashes) {
	const integrityGuardPath = "src/utils/integrity-guard.js";

	try {
		let content = fs.readFileSync(integrityGuardPath, "utf8");

		// Create hash object for injection
		const hashObject = {};
		Object.keys(hashes.files).forEach((filePath) => {
			hashObject[filePath] = hashes.files[filePath].simple;
		});

		// Replace the null values in PROTECTION_HASHES
		const hashString = JSON.stringify(hashObject, null, 2)
			.replace(/"/g, "'")
			.replace(/^/gm, "  ");

		content = content.replace(
			/const PROTECTION_HASHES = \{[\s\S]*?\};/,
			`const PROTECTION_HASHES = ${hashString};`
		);

		fs.writeFileSync(integrityGuardPath, content, "utf8");
		console.log("✓ Updated integrity-guard.js with computed hashes");
	} catch (error) {
		console.error("✗ Failed to update integrity-guard.js:", error.message);
	}
}

/**
 * Saves hash data to a separate file for reference
 * @param {object} hashes - Computed hash data
 */
function saveHashManifest(hashes) {
	const manifestPath = "scripts/protection-hashes.json";

	try {
		fs.writeFileSync(manifestPath, JSON.stringify(hashes, null, 2), "utf8");
		console.log(`✓ Saved hash manifest to ${manifestPath}`);
	} catch (error) {
		console.error("✗ Failed to save hash manifest:", error.message);
	}
}

/**
 * Main function to generate and apply protection hashes
 */
function main() {
	console.log("🔒 Generating protection system hashes...\n");

	const hashes = computeProtectionHashes();

	if (Object.keys(hashes.files).length === 0) {
		console.error("❌ No protection files found or processed");
		throw new Error("No protection files processed");
	}

	console.log("\n📊 Hash Summary:");
	Object.keys(hashes.files).forEach((filePath) => {
		const fileData = hashes.files[filePath];
		console.log(`   ${filePath}: ${fileData.simple} (${fileData.size} bytes)`);
	});

	updateIntegrityGuard(hashes);
	saveHashManifest(hashes);

	console.log("\n✅ Protection system hash generation completed!");
}

// Run if called directly
if (import.meta.url === fileURLToPath(import.meta.url)) {
	main();
}

export {
	computeProtectionHashes,
	updateIntegrityGuard,
	saveHashManifest,
	generateHash,
	generateSimpleHash,
	main,
};
