/**
 * Origin Tracking Module
 * Implements sophisticated commit tree validation and fork detection
 * Uses distributed checks to prevent git history manipulation
 */

// Obfuscated repository information using hex encoding
const HEX_DATA = {
	// Hex encoded strings for stealth operation
	userHex: "564b726973686e613034", // VKrishna04
	repoHex: "564b726973686e6130342e6769746875622e696f", // VKrishna04.github.io
	originHex:
		"68747470733a2f2f6769746875622e636f6d2f564b726973686e6130342f564b726973686e6130342e6769746875622e696f", // Full origin URL
	branchHex: "6d61696e", // main
};

/**
 * Converts hex string to ASCII
 * @param {string} hex - Hex encoded string
 * @returns {string} Decoded ASCII string
 */
function hexToAscii(hex) {
	let result = "";
	for (let i = 0; i < hex.length; i += 2) {
		result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return result;
}

/**
 * Generates a lightweight fingerprint for validation
 * @param {string} data - Data to fingerprint
 * @returns {string} Fingerprint hash
 */
function createFingerprint(data) {
	let hash = 5381;
	for (let i = 0; i < data.length; i++) {
		hash = (hash << 5) + hash + data.charCodeAt(i);
	}
	return (hash >>> 0).toString(16);
}

/**
 * Validates expected commit patterns from the original repository
 * @returns {Promise<boolean>} True if commit patterns match expectations
 */
async function validateCommitTree() {
	try {
		const user = hexToAscii(HEX_DATA.userHex);
		const repo = hexToAscii(HEX_DATA.repoHex).split(".")[0]; // Remove .github.io
		const branch = hexToAscii(HEX_DATA.branchHex);

		// GitHub API endpoint for commits
		const commitsUrl = `https://api.github.com/repos/${user}/${repo}/commits?sha=${branch}&per_page=10`;

		const response = await fetch(commitsUrl);
		if (!response.ok) return false;

		const commits = await response.json();

		// Validate commit structure and patterns
		const hasValidCommits =
			commits && Array.isArray(commits) && commits.length > 0;

		if (!hasValidCommits) return false;

		// Check for expected commit author patterns
		const originalAuthorCommits = commits.filter(
			(commit) => commit.author && commit.author.login === user
		);

		// At least some commits should be from the original author
		const hasOriginalAuthorCommits = originalAuthorCommits.length > 0;

		// Validate recent commit structure
		const recentCommit = commits[0];
		const hasValidStructure =
			recentCommit.sha && recentCommit.commit && recentCommit.commit.message;

		return hasOriginalAuthorCommits && hasValidStructure;
	} catch {
		return false;
	}
}

/**
 * Checks if the current site is a fork and validates its relationship to origin
 * @returns {Promise<boolean>} True if fork relationship is valid or if original
 */
async function validateForkRelationship() {
	try {
		const currentHost =
			typeof window !== "undefined" ? window.location.hostname : "";
		const expectedHost =
			hexToAscii(HEX_DATA.userHex).toLowerCase() + ".github.io";

		// If on original domain, validation passes
		if (currentHost === expectedHost) return true;

		// For other domains, check if it's a legitimate fork
		if (currentHost.includes("github.io")) {
			// Extract username from GitHub Pages URL
			const username = currentHost.split(".")[0];

			// Check if this user's repo is a fork of the original
			const forkCheckUrl = `https://api.github.com/repos/${username}/${hexToAscii(
				HEX_DATA.userHex
			)}.github.io`;

			const response = await fetch(forkCheckUrl);
			if (!response.ok) return false;

			const repoData = await response.json();

			// Check if it's a fork and has proper attribution
			const isFork = repoData.fork === true;
			const hasParent =
				repoData.parent &&
				repoData.parent.full_name ===
					`${hexToAscii(HEX_DATA.userHex)}/${hexToAscii(
						HEX_DATA.userHex
					)}.github.io`;

			return isFork && hasParent;
		}

		// For custom domains, allow but log
		console.info("Custom domain detected - template validation active");
		return true;
	} catch {
		return false;
	}
}

/**
 * Validates the repository's license and attribution requirements
 * @returns {Promise<boolean>} True if license compliance is maintained
 */
async function validateLicenseCompliance() {
	try {
		const user = hexToAscii(HEX_DATA.userHex);
		const repo = hexToAscii(HEX_DATA.repoHex).split(".")[0];

		// Check original repository license
		const licenseUrl = `https://api.github.com/repos/${user}/${repo}/license`;

		const response = await fetch(licenseUrl);
		if (!response.ok) return true; // If no license info, assume compliant

		const licenseData = await response.json();

		// Validate license exists and is proper open source license
		const hasValidLicense = licenseData.license && licenseData.license.spdx_id;

		return hasValidLicense;
	} catch {
		return true; // Default to allowing if check fails
	}
}

/**
 * Comprehensive origin validation
 * @returns {Promise<boolean>} Overall origin validation result
 */
async function validateOriginIntegrity() {
	const validationPromises = [
		validateCommitTree(),
		validateForkRelationship(),
		validateLicenseCompliance(),
	];

	try {
		const results = await Promise.allSettled(validationPromises);

		const validationResults = results.map((result) =>
			result.status === "fulfilled" ? result.value : false
		);

		const [commitValid, forkValid, licenseValid] = validationResults;

		// Require at least 2 of 3 validations to pass
		const passedValidations = validationResults.filter(Boolean).length;
		const validationPassed = passedValidations >= 2;

		// Create validation fingerprint for integrity
		const validationFingerprint = createFingerprint(
			`${commitValid}-${forkValid}-${licenseValid}-${Date.now()}`
		);

		if (!validationPassed) {
			console.info(
				"Origin integrity check:",
				validationFingerprint.substring(0, 8)
			);
		}

		return validationPassed;
	} catch {
		return false;
	}
}

/**
 * Initializes origin tracking system
 */
function initOriginTracking() {
	if (typeof window !== "undefined") {
		// Run validation after page stabilizes
		setTimeout(validateOriginIntegrity, 2000);

		// Periodic integrity checks
		setInterval(validateOriginIntegrity, 120000); // Every 2 minutes

		// Monitor for navigation changes that might indicate tampering
		let lastUrl = window.location.href;
		setInterval(() => {
			if (window.location.href !== lastUrl) {
				lastUrl = window.location.href;
				setTimeout(validateOriginIntegrity, 500);
			}
		}, 1000);
	}
}

// Auto-initialize origin tracking
initOriginTracking();

export {
	validateOriginIntegrity,
	validateCommitTree,
	validateForkRelationship,
	validateLicenseCompliance,
	createFingerprint,
	initOriginTracking,
};
