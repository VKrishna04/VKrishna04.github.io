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
import useGitHubRepos from "./useGitHubRepos";

/**
 * Hook to merge static projects with GitHub repos
 * - If project exists in both, merge them taking higher numeric values
 * - Respects useGitHubDescription setting to choose description source
 * - Ensures stars, forks, watchers are displayed properly
 */
const useMergedProjects = () => {
	const {
		repos: githubRepos,
		loading: githubLoading,
		error: githubError,
	} = useGitHubRepos();
	const [mergedProjects, setMergedProjects] = useState([]);
	const [staticProjects, setStaticProjects] = useState([]);
	const [settings, setSettings] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch settings and static projects
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/settings.json");
				if (!response.ok) {
					throw new Error(`Failed to fetch settings: ${response.status}`);
				}
				const data = await response.json();
				setSettings(data);
				setStaticProjects(data.projects?.staticProjects || []);
			} catch (err) {
				console.error("Error fetching settings:", err);
				setError(err.message);
			}
		};

		fetchData();
	}, []);

	// Merge projects when both GitHub and static are ready
	useEffect(() => {
		// Always set loading based on GitHub loading state
		setLoading(githubLoading);

		// Don't merge until GitHub is done loading
		if (githubLoading) {
			return;
		}

		const mergeProjects = () => {
			const merged = [];
			const processedGithubRepos = new Set();

			// Helper to match projects by name or URL
			const findMatchingGithubRepo = (staticProject) => {
				return githubRepos.find((repo) => {
					// Match by repository name
					if (repo.name.toLowerCase() === staticProject.name.toLowerCase()) {
						return true;
					}
					// Match by GitHub URL
					if (
						staticProject.githubUrl &&
						repo.html_url === staticProject.githubUrl
					) {
						return true;
					}
					return false;
				});
			};

			// Process static projects first
			staticProjects.forEach((staticProject) => {
				// Skip projects that shouldn't appear in Projects page (showInProjects: false)
				// Default to true if not specified to maintain backward compatibility
				if (staticProject.showInProjects === false) {
					return;
				}

				const matchingGithubRepo = findMatchingGithubRepo(staticProject);

				if (matchingGithubRepo) {
					// Merge: static + GitHub, taking higher numeric values
					processedGithubRepos.add(matchingGithubRepo.name);

					const useGithubDesc =
						settings.projects?.useGitHubDescription !== false; // Default to GitHub description

					const mergedProject = {
						...matchingGithubRepo, // Start with GitHub repo data
						// Override with static project fields
						id: staticProject.id || matchingGithubRepo.id,
						category: staticProject.category,
						featured: staticProject.featured,
						showInAbout: staticProject.showInAbout,
						showInProjects: staticProject.showInProjects !== false, // Default to true
						status: staticProject.status,
						startDate: staticProject.startDate,
						endDate: staticProject.endDate,
						highlights: staticProject.highlights || [],
						imageUrl: staticProject.imageUrl,
						documentationUrl: staticProject.documentationUrl,
						// Use GitHub description or static based on setting
						description: useGithubDesc
							? matchingGithubRepo.description || staticProject.description
							: staticProject.description || matchingGithubRepo.description,
						// Take higher numeric values
						stargazers_count: Math.max(
							matchingGithubRepo.stargazers_count || 0,
							staticProject.stats?.stars || 0
						),
						forks_count: Math.max(
							matchingGithubRepo.forks_count || 0,
							staticProject.stats?.forks || 0
						),
						watchers_count: Math.max(
							matchingGithubRepo.watchers_count || 0,
							staticProject.stats?.watchers || 0
						),
						open_issues_count: Math.max(
							matchingGithubRepo.open_issues_count || 0,
							staticProject.stats?.issues || 0
						),
						// Merge URLs
						html_url: staticProject.githubUrl || matchingGithubRepo.html_url,
						homepage:
							staticProject.liveUrl ||
							staticProject.demoUrl ||
							matchingGithubRepo.homepage,
						liveUrl: staticProject.liveUrl || matchingGithubRepo.homepage,
						demoUrl: staticProject.demoUrl,
						// Use GitHub dates (more reliable) or fallback to static
						created_at:
							matchingGithubRepo.created_at || staticProject.startDate,
						updated_at:
							matchingGithubRepo.updated_at ||
							staticProject.endDate ||
							staticProject.startDate,
						// Merge technologies/topics
						technologies: staticProject.technologies || [],
						topics: matchingGithubRepo.topics || staticProject.tags || [],
						// Mark as merged
						isMerged: true,
						isStatic: false, // Prioritize GitHub rendering
						// Ensure stats URLs are present
						statsUrls: {
							starsUrl: `${
								staticProject.githubUrl || matchingGithubRepo.html_url
							}/stargazers`,
							forksUrl: `${
								staticProject.githubUrl || matchingGithubRepo.html_url
							}/forks`,
							watchersUrl: `${
								staticProject.githubUrl || matchingGithubRepo.html_url
							}/watchers`,
							issuesUrl: `${
								staticProject.githubUrl || matchingGithubRepo.html_url
							}/issues`,
						},
					};

					merged.push(mergedProject);
				} else {
					// Static-only project - ensure stats are properly formatted
					const githubUrl = staticProject.githubUrl || null;
					const hasGithubUrl = !!githubUrl;

					merged.push({
						id: staticProject.id,
						name: staticProject.name,
						description: staticProject.description,
						html_url: githubUrl,
						homepage: staticProject.liveUrl || staticProject.demoUrl,
						liveUrl: staticProject.liveUrl,
						demoUrl: staticProject.demoUrl,
						topics: staticProject.tags || staticProject.technologies || [],
						language:
							staticProject.technologies?.[0] ||
							staticProject.category ||
							"Unknown",
						stargazers_count: staticProject.stats?.stars || 0,
						forks_count: staticProject.stats?.forks || 0,
						watchers_count: staticProject.stats?.watchers || 0,
						open_issues_count: staticProject.stats?.issues || 0,
						created_at: staticProject.startDate || new Date().toISOString(),
						updated_at:
							staticProject.endDate ||
							staticProject.startDate ||
							new Date().toISOString(),
						// Static project specific fields
						category: staticProject.category,
						featured: staticProject.featured,
						showInAbout: staticProject.showInAbout,
						showInProjects: staticProject.showInProjects !== false, // Default to true
						status: staticProject.status,
						startDate: staticProject.startDate,
						endDate: staticProject.endDate,
						documentationUrl: staticProject.documentationUrl,
						imageUrl: staticProject.imageUrl,
						highlights: staticProject.highlights || [],
						technologies: staticProject.technologies || [],
						isStatic: true,
						isMerged: false,
						// Add stats URLs only if GitHub URL exists
						statsUrls: hasGithubUrl
							? {
									starsUrl: `${githubUrl}/stargazers`,
									forksUrl: `${githubUrl}/forks`,
									watchersUrl: `${githubUrl}/watchers`,
									issuesUrl: `${githubUrl}/issues`,
							  }
							: null,
					});
				}
			});

			// Add GitHub-only projects
			githubRepos.forEach((repo) => {
				if (!processedGithubRepos.has(repo.name)) {
					merged.push({
						...repo,
						isStatic: false,
						isMerged: false,
					});
				}
			});

			setMergedProjects(merged);
			// Only set loading to false after merge is complete
			setLoading(false);
		};

		// Only merge if we have settings loaded
		if (Object.keys(settings).length > 0) {
			mergeProjects();
		}
	}, [githubRepos, staticProjects, githubLoading, settings]);

	return {
		projects: mergedProjects,
		loading: loading || githubLoading,
		error: error || githubError,
		settings,
	};
};

export default useMergedProjects;
