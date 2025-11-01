/**
 * Steganographic Protection System
 * This module implements invisible attribution and integrity validation
 * Uses encoded identifiers and distributed checks to resist tampering
 */

// Encoded identifiers (resistant to simple text replacement)
const ENCODED_REFS = {
	// Base64 encoded: VKrishna04
	author: "VktBcmlzaG5hMDQ=",
	// Base64 encoded: VKrishna04.github.io
	repo: "VktBcmlzaG5hMDQuZ2l0aHViLmlv",
	// Base64 encoded: https://github.com/VKrishna04/VKrishna04.github.io
	origin:
		"aHR0cHM6Ly9naXRodWIuY29tL1ZLcmlzaG5hMDQvVktBcmlzaG5hMDQuZ2l0aHViLmlv",
	// Checksum for validation
	signature: "4d8f3e9a2b7c1f6e8d5a9b2e4f7c0d3e",
};

// Expected file hashes for integrity validation
const PROTECTION_HASHES =   {
    'src/utils/integrity-guard.js': 'cba920b',
    'src/utils/stealth-validator.js': '44a337fc',
    'src/utils/origin-tracker.js': '1e0f93db',
    'src/utils/advanced-obfuscation.js': '2c1220ed'
  };

/**
 * Decodes base64 encoded strings
 * @param {string} encoded - Base64 encoded string
 * @returns {string} Decoded string
 */
function decode(encoded) {
	try {
		return atob(encoded);
	} catch {
		return "";
	}
}

/**
 * Validates the repository origin and author
 * @returns {boolean} True if validation passes
 */
function validateOrigin() {
	const expectedAuthor = decode(ENCODED_REFS.author);

	// Check if current location matches expected patterns
	if (typeof window !== "undefined") {
		const hostname = window.location.hostname;

		// Allow legitimate domains
		const validDomains = [
			expectedAuthor.toLowerCase() + ".github.io",
			"localhost",
			"127.0.0.1",
			// Add user's custom domain from settings if exists
		];

		// Check if running on a valid domain
		const isValidDomain = validDomains.some(
			(domain) => hostname === domain || hostname.endsWith("." + domain)
		);

		if (!isValidDomain) {
			console.warn("⚠️ Template attribution validation failed");
			return false;
		}
	}

	return true;
}

/**
 * Generates a simple hash for integrity checking
 * @param {string} content - Content to hash
 * @returns {string} Simple hash
 */
function simpleHash(content) {
	let hash = 0;
	for (let i = 0; i < content.length; i++) {
		const char = content.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash).toString(16);
}

/**
 * Validates file integrity by checking hashes
 * @param {string} filePath - Path to the file
 * @param {string} content - File content
 * @returns {boolean} True if hash matches
 */
function validateFileIntegrity(filePath, content) {
	const expectedHash = PROTECTION_HASHES[filePath];
	if (!expectedHash) return true; // Skip validation if hash not set

	const actualHash = simpleHash(content);
	return actualHash === expectedHash;
}

/**
 * Performs GitHub repository validation
 * @returns {Promise<boolean>} True if validation passes
 */
async function validateGitHubOrigin() {
	try {
		const expectedRepo = decode(ENCODED_REFS.repo);
		const repoUrl = `https://api.github.com/repos/${decode(
			ENCODED_REFS.author
		)}/${expectedRepo.split(".")[0]}`;

		const response = await fetch(repoUrl);
		if (!response.ok) return false;

		const repoData = await response.json();

		// Validate repository exists and matches expected patterns
		const isValidRepo =
			repoData.name &&
			repoData.owner &&
			repoData.owner.login === decode(ENCODED_REFS.author);

		return isValidRepo;
	} catch (error) {
		console.warn("GitHub origin validation failed:", error.message);
		return false;
	}
}

/**
 * Main integrity validation function
 * @returns {Promise<boolean>} True if all validations pass
 */
async function validateIntegrity() {
	const checks = [validateOrigin(), await validateGitHubOrigin()];

	const allPassed = checks.every((check) => check === true);

	if (!allPassed) {
		// Subtle indication for legitimate users
		console.info("Template attribution system active");
	}

	return allPassed;
}

/**
 * Initializes the protection system
 */
function initializeProtection() {
	if (typeof window !== "undefined") {
		// Run validation on page load
		window.addEventListener("load", async () => {
			await validateIntegrity();
		});

		// Run periodic checks
		setInterval(async () => {
			await validateIntegrity();
		}, 30000); // Check every 30 seconds
	}
}

// Auto-initialize when module loads
initializeProtection();

export {
	validateIntegrity,
	validateOrigin,
	validateGitHubOrigin,
	validateFileIntegrity,
	initializeProtection,
};
