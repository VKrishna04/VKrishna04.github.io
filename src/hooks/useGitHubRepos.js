import { useState, useEffect, useCallback } from "react";

const useGitHubRepos = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({});

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
        type: "user",
        username: "VKrishna04",
        apiUrl: "https://api.github.com/users/VKrishna04/repos",
        userAgent: "VKrishna04-Portfolio",
      },
      projects: {
        ignore: [],
        maxProjects: 12,
        sortBy: "updated",
        showForks: false,
        showPrivate: false,
        fallbackMode: true,
      },
    };
    setSettings(fallbackSettings);
    return fallbackSettings;
  };

  // Fetch repositories from GitHub API
  const fetchRepositories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const config = await fetchSettings();

      // Build API URL and options from settings
      const apiUrl =
        config.github?.apiUrl ||
        "https://api.github.com/users/VKrishna04/repos";
      const apiOptions = {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": config.github?.userAgent || "VKrishna04-Portfolio",
        },
      };

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
          // Filter out private repos if setting is false
          if (!projectSettings.showPrivate && repo.private) return false;
          // Filter out forks if setting is false
          if (!projectSettings.showForks && repo.fork) return false;
          // Filter out repos in ignore list
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
          // Sort by the configured sort method
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
        .slice(0, projectSettings.maxProjects || 12); // Limit number of projects

      setRepositories(filteredRepos);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError(err.message);

      // Fallback to some hardcoded projects if API fails
      const fallbackProjects = [
        {
          id: 1,
          name: "Portfolio Website",
          description: "Modern React portfolio with animations and dark theme",
          html_url: "https://github.com/VKrishna04/VKrishna04.github.io",
          homepage: "https://vkrishna04.github.io",
          topics: ["react", "portfolio", "framer-motion", "tailwind"],
          language: "JavaScript",
          stargazers_count: 0,
          forks_count: 0,
          updated_at: new Date().toISOString(),
        },
      ];

      // Only use fallback if enabled in settings
      if (settings.projects?.fallbackMode !== false) {
        setRepositories(fallbackProjects);
      }
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  const refetch = () => {
    fetchRepositories();
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
