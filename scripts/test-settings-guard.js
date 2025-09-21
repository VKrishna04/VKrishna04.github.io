/**
 * Settings Loader with Verification
 * This script demonstrates how settings.json loading becomes dependent on verification
 */

import process from "process";
import { loadSecureSettings } from "../src/utils/settings-guard.js";

console.log("🔒 Testing secure settings loading...\n");

const settings = loadSecureSettings();

if (settings) {
	console.log("✅ Settings loaded successfully");
	console.log(`   Site title: ${settings.seo?.title || "Unknown"}`);
	console.log(`   Author: ${settings.seo?.author || "Unknown"}`);
	console.log("   Site will work normally\n");
} else {
	console.log("❌ Settings failed to load");
	console.log("   Site will be broken/non-functional");
	console.log(
		"   This happens when verification files are missing or tampered\n"
	);
	process.exit(1);
}
