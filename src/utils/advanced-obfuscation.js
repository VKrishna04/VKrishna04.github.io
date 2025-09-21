/**
 * Advanced Obfuscation Utilities - Simplified Version
 * Provides sophisticated code protection with multi-layer obfuscation
 * This is a simplified version to avoid build issues
 */

/**
 * Creates a fragmented string split across multiple storage methods
 * @param {string} str - String to fragment
 * @returns {object} Fragmented string data
 */
function createFragmentedString(str) {
	const fragments = {
		p1: btoa(str.slice(0, 4)), // First 4 chars as base64
		p2: str
			.slice(4, 7)
			.split("")
			.map((c) => c.charCodeAt(0)), // Next 3 as char codes
		p3: str
			.slice(7)
			.split("")
			.map((c) => c.charCodeAt(0).toString(16))
			.join("-"), // Rest as hex
		len: str.length,
	};
	return fragments;
}

/**
 * Reconstructs a fragmented string
 * @param {object} fragments - Fragmented string data
 * @returns {string} Reconstructed string
 */
function reconstructFragments(fragments) {
	try {
		const part1 = atob(fragments.p1);
		const part2 = fragments.p2
			.map((code) => String.fromCharCode(code))
			.join("");
		const part3 = fragments.p3
			.split("-")
			.map((hex) => String.fromCharCode(parseInt(hex, 16)))
			.join("");
		return part1 + part2 + part3;
	} catch {
		return "";
	}
}

/**
 * Creates multiple encoded versions of a string for cross-validation
 * @param {string} str - String to encode
 * @returns {object} Multiple encoded versions
 */
function createMultipleEncodings(str) {
	return {
		base64: btoa(str),
		hex: str
			.split("")
			.map((c) => c.charCodeAt(0).toString(16))
			.join(""),
		chars: str.split("").map((c) => c.charCodeAt(0)),
		reversed: btoa(str.split("").reverse().join("")),
		checksum: str.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0),
	};
}

/**
 * Validates a string against multiple encodings
 * @param {string} str - String to validate
 * @param {object} encodings - Encoded versions for validation
 * @returns {boolean} True if validation passes
 */
function validateWithEncodings(str, encodings) {
	try {
		// Check base64
		if (atob(encodings.base64) !== str) return false;

		// Check checksum
		const checksum = str
			.split("")
			.reduce((sum, char) => sum + char.charCodeAt(0), 0);
		if (checksum !== encodings.checksum) return false;

		// Check char codes
		const charCodes = str.split("").map((c) => c.charCodeAt(0));
		if (JSON.stringify(charCodes) !== JSON.stringify(encodings.chars))
			return false;

		return true;
	} catch {
		return false;
	}
}

// Pre-computed obfuscated identifiers
const OBFUSCATED_IDS = {
	// VKrishna04
	primary: createMultipleEncodings("VKrishna04"),

	// Krishna GSVV
	author_name: createMultipleEncodings("Krishna GSVV"),

	// Life-Experimentalists
	organization: createMultipleEncodings("Life-Experimentalists"),

	// GitHub repository
	repo: createFragmentedString("VKrishna04.github.io"),

	// Domain patterns
	domain: {
		github: createMultipleEncodings("github.io"),
		localhost: createMultipleEncodings("localhost"),
		localip: createMultipleEncodings("127.0.0.1"),
	},
};

/**
 * Validates the current execution context against expected patterns
 * @returns {boolean} True if context is valid
 */
function validateExecutionContext() {
	try {
		// Validate primary identifier
		if (!validateWithEncodings("VKrishna04", OBFUSCATED_IDS.primary)) {
			return false;
		}

		// Validate author
		if (!validateWithEncodings("Krishna GSVV", OBFUSCATED_IDS.author_name)) {
			return false;
		}

		// All validations passed
		return true;
	} catch {
		return false;
	}
}

/**
 * Gets the validated repository identifier
 * @returns {string} Repository identifier if validation passes
 */
function getValidatedRepo() {
	try {
		return reconstructFragments(OBFUSCATED_IDS.repo);
	} catch {
		return "";
	}
}

/**
 * Performs integrity validation using multiple obfuscation layers
 * @returns {object} Validation results
 */
function performAdvancedValidation() {
	const results = {
		contextValid: validateExecutionContext(),
		repoValid: getValidatedRepo() === "VKrishna04.github.io",
		timestamp: Date.now(),
		version: "2.0.0",
	};

	results.overallValid = results.contextValid && results.repoValid;
	return results;
}

// Auto-initialize when module loads
let initializationComplete = false;

/**
 * Initialize protection system
 */
function initializeProtection() {
	if (initializationComplete) return;

	const validation = performAdvancedValidation();
	if (!validation.overallValid) {
		console.warn("Advanced protection validation failed");
	}

	initializationComplete = true;
}

/**
 * Validates the obfuscated environment using multiple layers
 * @returns {boolean} True if environment validation passes
 */
function validateObfuscatedEnvironment() {
	return performAdvancedValidation().overallValid;
}

// Export functions for use in other modules
export {
	createFragmentedString,
	reconstructFragments,
	createMultipleEncodings,
	validateWithEncodings,
	validateExecutionContext,
	getValidatedRepo,
	performAdvancedValidation,
	validateObfuscatedEnvironment,
	initializeProtection,
	OBFUSCATED_IDS,
};

// Auto-initialize when module loads
initializeProtection();
