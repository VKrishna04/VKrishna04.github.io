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
 * CFlair-Counter Integration Utilities
 *
 * This module provides utilities for tracking project views using CFlair-Counter.
 *
 * CFlair-Counter API:
 * - POST /api/views/{projectName} - Increment view count
 * - GET /api/views/{projectName} - Get current stats
 * - GET /api/views/{projectName}/badge - Get SVG badge
 */

const CFLAIR_BASE_URL = "https://cflaircounter.pages.dev";

/**
 * Track a view for a project
 * @param {string} projectName - The project name to track
 * @param {string} baseUrl - Optional custom base URL
 * @returns {Promise<object|null>} - The response data or null on error
 */
export async function trackProjectView(projectName, baseUrl = CFLAIR_BASE_URL) {
	if (!projectName) {
		console.warn("[CFlair-Counter] Project name is required");
		return null;
	}

	try {
		const url = `${baseUrl}/api/views/${encodeURIComponent(projectName)}`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
		});

		if (response.ok) {
			const data = await response.json();
			if (data.success) {
				console.log(
					`[CFlair-Counter] Tracked view for ${projectName}: ${data.totalViews} total views`
				);
				return {
					success: true,
					projectName: data.projectName,
					totalViews: data.totalViews || 0,
					uniqueViews: data.uniqueViews || 0,
					timestamp: data.timestamp,
				};
			}
		}

		console.warn(
			`[CFlair-Counter] Failed to track view for ${projectName}: ${response.status}`
		);
		return null;
	} catch (error) {
		console.warn(
			`[CFlair-Counter] Error tracking view for ${projectName}:`,
			error.message
		);
		return null;
	}
}

/**
 * Get view statistics for a project
 * @param {string} projectName - The project name
 * @param {string} baseUrl - Optional custom base URL
 * @returns {Promise<object|null>} - The stats data or null on error
 */
export async function getProjectStats(projectName, baseUrl = CFLAIR_BASE_URL) {
	if (!projectName) {
		console.warn("[CFlair-Counter] Project name is required");
		return null;
	}

	try {
		const url = `${baseUrl}/api/views/${encodeURIComponent(projectName)}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (response.ok) {
			const data = await response.json();
			if (data.success) {
				return {
					success: true,
					projectName: data.projectName,
					totalViews: data.totalViews || 0,
					uniqueViews: data.uniqueViews || 0,
					description: data.description,
					createdAt: data.createdAt,
				};
			}
		}

		console.warn(
			`[CFlair-Counter] Failed to get stats for ${projectName}: ${response.status}`
		);
		return null;
	} catch (error) {
		console.warn(
			`[CFlair-Counter] Error getting stats for ${projectName}:`,
			error.message
		);
		return null;
	}
}

/**
 * Get the badge URL for a project
 * @param {string} projectName - The project name
 * @param {object} options - Optional badge customization
 * @param {string} options.color - Badge color (blue, green, red, orange, purple, etc.)
 * @param {string} options.label - Custom label text
 * @param {string} baseUrl - Optional custom base URL
 * @returns {string} - The badge URL
 */
export function getProjectBadgeUrl(
	projectName,
	options = {},
	baseUrl = CFLAIR_BASE_URL
) {
	if (!projectName) {
		console.warn("[CFlair-Counter] Project name is required");
		return "";
	}

	const params = new URLSearchParams();
	if (options.color) params.set("color", options.color);
	if (options.label) params.set("label", options.label);

	const queryString = params.toString();
	const url = `${baseUrl}/api/views/${encodeURIComponent(projectName)}/badge`;

	return queryString ? `${url}?${queryString}` : url;
}

/**
 * Track portfolio page view
 * This should be called once when the portfolio loads
 * @param {string} baseUrl - Optional custom base URL
 * @returns {Promise<object|null>} - The response data or null on error
 */
export async function trackPortfolioView(baseUrl = CFLAIR_BASE_URL) {
	return trackProjectView("vkrishna04-portfolio", baseUrl);
}

/**
 * Batch track multiple project views
 * Useful for tracking when a project list is displayed
 * @param {string[]} projectNames - Array of project names
 * @param {string} baseUrl - Optional custom base URL
 * @param {number} delayMs - Delay between requests in milliseconds (default: 200ms)
 * @returns {Promise<object[]>} - Array of response data
 */
export async function batchTrackViews(
	projectNames,
	baseUrl = CFLAIR_BASE_URL,
	delayMs = 200
) {
	const results = [];

	for (let i = 0; i < projectNames.length; i++) {
		const projectName = projectNames[i];
		const result = await trackProjectView(projectName, baseUrl);
		results.push(result);

		// Add delay to avoid rate limiting (except for last item)
		if (i < projectNames.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}
	}

	return results;
}

/**
 * Check if CFlair-Counter service is available
 * @param {string} baseUrl - Optional custom base URL
 * @returns {Promise<boolean>} - True if service is available
 */
export async function isCFlairCounterAvailable(baseUrl = CFLAIR_BASE_URL) {
	try {
		const response = await fetch(`${baseUrl}/health`, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (response.ok) {
			const data = await response.json();
			return data.success === true && data.status === "ok";
		}
		return false;
	} catch (error) {
		console.warn("[CFlair-Counter] Service unavailable:", error.message);
		return false;
	}
}

export default {
	trackProjectView,
	getProjectStats,
	getProjectBadgeUrl,
	trackPortfolioView,
	batchTrackViews,
	isCFlairCounterAvailable,
};
