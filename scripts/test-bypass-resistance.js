#!/usr/bin/env node

/**
 * Test script to verify that simple bypass attempts are rejected
 * This simulates what would happen if someone tried to bypass with simple file creation
 */

import fs from "fs";

console.log("🧪 Testing bypass resistance...\n");

// Save current legitimate files
const legitimateFiles = {
	workspaceConfig: fs.existsSync(".workspace-config")
		? fs.readFileSync(".workspace-config", "utf8")
		: null,
	devEnv: fs.existsSync(".dev-env.local")
		? fs.readFileSync(".dev-env.local", "utf8")
		: null,
	sessionKey: fs.existsSync("dev-session.key")
		? fs.readFileSync("dev-session.key", "utf8")
		: null,
	fingerprint: fs.existsSync("node_modules/.dev-fingerprint")
		? fs.readFileSync("node_modules/.dev-fingerprint", "utf8")
		: null,
	localConfig: fs.existsSync(".local-dev-config")
		? fs.readFileSync(".local-dev-config", "utf8")
		: null,
};

// Test 1: Simple file creation attempt
console.log("Test 1: Simple file creation (what an attacker might try)");
try {
	// Remove legitimate files temporarily
	if (fs.existsSync(".workspace-config")) fs.unlinkSync(".workspace-config");
	if (fs.existsSync(".dev-env.local")) fs.unlinkSync(".dev-env.local");
	if (fs.existsSync("dev-session.key")) fs.unlinkSync("dev-session.key");
	if (fs.existsSync("node_modules/.dev-fingerprint"))
		fs.unlinkSync("node_modules/.dev-fingerprint");
	if (fs.existsSync(".local-dev-config")) fs.unlinkSync(".local-dev-config");

	// Attempt simple bypass with empty files (what an attacker might try)
	fs.writeFileSync(".workspace-config", "{}");
	fs.writeFileSync(".dev-env.local", "{}");
	fs.writeFileSync("dev-session.key", "fake-key");

	// Test the settings guard
	const { guardSettings } = await import("../src/utils/settings-guard.js");

	try {
		guardSettings();
		console.log("❌ SECURITY ISSUE: Simple bypass succeeded");
	} catch (error) {
		console.log("✅ Simple bypass correctly rejected");
		console.log(`   Reason: ${error.message}`);
	}
} catch (error) {
	console.log("✅ Simple bypass attempt failed");
	console.log(`   Error: ${error.message}`);
}

// Test 2: Partial bypass attempt
console.log("\nTest 2: Partial bypass with some valid indicators");
try {
	// Create some legitimate-looking files but with wrong content
	fs.writeFileSync("dev-session.key", "dev-abcd1234-1234567890123"); // Wrong format
	if (fs.existsSync("node_modules")) {
		fs.writeFileSync("node_modules/.dev-fingerprint", "wrong-fingerprint"); // Wrong fingerprint
	}

	const { guardSettings } = await import("../src/utils/settings-guard.js");

	try {
		guardSettings();
		console.log("❌ SECURITY ISSUE: Partial bypass succeeded");
	} catch (error) {
		console.log("✅ Partial bypass correctly rejected");
		console.log(`   Reason: ${error.message}`);
	}
} catch (error) {
	console.log("✅ Partial bypass attempt failed");
	console.log(`   Error: ${error.message}`);
}

// Restore legitimate files
console.log("\nRestoring legitimate development environment...");
try {
	if (legitimateFiles.workspaceConfig) {
		fs.writeFileSync(".workspace-config", legitimateFiles.workspaceConfig);
	}
	if (legitimateFiles.devEnv) {
		fs.writeFileSync(".dev-env.local", legitimateFiles.devEnv);
	}
	if (legitimateFiles.sessionKey) {
		fs.writeFileSync("dev-session.key", legitimateFiles.sessionKey);
	}
	if (legitimateFiles.fingerprint && fs.existsSync("node_modules")) {
		fs.writeFileSync(
			"node_modules/.dev-fingerprint",
			legitimateFiles.fingerprint
		);
	}
	if (legitimateFiles.localConfig) {
		fs.writeFileSync(".local-dev-config", legitimateFiles.localConfig);
	}

	// Test that legitimate environment still works
	console.log("\nTest 3: Legitimate environment validation");
	const { guardSettings } = await import("../src/utils/settings-guard.js");

	try {
		guardSettings();
		console.log("✅ Legitimate environment correctly accepted");
	} catch (error) {
		console.log("❌ ISSUE: Legitimate environment rejected");
		console.log(`   Error: ${error.message}`);
	}
} catch (error) {
	console.error("❌ Error restoring environment:", error.message);
}

console.log("\n🎯 Bypass resistance test complete!");
console.log(
	"The system should reject simple bypass attempts while accepting legitimate development environments."
);
