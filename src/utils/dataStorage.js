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
 * Enhanced Data Storage System for GitHub API Data Persistence
 * Provides long-term storage with versioning, backup, and data validation
 */

const STORAGE_PREFIX = "github_data_";
const BACKUP_PREFIX = "github_backup_";
const METADATA_KEY = "github_data_metadata";
const DEFAULT_STORAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_BACKUPS = 3;

class DataStorage {
	constructor() {
		this.initializeMetadata();
	}

	/**
	 * Initialize storage metadata
	 */
	initializeMetadata() {
		const metadata = this.getMetadata();
		if (!metadata) {
			this.setMetadata({
				version: "1.0.0",
				created: Date.now(),
				lastCleaned: Date.now(),
				totalEntries: 0,
				backupCount: 0,
			});
		}
	}

	/**
	 * Get storage metadata
	 */
	getMetadata() {
		try {
			const data = localStorage.getItem(METADATA_KEY);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.warn("Failed to get storage metadata:", error);
			return null;
		}
	}

	/**
	 * Set storage metadata
	 */
	setMetadata(metadata) {
		try {
			localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
		} catch (error) {
			console.warn("Failed to set storage metadata:", error);
		}
	}

	/**
	 * Store GitHub data with enhanced features
	 */
	async storeGitHubData(key, data, options = {}) {
		const {
			ttl = DEFAULT_STORAGE_TTL,
			backup = true,
			validate = true,
			compress = false,
		} = options;

		try {
			// Validate data if requested
			if (validate && !this.validateGitHubData(data)) {
				throw new Error("Invalid GitHub data structure");
			}

			// Create backup if requested
			if (backup) {
				await this.createBackup(key);
			}

			// Prepare storage entry
			const entry = {
				data: compress ? this.compressData(data) : data,
				timestamp: Date.now(),
				expires: Date.now() + ttl,
				version: "1.0.0",
				compressed: compress,
				hash: this.generateDataHash(data),
			};

			// Store the entry
			const storageKey = `${STORAGE_PREFIX}${key}`;
			localStorage.setItem(storageKey, JSON.stringify(entry));

			// Update metadata
			const metadata = this.getMetadata();
			metadata.totalEntries++;
			metadata.lastUpdated = Date.now();
			this.setMetadata(metadata);

			console.log(
				`GitHub data stored: ${key} (expires in ${Math.round(
					ttl / 1000 / 60
				)} minutes)`
			);
			return true;
		} catch (error) {
			console.error("Failed to store GitHub data:", error);
			return false;
		}
	}

	/**
	 * Retrieve GitHub data with validation
	 */
	async getGitHubData(key, options = {}) {
		const { fallbackToBackup = true, skipExpiration = false } = options;

		try {
			const storageKey = `${STORAGE_PREFIX}${key}`;
			const storedData = localStorage.getItem(storageKey);

			if (!storedData) {
				console.log(`No stored data found for key: ${key}`);
				return null;
			}

			const entry = JSON.parse(storedData);

			// Check if data has expired
			if (!skipExpiration && entry.expires < Date.now()) {
				console.log(`Stored data expired for key: ${key}`);

				// Try backup if available
				if (fallbackToBackup) {
					const backupData = await this.getBackupData(key);
					if (backupData) {
						console.log(`Using backup data for key: ${key}`);
						return backupData;
					}
				}

				// Clean up expired data
				this.removeGitHubData(key);
				return null;
			}

			// Decompress if needed
			const data = entry.compressed
				? this.decompressData(entry.data)
				: entry.data;

			// Validate data integrity
			const currentHash = this.generateDataHash(data);
			if (entry.hash && entry.hash !== currentHash) {
				console.warn(`Data integrity check failed for key: ${key}`);
				return null;
			}

			console.log(`Retrieved cached GitHub data: ${key}`);
			return {
				data,
				cached: true,
				timestamp: entry.timestamp,
				expires: entry.expires,
				timeUntilExpiry: entry.expires - Date.now(),
			};
		} catch (error) {
			console.error("Failed to retrieve GitHub data:", error);
			return null;
		}
	}

	/**
	 * Create a backup of existing data
	 */
	async createBackup(key) {
		try {
			const existingData = await this.getGitHubData(key, {
				skipExpiration: true,
			});
			if (!existingData) return;

			const backupKey = `${BACKUP_PREFIX}${key}_${Date.now()}`;
			localStorage.setItem(
				backupKey,
				JSON.stringify({
					originalKey: key,
					data: existingData.data,
					timestamp: existingData.timestamp,
					backupCreated: Date.now(),
				})
			);

			// Clean old backups
			this.cleanOldBackups(key);

			console.log(`Backup created for key: ${key}`);
		} catch (error) {
			console.warn("Failed to create backup:", error);
		}
	}

	/**
	 * Get backup data
	 */
	async getBackupData(key) {
		try {
			const backupKeys = Object.keys(localStorage)
				.filter((k) => k.startsWith(`${BACKUP_PREFIX}${key}_`))
				.sort((a, b) => {
					const timeA = parseInt(a.split("_").pop());
					const timeB = parseInt(b.split("_").pop());
					return timeB - timeA; // Most recent first
				});

			if (backupKeys.length === 0) return null;

			const latestBackup = localStorage.getItem(backupKeys[0]);
			const backup = JSON.parse(latestBackup);

			return backup.data;
		} catch (error) {
			console.warn("Failed to get backup data:", error);
			return null;
		}
	}

	/**
	 * Clean old backups
	 */
	cleanOldBackups(key) {
		try {
			const backupKeys = Object.keys(localStorage)
				.filter((k) => k.startsWith(`${BACKUP_PREFIX}${key}_`))
				.sort((a, b) => {
					const timeA = parseInt(a.split("_").pop());
					const timeB = parseInt(b.split("_").pop());
					return timeB - timeA;
				});

			// Remove old backups beyond MAX_BACKUPS
			for (let i = MAX_BACKUPS; i < backupKeys.length; i++) {
				localStorage.removeItem(backupKeys[i]);
			}
		} catch (error) {
			console.warn("Failed to clean old backups:", error);
		}
	}

	/**
	 * Remove stored GitHub data
	 */
	removeGitHubData(key) {
		try {
			const storageKey = `${STORAGE_PREFIX}${key}`;
			localStorage.removeItem(storageKey);
			console.log(`Removed stored data: ${key}`);
		} catch (error) {
			console.warn("Failed to remove stored data:", error);
		}
	}

	/**
	 * Clean all expired data
	 */
	cleanExpiredData() {
		try {
			const now = Date.now();
			const keys = Object.keys(localStorage);
			let cleanedCount = 0;

			for (const key of keys) {
				if (key.startsWith(STORAGE_PREFIX)) {
					try {
						const data = JSON.parse(localStorage.getItem(key));
						if (data.expires && data.expires < now) {
							localStorage.removeItem(key);
							cleanedCount++;
						}
					} catch {
						// Remove corrupted entries
						localStorage.removeItem(key);
						cleanedCount++;
					}
				}
			}

			const metadata = this.getMetadata();
			metadata.lastCleaned = now;
			metadata.totalEntries = Math.max(0, metadata.totalEntries - cleanedCount);
			this.setMetadata(metadata);

			if (cleanedCount > 0) {
				console.log(`Cleaned ${cleanedCount} expired/corrupted entries`);
			}
		} catch (error) {
			console.warn("Failed to clean expired data:", error);
		}
	}

	/**
	 * Validate GitHub data structure
	 */
	validateGitHubData(data) {
		if (!data || typeof data !== "object") return false;

		// For repository arrays
		if (Array.isArray(data)) {
			return data.every(
				(repo) => repo.id && repo.name && typeof repo.name === "string"
			);
		}

		// For single repository object
		if (data.id && data.name) return true;

		// For other GitHub API responses
		return true; // Be lenient for other data types
	}

	/**
	 * Generate a simple hash for data integrity
	 */
	generateDataHash(data) {
		const str = JSON.stringify(data);
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return hash.toString(36);
	}

	/**
	 * Compress data (simple implementation)
	 */
	compressData(data) {
		// For now, just return the data as-is
		// Could implement LZ-string or similar compression later
		return data;
	}

	/**
	 * Decompress data
	 */
	decompressData(data) {
		// For now, just return the data as-is
		return data;
	}

	/**
	 * Get storage statistics
	 */
	getStorageStats() {
		try {
			const metadata = this.getMetadata();
			const keys = Object.keys(localStorage);
			const storageKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
			const backupKeys = keys.filter((k) => k.startsWith(BACKUP_PREFIX));

			let totalSize = 0;
			let validEntries = 0;
			let expiredEntries = 0;
			const now = Date.now();

			for (const key of storageKeys) {
				try {
					const data = localStorage.getItem(key);
					totalSize += data.length;

					const entry = JSON.parse(data);
					if (entry.expires < now) {
						expiredEntries++;
					} else {
						validEntries++;
					}
				} catch {
					// Count corrupted entries as expired
					expiredEntries++;
				}
			}

			return {
				metadata,
				totalEntries: storageKeys.length,
				validEntries,
				expiredEntries,
				backupCount: backupKeys.length,
				totalSize,
				formattedSize: this.formatBytes(totalSize),
			};
		} catch (error) {
			console.warn("Failed to get storage stats:", error);
			return null;
		}
	}

	/**
	 * Format bytes to human readable format
	 */
	formatBytes(bytes) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}

	/**
	 * Clear all stored data (with confirmation)
	 */
	clearAllData(confirm = false) {
		if (!confirm) {
			console.warn("Use clearAllData(true) to confirm data deletion");
			return false;
		}

		try {
			const keys = Object.keys(localStorage);
			let removedCount = 0;

			for (const key of keys) {
				if (
					key.startsWith(STORAGE_PREFIX) ||
					key.startsWith(BACKUP_PREFIX) ||
					key === METADATA_KEY
				) {
					localStorage.removeItem(key);
					removedCount++;
				}
			}

			this.initializeMetadata();
			console.log(`Cleared ${removedCount} storage entries`);
			return true;
		} catch (error) {
			console.error("Failed to clear data:", error);
			return false;
		}
	}
}

// Export singleton instance
export const dataStorage = new DataStorage();

// Export individual functions
export const storeGitHubData = (key, data, options) =>
	dataStorage.storeGitHubData(key, data, options);
export const getGitHubData = (key, options) =>
	dataStorage.getGitHubData(key, options);
export const removeGitHubData = (key) => dataStorage.removeGitHubData(key);
export const cleanExpiredData = () => dataStorage.cleanExpiredData();
export const getStorageStats = () => dataStorage.getStorageStats();
export const clearAllData = (confirm) => dataStorage.clearAllData(confirm);
