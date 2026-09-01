/**
 * Build Integrity Validator
 * Prevents bypass of validation system by checking build script integrity
 * Must be run before any build process to ensure validation hasn't been bypassed
 */

import fs from "fs";
import process from "process";


/**
 * Steps build-core must still run - this is the source of truth.
 * We check the build-core script to avoid circular dependency.
 *
 * These are substrings rather than one exact script because the point of the
 * check is that validation and bundling cannot be dropped from the chain, not
 * that the chain can never gain a step. Exact-matching broke every fork that
 * added one.
 */
const REQUIRED_BUILD_CORE_STEPS = [
	"node scripts/pre-build-validation.js",
	"vite build",
];

/**
 * Forbidden build scripts that bypass validation
 */
const FORBIDDEN_BUILD_SCRIPTS = [
	"vite build",
	"node scripts/generate-hashes.js && vite build && node scripts/generate-manifest.js",
	"vite build && node scripts/generate-manifest.js",
];

/**
 * Validates that the package.json build script hasn't been tampered with
 * @returns {boolean} True if build script is correct
 */
function validateBuildScriptIntegrity() {
	try {
		console.log("🔍 Checking build script integrity...");

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

		const missingStep = REQUIRED_BUILD_CORE_STEPS.find(
			(step) => !currentBuildCoreScript.includes(step)
		);
		if (missingStep) {
			console.error("🚫 BUILD CORE SCRIPT IS MISSING A REQUIRED STEP!");
			console.error(
				"   This indicates an attempt to bypass the validation system."
			);
			console.error("");
			console.error(`   Missing step: "${missingStep}"`);
			console.error(`   Current build-core script: "${currentBuildCoreScript}"`);
			console.error("");
			console.error(
				"🔒 Security Note: build-core must run pre-build validation"
			);
			console.error(
				"   so the bundle cannot be produced without an integrity check."
			);
			return false;
		}

		// Check for forbidden bypass scripts
		if (FORBIDDEN_BUILD_SCRIPTS.includes(currentBuildCoreScript)) {
			console.error("🚫 FORBIDDEN BUILD SCRIPT DETECTED!");
			console.error("   This build script bypasses the validation system.");
			console.error("");
			console.error("   Forbidden build script:");
			console.error(`   "${currentBuildCoreScript}"`);
			console.error("");
			console.error("   Required steps:");
			REQUIRED_BUILD_CORE_STEPS.forEach((step) => {
				console.error(`   - "${step}"`);
			});
			console.error("");
			return false;
		}

		// Check for unauthorized build scripts that bypass validation
		const allScripts = packageJson.scripts || {};
		const suspiciousScripts = Object.entries(allScripts).filter(
			([name, script]) => {
				return (
					name.includes("build") &&
					name !== "build" &&
					name !== "secure-build" &&
					!script.includes("pre-build-validation.js")
				);
			}
		);

		if (suspiciousScripts.length > 0) {
			console.error("🚫 UNAUTHORIZED BUILD SCRIPTS DETECTED!");
			console.error("   Found scripts that bypass validation:");
			console.error("");
			suspiciousScripts.forEach(([name, script]) => {
				console.error(`   ${name}: "${script}"`);
			});
			console.error("");
			console.error(
				"🔒 Security Note: All build scripts must include validation"
			);
			console.error(
				"   Remove these scripts or ensure they include pre-build-validation.js"
			);
			return false;
		}

		console.log("✅ Build script integrity verified");
		return true;
	} catch (error) {
		console.error("❌ Failed to validate build script:", error.message);
		return false;
	}
}

/**
 * Validates the entire build system integrity
 */
function validateCompleteIntegrity() {
	console.log("🔒 Validating build system integrity...\n");

	// Check build script hasn't been tampered with
	const buildScriptValid = validateBuildScriptIntegrity();

	if (!buildScriptValid) {
		console.error("\n❌ BUILD SYSTEM INTEGRITY CHECK FAILED!");
		console.error("   The build process has been compromised.");
		console.error(
			"   Please restore the original build script before proceeding.\n"
		);
		return false;
	}

	console.log("\n✅ Build system integrity verified");
	console.log("   The build script correctly includes validation steps.");
	console.log("   Safe to proceed with build process.\n");

	return true;
}

// Export for testing
export {
	validateBuildScriptIntegrity,
	validateCompleteIntegrity,
	REQUIRED_BUILD_CORE_STEPS,
};

// Auto-run when called directly
if (import.meta.url.includes("validate-build-integrity.js")) {
	const isValid = validateCompleteIntegrity();
	if (!isValid) {
		process.exit(1);
	}
}
