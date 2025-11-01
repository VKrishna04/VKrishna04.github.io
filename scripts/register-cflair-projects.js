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

/**
 * CFlair-Counter Project Registration Script
 *
 * This script registers GitHub projects with CFlair-Counter during the build process.
 * It ensures projects exist by making an initial view count request.
 *
 * How CFlair-Counter works:
 * - POST /api/views/{projectName} - Creates project if doesn't exist & increments count
 * - GET /api/views/{projectName} - Gets current stats (returns 0 if doesn't exist)
 *
 * This script runs during build to initialize all projects.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import process from "process"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Configuration
const SETTINGS_FILE = path.join(__dirname, "..", "public", "settings.json");
const CFLAIR_BASE_URL = "https://cflaircounter.pages.dev";
const REQUEST_DELAY_MS = 500; // Delay between requests to avoid rate limiting
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Colors for console output
const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	cyan: "\x1b[36m",
	blue: "\x1b[34m",
};

// Helper function to make colored output
function log(color, prefix, message) {
	console.log(`${colors[color]}${prefix}${colors.reset} ${message}`);
}

// Sleep helper
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch GitHub repositories
async function fetchGitHubRepos(githubConfig) {
	const apiUrl =
		githubConfig.apiUrl ||
		`https://api.github.com/${githubConfig.type === "org" ? "orgs" : "users"}/${
			githubConfig.username
		}/repos`;

	log("cyan", "[INFO]", `Fetching repositories from: ${apiUrl}`);

	try {
		const response = await fetch(apiUrl, {
			headers: {
				Accept: "application/vnd.github.v3+json",
				"User-Agent": githubConfig.userAgent || "VKrishna04-Portfolio",
			},
		})

		if (!response.ok) {
			throw new Error(
				`GitHub API Error: ${response.status} ${response.statusText}`
			);
		}

		const repos = await response.json();
		log("green", "[SUCCESS]", `Fetched ${repos.length} repositories`);
		return repos;
	} catch (error) {
		log("red", "[ERROR]", `Failed to fetch GitHub repos: ${error.message}`);
		throw error;
	}
}

// Register a project with CFlair-Counter
async function registerProject(projectName, retries = 0) {
	const url = `${CFLAIR_BASE_URL}/api/views/${encodeURIComponent(projectName)}`;

	try {
		log("blue", "[REGISTER]", `Checking project: ${projectName}`);

		// First, check if project exists (GET request)
		const getResponse = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (getResponse.ok) {
			const data = await getResponse.json();
			if (data.success) {
				const views = data.totalViews || 0;
				const uniqueViews = data.uniqueViews || 0;

				if (views === 0) {
					// Project exists but has no views - initialize it with a POST
					log("yellow", "[INIT]", `Initializing project: ${projectName}`);
					const postResponse = await fetch(url, {
						method: "POST",
						headers: {
							Accept: "application/json",
						},
					});

					if (postResponse.ok) {
						const postData = await postResponse.json();
						if (postData.success) {
							log(
								"green",
								"[✓]",
								`Initialized: ${projectName} (Views: ${
									postData.totalViews || 1
								})`
							);
							return { success: true, initialized: true };
						}
					}
				} else {
					log(
						"green",
						"[✓]",
						`Already registered: ${projectName} (Views: ${views}, Unique: ${uniqueViews})`
					);
					return { success: true, initialized: false };
				}
			}
		}

		// If we get here, something went wrong
		log("yellow", "[RETRY]", `Retrying project: ${projectName}`);
		throw new Error("Failed to register project");
	} catch (error) {
		if (retries < MAX_RETRIES) {
			log(
				"yellow",
				"[RETRY]",
				`Retry ${retries + 1}/${MAX_RETRIES} for: ${projectName}`
			);
			await sleep(RETRY_DELAY_MS);
			return registerProject(projectName, retries + 1);
		}

		log(
			"red",
			"[ERROR]",
			`Failed to register ${projectName}: ${error.message}`
		);
		return { success: false, error: error.message };
	}
}

// Main function
async function main() {
	log("bright", "======================================", "");
	log("cyan", "[START]", "CFlair-Counter Project Registration");
	log("bright", "======================================", "");

	try {
		// Load settings
		log("cyan", "[INFO]", "Loading settings from settings.json...");
		const settingsContent = fs.readFileSync(SETTINGS_FILE, "utf-8");

		// Remove comments from JSON (JSONC to JSON)
		const cleanJson = settingsContent
			.split("\n")
			.filter((line) => !line.trim().startsWith("//"))
			.join("\n");

		const settings = JSON.parse(cleanJson);

		// Check if CFlair-Counter is enabled
		if (!settings.counterAPI?.enabled) {
			log("yellow", "[SKIP]", "CFlair-Counter is disabled in settings.json");
			process.exit(0);
		}

		log(
			"green",
			"[CONFIG]",
			`Base URL: ${settings.counterAPI.baseUrl || CFLAIR_BASE_URL}`
		);

		// Fetch GitHub repositories
		const repos = await fetchGitHubRepos(settings.github);

		// Filter repositories based on settings
		const ignoreList = settings.projects?.ignore || [];
		const showPrivate = settings.projects?.showPrivate || false;
		const showForks = settings.projects?.showForks || false;

		const filteredRepos = repos.filter((repo) => {
			if (!showPrivate && repo.private) return false;
			if (!showForks && repo.fork) return false;
			if (ignoreList.includes(repo.name)) return false;
			return true;
		});

		log("cyan", "[INFO]", `Filtered to ${filteredRepos.length} repositories`);
		log("bright", "--------------------------------------", "");

		// Register each project
		const results = {
			success: 0,
			failed: 0,
			initialized: 0,
			skipped: 0,
		};

		for (let i = 0; i < filteredRepos.length; i++) {
			const repo = filteredRepos[i];

			// Get project name (check custom mappings first)
			const projectName =
				settings.counterAPI.projectMapping?.customMappings?.[repo.name] ||
				repo.name;

			const result = await registerProject(projectName);

			if (result.success) {
				results.success++;
				if (result.initialized) {
					results.initialized++;
				}
			} else {
				results.failed++;
			}

			// Add delay between requests to avoid rate limiting
			if (i < filteredRepos.length - 1) {
				await sleep(REQUEST_DELAY_MS);
			}
		}

		// Summary
		log("bright", "--------------------------------------", "");
		log("cyan", "[SUMMARY]", "Registration complete!");
		log("green", "[✓]", `Successfully registered: ${results.success}`);
		log("yellow", "[~]", `Newly initialized: ${results.initialized}`);
		if (results.failed > 0) {
			log("red", "[✗]", `Failed: ${results.failed}`);
		}
		log("bright", "======================================", "");

		// Exit with error if any failed
		if (results.failed > 0) {
			process.exit(1);
		}
	} catch (error) {
		log("red", "[FATAL]", error.message);
		console.error(error);
		process.exit(1);
	}
}

// Run the script
main();
