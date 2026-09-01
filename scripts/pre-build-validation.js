/**
 * Self-Validating Build System
 * Validates the entire build chain including package.json build script
 * Prevents bypass attempts by validating itself and the build process
 */

import fs from "fs";
import process from "process";


// Expected build script configurations
const EXPECTED_BUILD_CONFIG = {
	// Steps build-core must still run. Pinning the whole script to one exact
	// string meant any fork that added a build step failed validation, which is
	// not what this check is for: it exists so validation and bundling cannot be
	// dropped from the chain, not so the script can never change.
	requiredBuildSteps: ["scripts/pre-build-validation.js", "vite build"],

	// The one step the top-level `build` script must keep. verify-attribution
	// reads dist/ after the prerenderer has run, which is the only place the
	// credit can be checked as shipped rather than as written.
	requiredTopLevelSteps: ["scripts/verify-attribution.js"],

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
		"src/utils/attribution.js",
		"NOTICE",
	],
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

		const missingStep = EXPECTED_BUILD_CONFIG.requiredBuildSteps.find(
			(step) => !currentBuildCoreScript.includes(step)
		);
		if (missingStep) {
			console.error("❌ Build script no longer runs a required step!");
			console.error(`   Missing:  ${missingStep}`);
			console.error(`   Actual:   ${currentBuildCoreScript}`);
			return false;
		}

		const buildScript = packageJson.scripts?.build || "";
		const missingTopLevel = EXPECTED_BUILD_CONFIG.requiredTopLevelSteps.find(
			(step) => !buildScript.includes(step)
		);
		if (missingTopLevel) {
			console.error("❌ Build script no longer verifies attribution!");
			console.error(`   Missing:  ${missingTopLevel}`);
			console.error(`   Actual:   ${buildScript}`);
			return false;
		}

		console.log("✅ Package.json build scripts validated");
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
			"requiredBuildSteps",
			"requiredTopLevelSteps",
			"EXPECTED_BUILD_CONFIG",
			"runComprehensiveValidation",
			"validateAttributionIntegrity",
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
 * Validates that the project attribution is intact and rendered.
 * The credit is NOTICE-backed (Apache License §4(d)): redistribution must
 * retain it, and this check makes stripping it break the build.
 * @returns {boolean} True if attribution is intact
 */
function validateAttributionIntegrity() {
	try {
		console.log("🔍 Validating attribution integrity...");

		// 1. The attribution module must exist and carry the canonical credit
		const attributionPath = "src/utils/attribution.js";
		const attribution = fs.readFileSync(attributionPath, "utf8");
		const requiredAttributionMarkers = [
			"Krishna GSVV",
			"https://github.com/VKrishna04",
			"Object.freeze",
			"ATTRIBUTION",
		];
		for (const marker of requiredAttributionMarkers) {
			if (!attribution.includes(marker)) {
				console.error(
					`❌ Attribution module missing required content: '${marker}'`
				);
				console.error(
					"   src/utils/attribution.js must retain the original project credit."
				);
				return false;
			}
		}

		// 2. The Footer must import and render the attribution
		const footerPath = "src/components/Footer.jsx";
		const footer = fs.readFileSync(footerPath, "utf8");
		if (
			!footer.includes("utils/attribution") ||
			!footer.includes("ATTRIBUTION.author")
		) {
			console.error("❌ Footer no longer renders the project attribution");
			console.error(
				"   src/components/Footer.jsx must import ATTRIBUTION and render ATTRIBUTION.author."
			);
			return false;
		}

		// 3. The NOTICE file (Apache §4(d)) must retain the credit
		const notice = fs.readFileSync("NOTICE", "utf8");
		if (!notice.includes("Krishna GSVV")) {
			console.error("❌ NOTICE file no longer credits the original author");
			return false;
		}

		// 4. The generators that spread the credit across the built site must still
		// do so. Each writes a different surface - meta tags and JSON-LD, robots.txt,
		// humans.txt, NOTICE.txt, the JSON endpoints - and verify-attribution.js
		// checks the output of all of them once the build has run. Spreading it is
		// the point: no single edit takes the credit off the site quietly.
		const generators = {
			"scripts/inject-seo.js": ["ATTRIBUTION.generator", "ATTRIBUTION.author"],
			"scripts/generate-ai-data.js": [
				"_attribution: CREDIT",
				"humans.txt",
				"NOTICE.txt",
			],
			"scripts/generate-sitemap.js": ["ATTRIBUTION.credit"],
			"scripts/verify-attribution.js": ["humans.txt", "_attribution", "NOTICE"],
		};
		for (const [file, markers] of Object.entries(generators)) {
			const source = fs.readFileSync(file, "utf8");
			for (const marker of markers) {
				if (!source.includes(marker)) {
					console.error(
						`❌ ${file} no longer emits the project attribution ('${marker}')`
					);
					return false;
				}
			}
		}

		console.log("✅ Attribution integrity validated");
		return true;
	} catch (error) {
		console.error("❌ Attribution validation failed:", error.message);
		return false;
	}
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

		// Step 1.5: Validate the project attribution is intact
		if (!validateAttributionIntegrity()) {
			console.error("\n❌ Attribution validation failed!");
			console.error(
				"   The original author credit (NOTICE / src/utils/attribution.js) must be retained."
			);
			throw new Error("Attribution integrity check failed");
		}

		// Step 2: Generate/update hashes
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
	validateAttributionIntegrity,
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
