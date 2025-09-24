/**
 * Self-Validating Build System
 * Validates the entire build chain including package.json build script
 * Prevents bypass attempts by validating itself and the build process
 */

import fs from "fs";
import process from "process";

/* eslint-env node */

// Expected build script configurations
const EXPECTED_BUILD_CONFIG = {
	// Expected package.json build-core script (to avoid circular dependency)
	expectedBuildScript:
		"node scripts/pre-build-validation.js && vite build && node scripts/generate-manifest.js",

	// Files that must exist and be valid
	requiredFiles: [
		"package.json",
		"scripts/pre-build-validation.js",
		"scripts/build-time-validator.js",
		"scripts/generate-hashes.js",
		"src/utils/build-time-protection.js",
		"src/utils/integrity-guard.js",
		"src/utils/origin-tracker.js",
		"src/utils/advanced-obfuscation.js",
	],

	// GitHub repository details
	github: {
		owner: "VKrishna04",
		repo: "VKrishna04.github.io",
		branch: "main",
		rawBase: "https://raw.githubusercontent.com",
	},
};

/**
 * Validates the package.json build script
 * @returns {boolean} True if build script is correct
 */
function validatePackageJsonBuildScript() {
	try {
		const packageJsonPath = "package.json";
		if (!fs.existsSync(packageJsonPath)) {
			console.error("❌ package.json not found");
			return false;
		}

		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
		const currentBuildCoreScript = packageJson.scripts?.["build-core"];

		if (!currentBuildCoreScript) {
			console.error("❌ No build-core script found in package.json");
			return false;
		}

		if (currentBuildCoreScript !== EXPECTED_BUILD_CONFIG.expectedBuildScript) {
			console.error("❌ Build script has been tampered with!");
			console.error(
				`   Expected: ${EXPECTED_BUILD_CONFIG.expectedBuildScript}`
			);
			console.error(`   Actual:   ${currentBuildCoreScript}`);
			return false;
		}

		console.log("✅ Package.json build-core script validated");
		return true;
	} catch (error) {
		console.error("❌ Failed to validate package.json:", error.message);
		return false;
	}
}

/**
 * Validates that this script itself hasn't been tampered with
 * @returns {Promise<boolean>} True if script is authentic
 */
async function validateSelfIntegrity() {
	try {
		// Get current script content
		const currentScript = fs.readFileSync(
			"scripts/pre-build-validation.js",
			"utf8"
		);

		// Check for required patterns that must exist in this script
		const requiredPatterns = [
			"validatePackageJsonBuildScript",
			"validateSelfIntegrity",
			"validateBuildChainIntegrity",
			"expectedBuildScript",
			"EXPECTED_BUILD_CONFIG",
			"runComprehensiveValidation",
		];

		for (const pattern of requiredPatterns) {
			if (!currentScript.includes(pattern)) {
				console.error(
					`❌ Self-validation failed: Missing required pattern '${pattern}'`
				);
				return false;
			}
		}

		// Check script hasn't been obviously bypassed
		const scriptLength = currentScript.length;
		if (scriptLength < 5000) {
			// Script should be substantial
			console.error(
				"❌ Self-validation failed: Script appears to be truncated"
			);
			return false;
		}

		// Check script hasn't been obviously bypassed by looking for suspicious modifications
		const suspiciousContent = [
			"true; //" + "/ bypass", // Split to avoid self-detection
			"exit(0); //" + "/ skip",
			"/* ret" + "urn true */",
			"Error(); //" + "/ skip validation",
		];

		for (const pattern of suspiciousContent) {
			if (currentScript.includes(pattern.replace(" //", "//"))) {
				console.error(`❌ Self-validation failed: Bypass pattern detected`);
				return false;
			}
		}

		console.log("✅ Self-integrity validated");
		return true;
	} catch (error) {
		console.error("❌ Self-validation failed:", error.message);
		return false;
	}
}

/**
 * Validates the entire build chain integrity
 * @returns {Promise<boolean>} True if build chain is intact
 */
async function validateBuildChainIntegrity() {
	try {
		console.log("🔍 Validating build chain integrity...");

		// 1. Validate package.json build script
		if (!validatePackageJsonBuildScript()) {
			return false;
		}

		// 2. Validate self-integrity
		if (!(await validateSelfIntegrity())) {
			return false;
		}

		// 3. Check all required files exist
		for (const filePath of EXPECTED_BUILD_CONFIG.requiredFiles) {
			if (!fs.existsSync(filePath)) {
				console.error(`❌ Required file missing: ${filePath}`);
				return false;
			}
		}

		// 4. Validate build-time validator exists and has required functions
		const validatorPath = "scripts/build-time-validator.js";
		if (fs.existsSync(validatorPath)) {
			const validatorContent = fs.readFileSync(validatorPath, "utf8");
			const requiredFunctions = [
				"validateBuildIntegrity",
				"validateAllFilesAgainstGitHub",
				"validateProtectionSystemIntegrity",
			];

			for (const func of requiredFunctions) {
				if (!validatorContent.includes(func)) {
					console.error(
						`❌ Build validator missing required function: ${func}`
					);
					return false;
				}
			}
		}

		console.log("✅ Build chain integrity validated");
		return true;
	} catch (error) {
		console.error("❌ Build chain validation failed:", error.message);
		return false;
	}
}

/**
 * Fetches file content from GitHub repository
 * @param {string} filePath - Path to file
 * @returns {Promise<string|null>} File content or null
 */
async function fetchFromGitHub(filePath) {
	try {
		const url = `${EXPECTED_BUILD_CONFIG.github.rawBase}/${EXPECTED_BUILD_CONFIG.github.owner}/${EXPECTED_BUILD_CONFIG.github.repo}/${EXPECTED_BUILD_CONFIG.github.branch}/${filePath}`;

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`GitHub fetch failed: ${response.status}`);
		}

		return await response.text();
	} catch (error) {
		console.info(`Could not fetch ${filePath} from GitHub:`, error.message);
		return null;
	}
}

/**
 * Validates critical files against GitHub repository
 * @returns {Promise<boolean>} True if files match repository
 */
async function validateCriticalFilesAgainstGitHub() {
	console.log("🔍 Validating critical files against GitHub...");

	const criticalFiles = [
		"package.json",
		"scripts/generate-hashes.js",
		"src/utils/integrity-guard.js",
	];

	let validationResults = {
		validated: 0,
		failed: 0,
		missing: 0,
	};

	// Comprehensive CI/hosting platform detection (matches settings-guard.js)
	const isCI =
		process.env.CI === "true" || // Generic CI indicator
		process.env.GITHUB_ACTIONS === "true" || // GitHub Actions
		process.env.VERCEL === "1" || // Vercel
		process.env.NETLIFY === "true" || // Netlify
		process.env.CF_PAGES === "1" || // Cloudflare Pages
		process.env.RENDER === "true" || // Render
		process.env.RAILWAY_ENVIRONMENT_NAME || // Railway
		process.env.HEROKU_APP_NAME || // Heroku
		process.env.NOW_REGION || // Vercel (legacy)
		process.env.DEPLOY_URL || // Netlify build
		process.env.CF_PAGES_URL || // Cloudflare Pages
		process.env.VERCEL_URL || // Vercel Deployment
		process.env.BUILD_ID || // Generic build system
		process.env.DRONE === "true" || // Drone CI
		process.env.TRAVIS === "true" || // Travis CI
		process.env.CIRCLECI === "true" || // CircleCI
		process.env.JENKINS_URL || // Jenkins
		process.env.GITLAB_CI === "true" || // GitLab CI
		process.env.BUILDKITE === "true" || // Buildkite
		process.env.AZURE_HTTP_USER_AGENT || // Azure DevOps
		process.env.GITHUB_WORKSPACE || // GitHub Actions (alt)
		process.env.BITBUCKET_BUILD_NUMBER; // Bitbucket Pipelines

	for (const filePath of criticalFiles) {
		try {
			const [githubContent, localContent] = await Promise.all([
				fetchFromGitHub(filePath),
				fs.promises.readFile(filePath, "utf8"),
			]);

			if (!githubContent) {
				if (isCI) {
					// In CI, all protection files MUST exist in repository
					console.error(
						`❌ ${filePath} not found in GitHub repository (CI mode)`
					);
					validationResults.failed++;
				} else {
					// In development, allow missing files
					console.warn(
						`⚠️ Could not validate ${filePath} against GitHub (file not in repository)`
					);
					validationResults.missing++;
				}
				continue;
			}

			// Normalize content for comparison
			const normalize = (content) => content.replace(/\r\n/g, "\n").trim();
			const githubNormalized = normalize(githubContent);
			const localNormalized = normalize(localContent);

			if (githubNormalized !== localNormalized) {
				// In development mode, be more lenient about file differences
				if (!isCI) {
					console.warn(
						`⚠️ ${filePath} differs from GitHub (may include development changes)`
					);
					validationResults.validated++; // Allow differences during development
				} else {
					console.error(`❌ ${filePath} differs from GitHub repository`);
					validationResults.failed++;
				}
			} else {
				console.log(`✅ ${filePath} matches GitHub`);
				validationResults.validated++;
			}
		} catch (error) {
			console.error(`❌ Failed to validate ${filePath}:`, error.message);
			validationResults.failed++;
		}
	}

	// Strict validation in CI, lenient in development
	if (isCI) {
		// In CI, no failures allowed
		if (validationResults.failed > 0) {
			console.error(
				`\n❌ CI Mode: ${validationResults.failed} validation failures detected`
			);
			return false;
		}
	} else {
		// In development, allow missing files or minor differences
		if (
			validationResults.failed === 0 ||
			validationResults.validated > validationResults.failed
		) {
			if (validationResults.missing > 0) {
				console.log(
					`ℹ️ Development mode: ${validationResults.missing} files not yet in repository`
				);
			}
			return true;
		}
	}

	return validationResults.failed === 0;
}

/**
 * Main validation function - validates everything before build
 */
async function runComprehensiveValidation() {
	console.log("🔒 Starting comprehensive build validation...\n");

	try {
		// Step 1: Validate build chain integrity (most important)
		const buildChainValid = await validateBuildChainIntegrity();
		if (!buildChainValid) {
			console.error("\n❌ Build chain validation failed!");
			console.error("   The build process has been tampered with.");
			throw new Error("Build chain integrity check failed");
		}

		// Step 2: Validate files against GitHub (if available)
		const githubValid = await validateCriticalFilesAgainstGitHub();
		if (!githubValid) {
			console.error("\n❌ GitHub validation failed!");
			console.error("   Files do not match the repository.");
			throw new Error("GitHub validation failed");
		}

		// Step 3: Generate/update hashes
		console.log("\n📋 Generating protection hashes...");

		// Import and run hash generation
		const { main: generateHashes } = await import("./generate-hashes.js");
		await generateHashes();

		console.log("\n✅ All validations passed successfully!");
		console.log("🚀 Build can proceed safely.\n");

		return true;
	} catch (error) {
		console.error("\n🚫 Validation failed:", error.message);
		console.error("   Build cannot proceed due to security concerns.");
		console.error("   Please restore files to their original state.\n");

		throw error; // Fail the build
	}
}

// Export for testing
export {
	validatePackageJsonBuildScript,
	validateSelfIntegrity,
	validateBuildChainIntegrity,
	validateCriticalFilesAgainstGitHub,
	runComprehensiveValidation,
};

// Auto-run when called directly
if (import.meta.url.includes("pre-build-validation.js")) {
	runComprehensiveValidation()
		.then(() => {
			console.log("Validation completed successfully");
		})
		.catch(() => {
			process.exit(1);
		});
}
