/**
 * Build-Time Protection Validator
 * Runs during npm run build to verify all files against GitHub repository
 * Ensures no local tampering before deployment
 */

import fs from "fs";
import crypto from "crypto";

// Build validation configuration
const BUILD_VALIDATION_CONFIG = {
	github: {
		owner: "VKrishna04",
		repo: "VKrishna04.github.io",
		branch: "main",
		rawBase: "https://raw.githubusercontent.com",
	},

	// Files that must match GitHub exactly before build
	criticalFiles: [
		"src/utils/integrity-guard.js",
		"src/utils/protection-system.js",
		"src/utils/stealth-validator.js",
		"src/utils/origin-tracker.js",
		"src/utils/advanced-obfuscation.js",
		"scripts/generate-hashes.js",
		"scripts/validate-json.js",
		"package.json",
		"vite.config.js",
	],

	// Patterns that must exist in critical files
	requiredPatterns: {
		"scripts/generate-hashes.js": [
			"PROTECTION_FILES",
			"generateSimpleHash",
			"updateIntegrityGuard",
		],
		"src/utils/integrity-guard.js": [
			"ENCODED_REFS",
			"PROTECTION_HASHES",
			"VktBcmlzaG5hMDQ=",
		],
	},
};

/**
 * Fetches file content from GitHub repository
 * @param {string} filePath - Path to file
 * @returns {Promise<string|null>} File content or null
 */
async function fetchFromGitHub(filePath) {
	try {
		const url = `${BUILD_VALIDATION_CONFIG.github.rawBase}/${BUILD_VALIDATION_CONFIG.github.owner}/${BUILD_VALIDATION_CONFIG.github.repo}/${BUILD_VALIDATION_CONFIG.github.branch}/${filePath}`;

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`GitHub fetch failed: ${response.status}`);
		}

		return await response.text();
	} catch (error) {
		console.error(`❌ Failed to fetch ${filePath} from GitHub:`, error.message);
		return null;
	}
}

/**
 * Normalizes content for comparison
 * @param {string} content - File content
 * @returns {string} Normalized content
 */
function normalizeContent(content) {
	return content.replace(/\r\n/g, "\n").replace(/\s+$/gm, "").trim();
}

/**
 * Generates content hash for comparison
 * @param {string} content - File content
 * @returns {string} Content hash
 */
function generateContentHash(content) {
	return crypto
		.createHash("sha256")
		.update(normalizeContent(content))
		.digest("hex")
		.substring(0, 16);
}

/**
 * Validates a single file against GitHub
 * @param {string} filePath - Path to file to validate
 * @returns {Promise<object>} Validation result
 */
async function validateFileAgainstGitHub(filePath) {
	try {
		// Check if local file exists
		if (!fs.existsSync(filePath)) {
			return {
				valid: false,
				error: "Local file missing",
				filePath,
			};
		}

		// Fetch both versions
		const [githubContent, localContent] = await Promise.all([
			fetchFromGitHub(filePath),
			fs.promises.readFile(filePath, "utf8"),
		]);

		if (!githubContent) {
			return {
				valid: false,
				error: "Could not fetch from GitHub",
				filePath,
			};
		}

		// Compare normalized content
		const githubHash = generateContentHash(githubContent);
		const localHash = generateContentHash(localContent);

		const isIdentical = githubHash === localHash;

		// Check required patterns if specified
		let patternsValid = true;
		const requiredPatterns = BUILD_VALIDATION_CONFIG.requiredPatterns[filePath];
		if (requiredPatterns) {
			const missingPatterns = requiredPatterns.filter(
				(pattern) => !localContent.includes(pattern)
			);
			patternsValid = missingPatterns.length === 0;

			if (!patternsValid) {
				return {
					valid: false,
					error: `Missing required patterns: ${missingPatterns.join(", ")}`,
					filePath,
				};
			}
		}

		return {
			valid: isIdentical && patternsValid,
			error: isIdentical ? null : "Content differs from GitHub",
			filePath,
			githubHash,
			localHash,
		};
	} catch (error) {
		return {
			valid: false,
			error: error.message,
			filePath,
		};
	}
}

/**
 * Validates all critical files against GitHub repository
 * @returns {Promise<boolean>} True if all files are valid
 */
async function validateAllFilesAgainstGitHub() {
	console.log("🔍 Validating files against GitHub repository...");

	const validationPromises = BUILD_VALIDATION_CONFIG.criticalFiles.map(
		(filePath) => validateFileAgainstGitHub(filePath)
	);

	const results = await Promise.allSettled(validationPromises);
	const validationResults = results
		.filter((r) => r.status === "fulfilled")
		.map((r) => r.value);

	let allValid = true;
	const errors = [];

	for (const result of validationResults) {
		if (result.valid) {
			console.log(`✅ ${result.filePath} - Valid`);
		} else {
			console.log(`❌ ${result.filePath} - ${result.error}`);
			allValid = false;
			errors.push(`${result.filePath}: ${result.error}`);
		}
	}

	if (!allValid) {
		console.log(
			"\n❌ Build validation failed! Files differ from GitHub repository:"
		);
		errors.forEach((error) => console.log(`   ${error}`));
		console.log(
			"\n📝 Please commit your changes or revert to match the repository."
		);
		return false;
	}

	console.log(
		"\n✅ All files validated successfully against GitHub repository!"
	);
	return true;
}

/**
 * Validates protection system integrity before build
 * @returns {Promise<boolean>} True if protection system is intact
 */
async function validateProtectionSystemIntegrity() {
	try {
		console.log("🛡️ Validating protection system integrity...");

		// Check if all protection files exist
		const protectionFiles = BUILD_VALIDATION_CONFIG.criticalFiles.filter((f) =>
			f.startsWith("src/utils/")
		);

		for (const filePath of protectionFiles) {
			if (!fs.existsSync(filePath)) {
				console.log(`❌ Protection file missing: ${filePath}`);
				return false;
			}
		}

		// Validate hash generation script
		const hashScript = "scripts/generate-hashes.js";
		if (!fs.existsSync(hashScript)) {
			console.log("❌ Hash generation script missing");
			return false;
		}

		const hashScriptContent = fs.readFileSync(hashScript, "utf8");
		const requiredFunctions = [
			"generateHash",
			"generateSimpleHash",
			"computeProtectionHashes",
			"updateIntegrityGuard",
		];

		for (const func of requiredFunctions) {
			if (!hashScriptContent.includes(func)) {
				console.log(`❌ Hash script missing required function: ${func}`);
				return false;
			}
		}

		console.log("✅ Protection system integrity validated");
		return true;
	} catch (error) {
		console.log("❌ Protection system validation failed:", error.message);
		return false;
	}
}

/**
 * Main build validation function
 * @returns {Promise<boolean>} True if build should proceed
 */
async function validateBuildIntegrity() {
	console.log("🔒 Starting build-time protection validation...\n");

	const validations = [
		validateProtectionSystemIntegrity(),
		validateAllFilesAgainstGitHub(),
	];

	const results = await Promise.all(validations);
	const allPassed = results.every(Boolean);

	if (allPassed) {
		console.log("\n🎉 Build validation passed! Proceeding with build...");
		return true;
	} else {
		console.log("\n🚫 Build validation failed! Build cannot proceed.");
		console.log("   Please ensure all files match the GitHub repository.");
		return false;
	}
}

// Export for use in build scripts
export {
	validateBuildIntegrity,
	validateAllFilesAgainstGitHub,
	validateProtectionSystemIntegrity,
};
