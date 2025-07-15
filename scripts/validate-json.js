#!/usr/bin/env node

/*
 * Copyright 2025 Krishna GSVV
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from "fs";
import path from "path";
import process from "process";

/**
 * Validates JSON files for comments and syntax errors
 * @param {string} filePath - Path to the JSON file to validate
 * @returns {Object} Validation result with errors array and isValid boolean
 */
function validateJsonFile(filePath) {
	const result = {
		isValid: true,
		errors: [],
		warnings: [],
	};

	try {
		// Check if file exists
		if (!fs.existsSync(filePath)) {
			result.isValid = false;
			result.errors.push(`File not found: ${filePath}`);
			return result;
		}

		// Read file content
		const content = fs.readFileSync(filePath, "utf8");

		// Check for comments (but avoid URLs)

		// Special handling for single-line comments to avoid false positives with URLs
		const lines = content.split("\n");
		lines.forEach((line, index) => {
			// Remove quoted strings first to avoid false positives from URLs in strings
			const lineWithoutQuotes = line.replace(/"[^"]*"/g, '""');

			// Look for // that are actual comments, not part of URLs
			// Comments typically start with // at beginning of line or after whitespace/punctuation
			// But exclude cases where // is preceded by : (like in URLs: http://, https://)
			const commentMatch = lineWithoutQuotes.match(/(?<!:)\/\/(?!\s*")/);

			if (commentMatch) {
				// Double check - if the original line contains http:// or https://, it's probably a URL
				if (!line.includes("http://") && !line.includes("https://")) {
					result.isValid = false;
					result.errors.push({
						type: "comment",
						message: "Single-line comments (//) are not allowed in JSON files",
						line: index + 1,
						column: line.indexOf("//") + 1,
						text: line.trim(),
					});
				}
			}
		});

		// Check for multi-line comments only
		const multiLineCommentMatches = content.match(/\/\*[\s\S]*?\*\//gm);
		if (multiLineCommentMatches) {
			multiLineCommentMatches.forEach((match) => {
				const lines = content.substring(0, content.indexOf(match)).split("\n");
				const lineNumber = lines.length;
				const columnNumber = lines[lines.length - 1].length + 1;

				result.isValid = false;
				result.errors.push({
					type: "comment",
					message: "Multi-line comments (/* */) are not allowed in JSON files",
					line: lineNumber,
					column: columnNumber,
					text: match.trim(),
				});
			});
		}

		// Check for trailing commas
		const trailingCommaPattern = /,(\s*[}\]])/gm;
		const trailingCommaMatches = content.match(trailingCommaPattern);
		if (trailingCommaMatches) {
			trailingCommaMatches.forEach((match) => {
				const lines = content.substring(0, content.indexOf(match)).split("\n");
				const lineNumber = lines.length;

				result.warnings.push({
					type: "trailing-comma",
					message:
						"Trailing comma detected - this may cause issues in strict JSON parsers",
					line: lineNumber,
					text: match.trim(),
				});
			});
		}

		// Try to parse JSON
		try {
			JSON.parse(content);
		} catch (parseError) {
			result.isValid = false;
			result.errors.push({
				type: "syntax",
				message: `JSON syntax error: ${parseError.message}`,
				line: parseError.lineNumber || "unknown",
				column: parseError.columnNumber || "unknown",
			});
		}
	} catch (error) {
		result.isValid = false;
		result.errors.push({
			type: "file-error",
			message: `Error reading file: ${error.message}`,
		});
	}

	return result;
}

/**
 * Main validation function
 */
function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log("Usage: node validate-json.js <json-file-path>");
		console.log("Example: node validate-json.js public/settings.json");
		process.exit(1);
	}

	const filePath = args[0];
	const absolutePath = path.resolve(filePath);

	console.log(`Validating JSON file: ${absolutePath}`);
	console.log("─".repeat(50));

	const result = validateJsonFile(absolutePath);

	if (result.isValid) {
		console.log("✅ JSON file is valid!");

		if (result.warnings.length > 0) {
			console.log("\n⚠️  Warnings:");
			result.warnings.forEach((warning, index) => {
				console.log(`  ${index + 1}. Line ${warning.line}: ${warning.message}`);
				if (warning.text) {
					console.log(`     Text: "${warning.text}"`);
				}
			});
		}
	} else {
		console.log("❌ JSON file validation failed!");
		console.log("\n🚨 Errors:");

		result.errors.forEach((error, index) => {
			console.log(`  ${index + 1}. ${error.message}`);
			if (error.line && error.line !== "unknown") {
				console.log(
					`     Location: Line ${error.line}${
						error.column ? `, Column ${error.column}` : ""
					}`
				);
			}
			if (error.text) {
				console.log(`     Text: "${error.text}"`);
			}
		});

		if (result.warnings.length > 0) {
			console.log("\n⚠️  Warnings:");
			result.warnings.forEach((warning, index) => {
				console.log(`  ${index + 1}. Line ${warning.line}: ${warning.message}`);
				if (warning.text) {
					console.log(`     Text: "${warning.text}"`);
				}
			});
		}

		process.exit(1);
	}
}

// Run the script
main();
