#!/usr/bin/env node

/**
 * Development Environment Setup Script
 * Automatically generates the necessary files for legitimate development environment detection
 * Run this once in your development environment to enable seamless local builds
 */

import fs from "fs";
import crypto from "crypto";
import os from "os";
import path from "path";
import process from "process";

console.log("🔧 Setting up development environment...");

try {
	// 1. Create workspace configuration
	if (!fs.existsSync(".workspace-config")) {
		const workspaceConfig = {
			created: new Date().toISOString(),
			user: os.userInfo().username,
			platform: os.platform(),
			arch: os.arch(),
			node: process.version,
		};

		fs.writeFileSync(
			".workspace-config",
			JSON.stringify(workspaceConfig, null, 2)
		);
		console.log("✅ Created .workspace-config");
	}

	// 2. Create local development environment file
	if (!fs.existsSync(".dev-env.local")) {
		const devEnv = {
			workspace: path.basename(process.cwd()),
			created: Date.now(),
			hostname: os.hostname(),
			tmpdir: os.tmpdir(),
		};

		fs.writeFileSync(".dev-env.local", JSON.stringify(devEnv, null, 2));
		console.log("✅ Created .dev-env.local");
	}

	// 3. Generate development session key
	const machineId = crypto
		.createHash("md5")
		.update(os.hostname() + os.userInfo().username + process.cwd())
		.digest("hex");

	const timestamp = Date.now();
	const sessionKey = `dev-${machineId}-${timestamp}`;

	fs.writeFileSync("dev-session.key", sessionKey);
	console.log("✅ Generated dev-session.key");

	// 4. Create development fingerprint in node_modules
	if (fs.existsSync("node_modules")) {
		const cwdHash = crypto
			.createHash("md5")
			.update(process.cwd())
			.digest("hex")
			.substring(0, 8);
		const fingerprint = `dev-fingerprint-${cwdHash}-${timestamp}`;

		fs.writeFileSync("node_modules/.dev-fingerprint", fingerprint);
		console.log("✅ Created node_modules/.dev-fingerprint");
	} else {
		console.log(
			'⚠️  node_modules not found - run "npm install" first, then re-run this script'
		);
	}

	// 5. Create local development config
	if (!fs.existsSync(".local-dev-config")) {
		const localConfig = {
			initialized: true,
			timestamp: Date.now(),
			machine: {
				platform: os.platform(),
				arch: os.arch(),
				release: os.release(),
			},
		};

		fs.writeFileSync(".local-dev-config", JSON.stringify(localConfig, null, 2));
		console.log("✅ Created .local-dev-config");
	}

	console.log("\n🎉 Development environment setup complete!");
	console.log("Your local builds will now bypass verification automatically.");
	console.log(
		"\nNote: These files are gitignored and specific to your development environment."
	);
} catch (error) {
	console.error("❌ Error setting up development environment:", error.message);
	process.exit(1);
}
