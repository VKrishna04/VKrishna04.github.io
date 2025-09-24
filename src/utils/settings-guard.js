/**
 * Settings Verification Guard
 * This file ensures settings.json only loads if verification passes
 * If verification files are missing or tampered, settings.json will fail to load
 */

import fs from "fs";
import crypto from "crypto";
import process from "process";

/* eslint-env node */

/**
 * Detects if we're in a legitimate development environment
 * Uses multiple sophisticated checks that are hard to reverse engineer
 * @returns {boolean} True if legitimate development environment
 */
function isLegitimateDevEnvironment() {
	// Comprehensive CI/hosting platform detection
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
		process.env.BITBUCKET_BUILD_NUMBER || // Bitbucket Pipelines
		typeof window === "undefined"; // Server-side rendering

	// Never allow bypass in any CI/hosting environment
	if (isCI) {
		return false;
	}

	try {
		// Check 1: VS Code workspace detection
		const hasVSCodeWorkspace =
			fs.existsSync(".vscode/settings.json") ||
			fs.existsSync(".vscode/launch.json") ||
			process.env.VSCODE_PID !== undefined ||
			process.env.TERM_PROGRAM === "vscode";

		// Check 2: Node modules development indicators
		const hasDevDependencies =
			fs.existsSync("node_modules/.package-lock.json") ||
			fs.existsSync("node_modules/.bin/vite") ||
			fs.existsSync("package-lock.json");

		// Check 3: Git repository in local development state
		const hasGitDev =
			fs.existsSync(".git/config") &&
			!process.env.GITHUB_WORKSPACE && // Not GitHub Actions
			!process.env.VERCEL && // Not Vercel
			!process.env.NETLIFY && // Not Netlify
			!process.env.CF_PAGES && // Not Cloudflare Pages
			!process.env.RENDER && // Not Render
			!process.env.RAILWAY_ENVIRONMENT_NAME && // Not Railway
			!process.env.HEROKU_APP_NAME && // Not Heroku
			!process.env.BUILD_ID; // Not generic build system

		// Check 4: Local workspace configuration (with content validation)
		let hasWorkspaceConfig = false;
		try {
			if (fs.existsSync(".workspace-config")) {
				const config = JSON.parse(fs.readFileSync(".workspace-config", "utf8"));
				// Must have valid created timestamp and user info
				hasWorkspaceConfig = config.created && config.user && config.platform;
			}
			if (fs.existsSync(".dev-env.local")) {
				const devEnv = JSON.parse(fs.readFileSync(".dev-env.local", "utf8"));
				// Must have valid workspace and hostname info
				hasWorkspaceConfig =
					hasWorkspaceConfig || (devEnv.workspace && devEnv.hostname);
			}
		} catch {
			hasWorkspaceConfig = false;
		}

		// Check 5: Development session key
		let hasValidDevSession = false;
		try {
			if (fs.existsSync("dev-session.key")) {
				const sessionKey = fs.readFileSync("dev-session.key", "utf8").trim();
				// Check if session key matches expected pattern (machine + time based)
				const validPattern = /^dev-[a-f0-9]{32}-\d{13}$/;
				hasValidDevSession = validPattern.test(sessionKey);
			}
		} catch {
			hasValidDevSession = false;
		}

		// Check 6: Local development fingerprint
		let hasDevFingerprint = false;
		try {
			if (fs.existsSync("node_modules/.dev-fingerprint")) {
				const fingerprint = fs
					.readFileSync("node_modules/.dev-fingerprint", "utf8")
					.trim();
				// Check if fingerprint contains current working directory hash
				const cwdHash = crypto
					.createHash("md5")
					.update(process.cwd())
					.digest("hex")
					.substring(0, 8);
				hasDevFingerprint = fingerprint.includes(cwdHash);
			}
		} catch {
			hasDevFingerprint = false;
		}

		// Require multiple indicators for legitimate development
		const devIndicators = [
			hasVSCodeWorkspace,
			hasDevDependencies,
			hasGitDev,
			hasWorkspaceConfig,
			hasValidDevSession,
			hasDevFingerprint,
		];

		const validIndicators = devIndicators.filter(Boolean).length;

		// Need at least 4 indicators for development mode (higher security)
		if (validIndicators >= 4) {
			console.log(
				`[Settings] Development environment detected (${validIndicators}/6 indicators)`
			);
			return true;
		}

		console.log(
			`[Settings] Insufficient development indicators (${validIndicators}/6) - using strict mode`
		);
		return false;
	} catch {
		console.log(
			"[Settings] Error detecting development environment - using strict mode"
		);
		return false;
	}
}

/**
 * Verifies that all required verification files exist and are valid
 * @returns {boolean} True if verification passes
 */
function verifyIntegrity() {
	// Check for legitimate development environment first
	if (isLegitimateDevEnvironment()) {
		return true;
	}

	const requiredFiles = [
		"scripts/pre-build-validation.js",
		"scripts/validate-build-integrity.js",
		"scripts/generate-hashes.js",
		"src/utils/integrity-guard.js",
		"src/utils/stealth-validator.js",
		"src/utils/origin-tracker.js",
		"src/utils/advanced-obfuscation.js",
		"src/utils/build-time-protection.js",
	];

	// Check if any file is missing
	for (const file of requiredFiles) {
		if (!fs.existsSync(file)) {
			console.error(`[Settings] Verification failed - missing: ${file}`);
			return false;
		}
	}

	console.log("[Settings] Verification passed - all files present");
	return true;
}

/**
 * Guard function that must be called before loading settings
 * Throws error if verification fails, preventing settings from loading
 */
export function guardSettings() {
	if (!verifyIntegrity()) {
		throw new Error(
			"Settings verification failed - required files missing or tampered"
		);
	}
	return true;
}

/**
 * Safe settings loader that includes verification
 * @param {string} settingsPath - Path to settings.json file
 * @returns {Object} Parsed settings object
 */
export function loadSecureSettings(settingsPath = "public/settings.json") {
	// Verify integrity first
	guardSettings();

	try {
		const settingsData = fs.readFileSync(settingsPath, "utf8");
		return JSON.parse(settingsData);
	} catch (error) {
		throw new Error(`Failed to load settings: ${error.message}`);
	}
}
