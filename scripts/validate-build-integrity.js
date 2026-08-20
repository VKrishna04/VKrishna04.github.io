/**
 * Build Integrity Validator
 * Prevents bypass of validation system by checking build script integrity
 * Must be run before any build process to ensure validation hasn't been bypassed
 */

import fs from "fs";
import process from "process";


/**
 * Expected build script configuration - this is the source of truth
 * We check the build-core script to avoid circular dependency
 */
const EXPECTED_BUILD_CORE_SCRIPT =
	"node scripts/pre-build-validation.js && node scripts/generate-icon-map.js && vite build && node scripts/generate-manifest.js";

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

		if (currentBuildCoreScript !== EXPECTED_BUILD_CORE_SCRIPT) {
			console.error("🚫 BUILD CORE SCRIPT HAS BEEN TAMPERED WITH!");
			console.error(
				"   This indicates an attempt to bypass the validation system."
			);
			console.error("");
			console.error("   Expected build-core script:");
			console.error(`   "${EXPECTED_BUILD_CORE_SCRIPT}"`);
			console.error("");
			console.error("   Current build-core script:");
			console.error(`   "${currentBuildCoreScript}"`);
			console.error("");
			console.error(
				"🔒 Security Note: The build-core script must include pre-build validation"
			);
			console.error(
				"   to ensure code integrity. Bypassing this validation could"
			);
			console.error("   allow malicious code to be built and deployed.");
			console.error("");
			console.error(
				"💡 To fix this issue, restore the correct build-core script in package.json:"
			);
			console.error(`   npm pkg set scripts.build-core="${EXPECTED_BUILD_CORE_SCRIPT}"`);
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
			console.error("   Required build script:");
			console.error(`   "${EXPECTED_BUILD_CORE_SCRIPT}"`);
			console.error("");
			console.error("💡 To fix this issue, restore the correct build script:");
			console.error(`   npm pkg set scripts.build-core="${EXPECTED_BUILD_CORE_SCRIPT}"`);
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
	EXPECTED_BUILD_CORE_SCRIPT,
};

// Auto-run when called directly
if (import.meta.url.includes("validate-build-integrity.js")) {
	const isValid = validateCompleteIntegrity();
	if (!isValid) {
		process.exit(1);
	}
}
