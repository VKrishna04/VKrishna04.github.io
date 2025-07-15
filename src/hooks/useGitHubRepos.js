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

import { useState, useEffect } from "react";

const useGitHubRepos = () => {
	const [repositories, setRepositories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [settings, setSettings] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				// Fetch settings configuration
				let config;
				try {
					const response = await fetch("/settings.json");
					if (response.ok) {
						config = await response.json();
						setSettings(config);
					} else {
						throw new Error("Failed to fetch settings");
					}
				} catch (settingsError) {
					console.warn("Could not fetch settings:", settingsError);
					// Fallback settings if file can't be loaded
					config = {
						github: {
							type: "user",
							username: "VKrishna04",
							apiUrl: "https://api.github.com/users/VKrishna04/repos",
							userAgent: "VKrishna04-Portfolio",
						},
						projects: {
							mode: "github",
							ignore: [],
							maxProjects: 12,
							sortBy: "updated",
							showForks: false,
							showPrivate: false,
							fallbackMode: true,
							staticProjects: [],
						},
					};
					setSettings(config);
				}

				const projectMode = config.projects?.mode || "github";
				console.log("Project mode:", projectMode);

				// If mode is static, only use static projects
				if (projectMode === "static") {
					const staticProjects = config.projects?.staticProjects || [];
					console.log("Using static projects:", staticProjects.length);
					setRepositories(staticProjects);
					setLoading(false);
					return;
				}

				// If mode is hybrid, try GitHub first, then combine with static
				if (projectMode === "hybrid") {
					try {
						const apiUrl =
							config.github?.apiUrl ||
							"https://api.github.com/users/VKrishna04/repos";
						const apiOptions = {
							headers: {
								Accept: "application/vnd.github.v3+json",
								"User-Agent":
									config.github?.userAgent || "VKrishna04-Portfolio",
							},
						};

						console.log("Fetching from GitHub API:", apiUrl);
						const response = await fetch(apiUrl, apiOptions);

						if (!response.ok) {
							throw new Error(`GitHub API Error: ${response.status}`);
						}

						const repos = await response.json();
						const ignoreList = config.projects?.ignore || [];
						const projectSettings = config.projects || {};

						// Transform and filter GitHub API data
						const filteredRepos = repos
							.filter((repo) => {
								if (!projectSettings.showPrivate && repo.private) return false;
								if (!projectSettings.showForks && repo.fork) return false;
								if (ignoreList.includes(repo.name)) return false;
								return true;
							})
							.map((repo) => ({
								id: repo.id,
								name: repo.name,
								description: repo.description,
								html_url: repo.html_url,
								homepage: repo.homepage,
								topics: repo.topics || [],
								language: repo.language,
								stargazers_count: repo.stargazers_count,
								forks_count: repo.forks_count,
								updated_at: repo.updated_at,
								created_at: repo.created_at,
								size: repo.size,
								default_branch: repo.default_branch,
								open_issues_count: repo.open_issues_count,
							}));

						// Combine GitHub repos with static projects
						const staticProjects = config.projects?.staticProjects || [];
						const combinedProjects = [...filteredRepos, ...staticProjects]
							.sort((a, b) => {
								const sortBy = projectSettings.sortBy || "updated";
								const sortOrder = projectSettings.sortOrder || "desc";
								let comparison = 0;

								if (sortBy === "updated") {
									comparison = new Date(a.updated_at) - new Date(b.updated_at);
								} else if (sortBy === "created") {
									comparison = new Date(a.created_at) - new Date(b.created_at);
								} else if (sortBy === "stars") {
									comparison =
										(a.stargazers_count || a.stats?.stars || 0) -
										(b.stargazers_count || b.stats?.stars || 0);
								} else if (sortBy === "name") {
									comparison = a.name.localeCompare(b.name);
								} else {
									comparison = new Date(a.updated_at) - new Date(b.updated_at);
								}

								return sortOrder === "asc" ? comparison : -comparison;
							})
							.slice(0, projectSettings.maxProjects || 15);

						console.log(
							"Hybrid mode: Combined projects:",
							combinedProjects.length
						);
						setRepositories(combinedProjects);
						return;
					} catch (apiError) {
						console.log(
							"GitHub API failed in hybrid mode, falling back to static projects:",
							apiError.message
						);
						const staticProjects = config.projects?.staticProjects || [];
						setRepositories(staticProjects);
						setError(null); // Clear error since we have fallback data
						return;
					}
				}

				// Regular GitHub mode
				const apiUrl =
					config.github?.apiUrl ||
					"https://api.github.com/users/VKrishna04/repos";
				const apiOptions = {
					headers: {
						Accept: "application/vnd.github.v3+json",
						"User-Agent": config.github?.userAgent || "VKrishna04-Portfolio",
					},
				};

				console.log("Fetching from GitHub API (regular mode):", apiUrl);
				const response = await fetch(apiUrl, apiOptions);

				if (!response.ok) {
					throw new Error(`GitHub API Error: ${response.status}`);
				}

				const repos = await response.json();
				const ignoreList = config.projects?.ignore || [];
				const projectSettings = config.projects || {};

				const filteredRepos = repos
					.filter((repo) => {
						if (!projectSettings.showPrivate && repo.private) return false;
						if (!projectSettings.showForks && repo.fork) return false;
						if (ignoreList.includes(repo.name)) return false;
						return true;
					})
					.map((repo) => ({
						id: repo.id,
						name: repo.name,
						description: repo.description,
						html_url: repo.html_url,
						homepage: repo.homepage,
						topics: repo.topics || [],
						language: repo.language,
						stargazers_count: repo.stargazers_count,
						forks_count: repo.forks_count,
						updated_at: repo.updated_at,
						created_at: repo.created_at,
						size: repo.size,
						default_branch: repo.default_branch,
						open_issues_count: repo.open_issues_count,
					}))
					.sort((a, b) => {
						const sortBy = projectSettings.sortBy || "updated";
						const sortOrder = projectSettings.sortOrder || "desc";
						let comparison = 0;

						if (sortBy === "updated") {
							comparison = new Date(a.updated_at) - new Date(b.updated_at);
						} else if (sortBy === "created") {
							comparison = new Date(a.created_at) - new Date(b.created_at);
						} else if (sortBy === "stars") {
							comparison = a.stargazers_count - b.stargazers_count;
						} else if (sortBy === "name") {
							comparison = a.name.localeCompare(b.name);
						} else {
							comparison = new Date(a.updated_at) - new Date(b.updated_at);
						}

						return sortOrder === "asc" ? comparison : -comparison;
					})
					.slice(0, projectSettings.maxProjects || 12);

				console.log("GitHub mode: Filtered repos:", filteredRepos.length);
				setRepositories(filteredRepos);
			} catch (err) {
				console.error("Error fetching repositories:", err);
				setError(err.message);

				// Fallback to hardcoded projects if everything fails
				const fallbackProjects = [
					{
						id: 1,
						name: "Portfolio Website",
						description:
							"Modern React portfolio with animations and dark theme",
						html_url: "https://github.com/VKrishna04/VKrishna04.github.io",
						homepage: "https://vkrishna04.github.io",
						topics: ["react", "portfolio", "framer-motion", "tailwind"],
						language: "JavaScript",
						stargazers_count: 0,
						forks_count: 0,
						updated_at: new Date().toISOString(),
					},
				];

				setRepositories(fallbackProjects);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const refetch = () => {
		setLoading(true);
		setError(null);
		setRepositories([]);
		// Trigger re-fetch by reloading
		window.location.reload();
	};

	const getSettings = () => settings;

	return {
		repos: repositories,
		loading,
		error,
		refetch,
		getSettings,
	};
};

export default useGitHubRepos;
