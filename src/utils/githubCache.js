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
 * GitHub API Cache System
 * Prevents rate limiting by caching responses with configurable TTL
 */

import { storeGitHubData, getGitHubData } from "./dataStorage";

const CACHE_PREFIX = "github_cache_";
const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 50; // Maximum cached entries

class GitHubCache {
	constructor() {
		this.memoryCache = new Map();
		this.cleanupOldEntries();
	}

	/**
	 * Generate cache key from URL and options
	 */
	generateKey(url, options = {}) {
		const params = new URLSearchParams();
		if (options.headers) {
			params.append("auth", options.headers.Authorization ? "true" : "false");
		}
		return `${CACHE_PREFIX}${url}${
			params.toString() ? "?" + params.toString() : ""
		}`;
	}

	/**
	 * Get cached data
	 */
	async get(url, options = {}) {
		const key = this.generateKey(url, options);

		// Check memory cache first
		if (this.memoryCache.has(key)) {
			const cached = this.memoryCache.get(key);
			if (cached.expiry > Date.now()) {
				console.log(`Cache HIT (memory): ${url}`);
				return cached.data;
			} else {
				this.memoryCache.delete(key);
			}
		}

		// Check localStorage
		try {
			const cached = localStorage.getItem(key);
			if (cached) {
				const parsed = JSON.parse(cached);
				if (parsed.expiry > Date.now()) {
					console.log(`Cache HIT (localStorage): ${url}`);
					// Also store in memory for faster access
					this.memoryCache.set(key, parsed);
					return parsed.data;
				} else {
					localStorage.removeItem(key);
				}
			}
		} catch (error) {
			console.warn("Error reading from cache:", error);
		}

		// Check enhanced data storage as fallback
		try {
			const storedData = await getGitHubData(key, { fallbackToBackup: true });
			if (storedData && storedData.data) {
				console.log(`Cache HIT (enhanced storage): ${url}`);
				// Store in memory cache for faster future access
				const cacheEntry = {
					data: storedData.data,
					expiry: storedData.expires,
					timestamp: storedData.timestamp,
				};
				this.memoryCache.set(key, cacheEntry);
				return storedData.data;
			}
		} catch (error) {
			console.warn("Error reading from enhanced storage:", error);
		}

		console.log(`Cache MISS: ${url}`);
		return null;
	}

	/**
	 * Set cached data
	 */
	set(url, data, options = {}, ttl = DEFAULT_TTL) {
		const key = this.generateKey(url, options);
		const expiry = Date.now() + ttl;
		const cacheEntry = { data, expiry, timestamp: Date.now() };

		// Store in memory cache
		this.memoryCache.set(key, cacheEntry);

		// Store in enhanced data storage for persistence
		storeGitHubData(key, data, {
			ttl,
			backup: true,
			validate: true,
		});

		// Store in localStorage (with size limit)
		try {
			const serialized = JSON.stringify(cacheEntry);
			localStorage.setItem(key, serialized);
			console.log(`Cached: ${url} (TTL: ${ttl}ms)`);
		} catch (error) {
			console.warn("Error storing in cache:", error);
			this.cleanupOldEntries();
		}

		// Cleanup if memory cache gets too large
		if (this.memoryCache.size > MAX_CACHE_SIZE) {
			this.cleanupMemoryCache();
		}
	}

	/**
	 * Clear specific cache entry
	 */
	delete(url, options = {}) {
		const key = this.generateKey(url, options);
		this.memoryCache.delete(key);
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.warn("Error removing from cache:", error);
		}
	}

	/**
	 * Clear all cache entries
	 */
	clear() {
		this.memoryCache.clear();
		try {
			const keys = Object.keys(localStorage);
			keys.forEach((key) => {
				if (key.startsWith(CACHE_PREFIX)) {
					localStorage.removeItem(key);
				}
			});
		} catch (error) {
			console.warn("Error clearing cache:", error);
		}
	}

	/**
	 * Get cache statistics
	 */
	getStats() {
		const memorySize = this.memoryCache.size;
		let localStorageSize = 0;
		let totalSize = 0;

		try {
			const keys = Object.keys(localStorage);
			keys.forEach((key) => {
				if (key.startsWith(CACHE_PREFIX)) {
					localStorageSize++;
					totalSize += localStorage.getItem(key).length;
				}
			});
		} catch (error) {
			console.warn("Error getting cache stats:", error);
		}

		return {
			memoryEntries: memorySize,
			localStorageEntries: localStorageSize,
			totalSizeBytes: totalSize,
			totalSizeKB: Math.round((totalSize / 1024) * 100) / 100,
		};
	}

	/**
	 * Cleanup expired entries from localStorage
	 */
	cleanupOldEntries() {
		try {
			const keys = Object.keys(localStorage);
			const now = Date.now();

			keys.forEach((key) => {
				if (key.startsWith(CACHE_PREFIX)) {
					try {
						const cached = JSON.parse(localStorage.getItem(key));
						if (cached.expiry < now) {
							localStorage.removeItem(key);
						}
					} catch {
						// Remove corrupted entries
						localStorage.removeItem(key);
					}
				}
			});
		} catch (error) {
			console.warn("Error during cache cleanup:", error);
		}
	}

	/**
	 * Cleanup oldest entries from memory cache
	 */
	cleanupMemoryCache() {
		const entries = Array.from(this.memoryCache.entries());
		entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

		// Remove oldest 25% of entries
		const toRemove = Math.floor(entries.length * 0.25);
		for (let i = 0; i < toRemove; i++) {
			this.memoryCache.delete(entries[i][0]);
		}
	}

	/**
	 * Check if we're likely being rate limited
	 */
	isRateLimited(response) {
		return (
			response &&
			(response.status === 403 ||
				response.status === 429 ||
				(response.headers &&
					response.headers.get("x-ratelimit-remaining") === "0"))
		);
	}

	/**
	 * Get recommended cache TTL based on response headers
	 */
	getRecommendedTTL(response) {
		if (!response || !response.headers) return DEFAULT_TTL;

		// If rate limited, cache for longer
		if (this.isRateLimited(response)) {
			return 60 * 60 * 1000; // 1 hour
		}

		// Check rate limit headers
		const remaining = response.headers.get("x-ratelimit-remaining");

		if (remaining && parseInt(remaining) < 10) {
			// Low remaining requests, cache for longer
			return 45 * 60 * 1000; // 45 minutes
		}

		return DEFAULT_TTL;
	}
}

// Create singleton instance
const githubCache = new GitHubCache();

/**
 * Enhanced fetch wrapper with caching
 */
export const cachedFetch = async (url, options = {}) => {
	// Check cache first
	const cached = await githubCache.get(url, options);
	if (cached) {
		return {
			ok: true,
			status: 200,
			json: async () => cached,
			headers: new Map([["x-cache", "HIT"]]),
		};
	}

	try {
		console.log(`Fetching from API: ${url}`);
		const response = await fetch(url, options);

		// Only cache successful responses
		if (response.ok) {
			const data = await response.json();
			const ttl = githubCache.getRecommendedTTL(response);
			githubCache.set(url, data, options, ttl);

			return {
				...response,
				json: async () => data,
				headers: new Map([
					...Array.from(response.headers.entries()),
					["x-cache", "MISS"],
				]),
			};
		} else {
			// Cache error responses for shorter duration to avoid repeated failures
			if (githubCache.isRateLimited(response)) {
				console.warn(`Rate limited for ${url}, caching error`);
				githubCache.set(
					url,
					{ error: "Rate limited", status: response.status },
					options,
					10 * 60 * 1000
				); // 10 minutes
			}
			return response;
		}
	} catch (error) {
		console.error(`Fetch error for ${url}:`, error);
		throw error;
	}
};

/**
 * Utility functions
 */
export const clearGitHubCache = () => githubCache.clear();
export const getGitHubCacheStats = () => githubCache.getStats();
export const cleanupGitHubCache = () => githubCache.cleanupOldEntries();

// Auto-cleanup on page load
githubCache.cleanupOldEntries();

export default githubCache;
