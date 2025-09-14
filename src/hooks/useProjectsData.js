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

import { useState, useEffect, useCallback } from "react";
import { cachedFetch } from "../utils/githubCache";

const useProjectsData = () => {
	const [repositories, setRepositories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [settings, setSettings] = useState({});
	const [counterData, setCounterData] = useState({});
	const [counterLoading, setCounterLoading] = useState(false);

	// Fetch settings configuration
	const fetchSettings = async () => {
		try {
			const response = await fetch("/settings.json");
			if (response.ok) {
				const data = await response.json();
				setSettings(data);
				return data;
			}
		} catch (error) {
			console.warn("Could not fetch settings:", error);
		}

		// Fallback settings if file can't be loaded
		const fallbackSettings = {
			github: {
				type: "org",
				username: "Life-Experimentalist",
				apiUrl: "https://api.github.com/orgs/Life-Experimentalist/repos",
				userAgent: "VKrishna04-Portfolio",
			},
			projects: {
				ignore: [
					"VKrishna04.github.io",
					".github",
					"financial_assist",
					"VKrishna04",
				],
				maxProjects: 15,
				sortBy: "updated",
				sortOrder: "desc",
				showForks: false,
				showPrivate: false,
				fallbackMode: true,
			},
			counterAPI: {
				enabled: true,
				baseUrl: "https://counterapi-9k7p.onrender.com",
				timeout: 10000,
				fallbackOnError: true,
				projectMapping: {
					autoGenerate: true,
					customMappings: {},
				},
			},
		};
		setSettings(fallbackSettings);
		return fallbackSettings;
	};

	// Fetch repository languages (top 3)
	const fetchRepositoryLanguages = async (owner, repo, apiHeaders) => {
		try {
			const response = await cachedFetch(
				`https://api.github.com/repos/${owner}/${repo}/languages`,
				{ headers: apiHeaders }
			);
			if (response.ok) {
				const languages = await response.json();
				const total = Object.values(languages).reduce(
					(sum, bytes) => sum + bytes,
					0
				);

				// Get top 3 languages by bytes
				const sortedLanguages = Object.entries(languages)
					.sort(([, a], [, b]) => b - a)
					.slice(0, 3)
					.map(([lang, bytes]) => ({
						name: lang,
						percentage: ((bytes / total) * 100).toFixed(1),
					}));

				return sortedLanguages;
			}
		} catch (error) {
			console.warn(`Could not fetch languages for ${repo}:`, error);
		}
		return [];
	};

	// Generate stats URLs for GitHub repositories
	const generateStatsUrls = (githubUrl, repoName, owner) => {
		if (!githubUrl && !repoName && !owner) return null;

		let baseUrl;
		if (githubUrl) {
			// Extract base URL from github URL
			baseUrl = githubUrl.replace(/\/$/, ""); // Remove trailing slash
		} else if (repoName && owner) {
			baseUrl = `https://github.com/${owner}/${repoName}`;
		} else {
			return null;
		}

		return {
			starsUrl: `${baseUrl}/stargazers`,
			forksUrl: `${baseUrl}/network/members`,
			watchersUrl: `${baseUrl}/watchers`,
			issuesUrl: `${baseUrl}/issues`,
		};
	};

	// Fetch CounterAPI data
	const fetchCounterData = async (config) => {
		if (!config.counterAPI?.enabled) return {};

		setCounterLoading(true);
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(
				() => controller.abort(),
				config.counterAPI.timeout || 10000
			);

			const response = await fetch(`${config.counterAPI.baseUrl}/projects`, {
				signal: controller.signal,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			clearTimeout(timeoutId);

			if (response.ok) {
				const data = await response.json();
				const counterMap = {};

				// Create mapping from CounterAPI project names to counts
				data.forEach((project) => {
					counterMap[project.name] = project.count || 0;
				});

				setCounterData(counterMap);
				return counterMap;
			}
		} catch (error) {
			if (error.name === "AbortError") {
				console.warn("CounterAPI request timed out");
			} else {
				console.warn("Could not fetch CounterAPI data:", error);
			}

			if (config.counterAPI.fallbackOnError) {
				return {};
			}
		} finally {
			setCounterLoading(false);
		}
		return {};
	};

	// Get counter value for a repository
	const getCounterValue = (repoName, settings) => {
		if (!settings.counterAPI?.enabled) return null;

		const { customMappings, autoGenerate } =
			settings.counterAPI.projectMapping || {};

		// Check custom mappings first
		if (customMappings && customMappings[repoName]) {
			const mappedName = customMappings[repoName];
			return counterData[mappedName] || null;
		}

		// Auto-generate mapping if enabled
		if (autoGenerate) {
			return counterData[repoName] || null;
		}

		return null;
	};

	// Fetch repositories from GitHub API
	const fetchRepositories = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const config = await fetchSettings();

			// Fetch CounterAPI data in parallel
			const counterPromise = fetchCounterData(config);

			// Build API URL and options from settings
			const apiUrl =
				config.github?.apiUrl ||
				`https://api.github.com/${
					config.github.type === "org" ? "orgs" : "users"
				}/${config.github.username}/repos`;

			const apiOptions = {
				headers: {
					Accept: "application/vnd.github.v3+json",
					"User-Agent": config.github?.userAgent || "VKrishna04-Portfolio",
				},
			};

			const response = await cachedFetch(apiUrl, apiOptions);

			if (!response.ok) {
				throw new Error(`GitHub API Error: ${response.status}`);
			}

			const repos = await response.json();
			const ignoreList = config.projects?.ignore || [];
			const projectSettings = config.projects || {};

			// Await counter data
			await counterPromise;

			// Transform and filter GitHub API data
			const filteredRepos = repos
				.filter((repo) => {
					// Filter out private repos if setting is false
					if (!projectSettings.showPrivate && repo.private) return false;
					// Filter out forks if setting is false
					if (!projectSettings.showForks && repo.fork) return false;
					// Filter out repos in ignore list
					if (ignoreList.includes(repo.name)) return false;
					return true;
				})
				.slice(0, projectSettings.maxProjects || 15);

			// Fetch languages for each repository
			const reposWithLanguages = await Promise.all(
				filteredRepos.map(async (repo) => {
					const languages = await fetchRepositoryLanguages(
						repo.owner.login,
						repo.name,
						apiOptions.headers
					);

					return {
						id: repo.id,
						name: repo.name,
						description: repo.description,
						html_url: repo.html_url,
						homepage: repo.homepage,
						topics: repo.topics || [],
						language: repo.language,
						languages: languages,
						stargazers_count: repo.stargazers_count,
						forks_count: repo.forks_count,
						watchers_count: repo.watchers_count || repo.subscribers_count || 0,
						updated_at: repo.updated_at,
						created_at: repo.created_at,
						size: repo.size,
						default_branch: repo.default_branch,
						open_issues_count: repo.open_issues_count,
						counterValue: getCounterValue(repo.name, config),
						statsUrls: generateStatsUrls(
							repo.html_url,
							repo.name,
							repo.owner.login
						),
					};
				})
			);

			// Sort repositories
			const sortedRepos = reposWithLanguages.sort((a, b) => {
				const sortBy = projectSettings.sortBy || "updated";
				const sortOrder = projectSettings.sortOrder || "desc";

				let comparison = 0;
				switch (sortBy) {
					case "updated":
						comparison = new Date(b.updated_at) - new Date(a.updated_at);
						break;
					case "created":
						comparison = new Date(b.created_at) - new Date(a.created_at);
						break;
					case "stars":
						comparison = b.stargazers_count - a.stargazers_count;
						break;
					case "name":
						comparison = a.name.localeCompare(b.name);
						break;
					default:
						comparison = new Date(b.updated_at) - new Date(a.updated_at);
				}

				return sortOrder === "asc" ? -comparison : comparison;
			});

			setRepositories(sortedRepos);
		} catch (error) {
			console.error("Error fetching repositories:", error);
			setError(error.message);

			// Fallback mode
			if (settings.projects?.fallbackMode) {
				setRepositories([]);
			}
		} finally {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Initial fetch
	useEffect(() => {
		fetchRepositories();
	}, [fetchRepositories]);

	return {
		repos: repositories,
		loading,
		error,
		settings,
		counterData,
		counterLoading,
		refetch: fetchRepositories,
		getCounterValue: (repoName) => getCounterValue(repoName, settings),
	};
};

export default useProjectsData;
