/**
 * Stealth Validation Module
 * Performs discrete checks without obvious attribution references
 * Uses character codes and string manipulation to hide identifiers
 */

// Character code arrays (obfuscated identifiers)
const CHAR_SEQUENCES = {
	// 'VKrishna04' as character codes
	target: [86, 75, 114, 105, 115, 104, 110, 97, 48, 52],
	// Expected domain pattern codes
	domain: [103, 105, 116, 104, 117, 98, 46, 105, 111], // 'github.io'
	// Validation signature
	sig: [118, 97, 108, 105, 100, 45, 50, 48, 50, 52], // 'valid-2024'
};

/**
 * Reconstructs string from character codes
 * @param {number[]} codes - Array of character codes
 * @returns {string} Reconstructed string
 */
const fromCodes = (codes) => String.fromCharCode(...codes);

/**
 * Performs environment validation
 * @returns {boolean} Validation result
 */
function validateEnvironment() {
	const targetUser = fromCodes(CHAR_SEQUENCES.target);
	const domainSuffix = fromCodes(CHAR_SEQUENCES.domain);

	if (typeof window === "undefined") return true; // Allow SSR

	const currentHost = window.location.hostname.toLowerCase();

	// Check for expected patterns
	const expectedPatterns = [
		targetUser.toLowerCase() + "." + domainSuffix,
		"localhost",
		"127.0.0.1",
	];

	// Allow development and legitimate domains
	const isValidEnvironment = expectedPatterns.some(
		(pattern) =>
			currentHost === pattern ||
			currentHost.endsWith(pattern) ||
			currentHost.includes("localhost") ||
			currentHost.includes("127.0.0.1")
	);

	if (!isValidEnvironment) {
		// Discrete logging
		const msg = ["⚠️", "Template", "source", "validation", "notice"].join(" ");
		console.info(msg);
	}

	return isValidEnvironment;
}

/**
 * Checks for template modification indicators
 * @returns {boolean} True if template appears unmodified
 */
function checkTemplateIntegrity() {
	const signature = fromCodes(CHAR_SEQUENCES.sig);

	// Check for expected meta tags and structure
	if (typeof document !== "undefined") {
		const titleElement = document.querySelector("title");
		const metaDescription = document.querySelector('meta[name="description"]');

		// Validate basic structure exists
		const hasExpectedStructure = titleElement && metaDescription;

		if (!hasExpectedStructure) {
			console.info("Template structure validation:", signature);
			return false;
		}
	}

	return true;
}

/**
 * Validates repository relationship
 * @returns {Promise<boolean>} Validation result
 */
async function validateRepository() {
	try {
		const user = fromCodes(CHAR_SEQUENCES.target);
		const apiBase =
			"https://api." + fromCodes(CHAR_SEQUENCES.domain.slice(0, -3)) + ".com";

		// Construct API URL discretely
		const repoPath = `/repos/${user}/${user}.${fromCodes(
			CHAR_SEQUENCES.domain
		)}`;
		const apiUrl = apiBase + repoPath;

		const response = await fetch(apiUrl);
		if (!response.ok) return false;

		const data = await response.json();

		// Validate repository metadata
		const isValidRepo =
			data.owner && data.owner.login === user && data.name && data.html_url;

		return isValidRepo;
	} catch {
		return false;
	}
}

/**
 * Performs comprehensive stealth validation
 * @returns {Promise<boolean>} Overall validation result
 */
async function performStealthValidation() {
	const results = await Promise.allSettled([
		Promise.resolve(validateEnvironment()),
		Promise.resolve(checkTemplateIntegrity()),
		validateRepository(),
	]);

	const validationResults = results.map((result) =>
		result.status === "fulfilled" ? result.value : false
	);

	const passedChecks = validationResults.filter(Boolean).length;
	const totalChecks = validationResults.length;

	// Require at least 2/3 checks to pass
	const validationPassed = passedChecks >= Math.ceil(totalChecks * 0.67);

	if (!validationPassed) {
		// Discrete notification
		console.info("Template validation system active");
	}

	return validationPassed;
}

/**
 * Initializes stealth monitoring
 */
function initStealthMonitoring() {
	if (typeof window !== "undefined") {
		// Run initial validation
		setTimeout(performStealthValidation, 1000);

		// Set up periodic validation
		setInterval(performStealthValidation, 45000); // Every 45 seconds

		// Monitor for suspicious activity
		let modificationCount = 0;
		const observer = new MutationObserver(() => {
			modificationCount++;
			if (modificationCount > 100) {
				// Excessive modifications
				performStealthValidation();
				modificationCount = 0;
			}
		});

		// Start observing after page load
		window.addEventListener("load", () => {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		});
	}
}

// Auto-initialize stealth monitoring
initStealthMonitoring();

export {
	performStealthValidation,
	validateEnvironment,
	validateRepository,
	checkTemplateIntegrity,
	initStealthMonitoring,
};
